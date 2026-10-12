---
name: vela-android-native-ui
description: 小米 Vela 手环与手表 JS 快应用 UI 设计和实现 Skill。适用于控件展示 Demo，也可复用到天气、运动、社交、搜索、工具等应用的界面实现；提供主题令牌、可复制 UX 组件、输入法、页面模板、设置交互、存储、多形态适配和构建规范。用户提出 Vela JS 快应用 UI、手环/手表界面、控件库、输入法或多屏页面设计修改时使用；Lua 表盘与 NuttX Shell 请配合 vela-quickapp-dev。
---

# Vela Android Native UI

本 Skill 的首要用途是让 AI **仅凭需求和本 Skill，就能从零构建完整的 Vela UI**。它适用于控件展示 Demo，也可为天气、运动、社交、搜索和工具类应用复用页面结构与控件模式；这些例子不代表 Skill 内含相关业务服务或数据 API。Demo 是可选的公开参考工程：用户可下载后直接改造成自己的应用，AI 也可查看它理解 UX 写法；**使用 Skill 不要求 Demo 存在，也不应把 Demo 当生成 UI 的前置依赖**。组件模板包含在本 Skill 的 `assets/components/`，可单独复制。先读本文件，再按任务加载主题、组件、页面或设备文档。不要猜测 Vela API：遇到文档未覆盖的 API，检查当前工程 SDK 文档或官方资料。

## 工作流程

1. 确认工程类型为 Vela JS 快应用（`.ux`），读取用户现有 `manifest.json`、页面和工程配置；不要把 Lua 表盘或 Android 原生工程混为一谈。若任务是 Lua/LVGL 或 NuttX Shell，使用 `vela-quickapp-dev` 中相应指南。若用户要“做 UI”而未提供项目，主动生成完整可运行页面与资源，不要只给建议或伪代码。
2. 识别比例形态：跑道屏、矩形方屏或圆屏。跑道屏手环首页强制单列；其他形态由 AI 根据有效内容宽度在单列与双列中选择。以运行时 `@system.device` 信息与令牌选择布局；分辨率仅用于 designWidth 和预览校正。
3. 看 `references/decisions-and-questions.md`。先从现有需求推断；只对尚未说明且影响成品的可选项向用户询问。用户已要求的说明跑马灯直接实现；不额外加未要求的动画或装饰。宽屏/圆屏选择单列或双列属于实现布局判断，不需要为列数再询问；单列图标按需决定。不要重复询问规格已给定的项目。
4. 从 `references/tokens-and-themes.md` 复制令牌模块。集中改动令牌，组件只通过 props/style 接收令牌值；Vela CSS 不支持 CSS 自定义变量。
5. 从 `references/components-api.md` 选取必要组件，复制对应 `assets/components/<name>/` 完整目录（含 `index.ux`、维护用 `component.json` 和组件引用的图片/词典等资源），用 Vela `<import>` 在页面引入。组件保持独立可复制，不依赖 Demo 全工程。
6. 按 `references/page-templates.md` 实现当前任务所需页面。控件 Demo 使用首页分类列表、分类展示、详情与设置页；一般应用按需求选择搜索、空状态、分页、确认交互、内容展示等模板，不强塞控件库导航。所有模板遵循本 Skill 的主题、字号和设备适配规则。跑道屏手环首页强制单列；其他形态根据可读宽度选择一列或两列。方屏/圆屏首页可采用紧凑横向顶部栏；圆屏顶部栏和列表必须整体位于圆形安全区。跑道屏保留纵向顶部结构。若 Demo 已按形态拆成独立工程，只修改目标工程，不把其他形态 CSS 或媒体规则复制到跑道屏工程。首页分类的长说明按用户已确认的设计使用单行小字号跑马灯。其他 Demo 页面顶部仅显示时间；一般应用需要页面标题时放在时间区下方，不叠加渐变遮罩。
7. 实现可用的交互与 `@system.storage` 持久化；给存储字段加命名空间、解析失败时回退默认值。字号设置只改指定的可调正文/长说明文字；时间、页面标题、区块标题、条目标题、按钮/控件标签、计数、图标和导航文字使用固定角色字号。四个 Demo 统一阶梯为辅助 10px、正文 12px、条目标题 14px、区块标题 16px、页面标题 18px、时钟/符号 20px、大图标 24px；同角色跨页面和设备必须同字号。22/24/26 用户偏好只用于允许变化的长说明，映射 10/11/12px；不得把原值直接塞进窄栏。不得在圆屏媒体查询中改变同一文字角色字号；空间不足时改内容宽度、间距、卡片高度和滚动视口。不得让正文偏好改动固定角色或控件几何。路由页参数必须声明为页面 `protected`/`public` 属性并通过 `this.category`、`this.id` 读取；每次页面 `onShow` 重新读取共享设置，确保返回缓存页面时状态同步。
8. 自检 `.ux` 根节点、页面路由、manifest 字段、资源路径、圆屏安全区、返回手势、主题对比度和列表可读宽度。控件 Demo 逐个点击首页分类，确认标题、数量和控件 ID 属于所选分类；一般应用逐个验证主要业务路由。逐个切换已提供的主题与模式，确认所有相关页面/组件都更新 palette，不能只改设置页。逐个点按/拖动交互控件，确认父页状态与控件显示同步。验证步骤见 `references/build-and-validation.md`。

