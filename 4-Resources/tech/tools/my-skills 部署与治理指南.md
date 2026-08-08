---
title: "my-skills 部署与治理指南"
aliases: ["my-skills 部署", "sync-skills", "skills-manifest", "技能治理"]
tags:
  - type/resource
  - domain/tech/tools
  - topic/skills-deployment
created: 2026-07-27
status: published
confidence: budding
source: "https://github.com/617luohe/my-skills"
related: "[[my-skills 开发工作流技能体系]]"
---

# my-skills 部署与治理指南

> v2 最大的工程化改进：从手动 `cp -r` 升级为 manifest 驱动的自动化同步 + 治理验证体系。

## 一、部署架构

```
my-skills/                        ← 源码仓库（技能唯一事实来源）
├── skills-manifest.yaml          ← 发布清单（版本号的唯一来源）
├── scripts/
│   ├── sync-skills.ps1           ← 同步脚本（Windows PowerShell）
│   ├── skill_manifest.py         ← manifest 解析器（标准库，无 PyYAML 依赖）
│   └── validate_skills.py        ← 治理验证脚本
├── 0-询问luohe/                  ← 各技能目录（19 个同步 + 5 个 vocabulary）
├── 0-启动/
├── 1-规划/
├── ...
└── vocabulary/

        │  sync-skills.ps1
        │  (读取 manifest → 复制到目标)
        ▼

宿主项目/
├── .claude/skills/               ← Claude Code 部署目标
│   ├── .my-skills-managed.json   ← 受管清单（记录上次同步状态）
│   ├── 0-询问luohe/
│   ├── 0-启动/
│   └── ...
├── .cursor/skills/               ← Cursor 部署目标
│   └── .my-skills-managed.json
└── .codex/skills/                ← Codex 部署目标
    └── .my-skills-managed.json
```

## 二、skills-manifest.yaml

**位置**：仓库根 `my-skills/skills-manifest.yaml`

**结构**：

```yaml
schema_version: 1
repository_version: 1.0.0
skills:
  - name: 0-询问luohe
    path: 0-询问luohe
    version: 1.0.0
    status: stable
    invocation: user              # user | model
    hosts: [claude, cursor, codex]
    distribution: synchronized    # synchronized = 正式发布集
    sync: true
    dependencies: []
  - name: vocabulary/grilling
    path: vocabulary/grilling
    version: 1.0.0
    status: stable
    invocation: model
    layer: vocabulary             # ← vocabulary 层标识
    hosts: [claude, cursor, codex]
    distribution: synchronized
    sync: true
    dependencies: []
```

**字段说明**：

| 字段 | 说明 |
|------|------|
| `name` | 技能唯一标识（vocabulary 层用 `vocabulary/` 前缀） |
| `path` | 源码目录相对路径 |
| `version` | 语义化版本 |
| `status` | `stable` / `beta` / `deprecated` |
| `invocation` | `user`（仅用户调用）/ `model`（允许模型自动调用） |
| `hosts` | 部署目标平台列表 |
| `distribution` | `synchronized` = 纳入同步发布集 |
| `layer` | `vocabulary` = 可复用核心层（可选） |
| `dependencies` | 依赖的其他技能名称列表 |

**统计**（v2, 2026-07）：
- `distribution: synchronized`：19 个（正式发布集）
- `layer: vocabulary`：5 个（可复用核心）
- `invocation: user`：10 个（仅用户调用）
- `invocation: model`：14 个（允许模型调用）

## 三、同步脚本

### sync-skills.ps1

**位置**：`my-skills/scripts/sync-skills.ps1`

**用法**：
```powershell
# 预览（不写盘）
.\my-skills\scripts\sync-skills.ps1 -DryRun

# 正式同步
.\my-skills\scripts\sync-skills.ps1

# 接管同名目录冲突
.\my-skills\scripts\sync-skills.ps1 -TakeOwnership
```

**同步逻辑**：

| 状态 | 含义 | 操作 |
|------|------|------|
| `ADD` | manifest 中有，目标中没有 | 复制新技能目录 |
| `UPDATE` | manifest 中有，目标中也受管（版本不同） | 覆盖更新 |
| `REMOVE MANAGED` | 上次受管，本次 manifest 中已移除 | 删除目标中的该目录 |
| `CONFLICT` | manifest 中的名称与目标中非受管目录同名 | **停止**，不写入任何目标 |
| （无标记） | 目标中非受管的目录 | **不删除、不覆盖** |

**安全机制**：
- 每个目标根维护 `.my-skills-managed.json`，只管理自己部署过的技能
- 非受管目录永远不会被删除或覆盖
- `CONFLICT` 时停止所有目标写入，需 `-TakeOwnership` 显式授权
- 同步先暂存 → 备份旧状态 → 移入新内容 → 发布新状态
- 任一步失败则恢复该目标及已提交目标的旧状态

### skill_manifest.py

**位置**：`my-skills/scripts/skill_manifest.py`

**职责**：读取 `skills-manifest.yaml`，提供结构化数据给同步脚本。

**特点**：使用 Python 标准库 + 受限 YAML 解析器，无 PyYAML 依赖。

## 四、治理验证

### validate_skills.py

**位置**：`my-skills/scripts/validate_skills.py`

**用法**：
```bash
# 验证源码治理规则（默认不检查部署目录）
python scripts/validate_skills.py
python scripts/validate_skills.py --json

# 验证部署目录与源码一致性
python scripts/validate_skills.py --check-deployments
```

**验证规则**：

| 类别 | 检查项 |
|------|--------|
| **命名规范** | 阶段技能以 `N-` 开头（N=0-6）+ 中文名称 |
| | 扩展能力以 `0--` 开头 + 英文名称 |
| | vocabulary 层位于 `vocabulary/` 子目录 |
| | 禁止非阶段技能使用 `N-` 格式 |
| **目录结构** | 每个技能必须有 `SKILL.md` |
| | vocabulary 技能路径与 manifest 一致 |
| **manifest 一致性** | manifest 中的技能与实际目录一致 |
| | 版本号格式正确 |
| | 依赖关系有效（引用的技能存在） |
| **部署一致性** | 受管清单与源码一致 |
| | 受管内容与源码一致 |

**退出码**：
- 0：通过
- 非 0：治理错误（警告不影响退出码）

> CI 只运行 `python scripts/validate_skills.py` 静态治理验证，不依赖宿主部署目录。

## 五、跨平台部署

my-skills v2 支持三个 AI 编程助手的 skill 目录：

| 平台 | 目标路径 | 兼容性 |
|------|---------|--------|
| **Claude Code** | `.claude/skills/` | ✅ 完全支持 |
| **Cursor** | `.cursor/skills/` | ✅ 完全支持 |
| **OpenCode** | `.codex/skills/` | ✅ 完全支持 |

`hosts` 字段控制每个技能部署到哪些平台。所有 19 个同步技能均配置为 `[claude, cursor, codex]`。

## 六、手动部署（备选）

如果不使用同步脚本，也可以手动复制：

```bash
# 单个技能
cp -r my-skills/0-询问luohe .claude/skills/

# 全部技能（不推荐，建议用同步脚本）
for skill in my-skills/*/; do
  cp -r "$skill" .claude/skills/$(basename "$skill")
done
```

但手动部署无法享受版本追踪、冲突检测、受管清单等治理能力。

## 七、相关笔记

- [[my-skills 开发工作流技能体系]] — 全体系概览
- [[my-skills vocabulary 核心层详解]] — 5 个 vocabulary 核心
- [[my-skills 深度分析报告]] — 架构分析
- [[MOC-my-skills v2]] — v2 技能体系总索引
