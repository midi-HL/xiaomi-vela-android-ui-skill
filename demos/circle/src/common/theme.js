// Shared theme palette: each accent informs both page surfaces and controls.
export const THEME_IDS = ['blue', 'indigo', 'teal', 'green', 'amber', 'rose', 'violet', 'slate']
export const MODE_IDS = ['light', 'dark', 'black']
export const PREFERENCE_KEY = 'vela_ui_preferences_v1'

const THEMES = {
  blue:   { accent:'#356DFF', light:'#E8EEFF', dark:'#26334D', black:'#18233A', lightBg:'#F4F7FF', lightSurface:'#EAF0FF', darkBg:'#111722', darkSurface:'#202B43', blackSurface:'#182137' },
  indigo: { accent:'#6750A4', light:'#EEE7F8', dark:'#302B3A', black:'#251A31', lightBg:'#F8F5FC', lightSurface:'#F0EAF8', darkBg:'#17131E', darkSurface:'#30263E', blackSurface:'#241A32' },
  teal:   { accent:'#00796B', light:'#DFF4EE', dark:'#203A36', black:'#102521', lightBg:'#F2FAF8', lightSurface:'#E6F6F0', darkBg:'#101A18', darkSurface:'#19332E', blackSurface:'#142823' },
  green:  { accent:'#2E7D32', light:'#E7F2E5', dark:'#293A2A', black:'#18271A', lightBg:'#F5FAF3', lightSurface:'#ECF5E9', darkBg:'#141A14', darkSurface:'#243828', blackSurface:'#1A2A1C' },
  amber:  { accent:'#B85C00', light:'#FFF0DB', dark:'#3D3023', black:'#2B1D11', lightBg:'#FFFAF2', lightSurface:'#FFF2E2', darkBg:'#1B1712', darkSurface:'#392819', blackSurface:'#2B1D12' },
  rose:   { accent:'#B3265E', light:'#FAE8EF', dark:'#3B2932', black:'#291722', lightBg:'#FFF5F8', lightSurface:'#FBEAF0', darkBg:'#1B1317', darkSurface:'#39212D', blackSurface:'#2B1720' },
  violet: { accent:'#7B4DFF', light:'#EFEAFF', dark:'#302A43', black:'#211936', lightBg:'#F7F5FF', lightSurface:'#F0ECFF', darkBg:'#161421', darkSurface:'#30264B', blackSurface:'#251B3B' },
  slate:  { accent:'#526477', light:'#E8EDF2', dark:'#29313B', black:'#171E27', lightBg:'#F4F7FA', lightSurface:'#EAF0F4', darkBg:'#13171B', darkSurface:'#293744', blackSurface:'#1C2732' }
}
const MODES = {
  light: { foreground:'#1C1B1F', secondary:'#625D6B', outline:'#E8E4EC' },
  dark:  { foreground:'#E5E1E9', secondary:'#C5C0CC', outline:'#44434B' },
  black: { foreground:'#FFFFFF', secondary:'#B8B8B8', outline:'#3A3A3A' }
}
export function makePalette(themeId, modeId) {
  const t = THEMES[themeId] || THEMES.blue
  const mode = MODE_IDS.indexOf(modeId) >= 0 ? modeId : 'light'
  const m = MODES[mode]
  return {
    accent:t.accent,
    soft:t[mode],
    bg: mode === 'light' ? t.lightBg : (mode === 'dark' ? t.darkBg : '#000000'),
    surface: mode === 'light' ? t.lightSurface : (mode === 'dark' ? t.darkSurface : t.blackSurface),
    fg:m.foreground, secondary:m.secondary, outline:m.outline
  }
}

