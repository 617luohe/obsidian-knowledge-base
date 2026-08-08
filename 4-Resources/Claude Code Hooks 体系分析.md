---
created: 2026-07-30
updated: 2026-08-08
tags:
  - type/resource
  - domain/tech/tools
  - claude-code
  - hooks
  - python
  - ai-tools
  - configuration
  - project-structure
status: draft
confidence: seed
---

# Claude Code Hooks 体系分析

> 基于 `~/.claude/hooks/` 的 10 个 Python 脚本 + `~/.claude/settings.json` 的 hook 注册配置，分析完整的 hook 事件链路和行为。

## 架构概览

共 10 个 Python 脚本，覆盖 **7 个 hook 事件**：

```
PreToolUse ─── guard.py (安全护栏)
            ├── inject-executor-rescue-prompt.py (Agent救援)
            └── workflow-model-allocation-guard.py (Workflow校验)

PostToolUse ── format-on-write.py (自动格式化)

UserPromptSubmit ├── skill-forced-eval.py (技能评估注入)
                 └── inject-workflow-keyword-prompt.py (编排意图注入)

PermissionRequest ── notify.py (GUI弹窗授权)

Notification ── notify.py (空闲提醒)

Stop ── notify.py (会话结束)

PreCompact ── pre-compact.py (状态提取)

SessionStart ── post-compact-inject.py (状态回注)

共享模块: _model_policy.py (模型策略)
```

---

## 一、PreToolUse 层（工具调用前拦截）

触发时机：**每次工具调用前**

### 1.1 guard.py — 安全护栏 + 审计日志

