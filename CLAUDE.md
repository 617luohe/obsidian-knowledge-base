# CLAUDE.md

Obsidian 知识库。强制规则：

## 修改前 grep
```bash
grep -rl "\[\[目标笔记\]\]" --include="*.md" .
```
确认影响面后再改。批量操作：grep → 逐篇改 → 验断链。

## 原子化
一篇一概念，能拆即拆，`[[wikilink]]` 互联。

## 创建笔记

### 目录
`1-Atlas/`(MOC) `2-Projects/` `3-Daily/` `4-Resources/`(工具/文章) `5-Ideas/`

### Frontmatter
```yaml
tags:
  - type/resource          # moc | resource | project | daily | idea
  - domain/xx/xx
status: draft | published | archived
confidence: seed | sapling | evergreen
```
`confidence` 从 seed（初稿）→ sapling（迭代中）→ evergreen（成熟）。

### 结构
首行 `> 一句话定义`，末段「延伸阅读」。

## Git
`type: 描述`（docs|update|refactor|fix|chore），一主题一 commit。

## 禁止
CodeGraph、不查反链即改、多主题混篇、混文件提交。
