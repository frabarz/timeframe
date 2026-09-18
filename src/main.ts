import './style.css'
import { CanvasEngine } from './canvas/engine.ts'
import { MockAdapter } from './adapters/mock.ts'
import { THEMES, initTheme, setTheme, type ThemeId } from './canvas/config.ts'

const currentTheme = initTheme()

// populate theme picker
const select = document.getElementById('theme-select') as HTMLSelectElement | null
if (select) {
  for (const [id, theme] of Object.entries(THEMES)) {
    const opt = document.createElement('option')
    opt.value = id
    opt.textContent = theme.label
    select.appendChild(opt)
  }
  select.value = currentTheme
  select.addEventListener('change', () => {
    setTheme(select.value as ThemeId)
  })
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw new Error('Canvas element not found')

const adapter = new MockAdapter()
const engine = new CanvasEngine(canvas, adapter, {
  zoom: { zoomFactor: 5, sigmaMs: 1_800_000 },
})

void engine.start()
