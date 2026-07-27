---
name: noteall
description: >
  知识库流程路由器。所有知识管理工作的统一入口，沿着主流程（输入→消化→撰写→润色→索引）
  或分支流程自动路由到对应技能。适合新手入门和日常使用。
  触发：工作流、导航、开始、今天做什么、帮我、引导、笔记、noteall、知识库。
---

# noteall — 知识库流程路由器

一条**流程**是一条穿过技能的路径。大部分知识工作沿着**主流程**走。

> **💡 最快入口**：不确定用哪个流程时，直接说 `note 写一篇关于 Transformer 的笔记`、`note 消化 https://...`、`note 整理 raw/`，`note` 技能会自动解析意图并路由。

## 一、资产目录速查

| 目录 | 角色 | INDEX |
|------|------|-------|
| `0-Inbox/` | 捕获区 — 零散想法、待处理素材 | [[0-Inbox/_INDEX]] |
| `1-Atlas/` | 知识地图 — MOC 索引中心 | [[1-Atlas/_INDEX]] |
| `2-Projects/` | 活跃项目 — 有截止日期的目标 | [[2-Projects/_INDEX]] |
| `3-Areas/` | 持续责任 — 无截止日期的领域 | [[3-Areas/_INDEX]] |
| `4-Resources/` | 知识库 — 按领域组织的原子笔记 | [[4-Resources/_INDEX]] |
| `5-Journal/` | 日记 — 日/周/月/季时间记录 | [[5-Journal/_INDEX]] |
| `6-People/` | 人脉 — 人物信息与互动 | [[6-People/_INDEX]] |
| `7-Sources/` | 来源 — 书/文章/课程/视频 | [[7-Sources/_INDEX]] |
| `raw/` | 暂存区 — 待处理的原始数据 | [[raw/_INDEX]] |

---

## 二、主流程：输入 → 知识

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ ① 输入    │ → │ ② 撰写    │ → │ ③ 润色    │ → │ ④ 索引    │
│ Intake   │    │ Compose  │    │ Polish   │    │ Index    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
 内容进入         转化为笔记       提升质量        维护导航
```

### ① 输入（Intake）— 内容进入知识库

根据内容来源和形态，选择入口：

| 来源 | 路由 | 产出 |
|------|------|------|
| 网页文章 / URL | `/info-digester`（depth: summary/detailed/atomic） | `7-Sources/` + 可选 `4-Resources/` |
| PDF / 文本粘贴 | `/info-digester` | `7-Sources/` |
| raw/ 中的文件 | `/raw-ingester` 盘问 → `/info-digester` 或 `/note-composer` | 取决于盘问结果 |
| 零散想法 | 快速捕获到 `0-Inbox/`（Ctrl+N → 选 0-Inbox） | `0-Inbox/YYYYMMDD-HHMM-主题.md` |
| 视频字幕 | `/info-digester`（当作文本处理） | `7-Sources/` |

**3 种消化深度**：
- ⚡ **summary** — 300 字摘要，对话中输出，不存文件（快速判断是否值得读）
- 📝 **detailed** — 完整来源笔记 → `7-Sources/`
- 🧬 **atomic** — 来源笔记 + 拆解为 N 篇原子概念笔记 → `4-Resources/`

### ② 撰写（Compose）— 转化为结构化笔记

| 场景 | 路由 | 产出目录 |
|------|------|----------|
| 单篇知识概念笔记 | `/note-composer` | `4-Resources/{domain}/` |
| MOC 知识地图 | `/note-composer`（type=moc） | `1-Atlas/` |
| 项目概述 | `/note-composer`（type=project） | `2-Projects/{项目名}/` |
| 责任域入口 | `/note-composer`（type=area） | `3-Areas/` |
| 人物笔记 | `/note-composer`（type=person） | `6-People/` |
| **深度长文/教程/综述**（2000+ 字） | **`/article-writer`** 研究→大纲→初稿→修订 | `4-Resources/{domain}/` |
| 会议纪要 | `/meeting-minutes` | `2-Projects/{项目}/notes/` |

**note-composer 的 4 阶段流程**：
```
发现(检查 raw/ 素材) → 盘问(类型/领域/深度) → 执行(模板+wikilink+frontmatter) → 收尾(建议归档)
```

### ③ 润色（Polish）— 提升笔记质量

| 场景 | 路由 |
|------|------|
| 单篇笔记润色 | `/note-polisher` |
| 长笔记拆解为原子笔记 | `/concept-atomizer` |
| 批量质量审计（如 "检查 4-Resources 全部笔记"） | `/note-polisher` batch mode |

**note-polisher 6 维度检查**：元数据完整性 → 结构规范性 → 链接健康度 → 内容完整性 → 格式一致性 → Confidence 升级评估

### ④ 索引（Index）— 维护知识导航

| 场景 | 路由 |
|------|------|
| 生成/更新 MOC | `/vault-cartographer` |
| 更新所有文件夹 INDEX | `/index-keeper` |
| 链接健康检查 | `/vault-cartographer`（link analysis） |
| 完整图谱报告 | `/vault-cartographer`（full report） |
| 收尾归档（处理后清理 raw/） | `/workflow-wrapup` |

---

## 三、分支判断

### 分支 — 需要深度研究 + 长篇写作？

- **是** → `/article-writer`：研究(vault搜索+外部) → 大纲(多级+确认) → 逐节撰写 → 全局修订(术语/交叉引用/一致性) → 发布(生成MOC引用+更新索引)
- **否** → 继续主流程（用 `/note-composer`）

### 分支 — 有大量原始文件要批量导入？

- **是** → `/batch-curator` 全自动 6 阶段流水线：
  ```
  ① Scan(扫描) → ② Analyze(分析内容+类型+领域) → ③ Plan(一次确认) 
  → ④ Execute(批量生成笔记+wikilink+标签) → ⑤ Index(更新MOC) → ⑥ Archive(归档到7-Sources/)
  ```
- **否** → 逐文件用 `/raw-ingester`（交互式盘问）

### 分支 — 是阅读场景？

- **读书/文章** → `/reading-digester`（支持分章节、高亮导入、书架管理、全书回顾、跨书概念交叉引用）
- **不是** → 继续主流程（用 `/info-digester`）

### 分支 — 文件组织混乱，需要整理？

- **是** → `/file-organizer` 自主扫描 → 诊断(错位/命名/重复/过期) → 计划一次确认 → 执行(移动/重命名/合并)
- **否** → 继续

### 分支 — 是时间管理场景？

- **日记/周记/月记** → `/daily-concierge`
- **不是** → 继续

---

## 四、上游（汇入主流程）

### 从 raw/ 汇入
```
raw/ 有待处理数据
  → /raw-ingester 扫描 + 盘问(项目/产出类型/格式/日期)
  → 按盘问结果路由：
      · 日报/周报 → /daily-concierge（1.3 节）
      · 知识笔记 → /note-composer
      · 来源笔记 → /info-digester
      · 仅归档 → 跳过执行
  → /workflow-wrapup 归档原始文件到 7-Sources/
