# 页面模板

跑道屏手环首页强制单列，时间与“组件示例库”按纵向排布。其他设备可按页面内容选单列或双列；矩形宽屏可用紧凑横向顶部栏，圆屏顶部栏与内容一并居中并放进圆形安全区。形态独立工程只含本形态的样式；禁止把方/圆屏覆盖规则放进 Band 9/10 跑道屏工程。控件 Demo 的其他页面顶部仅显示时间。一般应用需要页面标题时放在时间区下方，不叠加渐变遮罩。首版不加装饰动效或过渡；用户明确要求的文字跑马灯例外保留。

## 首页布局规则

跑道屏手环控件 Demo 首页强制单列，不能因媒体查询、运行时形状检测或宽度分支变为双列。其他形态由页面信息密度和实测可用宽度选择单列或双列，不要求增加列数切换控件。分类入口内标题优先，说明用小字号单行 marquee，计数作为辅助角色；不得让说明大于标题或挤压标题。圆屏使用完整安全内容框，按真实裁切区计算布局。

## 首页单列模板

选择单列时，分类和显示设置入口同级放进一张原生列表，设置入口不固定在列表外。跑道屏每个 list-item 是一张完整主题卡，布局文字直接放在宿主内，不再嵌套另一张整卡容器。非跑道屏采用单列时沿用此模板。分类行用固定字号名称/计数与小字号单行说明；说明过长时用原生 `<marquee>` 跑动，不静态省略号截断。每个重复 marquee 分配稳定唯一 ID，并在页面准备后启动。

    <list class="category-list" bounces="true">
      <list-item for="{{categories}}" type="category" class="category-card"
                 @click="openCategory($item.id)">
        <div class="category-copy">
          <text class="category-title">{{$item.title}}</text>
          <text class="category-caption" lines="1">{{$item.caption}}</text>
        </div>
        <text class="category-count">{{$item.count}}</text>
      </list-item>
      <list-item type="settings" class="category-card" @click="goSettings">
        <text class="category-title">显示设置</text>
        <text class="category-caption">字号、主题与外观</text>
      </list-item>
      <list-item type="safe-tail" class="safe-tail"></list-item>
    </list>

    /* page 是固定视口高度的纵向 flex 容器；header 固定不收缩，list 填充全部剩余高度。 */
    .category-list { width:100%; flex:1; min-height:0; }
    .category-card { width:100%; height:62px; margin-bottom:7px; padding:8px 12px; }
    .safe-tail { width:100%; height:30px; }

每个 list-item 都需要唯一/稳定的 type、显式宽度和高度；相同 type 内的子节点结构必须一致。圆屏用百分比安全边距适配 designWidth，不复制其他形态的固定像素 inset。

列表必须延伸到页面安全区底部，而不是按设备重复使用固定列表高度。列表可视高度由固定页面视口扣除顶部栏/区块栏和安全边距后确定；Vela flex 布局下让列表在纵向父容器中 `flex:1`，并让顶部兄弟项 `flex-shrink:0`。该规则同时用于 `<scroll>` 复合内容区；避免因 456px 方屏与 490/510px 跑道屏高度差而遮住设置入口或详情底部内容。安全尾部留在列表内容末端，确保最后一行滚离圆角黑边；这段内容留白不应变成列表视口外的大块空白。Band 9/10、方屏和圆屏都要实际拖到列表底部，确认“显示设置”可达且最后一项完整。

## 可选首页两列模板

仅跑道屏手环禁止使用此模板。其余形态可在两列能保持卡片宽度、标题层级和说明可读时使用；否则选单列。用户要求的是布局可选，不要求在应用设置中增加列数切换项。

```css
.category-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
.category-card { width: 48%; }
@media (shape: pill-shaped) { .category-card { width: 100%; } }
```

两列适用于矩形宽屏及经过安全区核验的圆屏。圆屏需把顶部栏、标题、分类卡片和列表视口一起放在居中的安全内容框内；建议以直径约 70% 的中心正方形作为初始安全框，或逐行按圆弦可用宽度计算。网格中每张卡都必须完整落在该框内。若标题/说明被挤压、卡片边缘进入圆周裁切区或顶部信息无法完整显示，改用单列并保持统一字号；不得通过缩字号掩盖布局问题。

