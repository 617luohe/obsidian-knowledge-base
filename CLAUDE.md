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
`0-Inbox/`(捕获) `1-Atlas/`(MOC) `2-Projects/` `3-Areas/` `4-Resources/`(概念笔记) `5-Journal/`(日/周/月) `6-People/` `7-Sources/`(来源，按领域子文件夹) `8-Templates/` `9-System/`(规范) + `assets/ raw/`

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