## 规格硬约束

- 8 个主题 × 浅色/暗色/纯黑三模式。主题色要影响全应用页面背景色调、控件表面/选中态和强调色，不能只换按钮颜色；浅色背景与卡片/按钮表面都按主题使用不同浅色，禁止把所有控件表面固定成纯白，暗色背景和表面采用该主题的深色调，纯黑只把页面画布设为 `#000000`，卡片/控件仍用可辨识的深色表面且保留主题色。
- 控件展示 Demo 首页按设备形态布局：跑道屏手环强制单列；矩形、方形、圆形设备可按有效内容宽度选择单列或双列。圆屏两列只有在卡片、标题和说明都完整落入圆形安全区时才可用；宽度不足时采用单列。所有首页都用可滚动原生列表，设置入口随列表滚动并带安全尾行。一般应用的首页按业务信息架构决定列数；重复纵向条目仍使用可滚动列表。
- 原生 `<list-item>` 的卡片表面直接画在列表项宿主本身：给宿主设置动态 `background-color: {{surface}}`、明确宽高和圆角；内部排版容器保持透明，不再叠加第二块填色背景。仅当行内确实需要预览/选中控件时，才在宿主内部使用较小的 `soft` 控件底板。只设置内部容器高度（包括固定像素高度）不能替代宿主的主题背景，用户截图已证实这类双层结构会在行中露出不同色带。首页、分类列表、设置列表一致执行。普通按钮/标签将背景放在一个 `div` 容器上，文字节点只负责文字，不重复给外层和内层同时铺色。详情控件舞台避免在整体 `soft` 背景上让子组件默认表面切出横带；背景层级应明确为一个 `surface` 舞台、一个控件、独立的 `soft` 状态条。Vela CSS 屏幕形态媒体查询使用 `shape` 特征（如 `@media (shape: circle)`），不要误写成 `screen-shape`；打包后须检查圆屏规则确实进入编译样式并用目标截图核对，不能以高度声明或静态构建通过代替视觉验证。
- 圆屏内容整体居中并避开圆周裁切区；安全区必须同时约束顶部栏、页面标题、卡片、列表项和底部控件，不能只给文字加水平 padding。可用以圆心为中心、宽高不超过屏幕直径约 70% 的安全矩形作为保守基线；若采用更宽布局，须按各元素所在高度的圆弦可用宽度核算。圆屏首页首屏截图中，时间、标题、分类标题/说明、卡片四边都必须完整，不能出现顶部标题消失或首行左右被裁。不要把圆屏固定像素边距套用于 192px 跑道屏。一级、二级、详情和设置页都检查实际可用宽高。矩形宽屏可用完整矩形视口，但要按实际字号和裁切边缘留白。宽屏首页如采用横向时间与主标题，时钟 18px、主标题 16px；其他页面继续使用全局角色字号。
- 控件展示 Demo 顶部只有时间；一般应用如需页面标题，放在时间区下方的页面内容中，仍不加顶部渐变遮罩。首版不加无关装饰动画；用户明确要求的单行说明跑马灯作为信息可读性功能保留，控件 Demo 首页分类说明、分类列表长说明和详情说明都用单行原生 `<marquee>`，并显式启动每个有唯一 ID 的实例。Vela `<marquee>` 默认字号为 30px，必须显式设置符合角色层级的字号（说明常用 10–12px）和单行高度；不能只设容器高度或误用默认字号导致文字盖住标题、状态栏和卡片。短的静态辅助标签不必使用 marquee。重复行需确认列表重建/虚拟化后仍可滚动。不要只在详情页加跑马灯而让首页说明被省略号截断。控件展示 Demo 不加入系统网络设置、无意义点按反馈或真实工具业务；一般应用依用户需求实现相应业务功能。
- 控件展示 Demo 的设置页只放字号、主题（含颜色与模式）和一行关于信息，可包含用户明确要求的示例开关；一般应用的设置项按具体业务需求取舍，保持可读、可滚动，不把 Demo 限制误当作所有应用的设置规范。
- 左滑返回事件绑在页面根节点，按 `direction === 'right'` 处理（平台事件方向语义需在设备上验证）；事件不冒泡，不要只绑定子卡片。二级页只保留统一手势返回，不在每个页面重复放置位置不一的“返回首页”按钮。
- 不默认使用 `list-item`；若采用必须指定 type。重复、同构、需要手势滚动的选项首选 Vela 原生 `<list>` + `<list-item>`；list 必须获得确定的可视高度：独立视口设置明确高度，固定高度纵向页面中的剩余视口可用 `flex:1` 填满（父容器须为可计算高度的 flex 列布局，且标题等兄弟项不参与收缩）；每个 list-item 必须设置 type、width、height，同 type 的 DOM 结构必须一致。列表末尾额外留至少一行（约 24–32px）的空白安全区，或给滚动内容加等效底部 padding，让最后一项滚离 Band 圆角/黑边后仍完整可读、可点；关于行和末项也要遵守。`<scroll>` 用于单个复合内容区，必须设置 `scroll-y="true"` 和可计算的明确高度，且只放一个直接子节点；不要把长列表渲染成 `for` 循环的普通 div 后假设它能像原生列表一样滚动。横排容器必须显式 `flex-direction: row`。
- 用户要求发布/真机包时用公版 release；debug 只用于模拟器。不得用 `aiot build` 作为 RPK 编译命令。

