const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const {
  FaIndustry, FaChartLine, FaCogs, FaExchangeAlt, FaStar, FaRocket,
  FaBrain, FaBullseye, FaCheckCircle, FaShieldAlt, FaUsers,
  FaTools, FaDatabase, FaArrowRight, FaLayerGroup, FaCalendarAlt
} = require("react-icons/fa");

// ─── Color Palette ───
const C = {
  navy:      "1E3A5F",
  navyDark:  "132438",
  orange:    "E8731A",
  orangeLight:"FDE8D0",
  teal:      "0D9488",
  tealLight: "CCFBF1",
  lightBg:   "F8F7F4",
  white:     "FFFFFF",
  textDark:  "1E293B",
  textMid:   "475569",
  textLight: "94A3B8",
  border:    "E2E8F0",
  phase1:    "2563EB",  // blue for April
  phase2:    "7C3AED",  // purple for May
  phase3:    "0D9488",  // teal for June
};

const FONT_H = "Arial Black";
const FONT_B = "Calibri";

// ─── Icon Helper ───
function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ─── Factory functions for reused option objects (avoid mutation bugs) ───
const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.10 });
const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });

// ─── Main ───
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "李涵彬";
  pres.title = "2026年第二季度工作汇报";

  // Pre-render all icons
  const icons = {
    industry: await iconToBase64Png(FaIndustry, "#" + C.white, 256),
    chartLine: await iconToBase64Png(FaChartLine, "#" + C.orange, 256),
    cogs: await iconToBase64Png(FaCogs, "#" + C.phase1, 256),
    exchange: await iconToBase64Png(FaExchangeAlt, "#" + C.phase2, 256),
    star: await iconToBase64Png(FaStar, "#" + C.phase3, 256),
    brain: await iconToBase64Png(FaBrain, "#" + C.teal, 256),
    bullseye: await iconToBase64Png(FaBullseye, "#" + C.orange, 256),
    checkCircle: await iconToBase64Png(FaCheckCircle, "#" + C.teal, 256),
    shield: await iconToBase64Png(FaShieldAlt, "#" + C.phase1, 256),
    users: await iconToBase64Png(FaUsers, "#" + C.phase3, 256),
    tools: await iconToBase64Png(FaTools, "#" + C.phase2, 256),
    database: await iconToBase64Png(FaDatabase, "#" + C.navy, 256),
    arrowRight: await iconToBase64Png(FaArrowRight, "#" + C.white, 256),
    layers: await iconToBase64Png(FaLayerGroup, "#" + C.orange, 256),
    calendar: await iconToBase64Png(FaCalendarAlt, "#" + C.textMid, 256),
    // White icons for dark slides
    industryW: await iconToBase64Png(FaIndustry, "#FFFFFF", 256),
    checkW: await iconToBase64Png(FaCheckCircle, "#FFFFFF", 256),
  };

  // ═══════════════════════════════════════════
  // SLIDE 1: TITLE
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Subtle top accent line
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });

    // Large title
    s.addText("2026年第二季度\n工作汇报", {
      x: 0.8, y: 1.0, w: 8.4, h: 2.0,
      fontSize: 44, fontFace: FONT_H, color: C.white, bold: true,
      lineSpacingMultiple: 1.2, margin: 0,
    });

    // Divider line
    s.addShape(pres.shapes.LINE, { x: 0.8, y: 3.15, w: 2.0, h: 0, line: { color: C.orange, width: 3 } });

    // Subtitle info
    s.addText([
      { text: "冷热板坯集批排产模型技术开发", options: { fontSize: 20, fontFace: FONT_B, color: C.white, breakLine: true } },
      { text: " ", options: { fontSize: 10, breakLine: true } },
      { text: "汇报人：李涵彬", options: { fontSize: 16, fontFace: FONT_B, color: C.textLight, breakLine: true } },
      { text: "2026年4月 – 6月  |  W14–W27  |  63个工作日", options: { fontSize: 14, fontFace: FONT_B, color: C.textLight } },
    ], { x: 0.8, y: 3.4, w: 8.4, h: 1.5, margin: 0 });

    // Right-side icon
    s.addImage({ data: icons.industryW, x: 8.3, y: 0.8, w: 1.2, h: 1.2 });
  }

  // ═══════════════════════════════════════════
  // SLIDE 2: AGENDA
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("汇报目录", {
      x: 0.8, y: 0.5, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const items = [
      { num: "01", title: "个人工作概述", desc: "季度整体定位与关键数据", icon: icons.chartLine },
      { num: "02", title: "工作进展与个人成长", desc: "三阶段详细进展 + 五项成长总结", icon: icons.star },
      { num: "03", title: "下季度工作计划", desc: "Q3核心目标、重点任务与节奏规划", icon: icons.bullseye },
    ];

    items.forEach((item, i) => {
      const yBase = 1.6 + i * 1.2;

      // Number circle background
      s.addShape(pres.shapes.OVAL, {
        x: 0.8, y: yBase, w: 0.7, h: 0.7,
        fill: { color: i === 0 ? C.phase1 : i === 1 ? C.phase2 : C.phase3 },
      });
      s.addText(item.num, {
        x: 0.8, y: yBase, w: 0.7, h: 0.7,
        fontSize: 20, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });

      // Title + desc
      s.addText(item.title, {
        x: 1.8, y: yBase - 0.05, w: 6.0, h: 0.4,
        fontSize: 22, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(item.desc, {
        x: 1.8, y: yBase + 0.35, w: 6.0, h: 0.35,
        fontSize: 14, fontFace: FONT_B, color: C.textMid, margin: 0,
      });

      // Right icon
      s.addImage({ data: item.icon, x: 8.5, y: yBase + 0.05, w: 0.55, h: 0.55 });
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 3: 个人工作概述
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("个人工作概述", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Overview description (moved up, larger area since stats removed)
    s.addText([
      { text: "二季度是冷热板坯集批排产模型从", options: { fontSize: 16, fontFace: FONT_B, color: C.textDark } },
      { text: '“能用”走向“好用”', options: { fontSize: 16, fontFace: FONT_B, color: C.orange, bold: true } },
      { text: "的关键阶段。本季度完成了粗轧规则排程从零到一的架构设计与上线，推动了核心排程算法从 BFS 到贪心策略的全面迁移，建立了评分体系使排产质量可量化、可优化，并持续响应现场需求完成多个功能模块交付。季度末完成配置治理与交付策略体系化，为 Q3 多策略并行迭代打下工程基础。", options: { fontSize: 15, fontFace: FONT_B, color: C.textMid } },
    ], { x: 0.8, y: 1.4, w: 8.4, h: 1.6, margin: 0 });

    // Three-phase cards at bottom
    const phases = [
      { label: "4月 · 基础建设", desc: "数据基础设施\n架构设计", color: C.phase1, ico: icons.database },
      { label: "5月 · 算法升级", desc: "BFS→贪心迁移\n评分体系开发", color: C.phase2, ico: icons.cogs },
      { label: "6月 · 功能深化", desc: "生产成熟\n工程治理", color: C.phase3, ico: icons.star },
    ];

    phases.forEach((ph, i) => {
      const xBase = 0.8 + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 3.4, w: 2.6, h: 1.5,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 3.4, w: 2.6, h: 0.06, fill: { color: ph.color },
      });
      s.addText(ph.label, {
        x: xBase + 0.2, y: 3.55, w: 1.7, h: 0.3,
        fontSize: 14, fontFace: FONT_H, color: ph.color, bold: true, margin: 0,
      });
      s.addText(ph.desc, {
        x: xBase + 0.2, y: 3.9, w: 1.7, h: 0.85,
        fontSize: 13, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
      s.addImage({ data: ph.ico, x: xBase + 2.0, y: 3.7, w: 0.45, h: 0.45 });
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 4: 第一阶段 - 4月 基础建设
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    // Section label
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 1.5, h: 0.35, fill: { color: C.phase1 } });
    s.addText("第一阶段", {
      x: 0.8, y: 0.45, w: 1.5, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("4月 · 基础建设与架构设计", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Three cards
    const cards = [
      {
        title: "数据基础设施现代化",
        week: "W14-W15",
        bullets: [
          "存储层 Excel → CSV 迁移",
          "日志系统重构，多类别日志文件",
          "数据过滤优化，减少DataFrame拷贝",
          '建立"优化-验证-回溯"安全工作流',
        ],
      },
      {
        title: "粗轧规则排程架构设计",
        week: "W16-W17",
        bullets: [
          "需求分析→模块划分→接口定义完整设计链",
          "调度器 / 规则引擎 / 结果构建器三大模块",
          "核心数据结构：排程计划、板坯单元、规则约束",
          "骨架代码搭建，明确模块边界",
        ],
      },
      {
        title: "稳定性保障与上线准备",
        week: "W18",
        bullets: [
          "修复 datetime/string 类型不一致 Bug",
          "批量测试暴露并修复空数据等边界问题",
          "编制上线 Checklist，代码整理归档",
          "五一后生产上线准备就绪",
        ],
      },
    ];

    cards.forEach((card, i) => {
      const xBase = 0.8 + i * 3.0;
      // Card bg
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 3.2,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      // Top accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 0.06, fill: { color: C.phase1 },
      });
      // Card title
      s.addText(card.title, {
        x: xBase + 0.2, y: 1.95, w: 2.2, h: 0.45,
        fontSize: 15, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      // Week badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase + 0.2, y: 2.4, w: 1.0, h: 0.28, fill: { color: C.phase1 },
      });
      s.addText(card.week, {
        x: xBase + 0.2, y: 2.4, w: 1.0, h: 0.28,
        fontSize: 10, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      // Bullets
      s.addText(
        card.bullets.map((b, bi) => ({
          text: b,
          options: { fontSize: 12, fontFace: FONT_B, color: C.textMid, bullet: true, breakLine: bi < card.bullets.length - 1 },
        })),
        { x: xBase + 0.2, y: 2.8, w: 2.2, h: 2.0, margin: 0, paraSpaceAfter: 6 }
      );
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 5: 第二阶段 - 5月 算法升级
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 1.5, h: 0.35, fill: { color: C.phase2 } });
    s.addText("第二阶段", {
      x: 0.8, y: 0.45, w: 1.5, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("5月 · 算法升级与评分体系", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const cards = [
      {
        title: "BFS → 贪心算法全模块迁移",
        week: "W20-W21",
        bullets: [
          "物料邻接算法 BFS→贪心",
          "主闸段连接算法迁移",
          "主轧段物料邻接过渡迁移",
          "过渡段+窗口约束+最小数量限制",
          "算法耗时大幅降低，适应实时性要求",
        ],
      },
      {
        title: "评分体系从零到集成",
        week: "W21-W22",
        highlight: true,
        bullets: [
          "设计评分架构与公式（主轧段+离散）",
          "评分模块编码→排程系统集成",
          "提前完成结果分析工具对接",
          '"能排" → "排得好"里程碑达成',
        ],
      },
      {
        title: "现场部署与问题响应",
        week: "W19-W20",
        bullets: [
          "烫辊段物料统计代码上线",
          "修复辊期数量不一致问题",
          "修复手动调度遗留同步 Bug",
          "完成设计文档/双语README/配置文档",
        ],
      },
    ];

    cards.forEach((card, i) => {
      const xBase = 0.8 + i * 3.0;
      const isHighlight = card.highlight;

      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 3.2,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 0.06,
        fill: { color: isHighlight ? C.orange : C.phase2 },
      });
      s.addText(card.title, {
        x: xBase + 0.2, y: 1.95, w: 2.2, h: 0.45,
        fontSize: 15, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase + 0.2, y: 2.4, w: 1.0, h: 0.28,
        fill: { color: isHighlight ? C.orange : C.phase2 },
      });
      s.addText(card.week, {
        x: xBase + 0.2, y: 2.4, w: 1.0, h: 0.28,
        fontSize: 10, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      s.addText(
        card.bullets.map((b, bi) => ({
          text: b,
          options: {
            fontSize: 12, fontFace: FONT_B,
            color: isHighlight ? C.textDark : C.textMid,
            bullet: true, breakLine: bi < card.bullets.length - 1,
            bold: isHighlight && bi === card.bullets.length - 1,
          },
        })),
        { x: xBase + 0.2, y: 2.8, w: 2.2, h: 2.0, margin: 0, paraSpaceAfter: 6 }
      );
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 6: 第三阶段 - 6月 功能深化
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 1.5, h: 0.35, fill: { color: C.phase3 } });
    s.addText("第三阶段", {
      x: 0.8, y: 0.45, w: 1.5, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("6月 · 功能深化与工程治理", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Two-column layout for 5 items
    const items = [
      {
        title: "评分体系正式上线",
        desc: "修复遗留 Bug，生产部署稳定运行。增加评分参数配置功能，开发算法离线测试模块。响应用户现场案例调测。",
        icon: icons.star,
        color: C.teal,
      },
      {
        title: "可利用材模块全流程交付",
        desc: "从 case 分析→方案设计→开发→上线试运行→问题修复的完整闭环。同步完成过渡段校验、批量重算工具等。",
        icon: icons.checkCircle,
        color: C.phase2,
      },
      {
        title: "规格集中与跨团队对齐",
        desc: "与用户讨论确定厚度规格集中方案并编码落地。参与供应链/排程算法对齐会议。",
        icon: icons.users,
        color: C.phase1,
      },
      {
        title: "配置治理",
        desc: "版本分支开关集中至配置文件第0节，结束配置混乱。明确 6 项交付策略并标注优先级。",
        icon: icons.tools,
        color: C.navy,
      },
      {
        title: "策略E 排程功能落地",
        desc: "惩罚矩阵 + 阶段1贪心算法实现。原生数据过滤器。修复温度惩罚计算、桥接逻辑、NaT写入等底层缺陷。",
        icon: icons.brain,
        color: C.orange,
      },
    ];

    items.forEach((item, i) => {
      const col = i < 3 ? 0 : 1;
      const row = i < 3 ? i : i - 3;
      const xBase = 0.8 + col * 4.5;
      const yBase = 1.65 + row * 1.15;

      // Card bg
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 4.1, h: 1.0,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      // Left color bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 0.06, h: 1.0, fill: { color: item.color },
      });
      // Icon
      s.addImage({ data: item.icon, x: xBase + 0.2, y: yBase + 0.15, w: 0.4, h: 0.4 });
      // Title
      s.addText(item.title, {
        x: xBase + 0.7, y: yBase + 0.08, w: 3.2, h: 0.35,
        fontSize: 14, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      // Desc
      s.addText(item.desc, {
        x: xBase + 0.7, y: yBase + 0.42, w: 3.2, h: 0.5,
        fontSize: 11, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 7: 个人成长总结
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("个人成长总结", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const growths = [
      {
        num: "01", title: "端到端交付能力",
        desc: "从需求分析到生产上线，完整经历粗轧排程和评分体系两个大型模块的全生命周期，具备将模糊需求转化为上线功能的独立能力。",
        color: C.phase1,
      },
      {
        num: "02", title: "算法工程化思维",
        desc: 'BFS→贪心迁移深化了对"解质量 vs 计算效率"工程权衡的理解。面向实际约束做算法决策，比单纯追求理论最优解更为务实。',
        color: C.phase2,
      },
      {
        num: "03", title: "质量意识与工程纪律",
        desc: '批量测试作为质量闸门贯穿全季度；"优化-验证-回溯"闭环；文档与代码同步更新，降低协作摩擦。',
        color: C.phase3,
      },
      {
        num: "04", title: "生产问题响应与用户协作",
        desc: "独立排查用户现场问题，从现象反推根因。与用户直接讨论业务规则，将模糊的领域需求转化为可实现的算法逻辑。",
        color: C.teal,
      },
      {
        num: "05", title: "技术债管理意识",
        desc: "季度末主动推动配置治理与交付策略体系化，在功能开发高压下不忘工程债务偿还，为多策略并行迭代打下基础。",
        color: C.orange,
      },
    ];

    growths.forEach((g, i) => {
      const yBase = 1.3 + i * 0.82;

      // Number circle
      s.addShape(pres.shapes.OVAL, {
        x: 0.8, y: yBase + 0.05, w: 0.5, h: 0.5,
        fill: { color: g.color },
      });
      s.addText(g.num, {
        x: 0.8, y: yBase + 0.05, w: 0.5, h: 0.5,
        fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });

      // Title
      s.addText(g.title, {
        x: 1.5, y: yBase, w: 3.0, h: 0.35,
        fontSize: 16, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      // Description
      s.addText(g.desc, {
        x: 1.5, y: yBase + 0.32, w: 7.5, h: 0.42,
        fontSize: 12, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 8: Q3 核心目标
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("下季度工作计划", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Q3 goal statement
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 1.2, w: 8.4, h: 0.8,
      fill: { color: C.navy },
    });
    s.addText([
      { text: "Q3 核心目标：", options: { fontSize: 14, fontFace: FONT_H, color: C.orange, bold: true } },
      { text: "多策略并行交付 + 排程质量闭环优化", options: { fontSize: 16, fontFace: FONT_H, color: C.white, bold: true } },
    ], { x: 1.1, y: 1.3, w: 7.8, h: 0.6, margin: 0 });

    // Priority table
    const headerOpts = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: FONT_H, align: "center", valign: "middle" };
    const cellOpts = (isAlt) => ({ fill: { color: isAlt ? "F1F5F9" : C.white }, color: C.textDark, fontSize: 11, fontFace: FONT_B, valign: "middle" });
    const p0Opts = (isAlt) => ({ ...cellOpts(isAlt), color: C.orange, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });
    const p1Opts = (isAlt) => ({ ...cellOpts(isAlt), color: C.phase2, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });
    const p2Opts = (isAlt) => ({ ...cellOpts(isAlt), color: C.textLight, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });

    const tableData = [
      [
        { text: "优先级", options: { ...headerOpts } },
        { text: "工作项", options: { ...headerOpts } },
        { text: "目标", options: { ...headerOpts } },
        { text: "预期产出", options: { ...headerOpts } },
      ],
      [
        { text: "P0", options: p0Opts(false) },
        { text: "策略E 排程功能集成测试与调优", options: cellOpts(false) },
        { text: "确保惩罚矩阵+贪心策略稳定可用", options: cellOpts(false) },
        { text: "策略E 上线运行", options: cellOpts(false) },
      ],
      [
        { text: "P0", options: p0Opts(true) },
        { text: "6 项交付策略分支逐个验证", options: cellOpts(true) },
        { text: "各策略开关独立可控、灵活切换", options: cellOpts(true) },
        { text: "交付策略矩阵落地", options: cellOpts(true) },
      ],
      [
        { text: "P1", options: p1Opts(false) },
        { text: "原生数据过滤器性能对比评估", options: cellOpts(false) },
        { text: "量化过滤优化效果，决定推广范围", options: cellOpts(false) },
        { text: "性能对比报告", options: cellOpts(false) },
      ],
      [
        { text: "P1", options: p1Opts(true) },
        { text: "基于评分结果反向优化排程参数", options: cellOpts(true) },
        { text: "利用Q2评分数据形成参数优化闭环", options: cellOpts(true) },
        { text: "参数调优方案与效果验证", options: cellOpts(true) },
      ],
      [
        { text: "P2", options: p2Opts(false) },
        { text: "算法测试模块完善", options: cellOpts(false) },
        { text: "持续建设离线测试能力", options: cellOpts(false) },
        { text: "测试模块功能扩展", options: cellOpts(false) },
      ],
      [
        { text: "P2", options: p2Opts(true) },
        { text: "未排出结果优化 + 文档体系完善", options: cellOpts(true) },
        { text: "系统性分析与方案设计", options: cellOpts(true) },
        { text: "未排出case方案 + 完整文档", options: cellOpts(true) },
      ],
    ];

    s.addTable(tableData, {
      x: 0.8, y: 2.3, w: 8.4,
      colW: [1.0, 2.8, 2.4, 2.2],
      rowH: [0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42],
      border: { pt: 0.5, color: C.border },
      margin: [0.08, 0.12, 0.08, 0.12],
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 9: Q3 季度节奏
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("Q3 季度节奏预期", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Timeline
    const months = [
      {
        month: "7月",
        color: C.phase1,
        items: ["策略E 调优上线", "交付策略分支验证", "原生过滤器性能评估"],
      },
      {
        month: "8月",
        color: C.phase2,
        items: ["评分反馈闭环", "参数反向优化", "未排出 case 优化方案"],
      },
      {
        month: "9月",
        color: C.phase3,
        items: ["算法测试模块完善", "全流程文档体系收尾", "Q3 总结与 Q4 规划"],
      },
    ];

    // Horizontal connecting line
    s.addShape(pres.shapes.LINE, {
      x: 1.8, y: 2.1, w: 6.8, h: 0,
      line: { color: C.border, width: 2 },
    });

    months.forEach((m, i) => {
      const xBase = 1.0 + i * 3.0;

      // Circle node
      s.addShape(pres.shapes.OVAL, {
        x: xBase + 0.7, y: 1.85, w: 0.5, h: 0.5,
        fill: { color: m.color },
      });
      s.addText(String(i + 1), {
        x: xBase + 0.7, y: 1.85, w: 0.5, h: 0.5,
        fontSize: 18, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });

      // Month label
      s.addText(m.month, {
        x: xBase, y: 2.5, w: 2.2, h: 0.5,
        fontSize: 22, fontFace: FONT_H, color: m.color, bold: true, align: "center", margin: 0,
      });

      // Items
      m.items.forEach((item, j) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: xBase, y: 3.1 + j * 0.6, w: 2.4, h: 0.48,
          fill: { color: C.white }, shadow: makeCardShadow(),
        });
        s.addShape(pres.shapes.RECTANGLE, {
          x: xBase, y: 3.1 + j * 0.6, w: 0.05, h: 0.48, fill: { color: m.color },
        });
        s.addText(item, {
          x: xBase + 0.15, y: 3.1 + j * 0.6, w: 2.1, h: 0.48,
          fontSize: 12, fontFace: FONT_B, color: C.textDark, valign: "middle", margin: 0,
        });
      });
    });
  }

  // ═══════════════════════════════════════════
  // SLIDE 10: THANK YOU
  // ═══════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });

    s.addText("谢谢", {
      x: 0.8, y: 1.6, w: 8.4, h: 1.2,
      fontSize: 56, fontFace: FONT_H, color: C.white, bold: true, margin: 0,
    });

    s.addShape(pres.shapes.LINE, { x: 0.8, y: 2.9, w: 2.0, h: 0, line: { color: C.orange, width: 3 } });

    s.addText([
      { text: "冷热板坯集批排产模型技术开发", options: { fontSize: 18, fontFace: FONT_B, color: C.white, breakLine: true } },
      { text: " ", options: { fontSize: 8, breakLine: true } },
      { text: "李涵彬  |  2026年7月", options: { fontSize: 14, fontFace: FONT_B, color: C.textLight } },
    ], { x: 0.8, y: 3.2, w: 8.4, h: 1.0, margin: 0 });
  }

  // ─── Write file ───
  const outPath = "c:/Users/Administrator/Documents/Obsidian Vault/7-Sources/热轧排程项目/Q2-2026-工作汇报-李涵彬.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX generated: " + outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
