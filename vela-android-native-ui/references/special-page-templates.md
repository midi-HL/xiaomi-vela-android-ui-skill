# 通用页面模板

本文件补充控件库以外常见的搜索、空状态、分页、确认交互和长内容展示模式。它们是按需使用的模板，不要求每个应用都实现全部页面。具体视觉始终从 `makePalette()` / 设备令牌获取，不照搬任何固定色值、页标题遮罩或单设备尺寸。

## 搜索页

搜索页通常由输入显示区、原生可滚动结果列表和自定义输入法组成。对于手表没有合适系统键盘的场景，使用 [`input-method`](input-method.md) 内的自定义组件。输入法发出 `complete`、`delete`、`visibilityChange` 事件，页面持有查询文本并负责过滤业务数据。

```html
<import name="empty-state" src="../../components/empty-state/index.ux"></import>
<import name="input-method" src="../../components/input-method/index.ux"></import>
<template>
  <div class="page">
    <list class="results" style="height: {{resultsHeight}}px;">
      <list-item type="query" class="query-row" @click="showKeyboard">
        <text class="query-text" if="{{query}}">{{query}}</text>
        <text class="query-placeholder" else>输入关键词</text>
      </list-item>
      <list-item type="result" for="{{results}}" @click="openResult($item)">
        <div class="result-copy">
          <text class="result-title">{{$item.title}}</text>
          <text class="result-summary">{{$item.summary}}</text>
        </div>
      </list-item>
      <list-item type="empty" if="{{query && results.length == 0}}">
        <empty-state title="没有找到结果" message="试试其他关键词" theme-id="{{themeId}}" mode-id="{{modeId}}"
          surface="{{palette.surface}}" foreground="{{palette.foreground}}" secondary="{{palette.secondary}}" />
      </list-item>
    </list>
    <input-method hide="{{keyboardHidden}}" keyboardtype="{{keyboardType}}" screentype="{{screenType}}"
      @complete="onInput" @delete="onDelete" @visibilityChange="onKeyboardVisibility" />
  </div>
</template>
<script>
export default {
  private: { query: '', allItems: [], results: [], keyboardHidden: true, keyboardType: 'QWERTY', screenType: 'pill-shaped' },
  showKeyboard() { this.keyboardHidden = false },
  onInput(event) {
    const content = event.detail && event.detail.content
    if (!content || this.query.length >= 20) return
    this.query += content
    this.updateResults()
  },
  onDelete() {
    this.query = this.query.slice(0, -1)
    this.updateResults()
  },
  onKeyboardVisibility(event) {
    this.keyboardHidden = !(event.detail && event.detail.visible)
  },
  updateResults() {
    const query = (this.query || '').toLowerCase()
    this.results = query ? this.allItems.filter(item => (item.title || '').toLowerCase().indexOf(query) !== -1) : []
  }
}
</script>
```

脚本中维护 `query`、`results` 和 `keyboardHidden`；对输入长度设上限；清空/删除时重新计算结果。键盘展开时缩小结果列表视口，确保它们不互相遮挡。每个原生 `list-item` 声明唯一 `type`，同一 type 的节点结构保持一致。

## 空状态

空状态表示“当前没有项目/结果/记录”，不是错误提示。用可复制的 [`empty-state`](../assets/components/empty-state/) 组件和本 Skill 自带的 Material 风格插图。标题、说明和插图分层显示；文本颜色按当前 palette 传入。插图按 8 个主题和 3 种模式预渲染成 PNG，SVG 源图保留在组件目录，用户可以按规范重新绘制/导出。

```html
<empty-state title="暂无记录" message="完成操作后，记录会显示在这里"
  theme-id="{{themeId}}" mode-id="{{modeId}}"
  surface="{{palette.surface}}" foreground="{{palette.foreground}}"
  secondary="{{palette.secondary}}" />
```

空状态容器应占据结果区的可用空间并居中，不使用整屏绝对定位；列表仍然保持可滚动，列表末尾遵守安全留白规则。使用 `empty-state` 时先用 `<import name="empty-state" src="../../components/empty-state/index.ux"></import>` 引入组件，再把当前主题和模式传入。SVG 到 PNG 的复现需要 Node.js 和 `sharp`：在空状态组件目录运行 `node render-assets.cjs`；`sharp` 只用于生成资源，不会进入 Vela 应用包。搜索模板使用 `input-method` 时也需以 `<import>` 引入，具体参见 [`input-method.md`](input-method.md)。

## 分页

短列表优先用原生滚动展示全部项目。只有数据量/业务交互确实要求分批时才加分页。分页控件放在原生列表尾部，上一页/下一页使用可点按 UI 按钮或文字控件，不要求图片箭头；首页禁用上一页，末页禁用下一页。

```html
<list-item type="pagination" class="pagination-row" if="{{pageCount > 1}}">
  <div class="pagination-controls">
    <text class="page-action" @click="previousPage" if="{{pageIndex > 0}}">上一页</text>
    <text class="page-count">{{pageIndex + 1}} / {{pageCount}}</text>
    <text class="page-action" @click="nextPage" if="{{pageIndex + 1 < pageCount}}">下一页</text>
  </div>
</list-item>
```

父页面必须把 `pageIndex` 限制在有效范围内，并在数据集变化后重新计算 `pageCount`。`type="pagination"` 需要与其他行保持不同、稳定的 DOM 结构。

## 确认交互

用户需要确认/取消时，优先使用 [`dialog`](../assets/components/dialog/) 组件覆盖当前页面。通过 `confirm` / `cancel` 事件由父页面执行具体业务；组件本身不假定删除、提交或网络操作。

```html
<import name="ui-dialog" src="../../components/dialog/index.ux"></import>
<template>
<ui-dialog visible="{{confirmVisible}}" title="确认清除？"
  message="此操作会清除当前列表。" confirm-text="清除" cancel-text="取消"
  surface="{{palette.surface}}" foreground="{{palette.foreground}}"
  secondary="{{palette.secondary}}" accent="{{palette.accent}}"
  @confirm="clearItems" @cancel="closeConfirm" />
</template>
```

父页面的 `confirmVisible` 在触发操作前设为 `true`，在 `clearItems`/`closeConfirm` 中关掉；只有确认回调执行实际业务。将 `<ui-dialog>` 的 `visible` 与页面状态保持单一数据源同步。

仅当用户需要专用确认流程、需要展示对象详情或无法在当前屏幕容纳内容时，才采用独立确认页面；独立页应声明路由参数，提供根节点滑动返回，并明确确认结果如何回传/持久化。

## 内容展示页

文章、帮助说明、长详情等内容使用单一 `<scroll scroll-y="true">` 视口，直接子级保持一个内容根容器。高度根据顶部时间区、可视操作区和设备安全边距计算。需要隐藏/显示顶栏时，按用户明确需求实现状态控制；不得默认复用参考 Skill 中的渐变遮罩和装饰性转场。

```html
<scroll class="content-viewport" scroll-y="true" style="height: {{contentHeight}}px;">
  <div class="content-body">
    <text class="content-title">{{title}}</text>
    <text class="content-copy">{{body}}</text>
    <div style="height: 28px;"></div>
  </div>
</scroll>
```

长文本按正文角色字号显示；用户要求滚动说明文字时才使用单行 `<marquee>`，不要把整篇内容改成跑马灯。
