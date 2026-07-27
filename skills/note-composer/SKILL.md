---
name: note-composer
description: 撰写高质量 Obsidian 笔记。自动匹配模板、推荐 wikilink、补全 frontmatter、规范化格式。触发：写笔记、创建笔记、记录想法。
---

# note-composer — 笔记撰写

## 〇、前置盘问（每次一问）

Q1: 为什么需要这篇笔记？（记录知识/跟踪项目/归档参考/学习理解）
Q2: 笔记类型？知识概念(4-Resources/)/MOC(1-Atlas/)/项目(2-Projects/)/责任域(3-Areas/)/人物(6-People/)/来源(7-Sources/)
Q3: 主题/标题？关键点？参考资料？
Q4: 领域（domain）？
Q5: 已有相关笔记？（可选）
Q6: 深度？简明/标准/详尽

## 一、操作判断

- **创建**："写/创建/新建/记录" → 从头撰写
- **更新**："更新/修改/补充" → 修改已有笔记（先读取→只改指定部分→保留手动属性→更新updated→展示diff→确认）
- **展开**："展开/深入" → 基于已有笔记扩展

## 二、类型→模板→目录

| 信号词 | 类型 | 模板 | 目录 |
|--------|------|------|------|
| 索引/概览/MOC | MOC | tpl-MOC | 1-Atlas/ |
| 项目/计划/方案 | Project | tpl-project | 2-Projects/ |
| 日常/习惯/财务 | Area | tpl-area | 3-Areas/ |
| 概念/术语 | Resource | tpl-resource | 4-Resources/ |
| 日记/周记/月记 | Journal | tpl-daily/weekly/monthly | 5-Journal/ |
| 人/联系 | Person | tpl-person | 6-People/ |
| 书/文章/论文/视频 | Source | tpl-source | 7-Sources/ |
| 会议/讨论/访谈 | Meeting | tpl-meeting | 2-Projects/{project}/ |

默认 Resource。

## 三、生成步骤

1. 加载模板 → 填充 {{variable}} → 生成正文
2. Wikilink 智能推荐：提取关键词 → 搜索 vault 已有笔记 → 首次出现时自然嵌入 `[[link]]` → 未匹配的放入"## 相关笔记"
3. Frontmatter 必填：title, tags(type/ + domain/), created, updated, status:draft
4. 格式规范：`#` 层级不乱跳、`[[wikilink]]`、`-` 列表、callout 标准语法、代码块标注语言、中英文间留空格

## 四、安全

- 默认不自动创建文件，确认后写入
- 更新模式不删除任何已有内容
- AI 推测标注 `> [!ai-guess]`
- 不链接 vault 外资源
