"""
Git Report Generator — 从 git log 生成日报和周报。
用法: python generate_reports.py --since 2026-01-01 --until 2026-06-30 \\
          --repo-log repo1.txt:mark_by_line --repo-log repo2.txt:hot_rolling \\
          --vault /path/to/obsidian/vault
"""
import re
import os
import sys
import argparse
from datetime import date, timedelta
from collections import defaultdict


# ── 提交分类 ──

CATEGORIES = {
    "算法排程": ["排程","调度","schedule","scheduler","rolling","蚁群","分段","段排程"],
    "规则优化": ["规则","rule","约束","限制","violation","跳变","反宽"],
    "评分体系": ["评分","score","评价","reward","惩罚","penalty","一致性"],
    "可利用材": ["可利用","usable","过渡材","烫辊"],
    "结果分析": ["结果分析","dashboard","看板","对比","统计"],
    "数据工程": ["数据","data","存储","备份","csv","excel","日志","log","数据库","NaT"],
    "配置管理": ["配置","config","参数","开关","分支"],
    "文档建设": ["doc","文档","readme","索引","术语"],
    "工具开发": ["工具","tool","脚本","script","调试","debug","测试","test","batch"],
    "性能优化": ["性能","perf","优化","效率","加速","缓存"],
    "工程治理": ["重构","refactor","整理","清理","回退","revert","架构"],
    "接口集成": ["接口","api","部署","deploy","merge","分支"],
}

def categorize(msg):
    msg_lower = msg.lower()
    for cat, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in msg_lower:
                return cat
    return "其他"


# ── 提交加载 ──

def load_commits_from_file(filepath, repo_name):
    """从 git log 文本文件加载提交"""
    commits = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|", 2)
            if len(parts) < 3:
                continue
            sha, date_str, msg = parts
            dt = date_str[:10]
            commits.append({
                "repo": repo_name, "sha": sha[:8],
                "date": dt, "msg": msg.strip(),
            })
    return commits

