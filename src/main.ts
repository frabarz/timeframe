import './style.css'
import { CanvasEngine } from './canvas/engine.ts'
import { MockAdapter } from './adapters/mock.ts'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw new Error('Canvas element not found')

const adapter = new MockAdapter()
const engine = new CanvasEngine(canvas, adapter, {
  zoom: { zoomFactor: 5, sigmaMs: 1_800_000 },
})

void engine.start()
