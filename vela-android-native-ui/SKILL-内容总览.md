# `vela-android-native-ui` Skill 内容总览

这份文档用来说明项目里的 `vela-android-native-ui` Skill 是什么、由哪些文件组成，以及使用时应先看哪里。它是目录导航和内容摘要，不替代各文件里的详细规范。

## 1. Skill 的目标

这套 Skill 教 AI 为小米 Vela 手环/手表编写类原生 Android Material 风格的 JS 快应用 UI。适用于控件展示 Demo，也可复用到其他业务类型的 Vela UI；它不代替传感器、网络或其他业务 API 文档。目标是让 AI 只读 Skill 也能从零实现界面；可选的 Demo 工程则用于参考页面、令牌和控件写法。

项目根目录的 [`需求文档.md`](../需求文档.md) 是产品需求来源；本目录的 [`SKILL.md`](SKILL.md) 是 AI 执行时的入口和总规则。两者作用不同：前者描述产品要交付什么，后者描述如何据此设计、编码、适配和自检。

## 2. 目录结构

```text
vela-android-native-ui/
├── SKILL.md                         # Skill 入口、总工作流程、硬约束
├── SKILL-内容总览.md                 # 本文：目录导览
├── references/                      # 细分规范和模板说明
└── assets/components/               # 可复制的 Vela .ux 控件和输入法模板

demos/
├── runway-band10/                   # 小米手环 10 跑道屏 Demo
├── runway-band9/                    # 小米手环 9 跑道屏 Demo
├── square/                          # 方屏 Demo
└── circle/                          # 圆屏 Demo
```

## 3. 入口文件 `SKILL.md` 包含什么

- **适用范围与工作流**：识别 Vela JS `.ux` 工程和设备形态；先读需求与参考规范；集中使用主题令牌；从模板组装页面；实现交互、存储和返回手势。
- **页面结构**：控件 Demo 主页为纵向可滚动分类列表，分类页展示控件预览，详情页展示可操作示例，设置页负责字号、主题/模式和关于信息；一般应用按业务需要选择页面模板。
- **字号规则**：固定界面文字与可调说明文字分开；按文字角色统一字号；字号偏好只作用于允许调整的说明文字。
- **主题规则**：8 种配色与浅色、暗色、纯黑三种显示模式；主题需同时影响页面背景、控件表面、选中状态和强调色。纯黑模式的页面画布为黑色，但控件表面仍需可辨认并保留主题色。
- **Vela 布局和交互约束**：原生列表滚动、每项的类型/尺寸、圆屏安全区、末项底部留白、页面路由参数、返回手势和设置持久化。
- **已记录的颜色分层经验**：列表卡片表面应该画在 `<list-item>` 宿主上，内部排版容器透明；避免内外重复铺色；详情预览舞台和控件状态条要有明确层级。
- **跑马灯要求**：用户要求长说明滚动显示时使用单行 `<marquee>`，并显式设置字号/高度及启动实例；短标签保持静态。
- **交付与自检**：覆盖点击分类、主题同步、控件交互、RPK 检查和设备截图检查。静态检查/编译成功不等于真实设备 UI 已验证。

## 4. `references/` 参考文件

| 文件 | 主要内容 |
|---|---|
| [`tokens-and-themes.md`](references/tokens-and-themes.md) | 主题矩阵、颜色/设备令牌、令牌模块写法、背景/控件表面、圆角屏幕底部安全留白。 |
| [`device-tokens.md`](references/device-tokens.md) | 设备尺寸字段、屏幕比例分组、运行时设备探测和字号层级。 |
| [`components-api.md`](references/components-api.md) | Skill 组件的属性、事件、调用示例和 Vela 组件语法注意事项。 |
| [`page-templates.md`](references/page-templates.md) | 首页、分类列表、设置页、详情页、路由恢复和返回手势的模板/规则。 |
| [`layout-and-interactions.md`](references/layout-and-interactions.md) | 小屏滚动、字体排版、控件交互绑定和验收方式。 |
| [`settings-and-typography.md`](references/settings-and-typography.md) | 字号角色标准、哪些文字可调、设置如何持久化。 |
| [`decisions-and-questions.md`](references/decisions-and-questions.md) | 哪些未决选择需要问用户，以及动效需求的成本/范围处理。 |
| [`build-and-validation.md`](references/build-and-validation.md) | 工程要求、构建/发布检查、路由与主题回归检查清单。 |
| [`special-page-templates.md`](references/special-page-templates.md) | 搜索、空状态、分页、确认交互和长内容页模板。 |
| [`input-method.md`](references/input-method.md) | 自定义输入法资源、属性事件、接入方法和测试范围。 |
| [`general-development.md`](references/general-development.md) | 通用工程结构、命名、性能注意事项和新工程流程。 |
| [`skill-cooperation.md`](references/skill-cooperation.md) | 本 Skill 与 `vela-quickapp-dev` 的使用边界和协作顺序。 |

