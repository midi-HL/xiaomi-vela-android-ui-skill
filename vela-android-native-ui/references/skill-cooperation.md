# 与 `vela-quickapp-dev` 协作

本 Skill 和 `vela-quickapp-dev` 各管一层，遇到跨层任务时一起使用，不相互替代。

| 任务 | 主要使用 |
|---|---|
| 主题、Material 色板、字号层级、间距、圆角、页面结构、组件外观与交互呈现 | `vela-android-native-ui` |
| Vela JS `.ux` 的 template/style/script 语法、内置组件与 API、manifest、路由、storage、屏幕形态、构建与发布工具 | `vela-quickapp-dev` |
| 输入法组件在某 SDK/设备上的属性、事件或资源路径能否运行 | 本 Skill 的 `input-method.md` 选择组件模式；再查 `vela-quickapp-dev` 的输入法/API/版本资料核对平台行为 |
| Lua/LVGL 表盘、NuttX Shell、设备系统层调试 | `vela-quickapp-dev`；本 Skill 的 `.ux` 模板不适用 |
| 既有应用出现构建/运行/API 故障 | 平台诊断优先查 `vela-quickapp-dev`；修复后的 UI 仍按本 Skill 的主题、布局和截图清单验收 |

## 协作顺序

1. 先判断交付是 JS 快应用 UI、Lua/LVGL、还是 NuttX Shell。只有 JS `.ux` UI 任务使用本 Skill 的组件和页面模板。
2. 本 Skill 负责确定“页面如何组织、视觉层级和状态如何表达”；它不代替传感器、网络、通信、输入法内部协议等平台能力文档。
3. 写 Vela API/组件语法时查 `vela-quickapp-dev` 对应参考文件，并根据目标 SDK 版本核验；不要从 Web/Vue 惯例推断 Vela 支持能力。
   - 单位等基础规则如与本项目 PRD/工程模板冲突，先服从本项目确定的设计基准：本项目 `需求文档.md` 规定 `px` 相对 `designWidth` 等比缩放，不能机械套用另一份速查中的 `dp` 结论。
4. 两份 Skill 的视觉示例不一致时，遵循当前任务/PRD和本 Skill 的 UI 令牌；两份 Skill 的 API/语法说法不一致或版本不明时，查当前工程 SDK/官方资料后再写代码。
5. 构建使用当前工程配置与 `vela-quickapp-dev` 的工具链说明；最终视觉与触摸仍按本 Skill 的目标设备截图/交互清单验证。

不要重复复制 `vela-quickapp-dev` 的大段 API 参考；本 Skill 只保留 UI 任务需要的查找路径、协作边界和已验证的视觉规则。
