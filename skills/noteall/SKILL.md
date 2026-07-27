---
name: noteall
description: 知识库流程路由器，主流程：输入→撰写→润色→索引。不确定用哪个流程时直接用 `note` 入口。触发：工作流、导航、noteall、知识库。
---

# noteall — 知识库流程路由器

主流程：**Intake → Compose → Polish → Index**。目录结构参考各 `_INDEX.md`。

## 〇、环境检测（每次启动首步）

1. **检测 `.obsidian/` 目录** — 存在于当前工作目录 → **Vault 模式**，所有路径相对于当前目录
2. **无 `.obsidian/`** → 读取 `./CLAUDE.md` 中 `## 默认知识库` 的 `默认知识库路径` → **外部项目模式**，所有产出路径相对于该 vault 根目录
3. **无配置** → 询问用户："当前项目未配置默认知识库，笔记写入哪里？"（提供：① 手动指定路径 ② 在当前项目创建本地笔记目录 ③ 运行 `/0--claude` 初始化配置）

**外部项目模式下的路径映射**（vault = 配置的默认知识库路径）：
| 原相对路径 | 映射为 |
|-----------|--------|
| `4-Resources/` | `{vault}/4-Resources/` |
| `7-Sources/` | `{vault}/7-Sources/` |
| `0-Inbox/` | `{vault}/0-Inbox/` |
| `1-Atlas/` | `{vault}/1-Atlas/` |
| `2-Projects/` | `{vault}/2-Projects/` |
| `3-Areas/` | `{vault}/3-Areas/` |
| `5-Journal/` | `{vault}/5-Journal/` |
| `6-People/` | `{vault}/6-People/` |
| `raw/` | `{vault}/raw/` |

**注意**：Wikilink 搜索范围始终为 vault 目录（`[[xxx]]` 在 vault 内匹配）；INDEX/MOC 操作也在 vault 内进行。

## 一、主流程路由

### ① Intake（内容进入）
| 来源 | 路由 | 产出 |
|------|------|------|
| URL/网页/PDF/文本 | `/info-digester`（depth: summary/detailed/atomic） | 7-Sources/ |
| raw/ 中的文件 | `/raw-ingester` 盘问 → 路由到对应技能 | 取决于结果 |
| 零散想法 | 捕获到 0-Inbox/ | 0-Inbox/ |

### ② Compose（撰写笔记）
| 场景 | 路由 | 目录 |
|------|------|------|
| 知识概念/MOC/项目/人物 | `/note-composer` | 按类型分目录 |
| 深度长文（2000+字） | `/article-writer` | 4-Resources/ |
| 会议纪要 | `/meeting-minutes` | 2-Projects/{项目}/notes/ |

### ③ Polish（提升质量）
| 场景 | 路由 |
|------|------|
| 单篇润色 | `/note-polisher` |
| 长笔记拆原子 | `/concept-atomizer` |
| 批量审计 | `/note-polisher` batch mode |

### ④ Index（维护导航）
| 场景 | 路由 |
|------|------|
| MOC 生成/更新 | `/vault-cartographer` |
| INDEX 维护 | `/index-keeper` |
| 收尾归档 | `/workflow-wrapup` |

## 二、分支决策

| 场景 | 判断 | 路由 |
|------|------|------|
| 深度研究+长篇写作 | 需要研究→大纲→撰写→修订 | `/article-writer` |
| 大量文件批量导入 | raw/ 有 ≥5 个文件 | `/batch-curator` |
| 阅读场景 | 读书/文章 | `/reading-digester` |
| 文件组织混乱 | 错位/命名/重复 | `/file-organizer` |
| 时间管理 | 日记/周记/月记 | `/daily-concierge` |

## 三、时间维度触发

| 时机 | 链路 |
|------|------|
| 早晨 | `/daily-concierge` 创建日记 → 拉取待办 |
| 晚间 | `/daily-concierge` 晚间反思 → 清空 Inbox |
| 周末 | `/daily-concierge` 周回顾 → `/vault-cartographer` → `/note-polisher` |
| 月末 | `/daily-concierge` 月回顾 → `/vault-cartographer` 全量 → `/index-keeper` 全量 |

## 四、维护触发

| 信号 | 链路 |
|------|------|
| 知识库混乱 | `/vault-cartographer` 审计 → `/file-organizer` → `/index-keeper` |
| raw/ 积压 | `/batch-curator` |
| 新增大批笔记 | `/index-keeper` 增量更新 |
| 项目完成 | `/workflow-wrapup` → `/index-keeper` 更新 |

## 五、原则

- 一次一步，确认后执行，允许跳转
- 大规模操作（batch-curator/全量索引）建议独立对话
- 每次摄入完成 → `/workflow-wrapup` 归档
