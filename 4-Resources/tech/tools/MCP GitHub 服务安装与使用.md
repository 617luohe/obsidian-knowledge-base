---
title: "MCP GitHub 服务安装与使用"
aliases: ["GitHub MCP Server", "MCP GitHub 集成", "GitHub API MCP"]
tags:
  - type/resource
  - domain/tech/tools
created: 2026-07-31
updated: 2026-07-31
status: published
confidence: evergreen
source: "https://github.com/github/github-mcp-server"
---

# MCP GitHub 服务安装与使用

> 一句话定义：GitHub 官方 MCP 服务器，让 AI 助手通过自然语言直接管理仓库、Issue、PR、Actions 等 GitHub 平台资源。

## 概述

GitHub MCP Server（`@modelcontextprotocol/server-github`）是 GitHub 官方构建的 MCP 服务器，连接 AI 助手与 GitHub 平台。通过它，Claude Code 可以直接创建 Issue、审查 PR、搜索代码、管理文件，无需手动操作 GitHub 网页界面。

- **技术栈**：Go 1.24+，使用 `modelcontextprotocol/go-sdk`
- **认证方式**：Personal Access Token（本地）或 OAuth（远程）
- **工具组织**：按功能分为多个 toolsets，可按需启用
- **许可协议**：MIT

## 安装与配置

### 前提条件

- Node.js ≥ 18（通过 npx 运行时）
- GitHub Personal Access Token（Fine-grained token）

### 获取 GitHub Token

1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Fine-grained token**
3. 设置过期时间，选择需要访问的仓库
4. **Repository permissions** 按需勾选：
   - `Contents`: Read and write（读写文件）
   - `Issues`: Read and write（管理 Issue）
   - `Pull requests`: Read and write（管理 PR）
   - `Metadata`: Read-only（默认必选）
5. 生成后复制 token（格式：`github_pat_xxx`）

### 配置方式

在 `~/.claude/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_your_token_here"
      }
    }
  }
}
```

### 可选配置项

| 环境变量 | 用途 | 示例 |
|----------|------|------|
| `GITHUB_HOST` | GitHub Enterprise 地址 | `https://github.mycompany.com` |
| `GITHUB_TOOLSETS` | 启用的工具集 | `default,code_security` |
| `GITHUB_READ_ONLY` | 只读模式（设为 `"1"`） | `"1"` |

#### 只读安全模式

如果不希望 AI 执行写操作，启用只读模式：

```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_xxx",
  "GITHUB_READ_ONLY": "1"
}
```

#### 启用代码安全工具集

```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_xxx",
  "GITHUB_TOOLSETS": "default,code_security"
}
```

### 生效

保存后重启 Claude Code，`/mcp` 确认 github 在线。

## 工具集（Toolsets）

GitHub MCP 按功能将工具组织为多个工具集：

| 工具集 | 功能 | 默认启用 |
|--------|------|:---:|
| **context** | 当前用户身份和 GitHub 上下文 | ✅ |
| **repos** | 仓库浏览、文件读写、搜索 | ✅ |
| **issues** | Issue 创建、读取、更新、评论 | ✅ |
| **pull_requests** | PR 创建、审查、合并、评论 | ✅ |
| **users** | 用户信息查询 | ✅ |
| **code_security** | 代码安全扫描、Dependabot | ❌ 需手动启用 |

## 核心工具说明

### 仓库操作

| 工具 | 用途 |
|------|------|
| `repo_read` | 浏览仓库结构、读取文件内容 |
| `repo_write` | 创建/更新/删除文件 |
| `repo_search` | 跨仓库搜索代码 |

### Issue 管理

| 工具 | 用途 |
|------|------|
| `issue_read` | 读取 Issue 详情、评论、标签、子 Issue |
| `issue_write` | 创建/更新 Issue（通过 `method` 参数切换） |
| `sub_issue_write` | 添加/排序/移除子 Issue |

### PR 管理

| 工具 | 用途 |
|------|------|
| `pull_request_read` | 读取 PR 详情、差异、评论、审查状态 |
| `pull_request_write` | 创建/更新/合并 PR |
| `pull_request_review_write` | 创建/提交/删除 PR 审查（通过 `method` 参数切换） |

> **注意**：2025 年底 GitHub 对工具进行了大幅整合，多个独立工具合并为带 `method` 参数的复合工具。如果找不到某个工具，检查相关复合工具的 method 参数。

### Server Instructions

GitHub MCP 内置了 Server Instructions（类似系统提示词），指导 AI 正确使用工具链。例如它会告诉模型"先读 PR 再审查"、"始终使用分页"等最佳实践。

## 使用示例

### 场景一：创建 Issue

```
你：帮我在 Obsidian Vault 仓库创建 Issue，标题"补全 MCP 协议介绍笔记"，标签 documentation

Claude 调用 issue_write(method="create")：
  → 仓库：617luohe/Obsidian-Vault
  → Issue #42 已创建
  → 返回链接：https://github.com/617luohe/Obsidian-Vault/issues/42
```

### 场景二：审查 PR

```
你：审查 PR #23，重点关注安全问题和代码风格

Claude 调用链：
  1. pull_request_read → 获取 PR diff
  2. 人工审查代码变更
  3. pull_request_review_write(method="create") → 提交审查意见
     - 安全：无问题
     - 风格：建议拆分过长函数
```

### 场景三：跨仓库搜索

```
你：搜索我所有仓库中使用 "ANTHROPIC_BASE_URL" 的地方

Claude 调用 repo_search：
  → 在 Obsidian Vault、my-skills 等仓库中找到多出引用
  → 列出文件路径和行号
```

## 安全最佳实践

### Token 权限最小化

- ✅ 使用 **Fine-grained token** 而非 Classic token
- ✅ 只授权必要的仓库，不要选择 "All repositories"
- ✅ 过期时间设为 7-90 天，定期轮换
- ✅ 按需勾选权限，不需要写操作就别开 write
- ❌ 不要在笔记或公开文件中暴露 token
- ❌ 不要在配置文件中直接写 token（可用环境变量引用）

### 只读模式

开发环境或不确定时，启用 `GITHUB_READ_ONLY=1`，AI 只能查看不能修改。

### 审查 AI 操作

- 重要仓库建议先让 AI 在 fork 仓库上操作
- 合并 PR 前人工确认 diff
- 定期检查 AI 创建的 Issue/PR 列表

## 与其他概念的关系

- [[MCP Memory 服务安装与使用]] — 搭配 memory 记忆项目结构和常用仓库路径
- [[Context7 MCP 服务安装与使用]] — 搭配 Context7 获取开发文档
- [[Claude Code Windows 安装与配置]] — 前置依赖
- [[Skills Manager 技能管理]] — GitHub 操作可模板化为 skill

## 延伸阅读

- [GitHub MCP Server 仓库](https://github.com/github/github-mcp-server)
- [GitHub Changelog: MCP Server Updates](https://github.blog/changelog/2025-10-29-github-mcp-server-now-comes-with-server-instructions-better-tools-and-more/)
- [[MCP 协议介绍与配置]]
