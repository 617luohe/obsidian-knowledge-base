const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

const {
  FaIndustry, FaChartLine, FaCogs, FaExchangeAlt, FaStar, FaRocket,
  FaBrain, FaBullseye, FaCheckCircle, FaUsers,
  FaTools, FaDatabase, FaCode, FaChartBar, FaLightbulb, FaTrophy, FaLayerGroup,
} = require("react-icons/fa");

// ─── Color Palette ───
const C = {
  navy:      "1E3A5F",
  orange:    "E8731A",
  teal:      "0D9488",
  lightBg:   "F8F7F4",
  white:     "FFFFFF",
  textDark:  "1E293B",
  textMid:   "475569",
  textLight: "94A3B8",
  border:    "E2E8F0",
  q1Color:   "7C3AED",  // purple for Q1
  q2Color:   "0D9488",  // teal for Q2
  phaseBlue: "2563EB",
};

const FONT_H = "Arial Black";
const FONT_B = "Calibri";

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

const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "李涵彬";
  pres.title = "2026年上半年工作汇报";

  const icons = {
    industry: await iconToBase64Png(FaIndustry, "#FFFFFF", 256),
    chartLine: await iconToBase64Png(FaChartLine, "#" + C.orange, 256),
    star: await iconToBase64Png(FaStar, "#" + C.q2Color, 256),
    bullseye: await iconToBase64Png(FaBullseye, "#" + C.orange, 256),
    brain: await iconToBase64Png(FaBrain, "#" + C.teal, 256),
    checkCircle: await iconToBase64Png(FaCheckCircle, "#" + C.teal, 256),
    users: await iconToBase64Png(FaUsers, "#" + C.phaseBlue, 256),
    tools: await iconToBase64Png(FaTools, "#" + C.q1Color, 256),
    database: await iconToBase64Png(FaDatabase, "#" + C.navy, 256),
    code: await iconToBase64Png(FaCode, "#" + C.q1Color, 256),
    chartBar: await iconToBase64Png(FaChartBar, "#" + C.q2Color, 256),
    lightbulb: await iconToBase64Png(FaLightbulb, "#" + C.orange, 256),
    trophy: await iconToBase64Png(FaTrophy, "#" + C.orange, 256),
    cogs: await iconToBase64Png(FaCogs, "#" + C.phaseBlue, 256),
    rocket: await iconToBase64Png(FaRocket, "#FFFFFF", 256),
    layers: await iconToBase64Png(FaLayerGroup, "#" + C.orange, 256),
  };

  // ═══ SLIDE 1: TITLE ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });

    s.addText("2026年上半年\n工作汇报", {
      x: 0.8, y: 0.9, w: 8.4, h: 2.0,
      fontSize: 44, fontFace: FONT_H, color: C.white, bold: true,
      lineSpacingMultiple: 1.2, margin: 0,
    });

    s.addShape(pres.shapes.LINE, { x: 0.8, y: 3.1, w: 2.0, h: 0, line: { color: C.orange, width: 3 } });

    s.addText([
      { text: "冷热板坯集批排产模型技术开发", options: { fontSize: 20, fontFace: FONT_B, color: C.white, breakLine: true } },
      { text: " ", options: { fontSize: 10, breakLine: true } },
      { text: "汇报人：李涵彬", options: { fontSize: 16, fontFace: FONT_B, color: C.textLight, breakLine: true } },
      { text: "2026年1月 – 6月  |  W1–W27  |  约126个工作日", options: { fontSize: 14, fontFace: FONT_B, color: C.textLight } },
    ], { x: 0.8, y: 3.4, w: 8.4, h: 1.5, margin: 0 });

    s.addImage({ data: icons.industry, x: 8.3, y: 0.8, w: 1.2, h: 1.2 });
  }

  // ═══ SLIDE 2: AGENDA ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("汇报目录", {
      x: 0.8, y: 0.5, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const items = [
      { num: "01", title: "上半年工作概述", desc: "整体定位、双季度主线与关键数据", icon: icons.chartLine, color: C.navy },
      { num: "02", title: "第一季度（1-3月）工作进展", desc: "工具链体系化建设与配置管理", icon: icons.code, color: C.q1Color },
      { num: "03", title: "第二季度（4-6月）工作进展", desc: "粗轧排程从零到一 + 评分体系落地", icon: icons.chartBar, color: C.q2Color },
      { num: "04", title: "个人成长与下阶段计划", desc: "五项能力成长总结 + Q3 工作规划", icon: icons.rocket, color: C.orange },
    ];

    items.forEach((item, i) => {
      const yBase = 1.5 + i * 0.9;
      s.addShape(pres.shapes.OVAL, {
        x: 0.8, y: yBase, w: 0.65, h: 0.65, fill: { color: item.color },
      });
      s.addText(item.num, {
        x: 0.8, y: yBase, w: 0.65, h: 0.65,
        fontSize: 18, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      s.addText(item.title, {
        x: 1.8, y: yBase - 0.02, w: 6.0, h: 0.35,
        fontSize: 20, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(item.desc, {
        x: 1.8, y: yBase + 0.33, w: 6.0, h: 0.3,
        fontSize: 13, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
      s.addImage({ data: item.icon, x: 8.6, y: yBase + 0.05, w: 0.5, h: 0.5 });
    });
  }

  // ═══ SLIDE 3: 上半年工作概述 ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("上半年工作概述", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Overview text
    s.addText([
      { text: "2026年上半年是冷热板坯集批排产模型从", options: { fontSize: 16, fontFace: FONT_B, color: C.textDark } },
      { text: '"工具链建设"到"产品化落地"', options: { fontSize: 16, fontFace: FONT_B, color: C.orange, bold: true } },
      { text: '的关键半年。一季度聚焦结果分析工具矩阵完善与配置管理体系建立，为后续开发提供工具支撑；二季度完成粗轧规则排程从零到一的架构设计与上线、BFS到贪心算法的全面迁移、评分体系的建立与落地，实现了排产质量从"能排"到"排得好"的跨越。两个季度产出覆盖了从工具链到核心算法的完整产品闭环。', options: { fontSize: 14, fontFace: FONT_B, color: C.textMid } },
    ], { x: 0.8, y: 1.3, w: 8.4, h: 1.4, margin: 0 });

    // Two quarter cards
    const quarters = [
      {
        label: "Q1 2026（1-3月）",
        tagline: "工具链体系化建设",
        color: C.q1Color,
        highlights: [
          "结果分析看板工具规则检查重写",
          "配置文件管理与多模式调用",
          "主轧材轧厚分析模块开发",
          "过渡材/可利用材标记逻辑修复",
        ],
      },
      {
        label: "Q2 2026（4-6月）",
        tagline: "产品化落地与质量跃升",
        color: C.q2Color,
        highlights: [
          "粗轧规则排程从需求到上线",
          "BFS→贪心算法四大模块迁移",
          "评分体系上线（能排→排得好）",
          "可利用材+规格集中+策略E落地",
        ],
      },
    ];

    quarters.forEach((q, i) => {
      const xBase = 0.8 + i * 4.5;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 2.95, w: 4.0, h: 2.4,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 2.95, w: 4.0, h: 0.06, fill: { color: q.color },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase + 0.2, y: 3.15, w: 1.8, h: 0.3, fill: { color: q.color },
      });
      s.addText(q.label, {
        x: xBase + 0.2, y: 3.15, w: 1.8, h: 0.3,
        fontSize: 11, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      s.addText(q.tagline, {
        x: xBase + 0.2, y: 3.55, w: 3.6, h: 0.35,
        fontSize: 16, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(
        q.highlights.map((h, hi) => ({
          text: h,
          options: { fontSize: 12, fontFace: FONT_B, color: C.textMid, bullet: true, breakLine: hi < q.highlights.length - 1 },
        })),
        { x: xBase + 0.3, y: 3.95, w: 3.4, h: 1.2, margin: 0, paraSpaceAfter: 4 }
      );
    });
  }

  // ═══ SLIDE 4: Q1 阶段一 - 工具链完善（1-2月）═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 2.0, h: 0.35, fill: { color: C.q1Color } });
    s.addText("Q1 · 阶段一", {
      x: 0.8, y: 0.45, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("1-2月 · 结果分析工具与配置管理", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const cards = [
      {
        title: "结果分析工具矩阵",
        items: [
          "结果对比看板规则检查模块重写",
          "修复混杂检查 Bug，运行正常",
          "人工/算法计划对比与导出功能",
          "Markdown 格式分析报告导出",
          "数据仪表板功能模块开发",
        ],
      },
      {
        title: "算法调用与配置管理",
        items: [
          "四种算法调用模式（含可利用材二次调用）",
          "配置文件分离管理与中文注释",
          "新旧配置文件同时展示功能",
          "使用本地数据运行算法功能",
          "人工计划新辊期号转存功能",
        ],
      },
      {
        title: "Bug 修复与数据治理",
        items: [
          "数据字段缺失统一处理",
          "计划时间更新防止主键冲突",
          '算法标记"模型名称"字段逻辑调整',
          "过渡材标记错误修复与后处理",
          "多进程冲突异常排查与修复",
        ],
      },
    ];

    cards.forEach((card, i) => {
      const xBase = 0.8 + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 3.3,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 0.06, fill: { color: C.q1Color },
      });
      s.addText(card.title, {
        x: xBase + 0.2, y: 1.95, w: 2.2, h: 0.4,
        fontSize: 15, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(
        card.items.map((b, bi) => ({
          text: b,
          options: { fontSize: 12, fontFace: FONT_B, color: C.textMid, bullet: true, breakLine: bi < card.items.length - 1 },
        })),
        { x: xBase + 0.2, y: 2.45, w: 2.2, h: 2.4, margin: 0, paraSpaceAfter: 5 }
      );
    });
  }

  // ═══ SLIDE 5: Q1 阶段二 - 三月关键进展 ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 2.0, h: 0.35, fill: { color: C.q1Color } });
    s.addText("Q1 · 阶段二", {
      x: 0.8, y: 0.45, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("3月 · 轧厚分析与排程分支增强", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    // Two-column layout
    const items = [
      {
        title: "主轧材轧厚分析模块",
        desc: "算法排程及结果分析工具增加主轧材轧厚分析模块，支持三种配置文件选择分支，为后续规格集中优化提供数据基础。",
        icon: icons.chartBar,
        color: C.q1Color,
      },
      {
        title: "配置文件分支管理增强",
        desc: "结果分析工具配置文件管理 Bug 修复——解决默认配置错误引用最新版本配置的问题，增加新旧配置文件同时展示功能。本地算法测试增加创建人后缀标识。",
        icon: icons.tools,
        color: C.q1Color,
      },
      {
        title: "排程分支策略扩展",
        desc: "排程分支增加断点宽松分支，扩展排程策略可选范围，为后续多策略并行交付打下基础。",
        icon: icons.layers,
        color: C.q1Color,
      },
      {
        title: "过渡边临时降级处理",
        desc: "多阶段调度中临时关闭过渡边功能，为后续粗轧规则排程的架构设计让路，体现了渐进式重构的工程思路。",
        icon: icons.cogs,
        color: C.q1Color,
      },
    ];

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xBase = 0.8 + col * 4.5;
      const yBase = 1.65 + row * 1.7;

      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 4.1, h: 1.5,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 0.06, h: 1.5, fill: { color: item.color },
      });
      s.addImage({ data: item.icon, x: xBase + 0.2, y: yBase + 0.15, w: 0.4, h: 0.4 });
      s.addText(item.title, {
        x: xBase + 0.7, y: yBase + 0.08, w: 3.2, h: 0.35,
        fontSize: 14, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(item.desc, {
        x: xBase + 0.7, y: yBase + 0.45, w: 3.2, h: 0.9,
        fontSize: 11, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
    });
  }

  // ═══ SLIDE 6: Q2 阶段一 - 基础建设与架构设计（4月）═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 2.0, h: 0.35, fill: { color: C.q2Color } });
    s.addText("Q2 · 阶段一", {
      x: 0.8, y: 0.45, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("4月 · 数据基础设施与架构设计", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const cards = [
      {
        title: "数据基础设施现代化",
        items: [
          "存储层 Excel → CSV 迁移",
          "日志系统重构，多类别日志文件",
          "数据过滤优化，减少DataFrame拷贝",
          '建立"优化-验证-回溯"安全工作流',
        ],
      },
      {
        title: "粗轧规则排程架构设计",
        highlight: true,
        items: [
          "需求分析→模块划分→接口定义完整设计链",
          "调度器/规则引擎/结果构建器三大模块",
          "核心数据结构：排程计划、板坯单元、规则约束",
          "骨架代码搭建，明确模块边界",
        ],
      },
      {
        title: "稳定性保障与上线准备",
        items: [
          "修复 datetime/string 类型不一致 Bug",
          "批量测试暴露并修复空数据等边界问题",
          "编制上线 Checklist，代码整理归档",
          "五一后生产上线准备就绪",
        ],
      },
    ];

    cards.forEach((card, i) => {
      const xBase = 0.8 + i * 3.0;
      const hl = card.highlight;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 3.2,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 0.06, fill: { color: hl ? C.orange : C.q2Color },
      });
      s.addText(card.title, {
        x: xBase + 0.2, y: 1.95, w: 2.2, h: 0.45,
        fontSize: 15, fontFace: FONT_H, color: hl ? C.orange : C.textDark, bold: true, margin: 0,
      });
      s.addText(
        card.items.map((b, bi) => ({
          text: b,
          options: { fontSize: 12, fontFace: FONT_B, color: C.textMid, bullet: true, breakLine: bi < card.items.length - 1 },
        })),
        { x: xBase + 0.2, y: 2.55, w: 2.2, h: 2.2, margin: 0, paraSpaceAfter: 6 }
      );
    });
  }

  // ═══ SLIDE 7: Q2 阶段二 - 算法升级与评分体系（5月）═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 2.0, h: 0.35, fill: { color: C.q2Color } });
    s.addText("Q2 · 阶段二", {
      x: 0.8, y: 0.45, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("5月 · 算法升级与评分体系", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const cards = [
      {
        title: "BFS→贪心算法全模块迁移",
        items: [
          "物料邻接算法 BFS→贪心",
          "主闸段连接算法迁移",
          "主轧段物料邻接过渡迁移",
          "过渡段+窗口约束+最小数量限制",
          "算法耗时大幅降低，适应实时性要求",
        ],
      },
      {
        title: "评分体系从零到集成",
        highlight: true,
        items: [
          "设计评分架构与公式（主轧段+离散）",
          "评分模块编码→排程系统集成",
          "提前完成结果分析工具对接",
          '"能排"→"排得好"里程碑达成',
        ],
      },
      {
        title: "现场部署与问题响应",
        items: [
          "烫辊段物料统计代码上线",
          "修复辊期数量不一致问题",
          "修复手动调度遗留同步 Bug",
          "完成设计文档/双语README/配置文档",
        ],
      },
    ];

    cards.forEach((card, i) => {
      const xBase = 0.8 + i * 3.0;
      const hl = card.highlight;
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 3.2,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: 1.75, w: 2.6, h: 0.06, fill: { color: hl ? C.orange : C.q2Color },
      });
      s.addText(card.title, {
        x: xBase + 0.2, y: 1.95, w: 2.2, h: 0.45,
        fontSize: 15, fontFace: FONT_H, color: hl ? C.orange : C.textDark, bold: true, margin: 0,
      });
      s.addText(
        card.items.map((b, bi) => ({
          text: b,
          options: { fontSize: 12, fontFace: FONT_B, color: C.textMid, bullet: true, breakLine: bi < card.items.length - 1 },
        })),
        { x: xBase + 0.2, y: 2.55, w: 2.2, h: 2.2, margin: 0, paraSpaceAfter: 6 }
      );
    });
  }

  // ═══ SLIDE 8: Q2 阶段三 - 功能深化与工程治理（6月）═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.45, w: 2.0, h: 0.35, fill: { color: C.q2Color } });
    s.addText("Q2 · 阶段三", {
      x: 0.8, y: 0.45, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText("6月 · 功能深化与工程治理", {
      x: 0.8, y: 0.95, w: 8.4, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const items = [
      {
        title: "评分体系正式上线",
        desc: "修复遗留 Bug，生产部署稳定运行。增加评分参数配置功能，开发算法离线测试模块。响应用户现场案例调测。",
        icon: icons.star, color: C.teal,
      },
      {
        title: "可利用材模块全流程交付",
        desc: "从 case 分析→方案设计→开发→上线试运行→问题修复的完整闭环。根因分析修复 b 规则违反问题。",
        icon: icons.checkCircle, color: C.q1Color,
      },
      {
        title: "规格集中与跨团队对齐",
        desc: "与用户讨论确定厚度规格集中方案并编码落地。参与供应链/排程算法对齐会议。",
        icon: icons.users, color: C.phaseBlue,
      },
      {
        title: "配置治理与策略E",
        desc: "版本分支开关集中至配置文件第0节，6项交付策略明确优先级。策略E落地：惩罚矩阵+贪心算法+原生数据过滤器。",
        icon: icons.tools, color: C.navy,
      },
      {
        title: "算法修复与优化",
        desc: "修复温度惩罚计算错误、桥接逻辑问题、数据库 NaT 写入等底层缺陷。重构粗轧规则排程配置结构。",
        icon: icons.cogs, color: C.q2Color,
      },
      {
        title: "批量工具与调试能力",
        desc: "批量粗排重算工具、批量导出性能优化、过渡段验证控制、Git-SVN 差异同步工具等配套工具链完善。",
        icon: icons.code, color: C.q1Color,
      },
    ];

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const xBase = 0.8 + col * 4.5;
      const yBase = 1.65 + row * 1.2;

      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 4.1, h: 1.05,
        fill: { color: C.white }, shadow: makeCardShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: xBase, y: yBase, w: 0.06, h: 1.05, fill: { color: item.color },
      });
      s.addImage({ data: item.icon, x: xBase + 0.2, y: yBase + 0.15, w: 0.4, h: 0.4 });
      s.addText(item.title, {
        x: xBase + 0.7, y: yBase + 0.05, w: 3.2, h: 0.35,
        fontSize: 14, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(item.desc, {
        x: xBase + 0.7, y: yBase + 0.38, w: 3.2, h: 0.6,
        fontSize: 11, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
    });
  }

  // ═══ SLIDE 9: 个人成长总结 ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("个人成长总结", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const growths = [
      {
        num: "01", title: "端到端产品交付能力",
        desc: "从需求分析到生产上线，完整经历粗轧排程和评分体系两个大型模块的全生命周期，具备将模糊需求转化为上线功能的独立能力。",
        color: C.phaseBlue,
      },
      {
        num: "02", title: "算法设计与工程化思维",
        desc: 'BFS→贪心迁移深化了对"解质量 vs 计算效率"工程权衡的理解。面向实际约束做算法决策，比单纯追求理论最优解更为务实。',
        color: C.q1Color,
      },
      {
        num: "03", title: "工具链构建与质量意识",
        desc: '从结果分析工具矩阵到算法离线测试模块，持续构建支撑算法迭代的工具链。批量测试作为质量闸门，"优化-验证-回溯"闭环贯穿始终。',
        color: C.q2Color,
      },
      {
        num: "04", title: "生产问题响应与用户协作",
        desc: "独立排查用户现场问题，从现象反推根因。与用户直接讨论业务规则，将模糊的领域需求转化为可实现的算法逻辑。",
        color: C.teal,
      },
      {
        num: "05", title: "技术债管理与工程治理",
        desc: "在功能开发高压下不忘偿还技术债——配置集中管理、版本分支体系化、交付策略明确化，为长期可维护性打下基础。",
        color: C.orange,
      },
    ];

    growths.forEach((g, i) => {
      const yBase = 1.3 + i * 0.82;

      s.addShape(pres.shapes.OVAL, {
        x: 0.8, y: yBase + 0.05, w: 0.5, h: 0.5, fill: { color: g.color },
      });
      s.addText(g.num, {
        x: 0.8, y: yBase + 0.05, w: 0.5, h: 0.5,
        fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      s.addText(g.title, {
        x: 1.5, y: yBase, w: 3.0, h: 0.35,
        fontSize: 16, fontFace: FONT_H, color: C.textDark, bold: true, margin: 0,
      });
      s.addText(g.desc, {
        x: 1.5, y: yBase + 0.32, w: 7.5, h: 0.42,
        fontSize: 12, fontFace: FONT_B, color: C.textMid, margin: 0,
      });
    });
  }

  // ═══ SLIDE 10: Q3 工作计划 ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("下阶段工作计划（Q3 2026）", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 34, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 1.2, w: 8.4, h: 0.7,
      fill: { color: C.navy },
    });
    s.addText([
      { text: "核心目标：", options: { fontSize: 14, fontFace: FONT_H, color: C.orange, bold: true } },
      { text: "多策略并行交付 + 排程质量闭环优化 + 知识体系固化", options: { fontSize: 15, fontFace: FONT_H, color: C.white, bold: true } },
    ], { x: 1.1, y: 1.3, w: 7.8, h: 0.5, margin: 0 });

    const hOpts = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: FONT_H, align: "center", valign: "middle" };
    const cOpts = (a) => ({ fill: { color: a ? "F1F5F9" : C.white }, color: C.textDark, fontSize: 11, fontFace: FONT_B, valign: "middle" });
    const p0 = (a) => ({ ...cOpts(a), color: C.orange, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });
    const p1 = (a) => ({ ...cOpts(a), color: C.q1Color, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });
    const p2 = (a) => ({ ...cOpts(a), color: C.textLight, bold: true, fontSize: 13, fontFace: FONT_H, align: "center" });

    const tableData = [
      [
        { text: "优先级", options: { ...hOpts } },
        { text: "工作项", options: { ...hOpts } },
        { text: "目标", options: { ...hOpts } },
      ],
      [{ text: "P0", options: p0(false) }, { text: "策略E排程功能集成测试与调优", options: cOpts(false) }, { text: "惩罚矩阵+贪心策略稳定上线", options: cOpts(false) }],
      [{ text: "P0", options: p0(true) }, { text: "6项交付策略分支逐个验证", options: cOpts(true) }, { text: "策略开关独立可控、灵活切换", options: cOpts(true) }],
      [{ text: "P1", options: p1(false) }, { text: "基于评分结果反向优化排程参数", options: cOpts(false) }, { text: "评分数据形成参数优化闭环", options: cOpts(false) }],
      [{ text: "P1", options: p1(true) }, { text: "原生数据过滤器性能对比评估", options: cOpts(true) }, { text: "量化过滤效果、决定推广范围", options: cOpts(true) }],
      [{ text: "P2", options: p2(false) }, { text: "算法测试模块完善", options: cOpts(false) }, { text: "离线测试能力持续建设", options: cOpts(false) }],
      [{ text: "P2", options: p2(true) }, { text: "未排出结果优化 + 全流程文档体系", options: cOpts(true) }, { text: "系统性方案 + 知识固化", options: cOpts(true) }],
    ];

    s.addTable(tableData, {
      x: 0.8, y: 2.2, w: 8.4,
      colW: [1.0, 3.8, 3.6],
      rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
      border: { pt: 0.5, color: C.border },
      margin: [0.06, 0.12, 0.06, 0.12],
    });
  }

  // ═══ SLIDE 11: Q3 季度节奏 ═══
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };

    s.addText("Q3 季度节奏预期", {
      x: 0.8, y: 0.4, w: 8.4, h: 0.7,
      fontSize: 36, fontFace: FONT_H, color: C.navy, bold: true, margin: 0,
    });

    const months = [
      { month: "7月", color: C.phaseBlue, items: ["策略E调优上线", "交付策略分支验证", "原生过滤器性能评估"] },
      { month: "8月", color: C.q1Color, items: ["评分反馈闭环", "参数反向优化", "未排出case优化方案"] },
      { month: "9月", color: C.q2Color, items: ["算法测试模块完善", "全流程文档体系收尾", "Q3总结与Q4规划"] },
    ];

    s.addShape(pres.shapes.LINE, { x: 1.8, y: 2.15, w: 6.8, h: 0, line: { color: C.border, width: 2 } });

    months.forEach((m, i) => {
      const xBase = 1.0 + i * 3.0;
      s.addShape(pres.shapes.OVAL, { x: xBase + 0.7, y: 1.9, w: 0.5, h: 0.5, fill: { color: m.color } });
      s.addText(String(i + 1), {
        x: xBase + 0.7, y: 1.9, w: 0.5, h: 0.5,
        fontSize: 18, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
      });
      s.addText(m.month, {
        x: xBase, y: 2.55, w: 2.2, h: 0.5,
        fontSize: 22, fontFace: FONT_H, color: m.color, bold: true, align: "center", margin: 0,
      });

      m.items.forEach((item, j) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: xBase, y: 3.15 + j * 0.6, w: 2.4, h: 0.48,
          fill: { color: C.white }, shadow: makeCardShadow(),
        });
        s.addShape(pres.shapes.RECTANGLE, {
          x: xBase, y: 3.15 + j * 0.6, w: 0.05, h: 0.48, fill: { color: m.color },
        });
        s.addText(item, {
          x: xBase + 0.15, y: 3.15 + j * 0.6, w: 2.1, h: 0.48,
          fontSize: 12, fontFace: FONT_B, color: C.textDark, valign: "middle", margin: 0,
        });
      });
    });
  }

  // ═══ SLIDE 12: THANK YOU ═══
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

  // ─── Write ───
  const outPath = "c:/Users/Administrator/Documents/Obsidian Vault/7-Sources/热轧排程项目/2026年上半年工作汇报-李涵彬.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX generated: " + outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
