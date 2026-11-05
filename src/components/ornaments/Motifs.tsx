import { motion } from 'framer-motion'
import type { SVGProps } from 'react'

const lotusPetal = 'M0 0 C 9 -10, 11 -26, 0 -42 C -11 -26, -9 -10, 0 0 Z'

/** A concentric lotus rosette. With `draw`, its lines trace themselves when scrolled into view. */
export function Mandala({ draw = false, ...props }: SVGProps<SVGSVGElement> & { draw?: boolean }) {
  const rings = [
    { radius: 26, count: 8, scale: 0.72 },
    { radius: 52, count: 12, scale: 0.95 },
    { radius: 86, count: 16, scale: 1.2 },
    { radius: 126, count: 24, scale: 1.05 },
  ]
  const drawProps = draw
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 3.2, ease: 'easeInOut' as const },
      }
    : {}

  return (
    <svg viewBox="-190 -190 380 380" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...props}>
      {rings.map((ring) =>
        Array.from({ length: ring.count }, (_, i) => (
          <g key={`${ring.radius}-${i}`} transform={`rotate(${(360 / ring.count) * i}) translate(0 ${-ring.radius}) scale(${ring.scale})`}>
            <motion.path d={lotusPetal} {...drawProps} />
          </g>
        )),
      )}
      {[22, 50, 84, 124, 176].map((radius) => (
        <motion.circle key={radius} r={radius} strokeOpacity="0.7" {...drawProps} />
      ))}
      <circle r="9" fill="currentColor" stroke="none" />
      {Array.from({ length: 48 }, (_, i) => {
        const angle = (i / 48) * Math.PI * 2
        return <circle key={i} cx={Math.cos(angle) * 182} cy={Math.sin(angle) * 182} r="2.2" fill="currentColor" stroke="none" />
      })}
    </svg>
  )
}

/** A purna kalash: brass pot, mango leaves, coconut. */
export function Kalash({ bloom, ...props }: SVGProps<SVGSVGElement> & { bloom?: boolean }) {
  return (
    <svg viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>
      {[-58, -36, -14, 14, 36, 58].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 60 62)`}>
          {/* With bloom set, the mango leaves unfold from the centre outwards */}
          <motion.path
            d="M60 62 C 52 48, 52 30, 60 16 C 68 30, 68 48, 60 62 Z M60 60 V 22"
            strokeWidth="1"
            initial={bloom === undefined ? false : { pathLength: 0 }}
            animate={bloom === undefined ? undefined : { pathLength: bloom ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.6 + (Math.abs(angle) / 22) * 0.25, ease: 'easeOut' }}
          />
        </g>
      ))}
      <path d="M60 14 C 45 18, 42 38, 46 50 H 74 C 78 38, 75 18, 60 14 Z" fill="var(--kalash-fill, none)" />
      <path d="M46 56 H 74 M42 62 H 78" strokeWidth="1.8" />
      <path d="M46 62 C 22 74, 18 112, 42 130 H 78 C 102 112, 98 74, 74 62" fill="var(--kalash-fill, none)" />
      <path d="M28 86 C 45 94, 75 94, 92 86 M26 102 C 44 110, 76 110, 94 102" strokeWidth="1" />
      {[34, 47, 60, 73, 86].map((x, i) => (
        <circle key={x} cx={x} cy={i === 2 ? 97 : i % 4 === 0 ? 94 : 96} r="1.7" fill="currentColor" stroke="none" />
      ))}
      <path d="M42 130 L 36 142 H 84 L 78 130" />
      <path d="M28 146 H 92" strokeWidth="1.8" />
    </svg>
  )
}

export function Lotus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
      {[-68, -46, -24, 0, 24, 46, 68].map((angle) => (
        <path key={angle} d="M60 56 C 48 42, 48 22, 60 4 C 72 22, 72 42, 60 56 Z" transform={`rotate(${angle} 60 56)`} />
      ))}
      <path d="M26 60 H 94" strokeWidth="1.6" />
    </svg>
  )
}

/** Hairline, lotus, hairline. Used as the separator between lines of text. */
export function OrnamentRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-current sm:w-24" />
      <Lotus className="h-4 w-8 shrink-0" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-current sm:w-24" />
    </div>
  )
}

/** The carved corner used on the invitation card. */
export function CornerFlourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" className={className}>
      <path d="M2 78 V 18 C 2 8, 8 2, 18 2 H 78" />
      <path d="M9 78 V 24 C 9 15, 15 9, 24 9 H 78" strokeOpacity="0.55" />
      <path d="M16 16 C 22 30, 34 36, 46 34 C 40 24, 30 16, 16 16 Z" />
      <path d="M16 16 C 30 22, 36 34, 34 46 C 24 40, 16 30, 16 16 Z" />
      <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" />
      <circle cx="52" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="52" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** A row of cusped scallops that hangs from the bottom of the section above. */
export function ScallopEdge({ color }: { color: string }) {
  const lobes = 36
  const width = 1440 / lobes
  const path = Array.from({ length: lobes }, () => `q ${width / 2} 44 ${width} 0`).join(' ')
  return (
    <motion.svg
      viewBox="0 0 1440 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 w-full sm:h-6"
      initial={{ clipPath: 'inset(0 50% 0 50%)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d={`M0 0 ${path} V 0 Z`} fill={color} />
    </motion.svg>
  )
}

/** Mamidi thoranam: the mango-leaf garland tied over a Telugu home's doorway on auspicious days. */
export function MangoToran({ className = '' }: { className?: string }) {
  const spacing = 40
  const leaves = Math.ceil(1440 / spacing)
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="xMidYMin slice" aria-hidden="true" className={className}>
      <path d="M0 8 H 1440" stroke="#C6A15B" strokeWidth="2.5" />
      {Array.from({ length: leaves }, (_, i) => {
        const x = i * spacing + spacing / 2
        const tilt = ((i * 37) % 11) - 5
        const length = 74 + ((i * 53) % 22)
        const shade = i % 2 ? '#1F5140' : '#2C6A52'
        return (
          <g key={i} transform={`translate(${x} 8) rotate(${tilt})`}>
            <path d={`M0 0 C 15 ${length * 0.25}, 15 ${length * 0.65}, 0 ${length} C -15 ${length * 0.65}, -15 ${length * 0.25}, 0 0 Z`} fill={shade} stroke="#0E2820" strokeWidth="0.8" />
            <path d={`M0 2 V ${length - 4}`} stroke="#C6A15B" strokeOpacity="0.65" strokeWidth="0.8" />
            {i % 4 === 0 && (
              <g transform="translate(20 8)">
                <circle r="10" fill="#C6A15B" />
                <circle r="6" fill="#E9B44C" />
                <circle r="2.6" fill="#781E32" />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
