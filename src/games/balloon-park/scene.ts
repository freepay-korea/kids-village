import { Application, Container, FillGradient, Graphics, type FederatedPointerEvent } from 'pixi.js'
import { colors, type BalloonColor } from './colors'

interface Balloon {
  g: Graphics
  color: BalloonColor
  vy: number
  phase: number
  scale: number
}

interface Particle {
  g: Graphics
  vx: number
  vy: number
  life: number
}

export interface SceneOptions {
  onPop: (color: BalloonColor) => void
}

/**
 * 풍선이 아래에서 떠오르는 PixiJS 장면. 그리기·움직임·터짐만 맡고, 규칙(놀이/미션)은 React 쪽이 정한다.
 * - speed: 1이 기본, 미션 난이도에 따라 올린다
 * - favored: 이 색이 더 자주 나온다 (미션 목표색)
 * - blocked: 이 색의 풍선은 탭해도 안 터지고 튕긴다 (미션에서 다른 색)
 */
export class BalloonScene {
  readonly app = new Application()
  speed = 1
  favored: BalloonColor | null = null
  blocked = false
  private balloons: Balloon[] = []
  private particles: Particle[] = []
  private layer = new Container()
  private fx = new Container()
  private spawnTimer = 0
  private running = false

  constructor(private opts: SceneOptions) {}

  async mount(host: HTMLElement) {
    await this.app.init({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    })
    host.appendChild(this.app.canvas)
    this.app.stage.addChild(this.drawClouds(), this.layer, this.fx)
    this.app.ticker.add(this.tick)
    this.running = true
    // 처음에 몇 개 미리 띄워 둔다
    for (let i = 0; i < 4; i++) this.spawn(this.app.screen.height * Math.random())
  }

  destroy() {
    this.running = false
    this.app.ticker.remove(this.tick)
    this.app.destroy(true, { children: true })
  }

  /** 뒤에 떠 있는 연한 구름 */
  private drawClouds() {
    const c = new Container()
    const { width, height } = this.app.screen
    for (let i = 0; i < 5; i++) {
      const g = new Graphics()
      const x = (width / 5) * i + 40
      const y = 40 + (i % 2) * 70
      const s = 0.8 + (i % 3) * 0.3
      g.ellipse(x, y + 10, 50 * s, 22 * s).fill({ color: 0xffffff, alpha: 0.85 })
      g.ellipse(x + 40 * s, y, 45 * s, 30 * s).fill({ color: 0xffffff, alpha: 0.85 })
      g.ellipse(x + 80 * s, y + 12, 36 * s, 20 * s).fill({ color: 0xffffff, alpha: 0.85 })
      c.addChild(g)
    }
    c.alpha = 0.9
    void height
    return c
  }

  private pickColor(): BalloonColor {
    if (this.favored && Math.random() < 0.45) return this.favored
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private spawn(y?: number) {
    const { width, height } = this.app.screen
    const color = this.pickColor()
    const scale = 0.8 + Math.random() * 0.45
    const g = new Graphics()
    drawBalloon(g, color.hex)
    g.scale.set(scale)
    g.x = 60 + Math.random() * Math.max(width - 120, 1)
    g.y = y ?? height + 80
    g.eventMode = 'static'
    g.cursor = 'pointer'
    // 터치 영역을 넉넉하게 (64px 이상)
    g.hitArea = { contains: (x: number, y: number) => x * x + (y + 10) * (y + 10) < 60 * 60 }
    const balloon: Balloon = { g, color, vy: 0.6 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, scale }
    g.on('pointerdown', (e: FederatedPointerEvent) => {
      e.stopPropagation()
      this.tap(balloon)
    })
    this.layer.addChild(g)
    this.balloons.push(balloon)
  }

  private tap(b: Balloon) {
    if (this.blocked && this.favored && b.color.id !== this.favored.id) {
      // 다른 색: 터지지 않고 살짝 튕긴다
      b.g.scale.set(b.scale * 1.15)
      b.g.y += 25
      setTimeout(() => b.g.scale.set(b.scale), 120)
      this.opts.onPop(b.color)
      return
    }
    this.pop(b)
    this.opts.onPop(b.color)
  }

  private pop(b: Balloon) {
    const i = this.balloons.indexOf(b)
    if (i >= 0) this.balloons.splice(i, 1)
    const { x, y } = b.g
    this.layer.removeChild(b.g)
    b.g.destroy()
    for (let k = 0; k < 12; k++) {
      const p = new Graphics().circle(0, 0, 4 + Math.random() * 5).fill(b.color.hex)
      p.x = x
      p.y = y
      const a = (k / 12) * Math.PI * 2
      const sp = 3 + Math.random() * 4
      this.fx.addChild(p)
      this.particles.push({ g: p, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1 })
    }
  }

  private tick = () => {
    if (!this.running) return
    const dt = this.app.ticker.deltaTime
    const { height } = this.app.screen

    this.spawnTimer += dt
    const interval = 55 / this.speed
    if (this.spawnTimer > interval && this.balloons.length < 9) {
      this.spawnTimer = 0
      this.spawn()
    }

    for (const b of [...this.balloons]) {
      b.phase += 0.03 * dt
      b.g.y -= b.vy * this.speed * dt * 1.6
      b.g.x += Math.sin(b.phase) * 0.6 * dt
      b.g.rotation = Math.sin(b.phase) * 0.08
      if (b.g.y < -120) {
        this.balloons.splice(this.balloons.indexOf(b), 1)
        this.layer.removeChild(b.g)
        b.g.destroy()
      }
    }

    for (const p of [...this.particles]) {
      p.g.x += p.vx * dt
      p.g.y += p.vy * dt
      p.vy += 0.15 * dt
      p.life -= 0.04 * dt
      p.g.alpha = Math.max(p.life, 0)
      if (p.life <= 0) {
        this.particles.splice(this.particles.indexOf(p), 1)
        this.fx.removeChild(p.g)
        p.g.destroy()
      }
    }
    void height
  }
}

function drawBalloon(g: Graphics, color: number) {
  g.clear()
  // 줄
  g.moveTo(0, 54)
  g.quadraticCurveTo(12, 78, -2, 104)
  g.stroke({ width: 2.5, color: 0x6b7280, alpha: 0.8 })
  // 매듭
  g.poly([-7, 56, 7, 56, 0, 44]).fill(color)
  // 몸통: 위-왼쪽이 밝고 아래가 진한 그라데이션
  const light = mix(color, 0xffffff, 0.45)
  const dark = mix(color, 0x000000, 0.25)
  const grad = new FillGradient({ type: 'radial', center: { x: 0.35, y: 0.3 }, innerRadius: 0, outerCenter: { x: 0.5, y: 0.5 }, outerRadius: 0.75 })
  grad.addColorStop(0, light)
  grad.addColorStop(0.55, color)
  grad.addColorStop(1, dark)
  g.ellipse(0, 0, 40, 50).fill(grad)
  g.ellipse(0, 0, 40, 50).stroke({ width: 3, color: dark, alpha: 0.6 })
  // 하이라이트
  g.ellipse(-15, -20, 9, 15).fill({ color: 0xffffff, alpha: 0.75 })
  g.circle(-6, -34, 4).fill({ color: 0xffffff, alpha: 0.7 })
}

function mix(a: number, b: number, t: number) {
  const ch = (sh: number) => Math.round(((a >> sh) & 0xff) * (1 - t) + ((b >> sh) & 0xff) * t)
  return (ch(16) << 16) | (ch(8) << 8) | ch(0)
}
