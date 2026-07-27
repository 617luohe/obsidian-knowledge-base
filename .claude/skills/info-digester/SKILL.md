---
name: info-digester
description: 外部信息消化为 Obsidian 笔记。支持 summary/detailed/atomic 三种深度。触发：消化、分析、提取、这篇文章、这个网页、整理成笔记。
---

# info-digester — 信息消化

将外部内容（网页/PDF/文本/视频字幕）转化为结构化笔记。

## 一、前置盘问（分步，每次一问）

Q1: 消化对象（网页/PDF/文本/视频）和标题？
Q2: 消化深度？⚡summary（300字摘要，不存文件）/ 📝detailed（来源笔记→7-Sources/）/ 🧬atomic（来源+概念笔记→4-Resources/）
Q3: 关联项目/领域 → 确定 domain 标签
Q4: 已知相关笔记？（可选）
Q5: 重点关注方向？（可选）

## 二、内容获取

- URL → defuddle skill 获取清洁正文
- PDF → pdf skill 提取文本
- 文本 → 直接使用
- 视频 → 有字幕当文本处理，无字幕需用户提供

## 三、消化深度

### summary
300字结构化摘要（一句话+3核心观点+是否值得读），对话中输出，不创建文件。

### detailed（默认）
创建完整来源笔记（7-Sources/），使用 `tpl-source.md` 模板：
- 元数据提取（title/author/date/url/source-type）→ 核心论点（3-5个）→ 关键概念+wikilink搜索 → 原文引用 → 个人思考提示 → 行动项
- AI 推断用 `> [!ai-guess]`，AI 解读用 `> [!ai-interpretation]`，原文引用用 `> [!quote]`

### atomic
创建 1 篇来源笔记 + N 篇原子概念笔记（4-Resources/{domain}/）：
- 概念命名 → 检索 vault 去重 → 已有→更新+链接 / 无→新建（精简模板：定义+核心内容+相关链接）
- 每篇标注 `confidence: seed` + `source` 指向来源笔记
- 概念去重：高度重叠→合并；相似不同角度→互相链接

## 四、特殊内容处理

| 类型 | 额外处理 |
|------|----------|
| 论文 | 提取研究方法/数据集/实验结论/局限，标注 DOI |
| 视频 | 时间戳关键片段，标注 channel |
| 书籍章节 | 章号+页码，链接全书来源笔记 |

## 五、收尾

消化完成后输出报告（新建文件列表 + 已有笔记链接 + 推荐行动）。检查是否需要更新对应 MOC。不绕过付费墙，AI 推测内容强制标注。
