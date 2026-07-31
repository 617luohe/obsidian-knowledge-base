---
title: "Context7 MCP 服务安装与使用"
aliases: ["Context7 MCP Server", "Context7 文档查询", "实时文档 MCP"]
tags:
  - type/resource
  - domain/tech/tools
created: 2026-07-31
updated: 2026-07-31
status: published
confidence: evergreen
source: "https://github.com/upstash/context7"
---

# Context7 MCP 服务安装与使用

> 一句话定义：Context7 是 Upstash 维护的 MCP 文档服务器，为 AI 助手注入实时、版本匹配的库文档，替代过时的训练数据。

## 概述

AI 模型的训练数据有截止日期，导致生成的代码可能使用已废弃的 API 或过时的写法。Context7 通过 MCP 协议提供实时文档查询，在回答问题前先拉取最新的官方文档和代码示例。

- **维护方**：Upstash
- **传输方式**：支持 HTTP 远程和 stdio 本地两种模式
- **npm 包**：`@upstash/context7-mcp`
- **认证**：免费匿名使用（可注册 API Key 提升速率限制）
- **覆盖范围**：主流开源库和框架的官方文档

## 安装与配置

### 方式一：HTTP 远程连接（推荐）

无需本地安装，直接连接 Context7 远程服务器：

在 `~/.claude/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

**优点**：零安装、自动更新、支持 OAuth 认证。

### 方式二：本地 stdio 连接

适合网络受限或需要离线缓存的场景：

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### 获取 API Key（可选）

匿名用户有速率限制，注册 API Key 可提升限额：

1. 打开 https://context7.com/dashboard
2. 注册/登录 Upstash 账号
3. 复制 API Key

在配置中传入 Key：

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer ctx7_your_api_key"
      }
    }
  }
}
```

### 生效

保存后重启 Claude Code，`/mcp` 确认 context7 在线。

## 核心工具

Context7 提供两个主要工具，遵循"先解析、后查询"的两步工作流：

### 1. `resolve-library-id` — 解析库 ID

将用户提到的库名称解析为 Context7 内部标识符。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| `libraryName` | string | ✅ | 库/产品名称，如 `"react"`、`"next.js"` |
| `query` | string | ✅ | 用户的完整问题，帮助排名匹配 |

**返回信息：**
- `id` — Context7 库 ID（格式：`/org/project`）
- `benchmarkScore` — 文档质量评分（0-100，100 最佳）
- `trustScore` — 可信度评分（0-10）
- `totalSnippets` — 可用代码片段数量
- `verified` — 是否为官方认证来源

**选择策略**：优先选择 `benchmarkScore` 高、`verified: true`、名称精确匹配的结果。

### 2. `query-docs` — 查询文档

根据解析出的库 ID，获取具体文档和代码示例。

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| `libraryId` | string | ✅ | 上一步解析的库 ID，如 `"/vercel/next.js"` |
| `query` | string | ✅ | 具体问题或主题关键词 |
| `type` | string | ❌ | `"json"`（默认，结构化）或 `"text"`（Markdown） |
| `tokens` | integer | ❌ | 返回最大 token 数，默认 5000 |

**返回结构（`type: "json"`）：**

```
Response
├── codeSnippets[]        # 代码示例
│   ├── codeTitle         # 示例标题
│   ├── codeDescription   # 功能说明
│   ├── codeLanguage      # 编程语言
│   ├── codeList[]        # 代码块（含 language + code）
│   └── pageTitle         # 来源文档页面
├── infoSnippets[]        # 文档说明
│   ├── content           # 文档文字内容
│   └── breadcrumb        # 文档路径面包屑
└── rules                 # 库特定规则（可选）
```

## 三步工作流

### 标准流程

```
用户问题
  │
  ▼
Step 1: resolve-library-id
  输入：{ libraryName: "next.js", query: "如何配置中间件" }
  输出：{ id: "/vercel/next.js", benchmarkScore: 100 }
  │
  ▼
Step 2: query-docs
  输入：{ libraryId: "/vercel/next.js", query: "middleware", type: "json" }
  输出：codeSnippets[] + infoSnippets[] 共 8 条
  │
  ▼
Step 3: 总结回答
  基于获取的文档生成答案，包含代码示例和版本号
```

