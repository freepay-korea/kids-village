import { Application, Container, Graphics, type FederatedPointerEvent } from 'pixi.js'

export type WashStage = 'scrub' | 'rinse' | 'shine' | 'done'

interface Spot {
  g: Graphics
  hp: number
}
interface Fading {
  g: Graphics
  vx: number
  vy: number
  life: number
  fade: number
}

export interface WashOptions {
  onStage: (stage: WashStage) => void
  /** 문지를 때마다 (소리용) */
  onTouch: (stage: WashStage) => void
}

const CAR_COLORS = [0xef4444, 0x3b82f6, 0xf59e0b, 0x22c55e, 0xa855f7]

/**
 * 세차장 PixiJS 장면.
 * 1) scrub: 진흙 묻은 차를 문지르면 거품이 나고 진흙이 지워진다
 * 2) rinse: 물을 뿌려(문질러) 거품을 씻어 낸다
 * 3) shine: 반짝이 효과 후 차가 떠난다
 */
export class WashScene {
  readonly app = new Application()
  stage: WashStage = 'scrub'
  private car = new Container()
  private body = new Graphics()
  private mud: Spot[] = []
  private bubbles: Fading[] = []
  private drops: Fading[] = []
  private sparks: Fading[] = []
  private fx = new Container()
  private down = false
  private lastTouch = 0
  /** 단계가 바뀐 직후에는 안내를 들을 수 있게 잠깐 터치를 쉰다 */
  private lockUntil = 0
  private driving = false
  private running = false

  constructor(private opts: WashOptions) {}