- **匹配范围**：全部工具（`matcher: ""`）
- **核心功能**：
  - **危险 Bash 拦截**：`rm -rf /`、`dd if=... of=/dev/sd*`、fork bomb、`format C:`、`del System32` 等 9 条正则规则
  - **危险写入路径拦截**：`C:\Windows\System32\`、`/etc/passwd`、`/etc/shadow`、`/etc/sudoers`、`/boot/` 等 6 条路径前缀
  - **审计日志**：所有工具调用写入 `~/.claude/hooks/audit.log`（JSONL 格式，包含时间戳、工具名、输入摘要、决策）
- **设计哲学**：只拦截真正的灾难性操作，不阻碍正常开发

### 1.2 inject-executor-rescue-prompt.py — Agent 子代理救援注入（v2 翻转门禁）

- **匹配范围**：仅 `Agent` 工具
- **核心功能**：
  - 向子 agent 的 prompt 注入 `<executor-rescue>` 指令块，确保子代理专注执行而非重新规划父任务
  - 模型策略校验（v2 逻辑）：
    - 省略 `model` → **放行**（继承主循环）
    - 显式声明廉价执行器 → **放行**
    - 显式声明昂贵主模型 → **拦截**
- **注入内容要点**：
  - 直接处理委托任务，不重新规划
  - 返回具体证据：变更文件、命令/测试结果、未解决风险
  - 遇到只有编排者能做的决策时，用 `NEED_ADVICE:` 标记向上反馈

### 1.3 workflow-model-allocation-guard.py — Workflow 执行器校验（v2 翻转门禁）

- **匹配范围**：仅 `Workflow` 工具
- **核心功能**：
  - 解析 Workflow 脚本源码（支持 `script` 内联和 `scriptPath` 文件路径）
  - 逐行扫描每个 `agent()` 调用，提取 `model` 参数
  - 用括号平衡算法准确解析，容忍引号和转义
  - 与 `inject-executor-rescue` 共用 `_model_policy.py` 策略

## 二、PostToolUse 层（工具调用完成后）

### 2.1 format-on-write.py — 写文件后自动格式化

- **匹配范围**：`Write|Edit`
- **格式化规则**：

| 文件类型 | 默认工具 | 环境变量覆盖 |
|---------|---------|------------|
| `.py` | `ruff format` | `FORMAT_PY` |
| `.md`, `.json`, `.yaml`, `.yml` | `npx prettier --write` | `FORMAT_PRETTIER` |
| `.js`, `.ts`, `.jsx`, `.tsx` | `npx prettier --write` | `FORMAT_PRETTIER` |
| `.css`, `.html` | `npx prettier --write` | `FORMAT_PRETTIER` |
| 任意扩展名 | — | `FORMAT_<EXT>` |

- **错误处理**：失败写入 `format_error.log`，静默不阻塞流程
- **超时限制**：30s 单文件格式化超时

## 三、UserPromptSubmit 层（用户输入提交时）

### 3.1 skill-forced-eval.py — 技能规划评估注入（v4）

- **触发条件**：用户输入匹配技术提问正则（代码/开发/修复/实现/审查/测试/deploy/refactor 等 50+ 关键词）
- **幂等检查**：如果 prompt 已包含 `<skill-evaluation>` 则跳过
- **核心功能**：
  - 扫描 `~/.claude/skills/` 和 `.claude/skills/` 目录
  - 解析每个 `SKILL.md` 的 YAML frontmatter（name、description）
  - 跟随软链接（兼容 skills-manager 管理方式）
  - 生成技能规划提醒上下文注入，包含：
    - 三步判断流程（新任务/追问/普通问答）
    - 编排层技能强调
    - 全部可用技能列表（限 30 个，每个描述截断 120 字符）
- **v4 特点**：默认由主模型内部判断，不再强制调用网关；追问和补充不重复加载技能

### 3.2 inject-workflow-keyword-prompt.py — 编排意图注入（v2）

- **触发条件**：prompt 含 workflow/agent orchestration/codex/cursor/编排/多智能体 等关键词
- **幂等守卫**：已含 `<workflow-orchestration>` 或 `<multi-worker-orchestration>` 则跳过
- **注入内容**：
  - **通用编排上下文**：Workflow vs Agent 选择策略、并行/串行决策、结果验证、执行器偏好
  - **multi-worker 特定上下文**（命中并行开发关键词时追加）：`/multi-worker` 技能使用指南、worker-dev agent 类型、编排者只协调不写代码

## 四、GUI 交互层

### 4.1 notify.py — 跨平台弹窗通知（3 合 1）

一个脚本处理 **3 个 hook 事件**：

| 事件 | 匹配规则 | 对话框 | 行为 |
|------|---------|--------|------|
| `PermissionRequest` | "" | `show_permission_dialog` | 阻塞等待用户决策，输出 decision JSON |
| `Notification` | `idle_prompt` | `show_idle_dialog` | 异步独立进程渲染，不阻塞 Claude Code |
| `Stop` | "" | `show_stop_dialog` | 独立进程渲染，不阻塞 |

**PermissionRequest 对话框**：
- `"同意" / "拒绝" / "同意并记住"` 三个按钮
- `Esc` 拒绝，`Enter` 同意
- **全局快捷键**（Windows）：`Ctrl+Shift+Y` 同意 / `Ctrl+Shift+N` 拒绝，可在任意窗口使用
- Always-On-Top 但不抢键盘焦点（`SWP_NOACTIVATE`）
- 支持 ntfy 推送通知到 Android（需要 `NTFY_ENABLED=1` + `NTFY_TOPIC` 环境变量）

**Notification / Stop 对话框**：
- 通过 `_spawn_detached_gui` 机制脱离 Claude Code 进程树
- Windows：`pythonw.exe` + `DETACHED_PROCESS` + `CREATE_NEW_PROCESS_GROUP`
- Linux/Mac：`start_new_session=True`
- 不受 hook timeout 限制，保持到用户主动关闭

**跨平台音效**：
- Windows：`winsound.MessageBeep()` + 自定义 `.wav`（`PlaySound` with `SND_ASYNC`）
- Mac：`afplay`
- Linux：`aplay`
- 最终回退：terminal bell（`\a`）
- 4 种事件对应 4 种音效类型：permission / notification / stop / deny

## 五、PreCompact → SessionStart 链（压缩状态保留）

### 5.1 pre-compact.py — 压缩前状态提取

- **触发**：`PreCompact`（`matcher: "manual"`）
- **核心功能**：
  - 读取 transcript JSONL 文件（`session_id` + `transcript_path`）
  - 提取 5 类关键信息：
    - **用户目标**：从 user messages 提取（最多 10 条，每条 ≤200 字符）
    - **已读取文件**：Read/Grep/Glob 的目标文件（最多 20 个）
    - **已修改文件**：Write/Edit 的目标文件（最多 15 个）
    - **错误信息**：从 tool results 提取异常（最多 10 个，正则匹配 Error/Exception/Traceback 等）
    - **决策/结论**：从 assistant messages 提取（中文+英文双模式正则，最多 15 条）
  - **大 session 优化**：超过 2000 行时保留头部 10% + 尾部 50%，丢弃中间重复段
  - 写入 `~/.claude/hooks/checkpoints/{session_id}.json`
- **设计原则**：纯提取不调用 API，零延迟，800-1200 token 预算

### 5.2 post-compact-inject.py — 压缩后状态回注

- **触发**：`SessionStart`（`matcher: "compact"`）
- **核心功能**：
  - 读取 pre-compact 写入的 checkpoint 文件
  - 通过 `additionalContext` 字段注入到新会话上下文
  - 自动清理 checkpoint 文件（避免残留到下一个 session）
- **Token 预算**：上限 3000 字符（含头部和脚注），不膨胀新上下文

## 六、共享模块：_model_policy.py

### 模型分层策略（动态 + 静态回退）

- **动态策略（优先级 1）**：读取 CC Switch 数据库 `~/.cc-switch/cc-switch.db`，获取当前激活 provider 的 tier 映射
  - `fable` + `opus` → **EXPENSIVE**（编排层，不可用于纯执行 agent）
  - `sonnet` + `haiku` + `subagent` → **EXECUTOR**（执行层）
- **静态回退（优先级 2）**：数据库不可读时，回退到硬编码的 2026-07 定价列表
  - 覆盖 DeepSeek、OpenAI GPT、Claude 三大提供商
  - 零维护：在 CC Switch 里调映射，hook 自动跟随

### 被以下 hook 共用
- `inject-executor-rescue-prompt.py`（Agent 子代理模型校验）
- `workflow-model-allocation-guard.py`（Workflow 脚本模型校验）

---

## 配置架构

在 `~/.claude/settings.json` 中注册：

```
hooks:
  PreToolUse       → guard.py, inject-executor-rescue, workflow-model-guard
  PostToolUse      → format-on-write
  UserPromptSubmit → skill-forced-eval, inject-workflow-keyword
  PermissionRequest → notify.py
  Notification     → notify.py (idle_prompt)
  Stop             → notify.py
  PreCompact       → pre-compact.py (manual)
  SessionStart     → post-compact-inject.py (compact)
```

---

## 设计亮点

1. **安全与效率平衡**：`guard.py` 只拦截灾难性操作，不阻碍正常开发
2. **翻转门禁逻辑**：v2 模型策略从"必须显式声明"改为"省略=放行"，符合 Claude Code 推荐模式
3. **压缩不丢上下文**：PreCompact→SessionStart 链通过文件 checkpoint 实现无 API 调用的状态保留
4. **独立进程弹窗**：Notification/Stop 弹窗脱离主进程，不受 hook timeout 约束
5. **零维护模型策略**：`_model_policy.py` 动态读取 CC Switch 配置，价格变更无需手动更新 hook 代码
6. **幂等守卫**：所有注入类 hook 都有重复注入检测，多次用户提交不会叠加上下文

## 相关笔记

- [[Claude Code MCP 工具配置]]
- [[Claude Code 配置指南]]
- [[ai-vibe-coding-config 项目结构]]
