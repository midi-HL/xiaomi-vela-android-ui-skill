# 设备参数令牌

> 设备尺寸和比例按需求规格用于初始基线。不同代际/系统镜像可能变化，运行时形状探测优先于型号字符串；交付前在目标模拟器/真机验证。

| 设备 | 屏幕 | shape | designWidth | 首页列数 | safeArea |
|---|---:|---|---:|---:|---|
| 小米手环 9 | 192×490 | pill | 192 | 1 | 水平 12；顶部时间区 42 |
| 小米手环 10 | 192×510 | pill | 192 | 1 | 水平 12；顶部时间区 42 |
| 小米手环 11 | 约 192×510 | pill | 192 | 1 | 水平 12；顶部时间区 42 |
| 小米手环 Pro | 280×456 | rectangle（平台值 `rect`） | 280 | 1 或 2，由页面选择 | 水平安全边距按内容核算 |
| 小米 Watch S | 466×466 | circle | 466 | 1 或 2；两列须先通过圆屏安全区核验 | 以圆心为基准的安全内容框；禁止卡片碰圆周 |
| Redmi Watch 系列 | 随型号变化 | 运行时识别 `rect` 或 `circle` | 按目标工程 | 1 或 2，由页面选择 | 按实际形状计算，不能按系列名猜测 |

跑道屏手环（Band 9/10/11 等）首页始终单列。其他形态的列数是页面实现选择，不是用户设置项。圆屏默认先以直径约 70% 的中心正方形作为安全内容框；只有顶部栏、标题、卡片和列表项都能完整位于安全框内时才启用双列，否则使用单列。约 70% 是保守起点，最终以目标设备截图中圆周裁切边缘为准。

## 完整字段示例

```js
export const device = {
  name: 'Mi Band 9', resolution: { width: 192, height: 490 }, shape: 'pill', designWidth: 192,
  typography: { display: 24, headline: 20, title: 18, titleSmall: 16, bodyLarge: 14, body: 12, labelLarge: 14, label: 12, caption: 10, micro: 10 },
  spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, section: 28 },
  radius: { xs: 8, sm: 12, card: 18, dialog: 24, pill: 999 },
  sizing: { touchMin: 44, buttonHeight: 52, rowHeight: 64, icon: 24, control: 44 },
  elevation: { card: 0, dialog: 2, shadowColor: '#20000000' },
  animation: { enabled: false, durationFast: 120, durationNormal: 200, easing: 'ease-out' }, // 禁止装饰动效；用户明确要求的文案 marquee 例外保留
  safeArea: { top: 44, horizontal: 12, bottom: 18, circleContentRatio: 0.70 }
}
```

### Typography 层级

`display`、`headline`、`title`、`titleSmall`、`bodyLarge`、`body`、`labelLarge`、`label`、`caption`、`micro` 共 10 层。偏好字号取 22/24/26，默认 24；只绑定产品指定的正文角色，两层正文可用 body 与 bodyLarge。时间、标题、标签等其余角色保持各自固定令牌。系统时间统一用 20px，页面标题 18px；页面形态变化不得改变同一角色字号。可调说明按 `22→10, 24→11, 26→12px` 映射。

### 比例分组与运行时探测

优先通过 `device.getInfo({ success(info) { ... } })` 读取运行时 `screenShape` / 宽高，将 `pill-shaped`、`rect`、`circle` 分别映射到 Skill 概念组 `pill`、`rectangle`、`circle`。注意运行时字段名 `screenShape` 与 CSS 媒体特征不同：Vela CSS 必须写 `@media (shape: circle)`、`@media (shape: rect)` 或 `@media (shape: pill-shaped)`，不能写成 `screen-shape`。将检测逻辑限制在 `common/device.js`。不依赖单一型号名称来确定列数。原型可由项目 manifest 的 `designWidth` 决定缩放；在每个形态独立工程中分别以 192/280/466 为基准。
