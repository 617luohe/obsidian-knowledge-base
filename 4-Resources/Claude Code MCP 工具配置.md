---
created: 2026-07-30
updated: 2026-08-08
tags:
  - type/resource
  - domain/tech/tools
  - claude-code
  - mcp
  - ai-tools
  - configuration
status: draft
confidence: seed
---

# Claude Code MCP 工具配置

总结 2026-07-30 安装并配置的三个 MCP Server，以及已内置的 Headroom。

## MCP 概述

Model Context Protocol (MCP) 是 Anthropic 发布的开放协议，让 AI 助手通过标准化接口连接外部工具和数据源。Claude Code 通过 `.mcp.json` 文件管理 MCP Server，支持用户级全局配置（`~/.claude/.mcp.json`）和项目级配置（`.mcp.json`）。

> **注意**：`mcpServers` 不能配置在 `settings.json` 中，必须使用独立的 `.mcp.json` 文件。

---

## 一、Headroom（内置）

- **包名**：内置（无需安装）
- **用途**：上下文压缩与检索
- **工作原理**：
  - 当工具输出过大时自动压缩内容，释放上下文窗口
  - 压缩后的原始内容可通过 hash 检索
  - 智能判断是否需要压缩（小内容走 noop，大内容才真正压缩）
- **使用方式**：零操作，自动触发。也可主动说"压缩这段内容"
- **API Key**：不需要

## 二、GitHub MCP

- **包名**：`@modelcontextprotocol/server-github@2025.4.8`
- **安装**：`npm install -g @modelcontextprotocol/server-github`
- **用途**：直接操作 GitHub — Issues、PRs、Releases、仓库搜索、文件读取、Actions 状态
- **配置**：
  ```json
  "github": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
    }
  }
  ```
- **Token 获取**：[github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) → 勾选 `repo`、`read:org`、`workflow`
- **Token 有效期**：classic token 需设置 expiration
- **核心能力**：
  - 搜索公开/私有仓库
  - 创建和管理 Issues
  - 创建和审查 PR（读 diff、写 review comment）
  - 查看 Actions workflow 状态
  - 直接读取任意仓库文件内容

## 三、Memory MCP

- **包名**：`@modelcontextprotocol/server-memory@2026.7.4`
- **安装**：`npm install -g @modelcontextprotocol/server-memory`
- **用途**：本地知识图谱数据库，跨会话持久化记忆
- **配置**：
  ```json
  "memory": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "env": {
      "MEMORY_FILE_PATH": "~/.claude/mcp-memory.json"
    }
  }
  ```
- **数据模型**：实体（Entity）→ 关系（Relation）→ 观测（Observation）三元组
  - **实体**：要记住的"事物"，如 `hooks-dependencies`、`luohe-preferences`
  - **观测**：实体的属性/事实，如 `tkinter is required for notify.py`
  - **关系**：实体之间的连线，如 `luohe-preferences → depends_on → tkinter`
- **API Key**：不需要
- **存储位置**：`~/.claude/mcp-memory.json`（本地文件）
- **与 auto-memory 对比**：
  - auto-memory：扁平 markdown 文件，全文匹配，手动 `[[link]]`
  - Memory MCP：知识图谱，结构化查询，关系自动遍历

## 四、Context7 MCP

- **包名**：`@upstash/context7-mcp@3.2.5`
- **安装**：`npm install -g @upstash/context7-mcp`
- **用途**：按需注入最新第三方库文档到上下文，减少不必要的文档加载
- **配置**：
  ```json
  "context7": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"],
    "env": {
      "CONTEXT7_API_KEY": "YOUR_API_KEY_HERE"
    }
  }
  ```
- **API Key**：可选，[context7.com/dashboard](https://context7.com/dashboard) 免费申请后可提升频限
- **工作原理**：写代码时遇到生疏库，自动拉取对应版本的文档片段注入上下文，精准短小
- **支持**：npm/Python 主流库的 README 和 API 文档

---

## 全局配置位置

所有 MCP Server 配置在 `~/.claude/.mcp.json`（用户级），对全部项目生效：

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY_HERE"
      }
    },
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "~/.claude/mcp-memory.json"
      }
    }
  }
}
```

> Headroom 为内置工具，无需在 `.mcp.json` 中声明，自动可用。

---

## 汇总

| MCP | 安装 | 核心价值 | API Key | Token 优化 |
|---|---|---|---|---|
| Headroom | 内置 | 上下文压缩 | ❌ 不要 | ✅ 直接省 token |
| GitHub | npm 全局 | GitHub 操作直达 | ✅ 必填 | — |
| Memory | npm 全局 | 跨会话知识图谱 | ❌ 不要 | — |
| Context7 | npm 全局 | 按需文档注入 | 🟡 可选 | ✅ 避免冗余文档 |

## 相关笔记

- [[Claude Code 配置指南]]
- [[ai-vibe-coding-config 项目结构]]
- [[MCP 协议入门]]
