---
title: "MOC-my-skills v2"
aliases: ["my-skills 索引", "技能体系总索引", "my-skills MOC"]
tags:
  - type/moc
  - domain/tech/tools
  - topic/skills-guide
created: 2026-07-27
status: active
---

# MOC-my-skills v2

> my-skills v2（24 技能，三层架构）的知识库总索引。旧版 v1 MOC 已弃用，归档至 `7-Sources/skills-legacy/`。

## 🏗️ 架构概览

- [[my-skills v2 开发工作流技能体系]] — **总入口**，体系全景 + 24 技能详述 + v1→v2 对照
- [[my-skills vocabulary 核心层详解]] — 5 个 vocabulary 可复用核心深度解析
- [[my-skills v2 深度分析报告]] — 架构分析 + 设计哲学 + 优劣势 + 迁移指南
- [[my-skills 部署与治理指南]] — sync-skills.ps1 + manifest + 治理验证

## 🚪 入口

- `0-询问luohe` — **技能路由器**，不知道用哪个技能？直接说需求

## 🧠 独立方法论

| 技能 | 用途 | 详见 |
|------|------|------|
| `0--dialectic` | 六步矛盾分析法，战略决策 | [[my-skills v2 开发工作流技能体系#0--dialectic]] |
| `0--laoyoutiao` | 面向甲方的交付节奏管理 | [[my-skills v2 开发工作流技能体系#0--laoyoutiao]] |
| `multi-worker` | 并行开发编排器（实验性） | [[my-skills v2 开发工作流技能体系#multi-worker]] |

## 🔧 开发流程（阶段 0-6）

### 阶段 0：预备

| 技能 | 用途 | 调用 |
|------|------|------|
| `0-启动` | 新项目脚手架（结构 + git + uv） | 用户 |
| `0--claude` | CLAUDE.md 初始化/注入 | 模型 |
| `0--neat-freak` | 知识库洁癖审查 | 用户 |
| `0--tokenless` | 超压缩沟通模式 | 模型 |

### 阶段 1-2：设计

| 技能 | 用途 | 委托到 |
|------|------|--------|
| `1-规划` | 方案设计 + 任务拆解（6 子阶段） | `vocabulary/grilling` + `vocabulary/domain-modeling` |
| `2-开发` | TDD 编码实现（红-绿-重构） | `vocabulary/tdd` |

### 阶段 3-4：质量

| 技能 | 用途 | 委托到 |
|------|------|--------|
| `3-检查` | 代码审查与验收（4 种模式自动路由） | `vocabulary/code-review` |
| `4-调试` | 结构化调试（六阶段） | `vocabulary/diagnosing-bugs` |

### 阶段 5-6：交付

| 技能 | 用途 | 调用 |
|------|------|------|
| `5-版本管理` | Git 全流程操作 | 用户 |
| `6-最后整理` | 会话收尾与沉淀 | 用户 |

## 🔩 vocabulary 核心层

| 技能 | 职责 | 被谁调用 |
|------|------|---------|
| `vocabulary/grilling` | 询问循环 | `1-规划` |
| `vocabulary/domain-modeling` | 领域建模 + ADR | `1-规划` |
| `vocabulary/tdd` | TDD 红-绿-重构 | `2-开发`、`multi-worker` |
| `vocabulary/code-review` | 双轴审查 | `2-开发`、`3-检查`、`multi-worker` |
| `vocabulary/diagnosing-bugs` | Bug 六阶段诊断 | `4-调试` |

## 🗺️ 推荐阅读路径

| 你是 | 先读这些 |
|------|---------|
| **想了解全局** | [[my-skills v2 开发工作流技能体系]] |
| **想理解架构设计** | [[my-skills v2 深度分析报告]] |
| **想深入 vocabulary 层** | [[my-skills vocabulary 核心层详解]] |
| **想部署或治理** | [[my-skills 部署与治理指南]] |
| **从 v1 迁移** | [[my-skills v2 深度分析报告#v1-v2-迁移指南]] |

## 📦 历史归档

v1 版本笔记已移至 `7-Sources/skills-legacy/`：
- MOC-my-skills 使用指南（v1，已弃用）
- 13 个独立技能使用指南（v1，已弃用）

## 🔗 外部链接

- GitHub 仓库：https://github.com/617luohe/my-skills
- [[Claude Code Skills 开发指南]]
- [[MOC-Tech Tools]]
