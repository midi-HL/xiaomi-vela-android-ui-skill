// Render the supplied SVG illustration into 8 themes x 3 display modes.
// Requires Node.js and sharp: npm install sharp
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const here = __dirname
const svgTemplate = fs.readFileSync(path.join(here, 'empty-state.svg'), 'utf8')
const outDir = path.join(here, 'images')
const themes = {
  blue: '#356DFF', indigo: '#6750A4', teal: '#00796B', green: '#2E7D32',
  amber: '#B85C00', rose: '#B3265E', violet: '#7B4DFF', slate: '#526477'
}
const modes = {
  light: { base: '#EFF3FC', tint: 0.14 },
  dark: { base: '#22252B', tint: 0.20 },
  black: { base: '#111111', tint: 0.24 }
}

function blend(hex, base, amount) {
  const channel = (value, offset) => parseInt(value.slice(offset, offset + 2), 16)
  const toHex = value => Math.round(value).toString(16).padStart(2, '0')
  const fg = [channel(hex, 1), channel(hex, 3), channel(hex, 5)]
  const bg = [channel(base, 1), channel(base, 3), channel(base, 5)]
  return '#' + fg.map((v, i) => toHex(v * amount + bg[i] * (1 - amount))).join('')
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  for (const [theme, accent] of Object.entries(themes)) {
    for (const [mode, options] of Object.entries(modes)) {
      const svg = svgTemplate
        .replaceAll('{{accent}}', accent)
        .replaceAll('{{accentSoft}}', blend(accent, options.base, options.tint))
      await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${theme}-${mode}.png`))
    }
  }
  console.log(`Rendered ${Object.keys(themes).length * Object.keys(modes).length} themed empty-state illustrations.`)
}

main().catch(error => { console.error(error); process.exitCode = 1 })
