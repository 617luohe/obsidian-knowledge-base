---
title: "MCP Memory 服务安装与使用"
aliases: ["Memory MCP Server", "MCP 记忆服务", "知识图谱记忆"]
tags:
  - type/resource
  - domain/tech/tools
created: 2026-07-31
updated: 2026-07-31
status: published
confidence: evergreen
source: "https://github.com/modelcontextprotocol/servers"
---

# MCP Memory 服务安装与使用

> 一句话定义：基于本地知识图谱的 MCP 记忆服务，让 AI 助手在跨会话间持久化存储实体、关系和观察记录。

## 概述

Memory MCP Server（`@modelcontextprotocol/server-memory`）是 Anthropic 官方维护的 MCP 参考实现。它使用本地 JSONL 文件构建知识图谱，无需外部数据库或网络连接，让 Claude Code 等 AI 工具实现跨会话的记忆持久化。

- **技术栈**：TypeScript + 现代 MCP SDK
- **存储方式**：本地 JSONL 文件（`~/.mcp-memory.json`）
- **搜索方式**：子字符串匹配（非语义搜索）
- **许可协议**：MIT
- **依赖**：Node.js ≥ 18

## 安装与配置

### 前提条件

- Node.js ≥ 18 已安装
- Claude Code（或其他 MCP 客户端）已安装

### 配置方式

在 `~/.claude/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### 自定义存储路径

如需指定知识图谱文件的存储位置，可通过环境变量 `MEMORY_FILE_PATH` 设置：

```json
{
  "mcpServers": {
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "D:/my-data/memory-graph.json"
      }
    }
  }
}
```

不设置则默认存储在 `~/.mcp-memory.json`。

### 生效

保存配置文件后重启 Claude Code，运行 `/mcp` 确认 memory 服务状态为在线。

## 核心工具（9 个）

### 读取工具（只读、幂等）

| 工具 | 用途 | 关键参数 |
|------|------|----------|
| `read_graph` | 读取整个知识图谱 | 无 |
| `search_nodes` | 按名称/描述搜索实体 | `query`（搜索词） |
| `open_nodes` | 查看指定节点的详细信息 | `names`（节点名称数组） |

### 写入工具（非破坏性、非只读）

| 工具 | 用途 | 关键参数 |
|------|------|----------|
| `create_entities` | 创建新实体（自动去重） | `entities`（实体数组，含 name/entityType/observations） |
| `create_relations` | 创建实体间关系（自动去重） | `relations`（关系数组，含 from/to/relationType） |
| `add_observations` | 为实体添加观察记录 | `observations`（观察数组，含 entityName/contents） |

### 删除工具（破坏性、幂等）

| 工具 | 用途 | 关键参数 |
|------|------|----------|
| `delete_entities` | 删除实体 | `names`（实体名称数组） |
| `delete_observations` | 删除指定观察 | `deletions`（删除项数组） |
| `delete_relations` | 删除关系 | `relations`（关系数组） |

所有 9 个工具均配置了 MCP 工具注解（`readOnlyHint`、`destructiveHint`、`idempotentHint`），客户端可根据注解自动决定权限策略。

## 数据模型

```
Entity（实体）
├── name: string          # 唯一名称
├── entityType: string    # 类型（如 Person、Project、Concept）
├── observations[]:       # 关于该实体的零散记录
│   └── content: string

Relation（关系）
├── from: string          # 源实体名称
├── to: string            # 目标实体名称
└── relationType: string  # 关系类型（如 knows、depends_on、part_of）
```

## 使用示例

### 场景一：记录用户偏好

```
你：请把"我偏好中文回答"记入记忆

Claude 调用 create_entities：
  entities: [{
    name: "用户偏好",
    entityType: "Preference",
    observations: [{ content: "用户偏好中文回答" }]
  }]
```

### 场景二：积累项目知识

```
你：记录一下，Obsidian Vault 项目使用 Python hooks 做自动化

Claude 调用 create_entities + create_relations：
  → 创建实体 "Obsidian Vault" (Project)
  → 创建实体 "Python Hooks" (Technology)
  → 创建关系 "Obsidian Vault" --uses--> "Python Hooks"
```

### 场景三：跨会话回顾

```
（新会话中）
你：我之前在做哪个项目？有什么重要决策？

Claude 调用 search_nodes("项目") → read_graph()
→ 返回之前记录的实体和关系，无缝继续
```

## 最佳实践

### 命名规范

- **实体名称**：使用可辨识的唯一名称，如 `"Obsidian Vault"` 而非 `"项目"`
- **关系类型**：使用语义化的动词短语，如 `depends_on`、`implements`、`authored_by`
- **entityType**：分类统一，如 `Person`、`Project`、`Technology`、`Concept`、`Decision`

### 粒度控制

- 每次存储控制在 3-5 条关键信息，避免知识图谱膨胀
- 定期手动审查：让 Claude `read_graph` 输出全图，清理过时或错误条目
- 观察记录（observations）用于零散事实，实体+关系用于结构化知识

### 安全注意事项

- 知识图谱存储在本地，不会上传到任何远程服务
- 敏感信息（密码、token）**不要**存入 memory，它没有加密
- 如果需要团队共享记忆，建议使用远程数据库方案，而非此本地版本

## 局限性

| 局限 | 说明 | 替代方案 |
|------|------|----------|
| 子字符串搜索 | 不支持语义/向量搜索，无法理解同义词 | 社区版 `@provos/memory-mcp-server` 支持向量融合搜索 |
| 无自动清理 | 知识图谱只增不减，不会自动合并冲突条目 | 定期手动维护 |
| 无 LLM 摘要 | 不对观察记录做智能摘要压缩 | 社区版支持 `memory_ingest` 原子事实分解 |
| 单文件存储 | 不支持多用户或多知识库隔离 | 通过 `MEMORY_FILE_PATH` 手动切换文件 |

## 与其他概念的关系

- [[MCP GitHub 服务安装与使用]] — 搭配 GitHub 服务，记忆项目结构和协作信息
- [[Context7 MCP 服务安装与使用]] — 搭配 Context7 获取实时文档
- [[Claude Code Windows 安装与配置]] — 前置依赖
- [[Skills Manager 技能管理]] — 技能管理与记忆管理互补

## 延伸阅读

- [MCP 官方示例](https://modelcontextprotocol.io/examples)
- [GitHub 仓库](https://github.com/modelcontextprotocol/servers)
- [[MCP 协议介绍与配置]]
