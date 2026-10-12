# 通用工程结构与开发约定

本参考补充新建/接手 Vela JS 快应用时的通用约定。现有工程的结构优先；不要为套模板而移动用户文件。具体 Vela API、manifest 字段与命令以当前 SDK 工程、AIoT-IDE 和 [`vela-quickapp-dev`](skill-cooperation.md) 中对应文档核验。

## 建议目录

```text
src/
├── app.ux
├── manifest.json
├── common/
│   ├── device.js                 # 设备形态和安全区探测
│   ├── theme/                    # palette、主题和持久化设置
│   └── images/                   # 被页面引用的静态位图
├── components/                  # 可独立复制的 UX 组件
└── pages/
    ├── index/index.ux
    ├── search/search.ux
    ├── detail/detail.ux
    └── settings/settings.ux
```

主题表、页面状态和存储逻辑应集中管理，不要在多个页面各自实现一份互不联动的逻辑。复杂组件按需 import，避免所有页面一次加载整套资源。

## 命名与文件约定

- 页面文件放在 `pages/<page-name>/<page-name>.ux`；目录和组件名用小写 kebab-case。
- 页面状态/JS 函数使用 camelCase；共享存储键使用项目名前缀，避免不同应用/组件冲突。
- 静态图片文件使用小写 kebab-case 并按用途分目录；引用路径相对于实际 `.ux` 组件/页面位置核对。
- 可复制组件的目录含 `index.ux`、`component.json` 和其所需资源；同步更新 Skill 的 props/event API 索引。
- `manifest.json` 中的 `deviceTypeList`、`config.designWidth`、路由、版本字段须符合目标 SDK；不要机械复制其他代际的字段值。

## 列表、图片和运行期开销

- 长/重复列表使用 Vela 原生 `<list>` 与同构 `<list-item>`，逐项填写 `type`、宽度和高度；不要把普通 `div for` 当作虚拟列表。
- 只在可见条件变化时需要真正卸载内容的场景用 `if`；根据目标 SDK 实测 `if`/`show` 行为与列表复用，不在高频输入时反复实例化整套键盘或全量词典结果。
- 图片资源应按实际显示尺寸导出，避免在 192px 手环界面加载不必要的大图。空状态图以 SVG 为可编辑源文件、PNG 为运行时资源。
- 使用定时器/长按循环的组件必须在释放、隐藏和销毁生命周期中清理；词典查询应避免无界结果集和重复全量扫描。
- 保持首版无装饰动画；用户明确需要的局部跑马灯属于阅读功能，不推广成转场动画。

## 新工程快速落地

1. 确认用户要 Vela JS 快应用，并读取现有工程、manifest 与 SDK 版本；不是 JS 工程时按 [`skill-cooperation.md`](skill-cooperation.md) 转到平台 Skill。
2. 选择设备比例组并设置合法 `designWidth`；按 `device-tokens.md` 计算安全区域和滚动视口。
3. 从 `tokens-and-themes.md` 建立统一 palette，再选用 `components-api.md` 和本目录页面模板。
4. 在 manifest 注册页面路由、用页面 `<import>` 引入所需组件，随后实现业务状态和 `@system.storage` 持久化；按需接入 `input-method.md`。
5. 使用当前 AIoT 工具链构建；逐个运行用户要求的设备形态，检查屏幕裁切、列表触摸、主题同步和输入事件。编译/静态检查不替代设备验证。不要把控件 Demo 特有的页面结构强加给其他业务应用。