## 5. `assets/components/` 可复制组件

18 个组件目录提供 `.ux` 模板和组件配置文件（常见为 `component.json`），用于拷贝到新项目并按需调整。

| 组件 | 用途概览 |
|---|---|
| `banner` | 横幅/提示信息区域 |
| `bottom-nav` | 底部导航 |
| `button` | 按钮 |
| `card` | 卡片容器 |
| `chip` | 标签/短状态胶囊 |
| `color-picker` | 颜色主题选择 |
| `dialog` | 对话框/确认提示 |
| `empty-state` | 空状态展示，含按主题/模式生成的 SVG/PNG 插图 |
| `font-adjuster` | 字号调整控件 |
| `list-item` | 列表项 |
| `progress-bar` | 线性进度条 |
| `radio` | 单选项 |
| `ring-progress` | 圆环进度 |
| `segmented-control` | 分段选择控件 |
| `slider` | 滑块 |
| `stepper` | 加减步进器 |
| `switch` | 开关 |
| `input-method` | 全键盘/T9 输入法、拼音词典和多屏按键资源 |

此外，`assets/components/empty-state/` 包含 SVG 源图、渲染脚本和 8×3 PNG 变体；`assets/components/input-method/` 包含词典、工具和全键盘/T9/弧形/横向布局图。

## 6. Demo 工程的作用

项目目前有四种设备目标 Demo：手环 10、手环 9、方屏和圆屏。它们是可运行/可修改的参考工程，用于展示分类导航、控件交互、主题和字号状态在不同屏幕形态下的组织方式。Skill 本身不应依赖这些 Demo 才能生成新 UI。一般业务 UI 可复用本 Skill 的设计系统，但业务逻辑、传感器和网络接口按具体需求查平台文档。

## 7. 阅读顺序建议

1. 先读根目录 [`需求文档.md`](../需求文档.md)，理解交付目标和产品要求。
2. 再读本目录 [`SKILL.md`](SKILL.md)，掌握总规则和工作流程。
3. 开始设计时读 `tokens-and-themes.md`、`device-tokens.md` 和 `page-templates.md`。
4. 搜索/输入读 `special-page-templates.md` 和 `input-method.md`；空状态、分页、确认框或长内容页也从 `special-page-templates.md` 选模板。
5. 需要具体控件时读 `components-api.md` 并复制对应组件；项目结构/性能读 `general-development.md`。
6. 确认 Vela 平台 API 或构建流程时按 `skill-cooperation.md` 转到 `vela-quickapp-dev` 对应参考。
7. 实现滚动、字号、设置和交互时读 `layout-and-interactions.md` 与 `settings-and-typography.md`；构建交付前读 `build-and-validation.md`。

## 8. 当前重要限制

Skill 中关于列表宿主背景、主题表面色和详情舞台层级的文字，是实现要求和排错经验；它本身不能证明运行时渲染已经正确。最近反馈的“三明治色带”问题仍未解决，因此后续必须继续以实际设备截图/像素取样验证，不能仅凭源码绑定或编译成功宣布 UI 修复完成。

当前项目的 Vela Skill 规则还同时覆盖了通用设计参考：遇到通用参考与 [`需求文档.md`](../需求文档.md) 或用户当前明确要求冲突时，应先遵循需求文档和用户明确要求，并把需要修订的 Skill 内容同步校正。