```

### 从阅读汇入
```
读完一本书
  → /reading-digester（全书回顾模式）
  → /concept-atomizer 提取关键概念 → 原子笔记
  → /vault-cartographer 更新相关 MOC
  → /workflow-wrapup（如有原始导入文件需归档）
```

### 从会议汇入
```
开完一个会
  → /meeting-minutes 解析转录/聊天记录/口述
  → 提取行动项 + 决策 → 链接参会人 + 项目
  → 写入 2-Projects/{项目}/notes/
  → 提醒追踪行动项
```

---

## 五、支撑层（不进主线，按信号触发）

### 时间维度

| 信号 | 技能 | 做什么 |
|------|------|--------|
| 早上 / 新的一天 / 开始工作 | `/daily-concierge` | 创建今日日记 → 拉取昨日回顾+活跃项目待办 → 设定今日 3 目标 |
| 晚间 / 下班 / 收尾 | `/daily-concierge`（晚间反思） | 对照目标 → 反思(做了什么/学到什么/改进什么/感恩) → 清空 Inbox → 提炼知识种子 |
| 周日 / 周回顾 | `/daily-concierge`（周回顾）→ `/vault-cartographer` → `/note-polisher` | 创建周记 → 审计本周笔记 → 检查链接 → 更新 MOC → 规划下周 |
| 月末 / 月回顾 | `/daily-concierge`（月回顾）→ `/vault-cartographer`（全量）→ `/index-keeper` | 创建月记 → 图谱报告 → 归档已完成项目 → 全量索引更新 |

### 维护维度

| 信号 | 技能 | 做什么 |
|------|------|--------|
| 知识库感觉混乱 / 找不到东西 | `/vault-cartographer`（全面审计）→ `/file-organizer` → `/index-keeper` | 审计 → 整理文件 → 重建索引 |
| Inbox 积压 |手动或 `/file-organizer` | 逐条处理或批量清空 |
| raw/ 有大量积压 | `/batch-curator` | 批量导入流水线 |
| 新增大量笔记后 | `/index-keeper` | 增量更新相关 INDEX |
| 笔记写完需要发布 | `/note-polisher` → `/index-keeper`（更新 INDEX） | 润色 + 更新导航 |

### 专项维度

| 信号 | 技能 |
|------|------|
| 新项目启动 | `/note-composer`（type=project）创建项目概述 + 任务拆解 |
| 项目完成 | `/workflow-wrapup` 归档 + 更新项目 status → `/index-keeper` 更新 2-Projects/_INDEX |
| 知识库初始化 / 大规模重构 | `/batch-curator`（批量导入）+ `/vault-cartographer`（全部 MOC）+ `/index-keeper`（全部 INDEX）|

---

## 六、Agent 层（自主执行，最小交互）

| Agent | 职责 | 触发方式 |
|-------|------|----------|
| **`/index-keeper`** | 维护所有一级文件夹的 `_INDEX.md`：检测变更 → 增量更新 → 缺失补全 → 健康报告 | 显式调用 / workflow-wrapup 后自动触发 / 定期（周/月） |
| **`/file-organizer`** | 自主扫描、诊断、修复文件组织问题：位置检查、命名规范、重复合并、过期处理、Inbox 清空 | 显式调用 / 知识库审计后建议触发 |
| **`/article-writer`** | 深度长文写作：研究阶段 → 大纲阶段 → 逐节撰写 → 全局修订 → 发布 | 显式调用 / 需要写 2000+ 字长文时 |

**Agent 与普通 Skill 的区别**：
- Agent 收到指令后自主执行，只在关键决策点询问
- Skill 以交互式引导为主，逐步确认
- Agent 可组合：`/index-keeper` 全量更新 → `/vault-cartographer` 全量审计 → 汇总报告

---

## 七、快速判断

| 你的情况 | 怎么做 |
|---------|--------|
| 看到一篇好文章，想保存 | `/info-digester {URL}` 或 `note 消化 {URL}` |
| 想写一篇知识笔记 | `note 写一篇关于XX的笔记`（自动路由到 note-composer） |
| 想写深度长文/教程 | `/article-writer 写一篇关于XX的教程` |
| raw/ 里有文件要处理 | `/raw-ingester 扫描 raw/` 或 `note 处理 raw/` |
| 大量文件要批量导入 | `/batch-curator 整理 raw/` |
| 开完会要整理纪要 | `note 整理会议纪要：主题XX，参会人XX，内容...` |
| 读完一本书 | `/reading-digester 读完了《书名》` |
| 笔记写完需要润色 | `/note-polisher {笔记名}` |
| 长笔记太臃肿要拆 | `/concept-atomizer {笔记名}` |
| 知识库导航该更新了 | `/index-keeper` 或 `/vault-cartographer 更新 MOC-XX` |
| 文件放错位置/命名混乱 | `/file-organizer 整理 {目录}` |
| 今天开始工作 | `/noteall` → "开始新的一天" |
| 今天收尾 | `/noteall` → "晚间收尾" |
| 周末/月末回顾 | `/noteall` → "周期回顾" |
| 知识库健康检查 | `/noteall` → "知识库维护" |
| 不知道用啥 | 直接说你的需求，我会引导你找到正确流程 😊 |

---

## 八、快捷命令

有经验的用户可直接用快捷命令跳过路由：

| 快捷命令 | 场景 |
|----------|------|
| `note {一句话需求}` | 智能解析 → 自动路由到对应流程 |
| `/daily-concierge 创建今天的日记` | 早晨启动 |
| `/daily-concierge 晚间反思` | 晚间收尾 |
| `/info-digester {URL}` | 消化网页 |
| `/note-composer 写一篇关于 {主题} 的笔记` | 写笔记 |
| `/article-writer {主题}` | 写长文 |
| `/meeting-minutes {内容}` | 整理会议 |
| `/reading-digester {操作}` | 阅读管理 |
| `/daily-concierge {周/月}回顾` | 周期回顾 |
| `/vault-cartographer {检查项}` | 知识库维护 |
| `/index-keeper` | 索引维护 |
| `/file-organizer 整理 {目录}` | 文件整理 |
| `/raw-ingester 扫描 raw/` | 处理原始数据 |
| `/batch-curator 整理 raw/` | 批量导入 |
| `/workflow-wrapup` | 收尾归档 |

---

## 九、对话管理原则

1. **一次一步**：不一次性展示所有步骤，引导用户逐步完成
2. **确认后执行**：涉及文件写入的操作，先展示预览再确认
3. **允许跳转**：用户可以说"跳过"、"不做了"、"直接到最后"
4. **记住进度**：在一个流程中，记住用户已完成的前序步骤
5. **出错友好**：失败时清晰说明原因并提供替代方案
6. **Agent 自主**：Agent 层技能（index-keeper/file-organizer/article-writer）最小化交互，只在关键决策点确认

---

## 十、上下文管理

### 主流程保持一个上下文
输入 → 撰写 → 润色 → 索引 可在同一对话中完成，共享 vault 理解和笔记上下文。

### 独立任务清空上下文
- `/batch-curator` 处理大量文件时，建议在独立对话中进行
- `/index-keeper` 全量巡检可后台自主运行
- `/file-organizer` 大规模整理前确认范围，执行中不回翻

### 完成后收尾
- 每次摄入或撰写任务完成 → `/workflow-wrapup` 归档原始文件
- 每周 → `/vault-cartographer` 审计 + `/note-polisher` 质量检查
- 每月 → `/vault-cartographer` 全量 + `/index-keeper` 全量 + 项目归档