## 交付行为

- 若用户要一套 UI：直接实现应用页面、路由、主题/字号状态、组件和需要的资源；只读 Skill 的 AI 也必须可以完成，不依赖 Demo。
- 若用户要示例：先判断用户想看代码示例还是下载整个 Demo。只有提出下载/修改基线时，才把 `demos/` 整工程作为交付对象；说明可复制到新项目并继续改造。
- 默认从需求规格和现有代码作判断，不机械复制参照 `vela-watch-design` 的时间+标题+遮罩布局。参照 Skill 仅用于结构/写法；本 Skill 的顶部只显示时间、Material 风格与“仅保留用户明确要求的说明跑马灯、其余不加装饰动画”的规则覆盖其冲突内容。
- 对会改变 UI 范围且尚未说明的可选功能才提问；其余按本 Skill 默认值直接完成。规格已经确定的项目不要重复询问。

## 重要参考

- 小屏列表、字体裁切、跑马灯和交互绑定：[`references/layout-and-interactions.md`](references/layout-and-interactions.md)

- 令牌与 8×3 主题：[`references/tokens-and-themes.md`](references/tokens-and-themes.md)
- 组件 props/事件/调用方式：[`references/components-api.md`](references/components-api.md)
- 页面模板和设备形态布局：[`references/page-templates.md`](references/page-templates.md)；搜索、空状态、分页、确认和内容展示：[`references/special-page-templates.md`](references/special-page-templates.md)
- 自定义输入法、词典资源和搜索接入：[`references/input-method.md`](references/input-method.md)
- 通用工程结构、命名、性能和快速开始：[`references/general-development.md`](references/general-development.md)
- 与 `vela-quickapp-dev` 的分工和协作：[`references/skill-cooperation.md`](references/skill-cooperation.md)
- 字号与设置页：[`references/settings-and-typography.md`](references/settings-and-typography.md)（Demo 全部文字必须使用同一角色字号阶梯）
- 动画成本与提问策略：[`references/decisions-and-questions.md`](references/decisions-and-questions.md)
- Vela 项目/构建/排错：[`references/build-and-validation.md`](references/build-and-validation.md)
- 设备参数完整表：[`references/device-tokens.md`](references/device-tokens.md)

## 路由和状态同步硬规则

Vela 路由参数必须先声明为页面属性。含 `protected`/`public` 属性的页面不要同时声明 `data`，普通响应式状态改放在 `private`。禁止读取未定义的 `this.$page.params`。

```js
export default {
  private: { categoryName: '', controls: [] },
  protected: { category: 'buttons' },
  onInit() { this.selectCategory(this.category || 'buttons') },
  onShow() { this.loadPreferences() }
}
// router.push({ uri: '/pages/list', params: { category: id } })
```

主题不是设置页局部装饰。用一份共享 palette 为 `background/surface/foreground/secondary/accent/soft/outline` 提供每主题、每模式的实色值；主页卡片、分类预览、列表卡、组件示例舞台和设置页都绑定 palette。组件由父页显式传入它支持的颜色与尺寸 props。页面首次显示和路由返回恢复时都重新加载持久化设置。

## 基础持久化范式

```js
import storage from '@system.storage'
storage.set({ key: 'THEME_ID', value: 'blue' })
storage.get({
  key: 'THEME_ID',
  success: (data) => { this.theme = data || 'blue' },
  fail: () => { this.theme = 'blue' }
})
```

`storage` 值按字符串处理；存对象时显式 `JSON.stringify/JSON.parse` 并捕获解析异常。组件不要各自直接写相同 key；由页面/状态模块统一提交设置并广播 props。
