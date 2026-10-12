# Xiaomi Vela Android Native UI Skill

An AI Agent Skill and reference implementation for building native-style Xiaomi Vela JS quick-app interfaces (`.ux`) for wearable devices.

中文说明：[docs/使用说明.md](docs/使用说明.md) · Demo 包说明：[docs/示例包说明.md](docs/示例包说明.md)

## What this Skill is for

Use it when designing or implementing Vela JS wearable interfaces: component showcases, settings, weather, sport, social, search, utility, and similar UI work. It covers theme tokens, reusable UX components, typography, settings and persistence, page templates, input-method assets, device-shape adaptation, and build/validation guidance. It does not provide the domain services or APIs for those example product categories.

The Skill is self-contained and can guide a new UI without the demo projects. The demo projects are optional reference implementations and can also be downloaded and modified as starter projects.

## Download and install

Download the Skill archive from the [latest GitHub Release](https://github.com/midi-HL/xiaomi-vela-android-ui-skill/releases/latest), or download [`vela-android-native-ui.zip`](https://github.com/midi-HL/xiaomi-vela-android-ui-skill/raw/refs/heads/main/releases/vela-android-native-ui.zip) directly from this repository.

Extract the archive so the folder `vela-android-native-ui` (containing `SKILL.md`) is placed in an Agent Skills directory supported by your agent. For Codex, a user-level install can be placed under `~/.agents/skills/vela-android-native-ui/`; restart or refresh the agent so it discovers the Skill. Other agents may use their own skills directory.

The archive root contains `vela-android-native-ui/SKILL.md`. Keep the `references/` and `assets/` folders beside `SKILL.md`; the Skill links to these relative paths.

## Repository contents

- `vela-android-native-ui/` — the complete, standalone Skill, references and reusable assets.
- `components/` — convenient repository-level copies of reusable components.
- `demos/` — source projects for Band 9, Band 10, square, and circular device layouts. Build output, dependency folders, and signing material are excluded.
- `releases/` — the Skill ZIP and precompiled public release RPK examples.
- `docs/` — Chinese usage and demo package guides.
- `需求文档.md` — project requirements/specification.

## Demo packages

The RPKs in the latest GitHub Release are installable Vela quick-app packages, not Android APKs. Their device shape and tested status are listed in [docs/示例包说明.md](docs/示例包说明.md). Download the RPK for a matching virtual device or wearable, then install it using the Vela/AIoT workflow supported by your device. Do not install a package on a different shape and assume its layout is validated there.

The source projects can be compiled with the Xiaomi Vela AIoT toolchain; see [`vela-android-native-ui/references/build-and-validation.md`](vela-android-native-ui/references/build-and-validation.md). Public demo packages do not include the developer's signing private key.

## Validation notes

RPK packaging and archive contents are checked before release. This does not mean every package has been visually validated on every physical device. See the package guide for shape-specific notes; please verify the target device and report issues with a screenshot and device model.

## License

MIT. See [LICENSE](LICENSE).
