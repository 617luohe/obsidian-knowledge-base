---
name: note
description: 自然语言笔记入口。自动解析意图 → 提取参数 → 路由到 noteall 对应流程。触发：note、笔记、写、创建、记录、整理。
---

# note — 自然语言入口

解析用户的自然语言需求，匹配场景、提取参数、路由到对应技能。缺参数时分步盘问。

## 一、场景 → 路由匹配

| 信号词 | 路由 | 提取参数 |
|--------|------|----------|
| URL/http/www | `/info-digester` | URL, depth(默认detailed) |
| 日记/今天/早上/晚间/收尾/反思 | `/daily-concierge` | 日期, 模式(早/晚) |
| 周回顾/月回顾/周期 | `/daily-concierge` 周期模式 | 周期类型 |
| 写长文/教程/综述/深度文章 | `/article-writer` | 主题, 领域 |
| 笔记/概念/知识点/写一篇 | `/note-composer` | 主题, 类型, domain |
| 会议/开会/讨论/纪要 | `/meeting-minutes` | 主题, 日期, 参会者 |
| 书/读书/阅读/书架 | `/reading-digester` | 书名, 操作类型 |
| 批量/导入/curate/整理文件夹 | `/batch-curator` | 文件夹路径 |
| raw/原始数据/处理文件 | `/raw-ingester` | 文件路径, 产出类型 |
| 拆解/原子化/atomize | `/concept-atomizer` | 目标笔记 |
| 润色/优化/修一下 | `/note-polisher` | 目标笔记 |
| 索引/INDEX/更新导航 | `/index-keeper` | 全量/增量/健康检查 |
| MOC/审计/图谱/链接健康 | `/vault-cartographer` | 检查类型 |
| 文件整理/归类/文件乱了 | `/file-organizer` | 目标目录 |
| 归档/收尾/wrapup/cleanup | `/workflow-wrapup` | 目标项目 |

多信号同时出现时，越具体越优先。URL 和 raw/ 路径自动优先识别。

## 二、处理流程

1. **解析** → 匹配信号词 → 提取参数（URL/路径/日期/主题等）
2. **盘问**（按需）→ 信息不足时分步补全（每次一问），参数齐全则跳过
3. **路由** → 带参跳转到 noteall 对应流程

## 三、快捷穿透

用户可提供精确指令直接穿透到具体技能：
- `note 写关于{主题}的笔记` → `/note-composer`
- `note 消化 {URL}` → `/info-digester`
- `note 批量整理 raw/` → `/batch-curator`
- `note 处理 raw/{路径}` → `/raw-ingester`

## 四、边界

- 完全无匹配 → 路由到 noteall 主入口
- 多义输入 → 按更具体场景优先，盘问确认
- 参数矛盾 → 以用户明确指定的为准
- 中途取消 → "算了"/"取消" 退出不路由
