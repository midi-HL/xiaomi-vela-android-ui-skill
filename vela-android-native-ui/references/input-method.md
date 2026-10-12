# 自定义输入法组件

本 Skill 包含一份可独立复制的 Vela JS 自定义输入法，源自本机 `vela-watch-design` Skill 中的 InputMethod 组件，并保留其完整布局/词典资源。它用于手表没有合适系统键盘的文本录入场景；具体 API、事件和资源路径必须再按目标 SDK 检查 `vela-quickapp-dev` 对应的输入法指南。

输入法图片中的键帽底色和字形颜色是预绘制的，不会自动响应主题 palette。需要在浅色或非蓝色主题下使用时，检查并按需重绘/替换按键位图，不能宣称仅给父页面传入 palette 就完成了键盘主题适配。

## 内容结构

```text
assets/components/input-method/
├── index.ux                  # 自定义键盘与拼音/按键状态
└── assets/
    ├── dic.js                # 拼音到候选汉字/词组数据
    ├── dicUtil.js            # 拼音匹配与候选结果工具
    ├── full/                 # 全键盘按键图
    ├── t9/                   # T9 九键按键图
    ├── arc/                  # 圆屏弧形布局按键图
    └── horizontal/           # 横向布局按键图
```

组件支持全键盘 QWERTY、T9 九键、数字/符号、中英文及大小写切换、候选词选择、空格/删除、候选面板展开，以及 `circle`、`rect`、`pill-shaped` 三种形态分支；圆屏分支包含弧形排布，窄跑道屏使用 horizontal 资源。外层宿主和父页面控件仍需绑定 palette；主题化按键皮肤要替换/重绘资源图并覆盖光暗模式，再在目标设备验证对比度。

## 属性和事件

| 属性 | 类型/默认值 | 作用 |
|---|---|---|
| `hide` | Boolean / `true` | 是否隐藏键盘 |
| `keyboardtype` | String / `QWERTY` | `QWERTY` 或 `T9` |
| `maxlength` | Number / `5` | 拼音候选显示窗口长度 |
| `vibratemode` | String / 空 | 按键振动模式；空值不调用振动 |
| `screentype` | String / `circle` | `rect`、`circle` 或 `pill-shaped` |

| 事件 | payload | 用途 |
|---|---|---|
| `complete` | `{ content: string }` | 输入字符、空格或确认的中文候选 |
| `delete` | `{}` | 组件内部拼音/候选已无可删内容时通知页面删一个字符 |
| `keyDown` | `{ content: string }` | 按键按下提示；仅在调用方确实需要时监听 |
| `visibilityChange` | `{ visible: boolean }` | `hide` 属性变化时回报显示状态 |

`delete` 的语义要与页面协同：组件会先删除内部拼音/候选，只有内部无内容时才发出 `delete`，页面此时删除查询字符串末尾一个字符。收到 `complete` 后由父页更新输入文本和结果。组件不直接访问业务列表、不写应用 storage，也不持有页面路由。

## 集成方法

1. 将 `assets/components/input-method/` **整个目录**复制到应用的 `src/components/input-method/`，保留内部 `assets/` 相对路径。
2. 检查 `index.ux` 中相对导入的 `dicUtil.js` 和 `vibrator`/`device` 使用与目标 SDK 版本匹配；遇到不支持的事件/导入先查 `vela-quickapp-dev`，不要猜测替换。
3. 用页面 `<import name="input-method" src="../../components/input-method/index.ux"></import>` 引入组件；按现有工程调整相对路径。Vela 自定义组件的页面引用使用 `<import>`，不要把本仓库的 `component.json` 元数据误当成组件注册机制。
4. 页面按形状传入 `screentype`，按用户选择传入 `keyboardtype`，监听 `complete`/`delete`/`visibilityChange`。
5. 键盘展开时重新计算搜索列表可视高度。弹出键盘不能挡住输入框、状态值或列表末项；圆屏要检查弧形安全区。
6. 针对 SDK 版本、band/rect/circle 设备逐一编译和试操作：中英文、大小写、符号、连续输入/删除、拼音候选、T9 选择、隐藏后重显和振动开关。

```html
<input-method hide="{{keyboardHidden}}" keyboardtype="{{keyboardType}}"
  maxlength="5" vibratemode="{{vibrateMode}}" screentype="{{screenType}}"
  @complete="onKeyboardInput" @delete="onKeyboardDelete"
  @visibilityChange="onKeyboardVisibility" />
```

```js
onKeyboardInput(event) {
  const content = event.detail && event.detail.content
  if (!content) return
  this.query = (this.query + content).slice(0, 20)
  this.updateResults()
},
onKeyboardDelete() {
  this.query = this.query.slice(0, -1)
  this.updateResults()
},
onKeyboardVisibility(event) {
  this.keyboardHidden = !(event.detail && event.detail.visible)
}
```

拼音词典很大，不要在每次键入时复制/重建全量字典；沿用组件词典工具并限制候选结果。若项目无需中文输入，可只保留英文/数字输入逻辑或直接使用系统输入方案，不必把词典资源打进包。
