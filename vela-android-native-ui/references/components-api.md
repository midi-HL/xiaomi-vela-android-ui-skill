# 组件 API

全部源文件位于 Skill 内 `../assets/components/<组件名>/`；本仓库根的 `components/<组件名>/` 是便于独立复制的镜像。每个组件独立目录包含 `index.ux`（完整 template/style/script）、可能存在的 `assets/` 和项目维护用 `component.json`。在页面通过 Vela `<import>` 引入组件，路径以目标工程为准：

```html
<import name="ui-button" src="../../components/button/index.ux"></import>
```

组件通过 props 接收颜色、尺寸和标签，不直接 import Demo 状态。子组件用 `$emit()` 上抛自定义事件，由父级组件绑定事件处理。`component.json` 是本仓库组件的维护元数据，不替代 Vela `<import>`。轻量页面避免一次 import 所有复杂组件；按页面拆分以控制可穿戴设备内存。导入路径/事件命名按 `vela-quickapp-dev` 和当前 SDK 工程确认。

| 组件 | props（默认值） | 事件/交互 | 用途 |
|---|---|---|---|
| `button` | `label="继续" variant="filled" accent="#356DFF" disabled=false scale=1`（scale 只调容器几何，标签字号固定） | `click` | 主/次/描边按钮 |
| `card` | `title="卡片" subtitle="说明" surface="#FFFFFF" radius=18 foreground secondary` | `click?` | 信息容器 |
| `list-item` | `title="设置项" subtitle="描述" trailing="›" accent foreground secondary` | `click` | 单行或双行列表项 |
| `radio` | `label="选项" checked=false accent="#356DFF" foreground` | `change` | 单选 |
| `switch` | `label="开关" checked=false accent="#356DFF" foreground` | `change` | 布尔切换 |
| `slider` | `value=50 min=0 max=100 accent="#356DFF" foreground` | `change` | 范围调节 |
| `stepper` | `value=24 min=22 max=26 step=2 accent foreground` | `change` | 步进器 |
| `color-picker` | `value="#356DFF" colors=[]` | `change` | 主题色选择 |
| `font-adjuster` | `value=24 min=22 max=26 step=2 accent foreground` | `change` | 字号调整 |
| `progress-bar` | `value=60 accent="#356DFF" track="#E9EBF2"` | `none` | 线性进度展示 |
| `ring-progress` | `value=60 accent="#356DFF" size=72 foreground` | `none` | 环形进度展示 |
| `dialog` | `visible=false title="确认" message="确定继续？" confirmText="确认" cancelText="取消" surface foreground secondary accent` | `confirm/cancel` | 确认对话框 |
| `chip` | `label="全部" selected=false accent="#356DFF" soft` | `click` | 小标签/筛选标签 |
| `segmented-control` | `items=["浅色","暗色","纯黑"] value=0 accent soft foreground` | `change` | 互斥分段选择 |
| `bottom-nav` | `items=[] value=0 accent="#356DFF" foreground` | `change` | 底部页面导航 |
| `banner` | `title="提示" message="状态说明" tone="info" accent soft foreground secondary` | `click?` | 轻量提示横幅 |
| `empty-state` | `title="暂无项目" message="内容会显示在这里" themeId="blue" modeId="light" surface foreground secondary` | `none` | 空状态插图和文案 |
| `input-method` | `hide=true keyboardtype="QWERTY" maxlength=5 vibratemode="" screentype="circle"` | `complete/delete/keyDown/visibilityChange` | 自定义拼音/英文/数字输入；详见 [`input-method.md`](input-method.md) |

空状态组件通过 `themeId` 与 `modeId` 选择相应插图，并传入当前 palette 的 `surface/foreground/secondary`。它用动态相对图片路径读取 8 主题×3 模式的 PNG；按目标 AIoT Toolkit 版本确认动态资源路径能力（输入法参考注明该能力从 toolkit 2.0.4 起修复），较旧版本改为显式条件分支或使用默认插图。矢量源文件和重绘说明见组件目录。输入法含 56 张布局位图和词典模块，按需复制；其键帽颜色固定，不会自动跟随 palette。无需文本录入的页面不要加载它。


## 使用示例

```html
<template>
  <div class="page">
<ui-button label="应用设置" variant="filled" accent="{{palette.accent}}" @click="saveSettings" />
<ui-switch label="启用提醒" checked="{{reminderEnabled}}" accent="{{palette.accent}}" @change="onReminderChange" />
  </div>
</template>
```

将用户交互状态放在页面 `data`。列表行要先预算可用宽度：`内容宽 - 左右页边距 - 卡片内边距 - 前置图标盒 - 尾部控件宽`。跑道屏优先让主标题完整可读，避免大字徽挤占标题宽度；优先删图标/缩文案，不能靠缩小正文字号解决。

## Vela 组件语法适配

UX 自定义组件配置格式会随 SDK 工程模板变化。这里提供的组件是可复制的完整 UX 单元；使用 Vela `<import>` 引入，路径与标签名按当前项目模板核验。不要把本仓库 `component.json` 元数据当作平台注册机制。不要直接把 Web Vue 的 `.sync` 或标准 DOM 事件机制假定为 Vela 能力。如 SDK 不支持某个自定义事件写法，在页面用 slot/markup 组合并由父页面处理交互。逐项编译确认后再扩展。


### 动态组件注意事项

Vela 内置 `<component is="...">` 动态组件容器不接受自定义组件 props；编译器会对 `component.accent` 等属性发出 unsupported attribute 警告。需要根据路由 ID 展示自定义 UX 组件时，使用静态导入的自定义标签配 `if` 分支，并在每个组件标签上只传该组件声明的 props。例如：

```html
<ui-button if="{{componentName==='button'}}" label="继续" accent="{{accent}}" />
<ui-card if="{{componentName==='card'}}" title="示例" surface="{{surface}}" />
```

为各分支设置安全默认值并编译确认。勿将任意属性统一塞给 `<component>`，也勿假设所有组件都接收 `accent`。
