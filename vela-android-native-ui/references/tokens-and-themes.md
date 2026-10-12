# 设计令牌与主题

## 主题矩阵

| ID / 名称 | 浅色强调色 | 暗色强调色 | 纯黑强调色 |
|---|---|---|---|
| `blue` 经典蓝 | `#356DFF` | `#356DFF` | `#356DFF` |
| `indigo` 靛紫 | `#6750A4` | `#6750A4` | `#6750A4` |
| `teal` 青碧 | `#00796B` | `#00796B` | `#00796B` |
| `green` 森林绿 | `#2E7D32` | `#2E7D32` | `#2E7D32` |
| `amber` 琥珀橙 | `#B85C00` | `#B85C00` | `#B85C00` |
| `rose` 蔷薇红 | `#B3265E` | `#B3265E` | `#B3265E` |
| `violet` 活力紫 | `#7B4DFF` | `#7B4DFF` | `#7B4DFF` |
| `slate` 石板灰 | `#526477` | `#526477` | `#526477` |

每个主题必须同时定义 accent、柔和选中表面，以及浅色/暗色/纯黑各自的 page background 和 card surface。主题切换必须影响所有页面的背景层次和控件状态，不可只替换按钮强调色。浅色画布和卡片/按钮表面都按主题轻微着色，避免所有控件卡片统一纯白；暗色按主题配深色画布与深灰卡片；纯黑仅画布严格为 `#000000`，控件卡片使用非黑的深色表面。三种模式都保留所选 accent。表中给出中性基准，不代表八个主题共用完全相同的背景色。

| Token | Light | Dark | Black |
|---|---|---|---|
| background | #F5F6FA | #15171C | #000000 |
| surface | #EFF3FC (theme tint) | #22252B | #111111 |
| surfaceVariant | #E9EBF2 | #2C3038 | #191919 |
| textPrimary | #171923 | #F4F5F7 | #FFFFFF |
| textSecondary | #5D6270 | #B8BBC4 | #B8B8B8 |
| outline | #D8DBE5 | #3C414B | #303030 |
| accentSoft | accent 14% tint | accent 20% tint | accent 24% tint |

For a themed card inside native `<list>`, put the single card fill on the `<list-item>` host itself: bind `background-color` to `surface`, and define the host width, height, and radius. Put row content directly in the host when practical; if a layout wrapper remains, keep it transparent and do not paint a second full-row background inside the host. Remove the wrapper if device screenshots still show a horizontal band. Use smaller `soft` panels only for an intentional control preview or selected state. Explicit inner pixel height did not remove the horizontal color band seen in device screenshots; host-owned fill is the required pattern. Apply it to home categories, category lists, and settings rows across supported shapes. Reusable buttons/chips likewise use one background-bearing `div`, with text-only child nodes. Stepper and font-adjuster action buttons use theme `soft` as their fill and `accent` for the glyph/label; selected segments and navigation items also use theme `soft`. Never leave a reusable action control on a hardcoded white or neutral surface when a palette prop is available. In detail previews, do not let a `soft` stage background show as top/bottom strips around component surfaces; use one consistent `surface` stage and reserve `soft` for deliberate state panels. Inspect packaged styles and a device screenshot for continuous row surfaces in light, dark, and pure-black modes.

## JS 令牌模块（无 CSS 变量）

```js
export const themes = {
  blue: { accent:'#356DFF', lightBg:'#F4F7FF', lightSurface:'#EAF0FF', darkBg:'#111722', darkSurface:'#202B43', blackSurface:'#182137', lightSoft:'#E8EEFF', darkSoft:'#26334D', blackSoft:'#18233A' },
  // 每个主题都补齐三种模式的背景/表面/选中底色，而不只提供 accent。
}
export const modes = {
  light: { text:'#1C1B1F', secondary:'#625D6B', outline:'#E8E4EC' },
  dark: { text:'#E5E1E9', secondary:'#C5C0CC', outline:'#44434B' },
  black: { background:'#000000', text:'#FFFFFF', secondary:'#B8B8B8', outline:'#3A3A3A' }
}
export function makePalette(themeId, modeId) {
  const t = themes[themeId] || themes.blue
  const mode = modes[modeId] || modes.light
  return {
    accent:t.accent,
    bg: modeId === 'black' ? '#000000' : (modeId === 'dark' ? t.darkBg : t.lightBg),
    surface: modeId === 'black' ? t.blackSurface : (modeId === 'dark' ? t.darkSurface : t.lightSurface),
    soft: modeId === 'black' ? t.blackSoft : (modeId === 'dark' ? t.darkSoft : t.lightSoft),
    foreground:mode.text, secondary:mode.secondary, outline:mode.outline
  }
}
```

注意：hex alpha 后缀在部分旧运行时不一致；若目标 SDK 不支持 8 位 hex，请使用对应不透明浅色表值，不要依赖 `rgba()` 与字符串拼接。推荐将 accentSoft 映射为每主题预先定义的实体色。

## 设备 token 字段

每台设备令牌必须提供：`device.name/resolution/shape/designWidth`、`typography` 至少 10 层、`spacing`、`radius`、`sizing`、`elevation`、`animation`、`safeArea`。具体数字见 [`device-tokens.md`](device-tokens.md)。设置偏好使用 `bodyFont`（22/24/26，默认 24），仅正文角色可绑定；其余界面文字使用固定角色令牌。

## 单点修改范例

字号调节不要散改页面：更新 `typography.body/largeBody` 后，仅让允许调节的正文绑定对应字号。按钮、开关、触控区域、图标盒与间距使用独立几何令牌，不随用户字号设置同比缩放，除非具体产品明确提出几何联动要求。主题切换只更新当前 palette，再把颜色 props 传到组件；主要按钮使用 `accent`，预览/选中底板使用 `soft`，所有卡片和面板使用对应的主题表面色。列数只读 `deviceTokens[shapeGroup].columns`。

## 小屏安全尾部

所有纵向滚动列表的末尾都要加入一行安全留白（约 24–32px），或等效的内容底部 padding。Band 9/10 的长圆角黑边会遮住紧贴底部的行；将关于行、最后一项、尾部按钮滚入可视区后，确认文字和点击区域完整露出。