  async mount(host: HTMLElement) {
    await this.app.init({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    })
    host.appendChild(this.app.canvas)
    this.running = true
    const { width, height } = this.app.screen
    drawCar(this.body, CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)])
    this.car.addChild(this.body)
    this.car.x = width / 2
    this.car.y = height / 2 + 30
    this.car.scale.set(Math.min(width / 560, height / 380, 1.5))
    this.app.stage.addChild(this.car, this.fx)

    // 진흙
    for (let i = 0; i < 8; i++) {
      const g = new Graphics()
      const r = 14 + Math.random() * 10
      g.circle(0, 0, r).fill({ color: 0x78350f, alpha: 0.85 })
      g.circle(r * 0.5, -r * 0.3, r * 0.5).fill({ color: 0x92400e, alpha: 0.9 })
      g.x = -150 + Math.random() * 300
      g.y = -70 + Math.random() * 90
      this.car.addChild(g)
      this.mud.push({ g, hp: 4 })
    }

    const st = this.app.stage
    st.eventMode = 'static'
    st.hitArea = this.app.screen
    st.on('pointerdown', (e: FederatedPointerEvent) => {
      this.down = true
      this.touch(e.global.x, e.global.y)
    })
    st.on('pointermove', (e: FederatedPointerEvent) => {
      if (this.down) this.touch(e.global.x, e.global.y)
    })
    const up = () => (this.down = false)
    st.on('pointerup', up)
    st.on('pointerupoutside', up)
    this.app.ticker.add(this.tick)
  }

  destroy() {
    this.running = false
    this.app.ticker.remove(this.tick)
    this.app.destroy(true, { children: true })
  }

  private touch(x: number, y: number) {
    if (this.stage === 'shine' || this.stage === 'done') return
    const now = performance.now()
    if (now < this.lockUntil) return
    if (now - this.lastTouch > 120) {
      this.lastTouch = now
      this.opts.onTouch(this.stage)
    }
    const local = this.car.toLocal({ x, y })
    if (this.stage === 'scrub') {
      for (let i = 0; i < 2; i++) this.addBubble(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50)
      for (const s of [...this.mud]) {
        const d = Math.hypot(s.g.x - local.x, s.g.y - local.y)
        if (d < 55) {
          s.hp -= 1
          s.g.alpha = s.hp / 4
          if (s.hp <= 0) {
            this.mud.splice(this.mud.indexOf(s), 1)
            this.car.removeChild(s.g)
            s.g.destroy()
          }
        }
      }
      if (this.mud.length === 0) this.setStage('rinse')
    } else if (this.stage === 'rinse') {
      for (let i = 0; i < 3; i++) this.addDrop(x + (Math.random() - 0.5) * 40, y - 20)
      for (const b of this.bubbles) {
        const d = Math.hypot(b.g.x - x, b.g.y - y)
        if (d < 70) b.fade = 0.12
      }
      if (this.bubbles.length === 0) this.setStage('shine')
    }
  }

  private setStage(stage: WashStage) {
    if (this.stage === stage) return
    this.stage = stage
    this.lockUntil = performance.now() + 1500
    this.opts.onStage(stage)
    if (stage === 'rinse' && this.bubbles.length === 0) {
      // 거품이 하나도 없으면 바로 반짝
      this.setStage('shine')
    }
    if (stage === 'shine') {
      for (let i = 0; i < 24; i++) {
        const g = new Graphics()
        drawStar(g, 6 + Math.random() * 8)
        g.x = this.car.x + (Math.random() - 0.5) * 360
        g.y = this.car.y + (Math.random() - 0.5) * 200
        this.fx.addChild(g)
        this.sparks.push({ g, vx: 0, vy: -0.5, life: 1 + Math.random(), fade: 0.015 })
      }
      setTimeout(() => {
        this.driving = true
        setTimeout(() => this.setStage('done'), 1400)
      }, 1600)
    }
  }

  private addBubble(x: number, y: number) {
    const g = new Graphics()
    const r = 10 + Math.random() * 14
    g.circle(0, 0, r).fill({ color: 0xffffff, alpha: 0.85 })
    g.circle(-r * 0.3, -r * 0.3, r * 0.3).fill({ color: 0xffffff, alpha: 1 })
    g.x = x
    g.y = y
    this.fx.addChild(g)
    this.bubbles.push({ g, vx: (Math.random() - 0.5) * 0.3, vy: -0.15, life: 1, fade: 0 })
    if (this.bubbles.length > 70) {
      const old = this.bubbles.shift()!
      this.fx.removeChild(old.g)
      old.g.destroy()
    }
  }

  private addDrop(x: number, y: number) {
    const g = new Graphics().ellipse(0, 0, 4, 7).fill({ color: 0x38bdf8, alpha: 0.9 })
    g.x = x
    g.y = y
    this.fx.addChild(g)
    this.drops.push({ g, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, life: 1, fade: 0.03 })
  }

  private tick = () => {
    if (!this.running) return
    const dt = this.app.ticker.deltaTime
    const step = (list: Fading[], gravity = 0) => {
      for (const p of [...list]) {
        p.g.x += p.vx * dt
        p.g.y += p.vy * dt
        p.vy += gravity * dt
        p.life -= p.fade * dt
        p.g.alpha = Math.max(Math.min(p.life, 1), 0)
        if (p.life <= 0) {
          list.splice(list.indexOf(p), 1)
          this.fx.removeChild(p.g)
          p.g.destroy()
        }
      }
    }
    step(this.bubbles)
    step(this.drops, 0.2)
    step(this.sparks)
    if (this.stage === 'rinse' && this.bubbles.length === 0) this.setStage('shine')
    if (this.driving) {
      this.car.x += 6 * dt
      this.car.y += Math.sin(this.car.x / 10) * 0.6
    }
  }
}

function drawCar(g: Graphics, color: number) {
  g.clear()
  // 바퀴
  for (const x of [-100, 100]) {
    g.circle(x, 72, 30).fill(0x1f2937)
    g.circle(x, 72, 14).fill(0x9ca3af)
  }
  // 차체
  g.roundRect(-170, 0, 340, 70, 24).fill(color)
  g.roundRect(-110, -70, 220, 90, 28).fill(color)
  // 창문
  g.roundRect(-95, -58, 90, 60, 14).fill(0xbae6fd)
  g.roundRect(5, -58, 90, 60, 14).fill(0xbae6fd)
  // 전조등
  g.circle(160, 30, 10).fill(0xfef08a)
  g.circle(-160, 30, 10).fill(0xfca5a5)
}

function drawStar(g: Graphics, r: number) {
  const pts: number[] = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    pts.push(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  g.poly(pts).fill(0xfde047)
}
