---
title: "my-skills vocabulary 核心层详解"
aliases: ["vocabulary 层", "可复用核心循环", "my-skills 核心层"]
tags:
  - type/resource
  - domain/tech/tools
  - topic/skills-vocabulary
created: 2026-07-27
status: published
confidence: budding
source: "https://github.com/617luohe/my-skills"
related: "[[my-skills v2 开发工作流技能体系]]"
---

# my-skills vocabulary 核心层详解

> vocabulary 层是 my-skills v2 最核心的架构创新 — 5 个可复用核心循环从阶段技能中提取出来，独立维护、被委托调用。阶段技能从 80-150+ 行精简到 30-80 行。

## 一、设计理念

### 为什么需要 vocabulary 层？

v1 中每个阶段技能都内联了完整的执行逻辑（如 `1-规划` 包含决策树追问的完整规则，`4-开发` 包含 TDD 循环的完整规则）。这导致：

- **重复**：相似的交互模式（追问、建模、审查）在不同技能中重复实现
- **膨胀**：阶段技能文件长（100-150+ 行），难以维护
- **不一致**：同一模式在不同技能中的实现细节不同

**v2 方案**：提取通用模式为独立 vocabulary 技能，阶段技能只保留"编排逻辑"（何时调用、如何组合）。

```
v1（内联）                          v2（委托）
┌──────────────────────┐          ┌──────────────────────┐
│ 1-规划 (150 行)        │          │ 1-规划 (80 行)        │
│  ├─ 决策树追问规则      │          │  ├─ 调用 grilling     │
│  ├─ 术语建模规则        │    →    │  ├─ 调用 domain-     │
│  ├─ CONTEXT.md 格式    │          │  │   modeling        │
│  ├─ ADR 模板           │          │  ├─ 接口设计          │
│  └─ PRD 格式           │          │  └─ 任务拆解          │
└──────────────────────┘          └──────────────────────┘
                                           │
                                  ┌────────┴────────┐
                                  │                 │
                          ┌───────▼──────┐  ┌──────▼──────┐
                          │ grilling     │  │ domain-     │
                          │ (可复用)      │  │ modeling    │
                          └──────────────┘  └─────────────┘
```

## 二、五大 vocabulary 技能

### 2.1 grilling — 询问循环

**位置**：`vocabulary/grilling`

**职责**：relentless 询问循环，沿决策树逐个决议。

**被谁调用**：`1-规划`

**核心特性**：

| 特性 | 说明 |
|------|------|
| **默认批量模式** | 集中询问 frontier 中独立决策（主题相近、互不依赖） |
| **逐步模式** | 用户说"逐步"/"一步一步"时，一次一问 |
| **事实/决策分流** | 事实自行调查（代码/配置/文档），决策交给用户 |
| **推荐答案** | 每个决策先给推荐 + 理由 |

**交互示例**：
```
Claude：[批量 grilling]
       1. 已支付订单取消后如何退款？推荐：自动原路退款。
       2. 未支付订单取消是否允许恢复？推荐：不可恢复。
用户：1 按推荐，2 不允许恢复
Claude：[下一层 frontier] 如果订单已部分发货，取消范围如何处理？
```

**设计要点**：
- 按决策依赖树取当前 frontier（同一层、互不依赖的决策集中询问）
- 用户回答后立即推进到下一层 frontier
- 不把所有分支走完不罢休

---

### 2.2 domain-modeling — 领域建模

**位置**：`vocabulary/domain-modeling`

**职责**：维护仅含领域 glossary 的 `CONTEXT.md`，并将架构决策记录为独立 ADR。

**被谁调用**：`1-规划`

**核心特性**：

| 特性 | 说明 |
|------|------|
| **术语冲突标记** | 用词与已有 CONTEXT.md 冲突时立即指出 |
| **模糊语言锐化** | 提议精确的规范术语（如 "account" 是 Customer 还是 User？） |
| **场景压力测试** | 用具体场景探测边界 |
| **内联更新** | 术语确认后立即更新 CONTEXT.md |

**CONTEXT.md 格式**：
```markdown
## Language
**Order**: A customer's request to purchase products.
_Avoid_: Purchase, transaction

## Relationships
- An **Order** produces one or more **Invoices**
```

**ADR 规则**：仅当难逆转、少见且存在真实取舍时创建；使用 `docs/adr/NNNN-title.md`，模板由 `vocabulary/domain-modeling/references/adr-format.md` 发布。

---

### 2.3 tdd — TDD 循环

**位置**：`vocabulary/tdd`

