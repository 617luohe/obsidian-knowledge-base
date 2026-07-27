---
name: index-keeper
description: [内部] 索引维护。自主维护所有一级文件夹 _INDEX.md：增量更新、缺失补全、健康报告。由 noteall 路由器调度。
---

# index-keeper — 索引维护

自主维护每个一级文件夹的 `_INDEX.md`（结构性导航索引，非概念地图）。与 vault-cartographer 分工：INDEX = "文件夹里有什么"，MOC = "概念怎么关联"。

## 一、INDEX 统一结构

每个 `_INDEX.md` 包含：frontmatter（title/tags/created/updated/auto-indexed）→ 一句话描述 → 统计区 → 内容导航 → 维护日志。

### 各文件夹导航结构定制

| 文件夹 | 导航内容 |
|--------|----------|
| 0-Inbox/ | 待处理队列表 + 处理统计（本周新增/处理/积压） |
| 1-Atlas/ | MOC 注册表（按 domain 分组列出所有 MOC） |
| 2-Projects/ | 项目看板（活跃/暂停/已完成，含优先级+截止日期+进度） |
| 3-Areas/ | 责任域仪表盘（领域+最后回顾+状态+入口笔记） |
| 4-Resources/ | 知识领域树（按 domain 分组，含笔记数） |
| 5-Journal/ | 日记结构 + 近期活跃表（日期+日记+心情+关键事件） |
| 6-People/ | 人物目录（按 relationship 分组：同事/朋友/…） |
| 7-Sources/ | 来源目录（按 source-type 分组：书籍/文章/视频/课程） |
| raw/ | 待处理文件表 + 处理统计（总/本周新增/超7天未处理） |

使用 `8-Templates/tpl-INDEX.md` 模板创建新 INDEX。统计数据优先用 dataview 动态查询。

## 二、工作模式

| 模式 | 命令 | 行为 |
|------|------|------|
| 全量更新 | `/index-keeper` | 扫描所有一级文件夹，生成/更新所有 _INDEX.md |
| 增量更新 | `/index-keeper 增量 {文件夹}` | 只更新指定文件夹，仅处理变更部分 |
| 健康检查 | `/index-keeper 健康检查` | 检测缺失 INDEX、失效链接、缺失条目、过期描述 |
| 缺失补全 | `/index-keeper 补全` | 仅为无 _INDEX.md 的文件夹创建初始 INDEX |

### 增量更新自动触发时机
- note-composer 新建笔记后
- batch-curator 批量导入后
- workflow-wrapup 归档后

## 三、安全规则

- `<!-- MANUAL -->...<!-- /MANUAL -->` 区域完全不碰
- 内容导航只增不删（确认失效链接除外）
- 每次修改记录维护日志
- 全量更新前展示变更摘要，确认后写入
- 只读写 `_INDEX.md`，不碰其他文件

## 四、输出

全量/增量更新后输出简短报告：哪些文件夹更新了，哪些条目增加/删除，需关注的问题。
