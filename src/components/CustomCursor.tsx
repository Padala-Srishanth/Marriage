import { useEffect, useRef } from 'react'

/** A gold ring that trails the pointer on desktop. The normal cursor stays visible. */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ring.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!element || !canHover || calm) return

    let targetX = -100
    let targetY = -100
    let x = -100
    let y = -100
    let size = 1
    let targetSize = 1
    let frame = 0

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      element.style.opacity = '1'
      const over = event.target instanceof Element && event.target.closest('a, button')
      targetSize = over ? 1.7 : 1
    }
    const onLeave = () => {
      element.style.opacity = '0'
    }

    const tick = () => {
      x += (targetX - x) * 0.2
      y += (targetY - y) * 0.2
      size += (targetSize - size) * 0.18
      element.style.transform = `translate3d(${x - 15}px, ${y - 15}px, 0) scale(${size})`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] h-[30px] w-[30px] rounded-full border border-gold opacity-0 shadow-[0_0_12px_rgba(198,161,91,0.55)] transition-opacity duration-300"
    />
  )
}