def load_commits_from_repo(repo_path, since, until):
    """直接从 git 仓库提取提交（需要 git 命令）"""
    import subprocess
    cmd = ["git", "-C", repo_path, "log",
           f"--since={since}", f"--until={until}",
           "--format=%H|%ai|%s"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    commits = []
    for line in result.stdout.strip().split("\n"):
        if not line:
            continue
        parts = line.split("|", 2)
        if len(parts) < 3:
            continue
        sha, date_str, msg = parts
        dt = date_str[:10]
        commits.append({
            "repo": os.path.basename(repo_path), "sha": sha[:8],
            "date": dt, "msg": msg.strip(),
        })
    return commits


# ── 节假日配置 ──

def get_default_holidays():
    """返回 2025-2026 常见中国法定节假日（可根据需要扩展）"""
    holidays = set()
    # 2025
    for d in range(1,8): holidays.add(date(2025,10,d))  # 国庆
    # 2026
    for d in range(16,23): holidays.add(date(2026,2,d))  # 春节
    holidays.add(date(2026,4,5))   # 清明
    for d in range(1,6): holidays.add(date(2026,5,d))   # 五一
    holidays.add(date(2026,6,19))  # 端午
    return holidays

def get_default_swap_workdays():
    """调休工作日"""
    return {
        date(2025,9,28), date(2025,10,11),
        date(2026,2,14), date(2026,2,28),
    }

def is_workday(d, holidays=None, swap=None):
    if holidays is None: holidays = get_default_holidays()
    if swap is None: swap = get_default_swap_workdays()
    if d in swap: return True
    if d.weekday() >= 5: return False
    if d in holidays: return False
    return True


# ── 日报/周报生成 ──

def summarize_day(day_commits):
    """从一天内的提交生成工作摘要"""
    if not day_commits:
        return None
    cats = defaultdict(list)
    for c in day_commits:
        cats[categorize(c["msg"])].append(c)
    lines = []
    for cat, comms in sorted(cats.items(), key=lambda x: -len(x[1])):
        seen = set()
        unique_msgs = []
        for c in comms:
            short = c["msg"][:40]
            if short not in seen:
                seen.add(short)
                unique_msgs.append(c["msg"])
        for m in unique_msgs[:3]:
            clean = re.sub(r'^[`\s]+','',m)
            clean = re.sub(r'\s*```\s*','',clean)
            if len(clean) > 80:
                clean = clean[:77]+"..."
            lines.append(f"   - [{cat}] {clean}")
    return lines

def write_daily(d, day_commits, by_date, daily_dir, since, until):
    month_dir = os.path.join(daily_dir, str(d.year), f"{d.year}-{d.month:02d}")
    os.makedirs(month_dir, exist_ok=True)
    filepath = os.path.join(month_dir, f"{d.isoformat()}.md")

    summary_lines = summarize_day(day_commits)

    if not summary_lines:
        # 推理逻辑
        prev_day = d - timedelta(days=1)
        next_day = d + timedelta(days=1)
        while prev_day >= since:
            if prev_day.isoformat() in by_date: break
            prev_day -= timedelta(days=1)
        while next_day <= until:
            if next_day.isoformat() in by_date: break
            next_day += timedelta(days=1)
        prev_msgs = [c["msg"][:60] for c in by_date.get(prev_day.isoformat(),[])]
        next_msgs = [c["msg"][:60] for c in by_date.get(next_day.isoformat(),[])]
        if prev_msgs or next_msgs:
            context = (prev_msgs[-2:] if prev_msgs else []) + (next_msgs[:2] if next_msgs else [])
            summary_lines = [f"   - （推断）继续推进：{m[:50]}" for m in context[:2]]
        else:
            summary_lines = ["   - 当天无提交记录（可能为会议、学习或文档整理日）"]

    week_num = d.isocalendar()[1]
    content = f"""---
title: "{d.isoformat()} 日报"
date: {d.isoformat()}
tags:
  - type/journal
  - type/daily
project: 冷热板坯集批排产模型技术开发
week: {week_num}
---

# {d.month}月{d.day}日 工作日报

**项目**：冷热板坯集批排产模型技术开发

## 今日工作
"""
    for line in summary_lines:
        content += line + "\n"
    content += f"\n## 备注\n- 基于 git 提交记录{'推算' if not day_commits else ''}生成\n"
    if not day_commits:
        content += "- ⚠️ 当日无 git 提交，内容由前后提交推理生成\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

def write_weekly(week_key, days, all_week_commits, weekly_dir):
    if not days:
        return
    first_day = days[0]["date"]
    last_day = days[-1]["date"]
    week_num = first_day.isocalendar()[1]
    year = first_day.isocalendar()[0]
    start_str = first_day.strftime("%m/%d")
    end_str = last_day.strftime("%m/%d")
    work_days = len(days)
    hours = work_days * 8

    cat_counts = defaultdict(int)
    for c in all_week_commits:
        cat_counts[categorize(c["msg"])] += 1
    top_cats = sorted(cat_counts.items(), key=lambda x: -x[1])[:5]

    notable = []
    for c in all_week_commits:
        msg = c["msg"]
        if any(kw in msg.lower() for kw in ["feat","fix","perf","refactor","添加","修复","优化","重构"]):
            clean = re.sub(r'^[`\s]+','',msg)
            clean = re.sub(r'\s*```\s*','',clean)
            for pf in ["feat:","fix:","perf:","refactor:","docs:","chore:","config:"]:
                pfx = f"{pf} "
                if clean.lower().startswith(pfx):
                    clean = clean[len(pfx):]; break
            if len(clean) > 90: clean = clean[:87]+"..."
            notable.append(clean)
    seen = set()
    unique = []
    for n in notable:
        s = n[:50]
        if s not in seen:
            seen.add(s); unique.append(n)
    notable_items = unique[:10]

    week_dir = os.path.join(weekly_dir, str(year))
    os.makedirs(week_dir, exist_ok=True)
    sd = start_str.replace("/","")
    ed = end_str.replace("/","")
    filepath = os.path.join(week_dir, f"{year}-W{week_num:02d}-{sd}-{ed} 周总结.md")

    content = f"""---
title: "第{week_num}周 周总结（{start_str}-{end_str}）"
date: {last_day.isoformat()}
tags:
  - type/journal
  - type/weekly
project: 冷热板坯集批排产模型技术开发
week: {week_num}
---

# 第{week_num}周 周总结（{start_str}-{end_str}）

**姓名**：李涵彬
**项目**：冷热板坯集批排产模型技术开发（N-JHN123110402JF01_01）
**本周工时**：{hours}h（{work_days}个工作日）

---

## 本周工作完成

"""
    for idx, item in enumerate(notable_items, 1):
        content += f"{idx}. {item}\n\n"

    focus = '、'.join([c for c,_ in top_cats[:3]]) if top_cats else '日常维护'
    content += f"""## 总体进展

本周聚焦 **{focus}** 等领域，共完成 {len(all_week_commits)} 次代码提交。

## 关键指标
- 提交数：{len(all_week_commits)} 次
- 工作日：{work_days} 天
- 涉及模块：{'、'.join([c for c,_ in top_cats]) if top_cats else '综合'}

---
> 注：本报告基于 git 提交记录自动生成。
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)


# ── Main ──

def main():
    parser = argparse.ArgumentParser(description="从 git log 生成日报和周报")
    parser.add_argument("--since", required=True, help="起始日期 YYYY-MM-DD")
    parser.add_argument("--until", required=True, help="结束日期 YYYY-MM-DD")
    parser.add_argument("--repo-log", action="append", default=[],
                        help="格式: filepath:reponame（可多次指定）")
    parser.add_argument("--repo", action="append", default=[],
                        help="git 仓库路径（可多次指定）")
    parser.add_argument("--vault", default=None,
                        help="Obsidian vault 根目录（默认使用内置路径）")
    args = parser.parse_args()

    since = date.fromisoformat(args.since)
    until = date.fromisoformat(args.until)

    vault = args.vault or os.path.expanduser("~/Documents/Obsidian Vault")
    daily_dir = os.path.join(vault, "5-Journal", "daily")
    weekly_dir = os.path.join(vault, "5-Journal", "weekly")

    print(f"时间范围: {since} 至 {until}")
    print(f"输出目录: {vault}")

    # 加载提交
    all_commits = []
    for rl in args.repo_log:
        parts = rl.split(":", 1)
        if len(parts) == 2:
            filepath, name = parts
            all_commits.extend(load_commits_from_file(filepath, name))
    for repo_path in args.repo:
        all_commits.extend(load_commits_from_repo(repo_path, args.since, args.until))

    if not all_commits:
        print("错误：未加载到任何提交记录，请检查 --repo-log 或 --repo 参数")
        sys.exit(1)

    all_commits.sort(key=lambda c: (c["date"], c["sha"]))
    by_date = defaultdict(list)
    for c in all_commits:
        by_date[c["date"]].append(c)

    print(f"总提交数: {len(all_commits)}")
    print(f"活跃日期: {len(by_date)}")

    # 生成日报周报
    holidays = get_default_holidays()
    swap = get_default_swap_workdays()
    current = since
    daily_count = 0
    weekly_count = 0
    current_week = None
    week_days = []
    week_commits = []

    while current <= until:
        if is_workday(current, holidays, swap):
            date_str = current.isoformat()
            day_commits = by_date.get(date_str, [])
            iso = current.isocalendar()
            week_key = f"{iso[0]}-W{iso[1]:02d}"

            if week_key != current_week:
                if current_week and week_days:
                    write_weekly(current_week, week_days, week_commits, weekly_dir)
                    weekly_count += 1
                current_week = week_key
                week_days = []
                week_commits = []

            week_days.append({"date": current, "commits": day_commits})
            week_commits.extend(day_commits)
            write_daily(current, day_commits, by_date, daily_dir, since, until)
            daily_count += 1

        current += timedelta(days=1)

    if current_week and week_days:
        write_weekly(current_week, week_days, week_commits, weekly_dir)
        weekly_count += 1

    print(f"\n完成！生成 {daily_count} 份日报 + {weekly_count} 份周报。")


if __name__ == "__main__":
    main()