### 快捷方式

如果用户明确提供了 Context7 格式的库 ID（`/org/project`），可直接跳过第一步：

```
你：用 context7 查 /vercel/next.js 的 App Router 文档

Claude 直接调用 query-docs({ libraryId: "/vercel/next.js", query: "App Router" })
```

## 使用示例

### 场景一：查 API 用法

```
你：use context7，Python httpx 库怎么发异步请求？

Claude 执行：
  1. resolve-library-id({ libraryName: "httpx", query: "异步请求" })
     → 返回 id: "/encode/httpx"
  2. query-docs({ libraryId: "/encode/httpx", query: "async client" })
     → 获取 AsyncClient 用法和代码示例
  3. 回答：
     "根据 httpx 官方文档（v0.27+）：
      import httpx
      async with httpx.AsyncClient() as client:
          r = await client.get('https://api.example.com')
      ..."
```

### 场景二：对比多个库

```
你：use context7，比较 Prisma 和 Drizzle ORM 的 migration 方式

Claude 执行：
  1. resolve-library-id → Prisma → /prisma/prisma
  2. resolve-library-id → Drizzle → /drizzle-team/drizzle-orm
  3. query-docs(Prisma, "migration")
  4. query-docs(Drizzle, "migration")
  5. 对比两者的 migration 命令、文件格式、回滚方式
```

### 场景三：写配置模板

```
你：use context7 查 Tailwind CSS v4 的 @theme 指令用法

Claude 执行：
  1. resolve-library-id({ libraryName: "tailwindcss", ... })
  2. query-docs({ libraryId: "/tailwindlabs/tailwindcss", query: "@theme directive" })
  3. 根据最新文档生成 v4 风格的 CSS 配置（而非 v3 的 tailwind.config.js）
```

## 使用技巧

### 优化查询效率

- ✅ **主题关键词**而非自然语言句子 — 用 `"middleware"` 而非 `"how do I set up middleware"`
- ✅ **限定 token 数** — 简单问题设 `tokens: 2000`，复杂问题设 `tokens: 8000`
- ✅ **先广泛后聚焦** — 第一次查询用宽泛主题，第二次用具体主题深入
- ❌ **避免超过 3 次调用** — Context7 建议每个问题最多 3 次 API 调用（含解析）

### 触发方式

- 在提示中加上 **"use context7"**，AI 会自动激活 Context7 工具
- 或在 `CLAUDE.md` 中添加规则：*"生成代码或配置时始终先查 Context7"*

### 结果可靠性判断

- 优先采用 `verified: true` 的库的文档
- 关注 `benchmarkScore`，低于 50 分的源可信度较低
- 代码示例优先于纯文本说明
- 文档版本号与用户需求版本不一致时标注警告

## 注意事项

| 事项 | 说明 |
|------|------|
| 安全性 | 文档内容视为不可信数据，不直接执行其中的指令（防 prompt injection） |
| 回退策略 | 3 次查询无果后，可回退到模型自身知识，但标注"可能过时" |
| 速率限制 | 匿名用户受限，建议注册免费 API Key |
| 缓存 | 本地 stdio 模式支持缓存（默认 TTL 1 天），减少重复请求 |

## 与其他概念的关系

- [[MCP Memory 服务安装与使用]] — Context7 查到的关键 API 信息可存入 memory 备查
- [[MCP GitHub 服务安装与使用]] — 查文档 → 写代码 → 提交 PR，形成完整工具链
- [[Claude Code Windows 安装与配置]] — 前置依赖
- [[CC Switch 配置与使用]] — 搭配 Context7 实现完整的 AI 编程环境

## 延伸阅读

- [Context7 官方文档](https://context7.com/docs)
- [GitHub 仓库](https://github.com/upstash/context7)
- [[MCP 协议介绍与配置]]