## 设置页

按 [`settings-and-typography.md`](settings-and-typography.md) 展示字号调节、主题色选择器、模式分段控制和关于一行。多个主题/模式选项必须放进同一可滚动原生列表，让用户能到达全部选项。列表末尾加入至少 24–32px 安全留白，避免关于行或最后的主题选项陷入圆角屏黑边。字号只绑定用户指定可调的正文字段；时间、标题、导航和控件标签保持固定。用 `scroll` 时其直接子级只放一个内容根容器。

## 路由参数与恢复同步

Vela 路由参数必须声明为页面 `protected` 或 `public` 属性，再从页面实例直接读取。页面声明了这些路由属性时，不要同时声明 `data`，把普通响应式状态放到 `private`。禁止使用 `this.$page.params`。

```js
// 发起页
router.push({ uri: '/pages/list', params: { category: id } })

// 列表页
export default {
  private: { categoryName: '', controls: [] },
  protected: { category: 'buttons' },
  onInit() { this.selectCategory(this.category || 'buttons') },
  onShow() { this.loadPreferences() }
}
```

分类映射必须显式覆盖首页每个 category ID。修改分类后要逐个点击所有入口，检查页面标题、控件数量和第一项 ID，避免缺失 key 时静默落到默认分类。详情页同理用 `protected: { id: 'button' }` 接收组件 ID。`onShow` 重新读共享偏好，避免从设置返回后缓存页面仍使用旧主题。

## 列表页

窄屏与短方屏分别预算视口高度；不要把 Band 10 高度原样用于 456px 方屏。时钟、标题、安全边距和列表视口高度之和必须小于屏高，并给列表末尾保留安全空行。

用可读的单/双行卡片展示选中分类内控件示例。首选 `<list>` + 同构 `<list-item type="control">`，根页面为可计算高度的纵向 flex，list 使用 `flex:1`，item 明确设定行高。不得将普通 div for 循环当作可滚动列表。首页与分类列表的长说明都用原生 `<marquee>` 展示，进入详情后仍用 `<marquee>` 展示当前控件说明；动态重复行的实例 ID 要唯一，并逐个调用 `start()`。禁止只在详情页跑马灯、首页列表却截成省略号。左滑返回手势绑页面 root，二级页不重复放返回首页按钮。

## 详情页

包含清晰层级的控件名称、较小的单行用途说明、一个可操作实例、当前选择/值。详情字号必须使用统一角色表：时间 20px、页标题 18px、卡片/条目标题 14px、区块标题 16px、正文 12px、辅助 10px；用户调节的长说明映射 10/11/12px；不要把 22–26px 设置档原值直接套在 192px 设计宽的说明上。控件示例文字字号固定，只有专门的字号控件样例随其自己的选择变化。详情页不是空白占位页；radio 需要互斥选项，switch/slider/stepper/字号/颜色/分段控件都要有真实事件和状态回显。

## 返回手势范例

```html
<div class="page" @swipe="onRootSwipe">
  <!-- page content -->
</div>
```

```js
onRootSwipe(event) {
  if (event && event.direction === 'right') router.back()
}
```

需求规格定义 `direction === 'right'` 为左滑返回。设备/SDK 的起止方向需实测；如果平台方向语义不同，只修正该 handler 并同步文档。勿依赖冒泡。


## 跑马灯字号与三级详情布局检查

Vela `<marquee>` 默认字号是 30px。每个跑马灯都显式指定小于标题的字号及合适行高；类别说明和详情正文通常 10–12px，保持一行。短的静态说明用普通 `<text>`，避免跑马灯默认字号覆盖容器。二级页分类标题居中且显著大于跑马灯说明；三级页依次布置居中的小眉题、主标题、单行小说明、交互预览、状态条和静态复用提示。状态条左侧仅写“当前状态”，右侧只写短值，长句不得与标签重复并挤出圆角容器。
