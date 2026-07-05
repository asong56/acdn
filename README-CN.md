# asong56 Design Manual
> 版本 0.2  
> 哲学来源：Innei Yohaku · Apple HIG · Tidal Design Language  
> 约束：Vanilla SCSS · 零 JS · 单文件 · 语义化 HTML 优先

---

## 目录

1. [设计哲学](#1-设计哲学)
2. [色彩系统](#2-色彩系统)
3. [字体排印](#3-字体排印)
4. [间距系统](#4-间距系统)
5. [圆角系统](#5-圆角系统)
6. [动效系统](#6-动效系统)
7. [材质与层次](#7-材质与层次)
8. [组件规范](#8-组件规范)
9. [交互细节图鉴](#9-交互细节图鉴)
10. [响应式策略](#10-响应式策略)
11. [可访问性与精修细节](#11-可访问性与精修细节)
12. [SCSS 变量总表](#12-scss-变量总表)
13. [光标、滚动条与选中样式](#13-光标滚动条与选中样式)
14. [附录：细节清单对照](#附录细节清单对照)

---

## 1. 设计哲学

### 1.1 三源分层

```
┌──────────────────────────────────────────┐
│  Tidal 精度层    最表层 · 10% 的决策       │
│  HIG Liquid Glass  中层 · 20% 的决策      │
│  Yohaku 余白哲学   底层 · 70% 的决策      │
└──────────────────────────────────────────┘
```

**Yohaku 是灵魂**：留白不是空缺，是结构本身。文字呼吸，间距说话。克制的颜色，Serif 只在特殊时刻出现，整体像一本手工装帧的读本。

**HIG Liquid Glass 是质感**：只取两件事——液态玻璃材质，以及关闭/弹出时遵循物理的动效。不引入 HIG 其他视觉语言。

**Tidal 是精度**：数字用 `tabular-nums`，颜色转场精确到毫秒，hover 状态同时变化的属性不超过 2 个。理性驱动感性。

### 1.2 情感目标

> **像触摸高级腕表表面的感觉。凉，润，有重量，按下去有适当阻尼，松开后归位流畅。**

用户感受到「用起来很舒服」，但说不出哪里好——这是目标，不是副产品。

### 1.3 禁止清单

- ❌ 彩色阴影（`box-shadow` 只用黑色透明）
- ❌ 两种以上强调色同时出现
- ❌ 动效 duration 超过 500ms（页面级过场除外）
- ❌ `border` 用于图片边框（用 inset ring 代替）
- ❌ `transition: all`（永远明确指定属性）
- ❌ `9999px` 等魔法数字
- ❌ 非 SVG 图标
- ❌ 在不必要处使用 class 或 id（语义标签优先）

### 1.4 HTML 语义优先原则

**只在以下情况使用 class**：
- 组件被大量复用且无对应语义标签（如 `.badge`、`.glass`）
- 同一语义标签需要多种视觉变体（如 `<button class="ghost">`）
- 状态修饰（如 `[aria-current]`、`[data-state]`——优先用属性选择器，不用 `.is-active`）

**禁止使用 id 作为样式钩子**，id 只用于页面锚点和 `<label for>`。

优先使用的语义标签对照：

| 内容类型 | 标签 | 而不是 |
|---|---|---|
| 主要内容区 | `<main>` | `<div class="main">` |
| 文章 / 博文 | `<article>` | `<div class="post">` |
| 版块 | `<section>` | `<div class="section">` |
| 侧边栏 | `<aside>` | `<div class="sidebar">` |
| 导航 | `<nav>` | `<div class="nav">` |
| 页脚 | `<footer>` | `<div class="footer">` |
| 引言 | `<blockquote>` | `<div class="quote">` |
| 说明文字 | `<figcaption>` | `<p class="caption">` |
| 数据行 | `<dl><dt><dd>` | `<div class="row">` |
| 时间 | `<time datetime>` | `<span class="date">` |

---

## 2. 色彩系统

### 2.1 系统架构

运行时全部走 CSS custom properties，SCSS 变量只用于编译期。

```
色彩层级
├── 语义色（代码中只用这一层）
│   ├── --color-bg            页面背景
│   ├── --color-surface       内嵌面板、次级容器
│   ├── --color-border        分隔线、边框
│   ├── --color-text          标题、强调、正文
│   ├── --color-text-muted    次要文字、导航、元信息
│   ├── --color-accent        唯一彩色强调
│   └── --color-accent-dim    accent 的低饱和版（背景用）
│
└── 原始色（只在 :root 赋值中出现一次）
    ├── OKLCH Neutral（5 档）
    └── Accent HSL（hue 可配置）
```

> **为什么只有 5 档而不是 11 档？**  
> 11 档是为了「覆盖所有可能性」——这是工具库思维。本系统是为特定产品服务的，5 档精确描述了实际存在的视觉层：背景、表面、边框、次要文字、正文。多出的档位只会让开发者在选择时犹豫。

### 2.2 Neutral Scale（5 档）

使用 OKLCH 色彩空间，感知均匀：

| 档位 | Light | Dark | 用途 |
|---|---|---|---|
| `n-0` | `oklch(98.5% 0.003 260)` | `oklch(11% 0.003 260)` | 页面背景 `--color-bg` |
| `n-1` | `oklch(95% 0.004 260)` | `oklch(16% 0.004 260)` | 内嵌面板 `--color-surface` |
| `n-2` | `oklch(88% 0.005 260)` | `oklch(24% 0.005 260)` | 分隔线 `--color-border` |
| `n-3` | `oklch(60% 0.008 260)` | `oklch(60% 0.008 260)` | 次要文字（明暗同值）`--color-text-muted` |
| `n-4` | `oklch(28% 0.008 260)` | `oklch(88% 0.008 260)` | 正文 / 标题 `--color-text` |

> `n-3` 在明暗模式下取同一 OKLCH 值，因为 60% 的亮度在两种背景下对比度刚好都能达标（约 4.5:1）。

### 2.3 Accent 色

```scss
$accent-hue:    220;     // 冷靛蓝，接近 Tidal 品牌色；改这一个值即可换色
$accent-c:      0.18;
$accent-l:      52%;

// 自动衍生：
// --color-accent      oklch(52% 0.18 220)
// --color-accent-hover oklch(47% 0.18 220)
// --color-accent-dim  oklch(96% 0.04 220)  [dark: oklch(18% 0.06 220)]
```

**Accent 使用规则**：

- ✅ 主行动按钮 · 当前选中态 · 链接下划线 · 光标颜色
- ✅ 同一视口最多 1 处 accent 色块
- ❌ 装饰性背景 · 边框 · 图标常态

### 2.4 语义色赋值

```scss
:root {
  --color-bg:         oklch(98.5% 0.003 260);
  --color-surface:    oklch(95%   0.004 260);
  --color-border:     oklch(88%   0.005 260);
  --color-text-muted: oklch(60%   0.008 260);
  --color-text:       oklch(28%   0.008 260);
  --color-accent:     oklch(52%   0.18  220);
  --color-accent-dim: oklch(96%   0.04  220);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:         oklch(11%  0.003 260);
    --color-surface:    oklch(16%  0.004 260);
    --color-border:     oklch(24%  0.005 260);
    --color-text-muted: oklch(60%  0.008 260);
    --color-text:       oklch(88%  0.008 260);
    --color-accent:     oklch(60%  0.16  220);
    --color-accent-dim: oklch(18%  0.06  220);
  }
}
```

### 2.5 Tinted Background（媒体主色染色）

CSS 定义接口，JS 注入 `--media-hue` 和 `--media-chroma`：

```scss
:root {
  --media-hue:    220;
  --media-chroma: 0;
}

.bg-tinted {
  background-color: oklch(
    var(--bg-l, 98.5%)
    var(--media-chroma)
    var(--media-hue)
  );
  transition: background-color 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

`--media-chroma` 上限：`0.05`（light）/ `0.07`（dark）。染色 transition 不低于 600ms——要「渗入」，不要「跳变」。

### 2.6 Dynamic Theme Color（`<meta>`）

```html
<meta name="theme-color" content="oklch(98.5% 0.003 260)"
      media="(prefers-color-scheme: light)">
<meta name="theme-color" content="oklch(11% 0.003 260)"
      media="(prefers-color-scheme: dark)">
```

---

## 3. 字体排印

### 3.1 字体栈

```scss
// Sans：Switzer 优先（最符合系统气质），系统字体兜底
$font-sans:
  'Switzer',
  'Open Sans',
  ui-sans-serif,     // macOS/iOS → SF Pro
  'Segoe UI',        // Windows
  system-ui,
  sans-serif;

// Serif：Gilda Display（大字号下飘逸，笔画有韧性，与 Switzer 的几何感形成感性对话）
// 仅用于 blockquote 和特殊展示时刻，不用于正文
$font-serif:
  'Gilda Display',
  Georgia,
  serif;

// Mono：Monaspace Neon 优先（GitHub 字体，连字丰富），Apple 用 SF Mono
$font-mono:
  'Monaspace Neon',
  ui-monospace,      // macOS/iOS → SF Mono
  'Cascadia Code',
  monospace;

// 中文：OPPO Sans 兜底系统中文
$font-cjk:
  'OPPO Sans',
  'PingFang SC',
  'Microsoft YaHei',
  sans-serif;
```

> **关于 Serif 的判断**：Gilda Display 是纯展示字体，这意味着它只在 24px 以上才真正好看——笔画的弧度、衬线的韧性、字母间的平衡，都是为大字号设计的。本系统 Serif 只用于 `blockquote` 和签名展示，字号始终在 `text-xl`（26px）以上，刚好落在 Gilda Display 的舒适区。在这个尺度上，它与 Switzer 的现代几何感形成「理性与感性的对话」，比更端庄的 Cormorant Garamond 多一点飘逸。

### 3.2 字体用途规则

| 场景 | 字体 | 理由 |
|---|---|---|
| 正文、UI 标签、导航、按钮 | Sans | 可读性、中性、系统一致 |
| 大标题（`h1`、`h2`）| **Sans** | 与 Tidal 精度感吻合，负字间距处理厚重感 |
| 展示数字（价格、数据、计数）| **Sans + `tabular-nums`** | 对齐精度，感性靠排版而不是字体 |
| 引言（`blockquote`）| Serif italic | 「特殊时刻」，Yohaku 的纸上温度 |
| 签名、装饰性小标 | Serif italic | 同上，克制使用 |
| 代码、路径、终端 | Mono | 语义区分 |
| 中文正文 | CJK + Sans 混排 | OPPO Sans 优先 |

> **为什么大标题改用 Sans？**  
> Serif italic 大标题在 Yohaku 语境里是「书页感」——适合 Innei 博客那种安静阅读场景。本系统更偏 Tidal 的精准理性，Sans 600 + 负字间距同样有「分量」，而且整体调性更统一，不会产生风格撕裂感。Serif 保留但降格为「稀有时刻」。

### 3.3 Type Scale（6 档）

基础 `1rem = 16px`：

| 变量 | rem | px | `font-weight` | 用途 |
|---|---|---|---|---|
| `--text-xs` | `0.75rem` | 12px | 400 | Badge、版权、辅助标注 |
| `--text-sm` | `0.875rem` | 14px | 400 | 次要正文、meta、导航 |
| `--text-base` | `1rem` | 16px | 400 | **主正文** |
| `--text-lg` | `1.25rem` | 20px | 600 | 卡片标题、`h3`、版块小标 |
| `--text-xl` | `1.625rem` | 26px | 600 | `h2`、页面次标题 |
| `--text-2xl` | `2.5rem` | 40px | 600 | `h1`、展示标题 |

> **为什么只有 6 档？**  
> 更多档位会让开发者在「用 `text-md` 还是 `text-lg`」上犹豫。6 档中每档都有唯一使用场景，无需选择。

### 3.4 字重规范（仅 400 / 600）

```
400 → 一切正文、辅助文字、次要文字、导航（静态）
600 → 标题、按钮、Badge、导航（active）、强调
```

**防止布局偏移**（400 → 600 偏移约 1–2px，必须处理）：

```scss
// 导航项等需要 hover 改变字重的元素，用 ::after 预占宽度
nav a {
  font-weight: 400;
  transition: font-weight 0s;  // 字重变化无需动效，立刻切换

  &::after {
    content: attr(data-text);  // data-text 与链接文字相同
    font-weight: 600;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    display: block;
    pointer-events: none;
  }

  &[aria-current='page'] {
    font-weight: 600;
  }
}
```

### 3.5 行高

| 用途 | `line-height` |
|---|---|
| `h1`（`text-2xl`）| `1.1` |
| `h2`（`text-xl`）| `1.2` |
| `h3`（`text-lg`）| `1.3` |
| 正文（`text-base`）| `1.7` |
| 次要文字（`text-sm`）| `1.5` |
| Badge / 按钮（`text-xs`、`text-sm`）| `1.2` |
| `blockquote`（Serif）| `1.8` |
| 代码块 | `1.6` |

### 3.6 字间距

| 场景 | `letter-spacing` |
|---|---|
| 正文（`text-base`）| `+0.02em` |
| 次要文字（`text-sm`）| `+0.02em` |
| `h1`（`text-2xl`）| `-0.03em` |
| `h2`（`text-xl`）| `-0.02em` |
| `h3`（`text-lg`）| `-0.01em` |
| ALL-CAPS 标签 | `+0.10em` |
| 按钮文字 | `+0.01em` |
| Badge | `+0.06em` |
| 数字（价格、计数）| `0`（tabular-nums 处理）|
| Mono 代码 | `0` |
| `blockquote`（Serif）| `+0.015em` |

**全大写使用场景**（仅限以下，不扩展）：
- 版块标签（section label）：`ABOUT · WORK · CONTACT`
- 数据表格列头
- 状态徽标：`LIVE · SOLD OUT`

### 3.7 链接样式

| 状态 | 样式 |
|---|---|
| 默认 | 颜色继承，`text-decoration: underline`，颜色 `--color-border` |
| `:hover` | 颜色 → `--color-accent`，下划线颜色 → `--color-accent` |
| `:visited` | 颜色 → `--color-text-muted`，样式不变 |

外部链接附加 `↗`（`[href^="https"]::after`），内部链接不附加：

```scss
a[href^='http']::after {
  content: '↗';
  font-size: 0.7em;
  vertical-align: super;
  margin-left: 0.1em;
  display: inline-block;
  transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1.0);
}

a[href^='http']:hover::after {
  transform: translate(2px, -2px);
}
```

**Drop www prefix**：通过 `data-display-href` 属性展示处理后 URL，`href` 不变。CSS 只处理展示：

```scss
a[data-display-href]::before {
  content: attr(data-display-href);
}

a[data-display-href] {
  font-size: 0;  // 隐藏原始文本节点（需配合 HTML 结构）
  
  &::before {
    font-size: var(--text-sm);
  }
}
```

---

## 4. 间距系统

### 4.1 Scale（8 档）

```scss
// 前四档：4px 步进（精细 UI 控制）
// 后四档：渐进扩大（布局级间距）
$space: (
  1:  4px,   // 图标与文字、inline 元素间距
  2:  8px,   // 基础内边距、列表项间距
  3:  12px,  // 紧凑内边距
  4:  16px,  // 标准内边距（卡片、按钮）
  6:  24px,  // 元素组间距、段落间距
  8:  32px,  // 版块内部间距
  12: 48px,  // 版块间距
  24: 96px,  // 页面级大间距（hero、首屏）
);
```

> **关于 96px 的跳跃**：从 48 到 96 是翻倍，视觉上的「断档」确实存在。但这个断档是刻意的——96px 只用于页面级大间距（Hero 区域、首屏顶部），它代表「换了一个尺度」，不需要与前面的档位平滑衔接。如果希望有过渡档，可加 `64px`，但本系统认为 64 和 48、96 都太近，用到的场景模糊。建议保持现状，在使用规范中严格限制 96px 的出场次数。

### 4.2 使用规则（场景锁定）

| 间距 | 场景 | 禁止用于 |
|---|---|---|
| `4px` | 图标与文字、`<dt>` 与 `<dd>` 同行 | 布局间距 |
| `8px` | 列表项间、inline 元素堆叠、`<li>` margin | 大版块 |
| `12px` | 紧凑容器内边距（`<code>`、badge）| 段落间距 |
| `16px` | 标准容器内边距（按钮、输入框）、`<p>` margin-bottom | — |
| `24px` | 组件间间距、`<section>` 内部子元素间 | 页面级 |
| `32px` | `<h2>` 上方 margin | — |
| `48px` | `<section>` 与 `<section>` 之间 | hero 区域 |
| `96px` | 页面 hero、首屏、页脚上方 | 任何组件内部 |

### 4.3 内容宽度

```scss
$w-text:  68ch;     // 主正文（ch 单位，随字号自适应）
$w-wide:  860px;    // 宽内容（代码块、图表）
$w-full:  1100px;   // 最大容器
```

正文永远不拉到 100% 宽度。这是 Yohaku 的核心空间规则——空白本身是结构。

### 4.4 版块节奏（Breathing Rhythm）

| 元素 | `margin-top` | `margin-bottom` |
|---|---|---|
| `h1` | — | `24px` |
| `h2` | `48px` | `16px` |
| `h3` | `32px` | `8px` |
| `p` | — | `16px` |
| `li` | — | `8px` |
| `blockquote` | `32px` | `32px` |
| `pre` | `24px` | `24px` |
| `figure` | `32px` | `32px` |

### 4.5 同心圆边距关系（HIG Concentricity）

**规则**：外圆角 = 内圆角 + 容器内边距

```scss
// 容器暴露变量，子元素自动计算
.card {
  --r: 12px;           // 容器圆角
  --p: 16px;           // 容器内边距
  --r-inner: max(0px, calc(var(--r) - var(--p)));

  border-radius: var(--r);
  padding: var(--p);

  img { border-radius: var(--r-inner); }
}
```

快查（常用组合）：

| 容器圆角 | 内边距 | 内元素圆角 |
|---|---|---|
| 8px | 4px | 4px |
| 8px | 8px | 0px |
| 12px | 8px | 4px |
| 12px | 12px | 0px |

---

## 5. 圆角系统

### 5.1 Scale（3 档 + 1 展示值）

```scss
$radius-sm:   4px;    // Badge、inline code、Tooltip
$radius-base: 8px;    // 标准：输入框、按钮、卡片、Dropdown、Modal
$radius-lg:   12px;   // 大型浮层（Drawer、大 Modal）
$radius-pill: 50px;   // 「视觉上的全圆」，用于 pill 按钮和 avatar
                      // 50px 不是魔法数字：任何高度 ≤ 50px 的元素
                      // 用此值都能得到真正的全圆角
```

> **为什么不用 `9999px`？**  
> `9999px` 是一个没有物理意义的值，代码中出现时让人不安：「这个数字是怎么来的？」`50px` 有明确语义：「任何高度不超过 50px 的元素，这个值会产生真正的半圆端点。」如果将来某个 pill 元素高度超过了 50px，问题会立刻暴露，迫使开发者重新思考设计，而不是用魔法数字掩盖。

### 5.2 元素圆角对照

| 元素 | 圆角 | 备注 |
|---|---|---|
| `<button>`（标准）| `$radius-base` 8px | |
| `<button>`（pill 主行动）| `$radius-pill` 50px | 仅主行动按钮 |
| `.badge` | `$radius-sm` 4px | 方形徽标，不要 pill |
| `<input>`、`<select>` | `$radius-base` 8px | |
| `<code>`（inline）| `$radius-sm` 4px | |
| `<pre>`（代码块）| `$radius-base` 8px | |
| Tooltip | `$radius-sm` 4px | 小、快、锐 |
| Dropdown menu | `$radius-base` 8px | |
| Modal（标准）| `$radius-base` 8px | |
| Drawer / 大浮层 | `$radius-lg` 12px | |
| Avatar | `$radius-pill` 50px | |
| Switch | `$radius-pill` 50px | |
| 独立图片 | `$radius-base` 8px | |
| 卡片内图片 | `var(--r-inner)`（同心计算）| |

---

## 6. 动效系统

### 6.1 核心原则

1. **可中断**：所有 `transition` 从当前计算值开始；`animation + forwards` 只用于单向入场/离场
2. **尊重 `prefers-reduced-motion`**：全局压缩至 `0.01ms`（非 0，防止状态跳变）
3. **高频操作要短**：2 秒内可重复触发的交互，duration ≤ 120ms
4. **只改必要属性**：hover 状态同时变化的属性 ≤ 2 个

### 6.2 Easing 曲线

```scss
$ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);    // 通用减速
$ease-in-out: cubic-bezier(0.0,  0.0,  0.2,  1.0);     // 元素进入
$ease-in:     cubic-bezier(0.4,  0.0,  1.0,  1.0);     // 元素离开
$ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);     // 弹性（轻微超出）
$ease-snap:   cubic-bezier(0.6,  0.0,  0.0,  1.0);     // 快速吸附
$ease-drop:   cubic-bezier(0.55, 0.0,  1.0,  0.45);    // Modal 关闭·落下感
```

### 6.3 Duration

| 变量 | 值 | 场景 |
|---|---|---|
| `$dur-instant` | `80ms` | 图标状态、:active 颜色 |
| `$dur-fast` | `120ms` | hover（高频）|
| `$dur-normal` | `220ms` | 标准状态切换 |
| `$dur-slow` | `350ms` | 面板展开、元素入场 |
| `$dur-page` | `600ms` | 页面级过渡 |
| `$dur-tint` | `800ms` | 背景染色渗透 |

### 6.4 具体动效规格

#### `hover` 标准

```scss
// 规则：hover 只改 background-color + box-shadow，120ms，$ease-out
article:hover,
a:hover {
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px oklch(0% 0 0 / 0.05);
  transition:
    background-color 120ms $ease-out,
    box-shadow       120ms $ease-out;
}
```

#### Modal 物理开 / 关

```scss
@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

@keyframes modal-out {
  from { opacity: 1; transform: translateY(0)    scale(1); }
  to   { opacity: 0; transform: translateY(20px) scale(0.96); }
}

dialog[open]    { animation: modal-in  350ms $ease-in-out forwards; }
dialog:not([open]) { animation: modal-out 220ms $ease-drop forwards; }
```

> 开：从下方升起（`$ease-in-out` 加速后减速，像被轻轻托起）  
> 关：向下落去（`$ease-drop` 非镜像，遵循重力，不对称）

#### 列表错落入场

```scss
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

li,
article {
  animation: fade-up 400ms $ease-in-out both;
  animation-delay: calc(var(--i, 0) * 50ms);
  
  @for $n from 1 through 8 {
    &:nth-child(#{$n}) { --i: #{$n - 1}; }
  }
}
```

#### 图片 Progressive Blur Reveal

```scss
img {
  filter: blur(12px);
  transform: scale(1.02);  // 补偿 blur 边缘空白
  transition:
    filter    600ms $ease-out,
    transform 600ms $ease-out;

  &.loaded {
    filter: blur(0);
    transform: scale(1);
  }
}
```

#### Icon 状态切换（Blurred Transition）

```scss
.icon {
  transition: filter 80ms $ease-snap, opacity 80ms $ease-snap;

  &[data-switching] {
    filter: blur(3px);
    opacity: 0.7;
  }
}
```

#### 两个 Tooltip 之间的切换

```scss
[role='tooltip'] {
  &[data-state='leaving'] {
    transition: opacity 100ms $ease-in, transform 100ms $ease-in;
    opacity: 0;
    transform: scale(0.95);
  }

  &[data-state='entering'] {
    transition: opacity 150ms $ease-in-out, transform 150ms $ease-in-out;
    opacity: 1;
    transform: scale(1);
  }
}
```

#### SVG 签名动画

```scss
// HTML 中手动测量 path 长度填入 --path-length
.signature path {
  stroke-dasharray:  var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: draw 1200ms $ease-in-out 300ms forwards;
}

@keyframes draw { to { stroke-dashoffset: 0; } }
```

#### Cast Ending（播放结束散场）

```scss
@keyframes cast-fade {
  from { opacity: 1; filter: blur(0);   transform: scale(1); }
  to   { opacity: 0; filter: blur(4px); transform: scale(0.98); }
}

.player[data-state='ended'] img {
  animation: cast-fade 600ms $ease-in 200ms forwards;
}
```

#### Animated Action Button

```scss
button .icon {
  transition: transform 200ms $ease-spring;
}

button:active .icon {
  transform: translateX(4px) scale(0.9);
}

button[data-success] .icon {
  animation: success-pop 400ms $ease-spring forwards;
}

@keyframes success-pop {
  0%   { transform: scale(0.8); opacity: 0.6; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
```

#### Animated State-Based Icons（Play / Pause）

```scss
.icon-toggle {
  position: relative;
  width: 24px;
  height: 24px;

  > * {
    position: absolute;
    inset: 0;
    transition: opacity 150ms $ease-out, transform 150ms $ease-out;
  }

  &[data-state='a'] > :first-child  { opacity: 1; transform: scale(1); }
  &[data-state='a'] > :last-child   { opacity: 0; transform: scale(0.8); }
  &[data-state='b'] > :first-child  { opacity: 0; transform: scale(0.8); }
  &[data-state='b'] > :last-child   { opacity: 1; transform: scale(1); }
}
```

#### Self-Explanatory Load Bar

```scss
progress {
  appearance: none;
  height: 2px;
  background: var(--color-surface);
  border-radius: 1px;
  overflow: hidden;
  border: none;

  &::-webkit-progress-bar   { background: var(--color-surface); }
  &::-webkit-progress-value {
    background: var(--color-accent);
    transition: width 300ms $ease-in-out;
  }
  &::-moz-progress-bar {
    background: var(--color-accent);
    transition: width 300ms $ease-in-out;
  }
}

// Indeterminate 状态
progress:not([value]) {
  &::after {
    content: '';
    display: block;
    height: 100%;
    background: var(--color-accent);
    animation: progress-slide 1.5s $ease-out infinite;
  }
}

@keyframes progress-slide {
  0%   { transform: translateX(-100%) scaleX(0.4); }
  60%  { transform: translateX(100%)  scaleX(0.6); }
  100% { transform: translateX(100%)  scaleX(0.4); }
}
```

### 6.5 Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
}
```

---

## 7. 材质与层次

### 7.1 Z-index（0–5）

```scss
$z-0: 0;   // 正常文档流
$z-1: 1;   // 稍微浮起（sticky header、hover 状态的元素）
$z-2: 2;   // Dropdown、浮动工具栏
$z-3: 3;   // Modal 遮罩（overlay）
$z-4: 4;   // Modal 内容、Drawer
$z-5: 5;   // Toast、Tooltip（始终最上层）
```

> **为什么 0–5？**  
> 当 z-index 用到三位数（100、200、300）时，说明层级关系没被真正理解，只是在数字上「跑赢」对手。0–5 强迫开发者梳理真实的层叠关系：每一层都有名字，每个名字都有具体含义。

### 7.2 阴影系统

只用黑色透明，不用有色阴影：

| 档位 | 值 | 用途 |
|---|---|---|
| `shadow-sm` | `0 1px 3px oklch(0% 0 0 / 0.05)` | 轻微浮起 |
| `shadow-md` | `0 3px 12px oklch(0% 0 0 / 0.08), 0 1px 3px .../0.04` | Dropdown、hover 卡片 |
| `shadow-lg` | `0 8px 32px oklch(0% 0 0 / 0.10), 0 2px 8px .../0.05` | Modal |

Dark mode 阴影 opacity 减半。

### 7.3 图片 Inset Ring

```scss
img {
  box-shadow: inset 0 0 0 1px oklch(0% 0 0 / 0.08);

  @media (prefers-color-scheme: dark) {
    box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.10);
  }
}
```

不用 `border`——`border` 改变盒模型尺寸，`inset box-shadow` 不占空间，边界随背景自然融合。

### 7.4 Liquid Glass（仅限特定容器）

**允许使用的位置**：
- `<header>`（顶部导航）
- 播放控制器
- Switch 的滑块
- 浮动操作面板

**明确禁止用于**：`<article>`、`<section>`、`<button>`（普通）、`<input>`——这些走 Yohaku 的「纸质感」，不走玻璃。

```scss
.glass {
  --glass-l:  100%;
  --glass-a:  0.72;

  background-color: oklch(var(--glass-l) 0.002 260 / var(--glass-a));
  backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  box-shadow:
    inset 0  1px 0 oklch(100% 0 0 / 0.25),
    inset 0 -1px 0 oklch(0%   0 0 / 0.06),
          0  2px 8px oklch(0% 0 0 / 0.08);

  @media (prefers-color-scheme: dark) {
    --glass-l: 15%;
    --glass-a: 0.65;

    box-shadow:
      inset 0  1px 0 oklch(100% 0 0 / 0.12),
      inset 0 -1px 0 oklch(0%   0 0 / 0.20),
            0  2px 8px oklch(0% 0 0 / 0.20);
  }
}
```

### 7.5 Progressive Blur Edge（`mask-image`）

```scss
// 底部渐隐（媒体封面向背景过渡）
.fade-bottom {
  mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
}

// 四周渐隐
.fade-edges {
  mask-image: radial-gradient(ellipse 80% 70% at center, black 45%, transparent 100%);
}
```

快速滚动时 blur 减弱（Scroll-Driven Animations）：

```scss
@keyframes reduce-blur {
  from { --blur: 8px; }
  to   { --blur: 1px; }
}

.blur-edge {
  filter: blur(var(--blur, 8px));
  animation: reduce-blur linear both;
  animation-timeline: scroll();
  animation-range: 0px 80px;
}
```

---

## 8. 组件规范

### 8.1 关于卡片的慎用原则

Yohaku 的精神是**内容本身即结构**——留白、行距、标题层级足以建立秩序，不需要把内容「装进盒子」来制造层次感。

**卡片（任何带明显 `background` + `border-radius` + `padding` 的容器）只在以下场景使用**：

- ✅ 媒体网格（音乐专辑、照片列表）——需要「可点击的独立单元」
- ✅ 数据面板（仪表盘 widget）——需要视觉区隔
- ✅ 高亮提示框（callout、tip）——需要与正文流区分

**明确禁止用卡片**：

- ❌ 文章列表（用 `<article>` + 间距 + 分隔线）
- ❌ 导航菜单（用 `<nav>` + 结构）
- ❌ 表单（`<form>` 直接在页面上）
- ❌ 任何可以用「增加间距」解决视觉区隔的地方

### 8.2 `<article>` 文章列表（替代卡片）

```scss
article + article {
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  margin-top: 24px;
}

article {
  transition:
    background-color 120ms $ease-out,
    padding          120ms $ease-out;

  &:hover {
    background-color: var(--color-surface);
    padding-inline: 12px;
    margin-inline: -12px;
    border-radius: $radius-base;
  }
}
```

### 8.3 `.badge`

唯一强制使用 class 的内联元素（无对应语义标签，且频繁复用）：

```scss
.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: $radius-sm;
  padding: 2px 6px;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  background: transparent;
  user-select: none;

  &[data-variant='accent'] {
    color: var(--color-accent);
    border-color: currentColor;
    background: var(--color-accent-dim);
  }

  &[data-variant='warning'] {
    color: oklch(52% 0.18 55);
    border-color: currentColor;
    background: oklch(97% 0.04 55);
  }
}
```

### 8.4 `<button>` 按钮

```scss
button {
  // 基础 reset
  appearance: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: $radius-base;
  padding: 8px 16px;
  transition:
    background-color 120ms $ease-out,
    color            120ms $ease-out,
    transform         80ms $ease-snap;

  &:active { transform: scale(0.97); }

  // Primary
  &[data-variant='primary'] {
    background: var(--color-accent);
    color: oklch(99% 0 0);
    border-radius: $radius-pill;

    &:hover { background: oklch(47% 0.18 220); }
  }

  // Ghost
  &[data-variant='ghost'] {
    background: transparent;
    color: var(--color-text-muted);

    &:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }
  }

  // Disabled + Shake
  &:disabled {
    opacity: 0.45;
    pointer-events: none;
    cursor: not-allowed;
  }

  // 防连点
  &[aria-busy='true'] {
    pointer-events: none;
    opacity: 0.7;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-4px); }
  40%       { transform: translateX(4px); }
  60%       { transform: translateX(-3px); }
  80%       { transform: translateX(3px); }
}

// 注：shake 动画需要 JS 动态添加 class / attribute 触发
// CSS 层面：禁用按钮的视觉反馈
button:disabled:active {
  animation: shake 300ms $ease-out;
  pointer-events: auto;  // 临时允许触发，仅用于 shake 反馈
}
```

**更大点击区域**（视觉尺寸不变）：

```scss
button.icon-only {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
}
```

**Morphing Button → Input**：

```scss
.search-btn {
  width: 36px;
  overflow: hidden;
  border-radius: $radius-pill;
  transition:
    width         300ms $ease-in-out,
    border-radius 300ms $ease-in-out;

  &[aria-expanded='true'] {
    width: 220px;
    border-radius: $radius-base;
  }
}
```

### 8.5 `<input>` / `<textarea>`

```scss
input, textarea, select {
  font-family: inherit;
  font-size: var(--text-base);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-base;
  padding: 8px 12px;
  outline: none;
  transition:
    border-color 120ms $ease-out,
    box-shadow   120ms $ease-out;

  &:focus-visible {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-dim);
  }

  &::placeholder {
    color: var(--color-text-muted);
    opacity: 0.6;
  }
}

// 软键盘弹出时不遮挡表单底部
form footer,
.form-actions {
  padding-bottom: max(16px, env(keyboard-inset-height, 0px));
  transition: padding-bottom 300ms $ease-out;
}
```

### 8.6 `<dl>` 数据行（替代 `.row`）

Tidal 风格数据密度：

```scss
dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 0;
}

dt {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
  line-height: 1.5;
}

dd {
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--color-text);
  text-align: right;
  line-height: 1.5;
  margin: 0;
}

// 分隔线：用 border-top 而不是 margin
dl > dt:not(:first-child),
dl > dd:not(:nth-child(2)) {
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
  margin-top: 8px;
}
```

---

## 9. 交互细节图鉴

### 9.1 光学修正（Blur Trick for Optical Fit）

```scss
.icon-optical {
  filter: drop-shadow(0 0 6px oklch(60% 0.1 220 / 0.2));
}
```

### 9.2 Liquid Glass Switcher

```scss
.switcher {
  position: relative;
  display: flex;
  background: oklch(95% 0.002 260 / 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: $radius-pill;
  padding: 3px;
  gap: 0;

  button {
    flex: 1;
    background: transparent;
    border-radius: calc($radius-pill - 3px);
    border: none;
    transition: color 150ms $ease-out;
    z-index: 1;
  }

  &::after {  // 滑块
    content: '';
    position: absolute;
    inset: 3px;
    width: calc(50% - 3px);
    background: oklch(100% 0 0 / 0.9);
    border-radius: calc($radius-pill - 3px);
    box-shadow: shadow-sm;
    transition: transform 300ms $ease-spring;
  }

  &[data-active='1']::after { transform: translateX(0); }
  &[data-active='2']::after { transform: translateX(100%); }
}
```

### 9.3 Colorful Cursor Blink

```scss
input, textarea, [contenteditable] {
  caret-color: var(--color-accent);
}
```

### 9.4 人名 Hover 特殊光标

```scss
[data-type='person'] {
  cursor: context-menu;
}
```

### 9.5 Filepath 截断（保留文件名）

```scss
.filepath {
  display: flex;
  overflow: hidden;
  font-family: $font-mono;
  font-size: var(--text-xs);

  span:first-child {  // 目录部分
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;
    unicode-bidi: plaintext;
    color: var(--color-text-muted);
  }

  span:last-child {   // 文件名
    flex-shrink: 0;
    color: var(--color-text);
  }
}
```

### 9.6 Color String Preview

```scss
// <span class="color-swatch" style="--c: #ff6b6b">#ff6b6b</span>
.color-swatch::before {
  content: '';
  display: inline-block;
  width: 0.7em;
  height: 0.7em;
  border-radius: 2px;
  background: var(--c);
  margin-right: 0.3em;
  vertical-align: middle;
  box-shadow: inset 0 0 0 1px oklch(0% 0 0 / 0.15);
}
```

### 9.7 Footer 导航 Active 状态

```scss
footer nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 120ms $ease-out;

  &[aria-current='page'] {
    color: var(--color-accent);
    font-weight: 600;

    &::after {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      margin: 2px auto 0;
      animation: dot-in 200ms $ease-spring forwards;
    }
  }
}

@keyframes dot-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
```

### 9.8 Overscroll Bouncing

```scss
html { overscroll-behavior-y: contain; }

.scroll-area {
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
```

### 9.9 Animated Icon Picker

```scss
.swatch {
  transition:
    background-color 200ms $ease-out,
    transform        120ms $ease-spring,
    box-shadow       120ms $ease-out;

  &[aria-checked='true'] {
    transform: scale(1.15);
    box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px currentColor;
  }

  &:hover:not([aria-checked='true']) {
    transform: scale(1.08);
  }
}
```

### 9.10 Smooth Highlight Transition

```scss
:target,
[data-highlight] {
  background-color: var(--color-accent-dim);
  border-radius: $radius-sm;
  transition: background-color 300ms $ease-out;
}
```

### 9.11 Contact 替代 Follow Us

```scss
a[href^='mailto'],
a[data-contact] {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 120ms $ease-out;

  &::after {
    content: ' ↗';
    font-size: 0.7em;
    display: inline-block;
    transition: transform 120ms $ease-spring;
  }

  &:hover {
    color: var(--color-text);
    &::after { transform: translate(2px, -2px); }
  }
}
```

### 9.12 Footer Easter Egg

```scss
footer [data-easter] {
  cursor: pointer;
  user-select: none;

  &:active {
    animation: easter 200ms $ease-spring;
  }
}

@keyframes easter {
  0%, 100% { transform: rotate(0) scale(1); }
  50%       { transform: rotate(15deg) scale(1.08); }
}
```

---

## 10. 响应式策略

### 10.1 断点（Mobile First）

```scss
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;
```

### 10.2 Not Available on Mobile

```scss
[data-desktop-only] {
  @media (max-width: #{$bp-md - 1px}) { display: none; }
}
```

### 10.3 Format Detection & Tel/Mailto

HTML：

```html
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<a href="tel:+12223334444">(+1) 222 333 4444</a>
<a href="mailto:hi@example.com">hi@example.com</a>
```

CSS（防 iOS 蓝色污染）：

```scss
a[href^='tel'],
a[href^='mailto'] {
  color: inherit;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}
```

---

## 11. 可访问性与精修细节

### 11.1 Focus

```scss
:focus          { outline: none; }
:focus-visible  {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: inherit;
}
```

### 11.2 对比度要求

| 文字类型 | 最低对比度 | 目标 |
|---|---|---|
| 正文（`text-base`）| 4.5:1 | 7:1 |
| 大文字（`text-xl+`）| 3:1 | 4.5:1 |
| UI 边框 | 3:1 | — |
| 装饰性 | — | — |

### 11.3 语义驱动样式

```scss
[aria-disabled='true']  { opacity: 0.45; pointer-events: none; }
[aria-expanded='false'] + * { display: none; }
[aria-expanded='true']  + * { display: block; }
[aria-current='page']   { color: var(--color-accent); font-weight: 600; }
[aria-busy='true']      { pointer-events: none; }
```

### 11.4 `user-select` 禁止选择规范

**原则**：凡是「读起来会自然想复制」的内容允许选择，凡是「选到了只会打断思路」的内容禁止选择。

| 元素 | `user-select` | 理由 |
|---|---|---|
| 正文 `<p>`、`<article>` | `auto`（默认）| 允许复制阅读内容 |
| 代码 `<code>`、`<pre>` | `auto` | 允许复制代码 |
| `<nav>` 导航链接 | `none` | 点击导航时选中文字很烦 |
| `<button>` | `none` | 连击时文字被选中干扰交互 |
| `.badge` | `none` | 标签不需要复制 |
| `<label>` | `none` | 点击 label 触发 input，不应选中文字 |
| `<th>`、表格列头 | `none` | 点击排序时不应选中 |
| `<time>` 时间戳 | `none` | 时间戳阅读即可，选中无意义 |
| 图标、装饰性文字 | `none` | |
| 价格数字、统计数值 | `auto` | 用户可能需要复制价格 |
| 标题 `<h1>`–`<h3>` | `auto` | 允许复制标题文字 |
| `<figcaption>` | `auto` | 说明文字允许复制 |
| `<blockquote>` | `auto` | 引言值得复制 |

```scss
// 全局基础
nav, button, label, th,
.badge, time, [role='img'] {
  user-select: none;
  -webkit-user-select: none;
}

// 明确保留选择权
p, article, code, pre, h1, h2, h3,
blockquote, figcaption, dd {
  user-select: text;
}
```

### 11.5 文字选中（Text Selection）

**原则**：选中时用户需要知道「这块内容被标记了」，但不应该因为颜色太重而打断阅读节奏。Accent 色低透明度是最自然的选择——它和系统语言一致，又带着本系统的气质。

```scss
::selection {
  background: oklch(52% 0.18 220 / 0.15);
  color: inherit;  // 永远不改文字颜色
}
```

**不同内容区域的选中颜色**：

```scss
// 正文（默认）
::selection {
  background: oklch(52% 0.18 220 / 0.15);
  color: inherit;
}

// 代码块：背景本身有颜色，选中需更深才可见
pre::selection,
pre *::selection,
code::selection {
  background: oklch(52% 0.18 220 / 0.28);
  color: inherit;
}

// blockquote（Gilda Display Serif 区域）
// 暖色调与 Serif 的温度感呼应
blockquote::selection,
blockquote *::selection {
  background: oklch(72% 0.12 55 / 0.20);  // 暖琥珀
  color: inherit;
}
```

> **为什么不改 `color`？**  
> 一旦 `::selection` 设置了 `color`，对比度就完全脱离了系统控制。如果页面某处文字是浅色（比如 hero 背景上的白字），强制 `color: var(--color-text)` 会让它在选中时突然变黑，视觉上非常突兀。`color: inherit` 让选中颜色只叠加在现有文字上，永远安全。

---

### 11.6 光标系统（Custom Cursor）

**核心判断**：不替换系统默认箭头光标。系统光标经过操作系统级渲染优化，响应速度在 1ms 以内，任何 CSS cursor 替换都会引入感知延迟。「眼前一亮」不靠光标形状，靠的是每个状态下光标语义的精确和 hover 过渡的品质。

#### 状态语义表

| 状态 | `cursor` 值 | 场景 | 说明 |
|---|---|---|---|
| 默认 | `default`（系统） | 页面背景、非交互元素 | 不替换 |
| 可点击 | `pointer`（自定义 SVG）| `<a>`、`<button>`、`.badge` | 见下方 SVG 规格 |
| 文本输入 | `text`（系统）| `<input>`、`<textarea>`、`[contenteditable]` | 不替换，用 `caret-color` 着色 |
| 人名 | `context-menu`（系统）| `[data-type='person']` | 系统自带小问号图标，语义清晰 |
| 拖拽就绪 | `grab`（系统）| 可拖动容器 | 系统光标质感已足够 |
| 拖拽中 | `grabbing`（系统）| 拖动进行时 | |
| 禁用 | `not-allowed`（系统）| `[disabled]`、`[aria-disabled]` | |
| 十字精准 | `crosshair`（系统）| 数据图表、画布类 | |
| 文本 + 链接混合区 | `pointer`（自定义）| 卡片整体可点击时 | |

#### Pointer 光标 SVG 规格

只替换 `pointer`——它是出现频率最高的自定义光标，也是最值得打磨的。

设计原则：
- 形状：实心圆，无描边，无阴影
- 尺寸：16×16px，圆半径 5px（不要大，大了会遮挡内容）
- 颜色：`oklch(20% 0.005 260)`（light mode）/ `oklch(90% 0.005 260)`（dark mode）
- 热点：圆心（8, 8）

```scss
// Light mode pointer cursor（base64 编码的内联 SVG）
$cursor-pointer-light: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='5' fill='oklch(20%25 0.005 260)' fill-opacity='0.85'/%3E%3C/svg%3E") 8 8, pointer;

// Dark mode pointer cursor
$cursor-pointer-dark: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='5' fill='oklch(90%25 0.005 260)' fill-opacity='0.85'/%3E%3C/svg%3E") 8 8, pointer;

// 应用
a, button, [role='button'], label, .badge, summary {
  cursor: $cursor-pointer-light;

  @media (prefers-color-scheme: dark) {
    cursor: $cursor-pointer-dark;
  }
}
```

> **为什么是实心圆而不是箭头变体？**  
> 箭头光标的「方向感」是操作系统的视觉语言——替换它反而产生认知摩擦。圆点没有方向，它只传达「这里有东西」，是一种更中性、更精准的语义。Figma、Linear 在特定状态下用的都是这个思路。

#### 输入光标（Caret）

```scss
input, textarea, [contenteditable] {
  caret-color: var(--color-accent);
  // 光标颜色 = accent，在白色页面上极其精准，是最「眼前一亮」的光标细节
}
```

#### 光标 Follower（需要极少量 JS）

如果需要「鼠标跟随圆点」这类效果（在 portfolio / 展示页面中非常有冲击力），CSS 层只定义元素样式，JS 仅负责更新坐标：

```scss
// HTML: <div class="cursor-follower" aria-hidden="true"></div>
.cursor-follower {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50px;
  background: var(--color-text);
  opacity: 0.5;
  pointer-events: none;
  z-index: $z-5;

  // 跟随时的平滑延迟（不是 transition——transition 会产生追赶感）
  // JS 用 lerp 插值控制，CSS 只管样式
  transform: translate(-50%, -50%);
  will-change: transform;

  // hover 到可点击元素时放大
  &[data-hover='true'] {
    width: 24px;
    height: 24px;
    opacity: 0.15;
    background: var(--color-accent);
    transition:
      width   200ms $ease-spring,
      height  200ms $ease-spring,
      opacity 200ms $ease-out,
      background 150ms $ease-out;
  }

  @media (prefers-reduced-motion: reduce) { display: none; }
  @media (hover: none) { display: none; }  // 触屏设备隐藏
}
```

> **性能注意**：follower 元素只用 `transform` 移动（GPU 加速），不用 `top`/`left`。JS 侧用 `requestAnimationFrame` + lerp，不用 `mousemove` 直接设置。CSS 声明 `will-change: transform` 提前提升为合成层。

---

### 11.7 滚动条（Scrollbar）

**原则**：滚动条是「我还有更多内容」的信号，不是装饰带。目标状态：
- 静止时：几乎不可见（track 透明，thumb 极淡）
- hover 容器时：thumb 浅浅显现
- 拖动时：thumb 清晰，给操作感
- 不影响布局：用 overlay scrollbar 思路

#### 全局滚动条

```scss
// Firefox（标准 API）
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;  // 默认隐藏
}

// hover 时显现（Firefox 暂不支持 :hover 切换 scrollbar-color，以下为 WebKit 方案）

// WebKit（Chrome / Safari / Edge）
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 50px;
  transition: background 150ms $ease-out;
}

// hover 到可滚动容器时显现 thumb
*:hover::-webkit-scrollbar-thumb {
  background: var(--color-border);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

::-webkit-scrollbar-thumb:active {
  background: var(--color-text-muted);
}

::-webkit-scrollbar-corner {
  background: transparent;
}
```

#### 特殊滚动容器（代码块、侧边栏）

代码块的滚动条需要更明显——内容密度高，用户需要明确知道可以横向滚动：

```scss
pre::-webkit-scrollbar {
  height: 4px;
}

pre::-webkit-scrollbar-thumb {
  background: var(--color-border);  // 代码块内始终可见，不需要 hover 才出现
  border-radius: 50px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

#### 滚动条颜色的 Dark Mode 适配

```scss
@media (prefers-color-scheme: dark) {
  *:hover::-webkit-scrollbar-thumb {
    // --color-border 在 dark mode 已经自动切换为深色主题值
    // 无需额外覆盖，semantic token 自动处理
    background: var(--color-border);
  }
}
```

#### Overlay Scrollbar 行为

```scss
// 确保滚动条是 overlay 类型（不挤压内容宽度）
// macOS / iOS 默认已是 overlay；Windows 需要额外声明
@supports (overflow: overlay) {
  .scroll-area {
    overflow: overlay;  // 已废弃但仍广泛支持
  }
}

// 现代替代方案：scrollbar-gutter
.scroll-area {
  scrollbar-gutter: stable both-edges;  // 预留滚动条空间，防止内容跳动
  overflow-y: auto;
}
```

#### 滚动条「防闪」（Prevent Layout Shift）

```scss
// 固定布局中，滚动条出现/消失会让内容左右跳动
// 在 <html> 上声明，始终预留空间
html {
  scrollbar-gutter: stable;
}
```

> **为什么 thumb 默认透明而不是直接隐藏（`display: none`）？**  
> `display: none` 会让滚动条在出现时「跳出来」，没有过渡感。透明 → 有色的 `background` 过渡才能做出「渐现」效果，用户感知到的是「轻轻浮现」而不是「突然出现」。

---

## 12. SCSS 变量总表

```scss
// ════════════════════════════════════════════
// asong56 Design Manual — Token Reference
// ════════════════════════════════════════════

// ── COLOR ────────────────────────────────────
$accent-hue: 220;
$accent-c:   0.18;
$accent-l:   52%;

// ── TYPOGRAPHY ───────────────────────────────
$font-sans:
  'Switzer', 'Open Sans',
  ui-sans-serif, 'Segoe UI', system-ui, sans-serif;

$font-serif:
  'Gilda Display',
  Georgia, serif;

$font-mono:
  'Monaspace Neon',
  ui-monospace, 'Cascadia Code', monospace;

$font-cjk:
  'OPPO Sans', 'PingFang SC',
  'Microsoft YaHei', sans-serif;

// ── SPACING ──────────────────────────────────
// 4, 8, 12, 16, 24, 32, 48, 96 px

// ── RADIUS ───────────────────────────────────
$radius-sm:   4px;
$radius-base: 8px;
$radius-lg:   12px;
$radius-pill: 50px;

// ── EASING ───────────────────────────────────
$ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
$ease-in-out: cubic-bezier(0.0,  0.0,  0.2,  1.0);
$ease-in:     cubic-bezier(0.4,  0.0,  1.0,  1.0);
$ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);
$ease-snap:   cubic-bezier(0.6,  0.0,  0.0,  1.0);
$ease-drop:   cubic-bezier(0.55, 0.0,  1.0,  0.45);

// ── DURATION ─────────────────────────────────
$dur-instant: 80ms;
$dur-fast:    120ms;
$dur-normal:  220ms;
$dur-slow:    350ms;
$dur-page:    600ms;
$dur-tint:    800ms;

// ── Z-INDEX ──────────────────────────────────
$z-0: 0;   // 正常文档流
$z-1: 1;   // sticky / hover 浮起
$z-2: 2;   // Dropdown、浮动工具栏
$z-3: 3;   // Modal 遮罩
$z-4: 4;   // Modal / Drawer
$z-5: 5;   // Toast / Tooltip

// ── BREAKPOINTS ──────────────────────────────
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;

// ── CONTENT WIDTH ────────────────────────────
$w-text: 68ch;
$w-wide: 860px;
$w-full: 1100px;
```

---

## 附录：细节清单对照

| 细节条目 | 手册章节 | 状态 |
|---|---|---|
| tinted background | §2.5 | ✅ CSS 接口 |
| describe link action | §3.7 | ✅ `↗` 附加 |
| Not Available on Mobile Hint | §10.2 | ✅ |
| reduce edge blur on fast scroll | §7.5 | ✅ scroll-timeline |
| blurred icon transition | §6.4 | ✅ |
| blurred image appearing | §6.4 | ✅ |
| progressive blur edge | §7.5 | ✅ mask-image |
| animated signature | §6.4 | ✅ stroke-dashoffset |
| special text selection style | §11.5 | ✅ ::selection |
| media response to theme mode | §2.4 | ✅ |
| prevent continuous click | §8.4 | ✅ aria-busy |
| footer Easter egg | §9.12 | ✅ |
| mailto link | §10.3 | ✅ |
| inset ring | §7.3 | ✅ |
| Prevent Layout Shift Font Weight | §3.4 | ✅ ::after 占位 |
| cast ending | §6.4 | ✅ |
| larger hit area | §8.4 | ✅ ::after inset |
| shaked disabled button | §8.4 | ✅ |
| drop www prefix | §3.7 | ✅ CSS 接口 |
| Blur Trick Optical Fit | §9.1 | ✅ |
| Closing Modal Respects Physics | §6.4 | ✅ 非对称 easing |
| Outer/Inner Border Radius | §4.5 | ✅ |
| animated color change icon picker | §9.9 | ✅ |
| morphing button to input | §8.4 | ✅ |
| overscroll bouncing | §9.8 | ✅ |
| smooth highlight transition | §9.10 | ✅ |
| special cursor person name | §9.4 | ✅ |
| Animate transition two tooltips | §6.4 | ✅ |
| Interruptible Animation | §6.1 | ✅ |
| animated action button | §8.4 | ✅ |
| self-explanatory load bar | §8.5（progress）| ✅ |
| staggered animation | §6.4 | ✅ |
| animated state based icons | §6.4 | ✅ |
| form respects keyboard | §8.5 | ✅ env() |
| colorful cursor blink | §9.3 | ✅ caret-color |
| color string preview | §9.6 | ✅ |
| connect/contact vs follow | §9.11 | ✅ |
| filepath truncating | §9.5 | ✅ direction:rtl |
| liquid glass switcher | §9.2 | ✅ |
| active state footer nav | §9.7 | ✅ |
| dynamic theme color | §2.6 | ✅ |
| Reduced Animation Frequent | §6.1 §6.3 | ✅ |
| format-detection meta | §10.3 | ✅ |
| user-select 禁止选择规范 | §11.4 | ✅ **新增** |
| 卡片慎用原则 | §8.1 | ✅ **新增** |
| 语义 HTML 优先 | §1.4 | ✅ **新增** |
| z-index 0–5 | §7.1 | ✅ |
| custom cursor system | §11.6 | ✅ SVG data URI |
| cursor follower | §11.6 | ⚠️ CSS 定义，需极少量 JS |
| scrollbar design | §11.7 | ✅ |
| text selection colors | §11.5 | ✅ 分区域规定 |
| caret-color accent | §11.6 | ✅ |
| chat minimap | — | ⚠️ 需 JS |
| ToC visibility active items | — | ⚠️ 需 IntersectionObserver |
| inline unit conversion | — | ⚠️ 需 JS tooltip |
| searchable collapsed content | — | ⚠️ 需 JS |
| pluralized labels | — | — 模板层 |
| pick date with natural language | — | — JS 层 |
| interactive 404 | — | — 独立页面 |

> ✅ 已完整规定 · ⚠️ CSS 接口已定义，逻辑需 JS · — 非 CSS 层

---

*asong56 Design Manual · v0.3*

---

## 13. 光标、滚动条与选中样式

### 13.1 自定义光标

#### 设计原则

光标是最后一个被注意到、第一个影响「手感」的元素。目标：

- **比系统光标更轻**：笔画细 1px，整体缩小约 15%，在高分屏上更精准
- **黑底白描边**：任何背景下清晰，不依赖颜色传达信息
- **不引入动画**：纯 CSS 光标是静态 SVG，强行加动效需要 JS 且拖慢速度——不做
- **只在有语义时改变形状**：不为了「好看」乱换光标，每种形状都有明确含义

#### 光标类型与场景

| 光标类型 | 场景 | 实现 |
|---|---|---|
| 自定义箭头 | 默认（非文字、非可点击区域）| SVG data URI |
| 系统 `text` | 可选中文字区域 | 保留系统 I-beam（已经是最优解）|
| 系统 `pointer` | `<a>`、`<button>` | 保留系统手形（用户认知一致性）|
| 自定义十字 | 数据图表、精确操作区域 | SVG data URI |
| `context-menu` | 人名（`[data-type='person']`）| 系统内置，表示「可查看信息」|
| `grab` / `grabbing` | 可拖拽元素 | 系统内置 |
| `zoom-in` | 可放大图片 | 系统内置 |
| `not-allowed` | 禁用元素（不用 `no-drop`）| 系统内置 |

#### SVG 光标设计规格

**默认光标（refined arrow）**：

```
尺寸：20 × 20px（系统约 24px，缩小约 15%）
热点：0, 0（左上角尖端）
笔画：fill #0a0a0a，stroke white 1.5px
形状：标准箭头角度，但右侧边缘稍内收，尾部更短
```

```scss
// Base64 编码后约 220 字节，对性能无影响
$cursor-default: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M2 2l5.5 14 2.5-4.5 4.5 2.5-2.5-11z' fill='%230a0a0a' stroke='white' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 0 0, default;

// 精确操作十字（数据区域、图表）
$cursor-precise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%230a0a0a'/%3E%3Cline x1='10' y1='2' x2='10' y2='8' stroke='%230a0a0a' stroke-width='1.5'/%3E%3Cline x1='10' y1='12' x2='10' y2='18' stroke='%230a0a0a' stroke-width='1.5'/%3E%3Cline x1='2' y1='10' x2='8' y2='10' stroke='%230a0a0a' stroke-width='1.5'/%3E%3Cline x1='12' y1='10' x2='18' y2='10' stroke='%230a0a0a' stroke-width='1.5'/%3E%3C/svg%3E") 10 10, crosshair;
```

#### 全局应用

```scss
// 页面默认光标换成精制版
html {
  cursor: $cursor-default;
}

// 文字区域：保留系统 I-beam（最优解，不覆盖）
p, article, blockquote, li, h1, h2, h3,
[contenteditable], input, textarea {
  cursor: text;
}

// 可点击元素：保留系统 pointer（认知一致性）
a, button, label, [role='button'],
summary, [tabindex]:not([tabindex='-1']) {
  cursor: pointer;
}

// 人名：context-menu 表示「点击可查看信息」
[data-type='person'] {
  cursor: context-menu;
}

// 精确操作区域（图表、数据可视化）
[data-cursor='precise'],
canvas,
.chart {
  cursor: $cursor-precise;
}

// 可拖拽
[draggable='true'] {
  cursor: grab;

  &:active { cursor: grabbing; }
}

// 禁用
[disabled],
[aria-disabled='true'] {
  cursor: not-allowed;
}

// 可放大图片
figure img[data-zoomable] {
  cursor: zoom-in;
}
```

#### Dark Mode 光标适配

系统光标自动适配深色模式，但自定义 SVG 的 `stroke: white` 在浅色背景上已足够（白色描边确保任何背景都可见）。不需要 dark mode 专用版本。

> **为什么不做「小圆点」跟随光标？**  
> 跟随光标的小圆点需要 JS `mousemove` 事件驱动，且每帧更新 `transform`——即便用 `will-change: transform` 优化，在慢速滚动时仍有约 1 帧延迟，破坏「精准」感。本系统选择在光标形状本身上下功夫，而不是在光标周围加装饰。

---

### 13.2 滚动条

#### 设计原则

- **细**：6px（垂直），4px（水平）
- **透明轨道**：平时几乎不可见，不抢占视觉
- **语境色**：颜色跟随 `--color-border`，自然融入界面
- **hover 深色**：鼠标靠近时加深，给操作反馈
- **圆角**：`border-radius: 3px`（全圆）

#### 实现

```scss
// ── 现代标准（Firefox + Chrome 121+）────────────────
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

// ── Webkit 精细控制（Safari + 旧版 Chrome）──────────
::-webkit-scrollbar {
  width: 6px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
  transition: background 120ms ease;  // 注：部分浏览器忽略此 transition
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

// ── 特定容器：更细的滚动条 ────────────────────────────
// 用于 modal、dropdown、代码块内部——更细以减少视觉干扰
dialog,
[role='dialog'],
.dropdown,
pre {
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 3px;
  }
}

// ── 覆盖浏览器默认的「永远显示」行为 ────────────────────
// macOS 默认只在滚动时显示，Windows 默认常显——统一用 overlay
.scroll-area {
  overflow: auto;
  overflow: overlay;  // Chrome 支持，使滚动条浮在内容上方，不占宽度
  // Firefox 不支持 overlay，回落到 auto（轻微宽度差异可接受）
}
```

#### 场景差异

| 场景 | 宽度 | 颜色 | 特殊处理 |
|---|---|---|---|
| 页面主滚动条 | 6px | `--color-border` | 无 |
| Modal / Drawer 内部 | 3px | `--color-border` | 更细，不喧宾夺主 |
| `<pre>` 代码块 | 3px | `--color-border` | 水平滚动条也 3px |
| 数据表格 | 4px | `--color-border` | 水平方向主要 |

> **关于 macOS overlay scrollbar**：macOS 默认滚动条是 overlay 模式（半透明，不占空间，只在滚动时出现）。这个行为完全不需要 CSS 干预，是最理想的状态。上面的自定义主要针对 Windows（默认常显且占 15–17px 宽度）。

---

### 13.3 选中样式

#### 技术边界

`::selection` 只支持：
- `background-color`
- `color`
- `text-shadow`（部分浏览器）

不支持 `border`、`border-radius`、`outline`、`box-shadow`——无法做「圆角选中框」等效果。

#### 设计决策

在这个约束下，「好看」靠两件事：
1. **选中色与 accent 一致**：不用浏览器默认的蓝色，用系统的 `--color-accent-dim`
2. **正文和代码区分**：代码选中时背景稍深，给「选中了语法单元」的感觉

```scss
// ── 全局选中样式 ──────────────────────────────────────
::selection {
  background-color: var(--color-accent-dim);
  color: var(--color-text);
}

// ── 代码块选中：稍深，强调「选中了代码」────────────────
pre ::selection,
code ::selection {
  background-color: oklch(52% 0.18 220 / 0.25);  // accent 的 25% 透明
  color: inherit;
}

// ── Serif 引言选中：同步 accent 色 ─────────────────────
blockquote ::selection {
  background-color: var(--color-accent-dim);
  color: var(--color-text);
}
```

#### Dark Mode 选中色

```scss
@media (prefers-color-scheme: dark) {
  ::selection {
    background-color: var(--color-accent-dim);  // 已在 §2.4 适配 dark
    color: var(--color-text);
  }

  pre ::selection,
  code ::selection {
    background-color: oklch(60% 0.16 220 / 0.30);  // dark accent 的 30% 透明
  }
}
```

#### 禁止选中的元素回顾（见 §11.4）

选中样式只对「允许选中」的元素有意义。确认 `user-select: none` 已覆盖 `nav`、`button`、`.badge`、`time`、`label` 等。

---

### 13.4 三者联动的整体感

光标 + 滚动条 + 选中色，这三个细节的颜色应来自同一套系统：

| 细节 | 颜色来源 | 值 |
|---|---|---|
| 光标填充 | 固定黑（任何主题）| `#0a0a0a` + `white` 描边 |
| 滚动条 thumb | `--color-border`（跟随主题）| n-2 档 |
| 滚动条 hover | `--color-text-muted`（跟随主题）| n-3 档 |
| 选中背景 | `--color-accent-dim`（唯一彩色）| accent 低饱和版 |
| 代码选中 | `accent / 0.25`（稍深）| — |

> 光标用固定黑而不是主题色，是因为光标需要在任何背景下清晰——包括图片、视频、渐变背景上。选中色用 accent 是因为这是界面中唯一彩色，在白色选中背景上高亮文字的那一刻，用户「看到了系统的颜色」，而不是浏览器的蓝色。