**职责**：红-绿-重构循环，pytest 驱动。

**被谁调用**：`2-开发`、`multi-worker`

**核心特性**：

| 阶段 | 说明 |
|------|------|
| **规划** | 列出要测试的行为（不是实现步骤） |
| **示踪弹** | 写一个测试确认路径可行 |
| **递增循环** | RED → GREEN，一次一个测试，不超前实现 |
| **重构** | 全绿后提取重复、深化浅模块 |

**测试策略（按行为风险）**：
- 行为变化默认新增自动化回归测试
- 通过公共接口覆盖用户可感知行为、边界及失败模式
- 纯文档/格式/机械生成物可不新增测试，但必须记录验证证据
- 无法测试时说明 seam 缺失和风险

**MUST 规则**：
- 绝不在 RED 时重构
- 测试通过公共接口验证行为，不验证实现细节

---

### 2.4 code-review — 代码审查

**位置**：`vocabulary/code-review`

**职责**：双轴审查（Standards + Spec），并行子代理。

**被谁调用**：`2-开发`、`3-检查`、`multi-worker`

**核心特性**：

| 轴 | 子代理职责 | 读取内容 |
|----|-----------|---------|
| **Standards** | 报告违反编码规范的地方 | CLAUDE.md、CONTRIBUTING.md + diff |
| **Spec** | 报告需求符合度 | PRD、issue + diff |

**并行策略**：
- diff < 500 行 → 并行执行（两个子代理同时跑）
- diff ≥ 500 行 → 串行执行（避免上下文溢出）

**审查维度**：
- 代码质量门禁：命名、类型、异常处理、import 组织
- 功能目标门禁：性能指标、可靠性、资源消耗、覆盖率

---

### 2.5 diagnosing-bugs — Bug 诊断

**位置**：`vocabulary/diagnosing-bugs`

**职责**：六阶段诊断流程，用于难复现 bug 和性能回归。

**被谁调用**：`4-调试`

**六阶段流程**：

| # | 阶段 | 核心任务 | 关键原则 |
|----|------|---------|---------|
| 1 | 构建可比较观测信号 | 建立快速 pass/fail 信号 | 可使用 trace、metrics、采样、profile、内存快照 |
| 2 | 复现与最小化 | 确认信号产生正确失败模式 | 稳定或统计可信复现用于修复验收 |
| 3 | 假设 | 列出 3-5 条可证伪假设 | 不能只有一条（防止锚定偏见） |
| 4 | 工具验证 | 一次改一个变量验证假设 | 以根因证据验证 |
| 5 | 修复 + 回归测试 | 最小化修复 + 回归测试 | 命名 `test_regression_<编号>` |
| 6 | 清理 | 确认不复现 + 调试标签清除 | 问"什么能防止这个 bug？" |

**MUST 规则**：
- 不建立可比较观测信号不假设
- 假设阶段至少 3 条
- 一次只改一个变量
- 修复必带回归测试

---

## 三、vocabulary 层的特殊性

### 不被用户直接调用

vocabulary 技能标记为 `layer: vocabulary`，在 manifest 中独立分组：

```yaml
- name: vocabulary/grilling
  layer: vocabulary        # ← 标识为 vocabulary 层
  invocation: model        # ← 允许模型调用（被阶段技能委托）
```

它们不出现在路由器的用户可见技能列表中，不参与 `/0-询问luohe` 的路由匹配。

### 部署时同步到 skill 目录

尽管 vocabulary 不被用户直接调用，它们仍然通过 `sync-skills.ps1` 部署到 `.claude/skills/vocabulary/` 子目录，确保阶段技能可以通过相对路径引用。

### 独立版本管理

vocabulary 技能在 `skills-manifest.yaml` 中有独立版本号，可以独立于阶段技能升级。

---

## 四、调用关系图

```
1-规划 ──→ grilling（决策树追问）
       ──→ domain-modeling（术语建模 + ADR）

2-开发 ──→ tdd（红-绿-重构循环）
       ──→ code-review（自检审查）

3-检查 ──→ code-review（正式审查）

4-调试 ──→ diagnosing-bugs（六阶段诊断）

multi-worker ──→ tdd（worker 内 TDD 开发）
             ──→ code-review（worker 内自检 + 验收审查）
```

---

## 五、相关笔记

- [[my-skills v2 开发工作流技能体系]] — 全体系概览
- [[my-skills v2 深度分析报告]] — 架构分析与设计哲学
- [[my-skills 部署与治理指南]] — 部署与治理
