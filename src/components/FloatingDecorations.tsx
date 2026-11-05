import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Petal = { x: number; y: number; size: number; fall: number; drift: number; phase: number; spin: number; angle: number; sprite: number }
type Mote = { x: number; y: number; radius: number; rise: number; phase: number }

const PETAL_COLOURS: [string, string][] = [
  ['#C93A55', '#7E1730'],
  ['#D9566D', '#8E1F38'],
  ['#E7A0A6', '#B04A5C'],
]

// Petals are painted once to small bitmaps, then only moved. That keeps the
// animation cheap on phones.
function makeSprite([light, dark]: [string, string]) {
  const size = 48
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const c = canvas.getContext('2d')!
  const gradient = c.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, light)
  gradient.addColorStop(1, dark)
  c.fillStyle = gradient
  c.beginPath()
  c.moveTo(24, 2)
  c.bezierCurveTo(46, 12, 42, 40, 24, 46)
  c.bezierCurveTo(6, 40, 2, 12, 24, 2)
  c.fill()
  return canvas
}

/** Rose petals across the whole page, and gold dust in the lamplight of the first screen. */
export function FloatingDecorations() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    const c = canvas.getContext('2d')
    if (!c) return

    const sprites = PETAL_COLOURS.map(makeSprite)
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      c.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const narrow = width < 768
    const petals: Petal[] = Array.from({ length: narrow ? 9 : 16 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 11,
      fall: 16 + Math.random() * 24,
      drift: 10 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.2,
      angle: Math.random() * Math.PI * 2,
      sprite: i % sprites.length,
    }))
    const motes: Mote[] = Array.from({ length: narrow ? 22 : 44 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.5 + Math.random() * 1.5,
      rise: 5 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
    }))

    let frame = 0
    let last = performance.now()

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      c.clearRect(0, 0, width, height)

      const heroShare = 1 - Math.min(window.scrollY / height, 1)
      if (heroShare > 0) {
        c.fillStyle = '#FFE3A6'
        for (const mote of motes) {
          mote.y -= mote.rise * dt
          if (mote.y < -4) mote.y = height + 4
          c.globalAlpha = heroShare * (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(now / 900 + mote.phase)))
          c.beginPath()
          c.arc(mote.x + Math.sin(now / 2400 + mote.phase) * 8, mote.y, mote.radius, 0, Math.PI * 2)
          c.fill()
        }
      }

      c.globalAlpha = 0.82
      for (const petal of petals) {
        petal.y += petal.fall * dt
        petal.angle += petal.spin * dt
        if (petal.y > height + 30) {
          petal.y = -30
          petal.x = Math.random() * width
        }
        const x = petal.x + Math.sin(now / 1800 + petal.phase) * petal.drift
        const tumble = 0.35 + 0.65 * Math.abs(Math.sin(now / 1400 + petal.phase))
        c.save()
        c.translate(x, petal.y)
        c.rotate(petal.angle)
        c.scale(tumble, 1)
        c.drawImage(sprites[petal.sprite], -petal.size / 2, -petal.size / 2, petal.size, petal.size)
        c.restore()
      }
      c.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) {
        last = performance.now()
        frame = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  if (reduced) return null
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
}
