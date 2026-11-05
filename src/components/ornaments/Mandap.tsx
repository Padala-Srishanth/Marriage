import { motion } from 'framer-motion'
import { Kalash } from './Motifs'

function Swag({ x1, x2, y, sag }: { x1: number; x2: number; y: number; sag: number }) {
  const flowers = 15
  return (
    <g>
      {Array.from({ length: flowers + 1 }, (_, i) => {
        const t = i / flowers
        const px = x1 + (x2 - x1) * t
        const py = y + sag * 4 * t * (1 - t)
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="6.2" fill={i % 2 ? '#C6A15B' : '#E9B44C'} />
            <circle cx={px} cy={py} r="2.1" fill="#781E32" />
          </g>
        )
      })}
    </g>
  )
}

function Strand({ x, length, delay }: { x: number; length: number; delay: number }) {
  const beads = Math.floor(length / 9)
  return (
    <g className="sway" style={{ transformOrigin: `${x}px 62px`, animationDelay: `${delay}s` }}>
      {Array.from({ length: beads }, (_, i) => (
        <circle key={i} cx={x} cy={62 + i * 9} r="3.1" fill={i % 7 === 6 ? '#C6A15B' : '#FFF8EB'} fillOpacity="0.92" />
      ))}
      <path
        d={`M${x - 7} ${70 + beads * 9} C ${x - 7} ${58 + beads * 9}, ${x + 7} ${58 + beads * 9}, ${x + 7} ${70 + beads * 9} L ${x + 9} ${74 + beads * 9} H ${x - 9} Z`}
        fill="#C6A15B"
      />
      <circle cx={x} cy={76 + beads * 9} r="2.1" fill="#EBD49C" />
    </g>
  )
}

/** The carved beam of the mandap, hung with garlands and jasmine strands. */
export function MandapCanopy() {
  const span = 240
  const nodes = Array.from({ length: 7 }, (_, i) => i * span)
  const cusps = Array.from({ length: 48 }, () => 'q 15 26 30 0').join(' ')
  const diamonds = Array.from({ length: 72 }, (_, i) => i * 20 + 10)

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[112px] sm:h-[196px]">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMin slice" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22040D" />
            <stop offset="1" stopColor="#4B0C1E" />
          </linearGradient>
        </defs>
        <rect width="1440" height="50" fill="url(#beam)" />
        <path d="M0 50 H 1440 M0 44 H 1440 M0 6 H 1440" stroke="#C6A15B" strokeWidth="1.2" />
        {diamonds.map((x) => (
          <path key={x} d={`M${x} 17 l 7 8 l -7 8 l -7 -8 Z`} fill="none" stroke="#C6A15B" strokeWidth="1" />
        ))}
        <path d={`M0 50 ${cusps} V 50 Z`} fill="#4B0C1E" stroke="#C6A15B" strokeWidth="1.2" />

        {nodes.slice(0, -1).map((x, i) => (
          <Swag key={x} x1={x} x2={x + span} y={58} sag={i === 2 || i === 3 ? 54 : 74} />
        ))}
        {nodes.map((x, i) => (
          <Strand key={x} x={x} length={i === 3 ? 0 : 92 + ((i * 29) % 34)} delay={i * -0.7} />
        ))}
        {nodes.slice(0, -1).map((x, i) =>
          i === 2 || i === 3 ? null : <Strand key={`m${x}`} x={x + span / 2} length={38} delay={i * -1.2} />,
        )}
      </svg>
      <div className="absolute left-1/2 top-1.5 -translate-x-1/2 text-gold-light [--kalash-fill:#4B0C1E]">
        <Kalash className="h-[58px] w-[46px] sm:h-[78px] sm:w-[62px]" />
      </div>
    </div>
  )
}

/**
 * A Dravidian temple pillar assembled from stacked blocks. It is shaded from
 * the side so the columns read as stone lit by lamps at the centre of the hall.
 */
export function MandapPillar({ side }: { side: 'left' | 'right' }) {
  const id = `stone-${side}`
  const litEdge = side === 'left' ? 1 : 0
  const blocks = [160, 345, 530]

  return (
    <svg
      viewBox="0 0 150 900"
      preserveAspectRatio={side === 'left' ? 'xMinYMax slice' : 'xMaxYMax slice'}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-[1] hidden h-full sm:block sm:w-[90px] lg:w-[140px] ${side === 'left' ? 'left-0' : 'right-0'}`}
    >
      <defs>
        <linearGradient id={id} x1={1 - litEdge} y1="0" x2={litEdge} y2="0">
          <stop offset="0" stopColor="#1B030A" />
          <stop offset="0.65" stopColor="#4B0C1E" />
          <stop offset="1" stopColor="#8A3343" />
        </linearGradient>
      </defs>
      <g stroke="#C6A15B" strokeWidth="1.3" fill={`url(#${id})`}>
        {/* Corbel capital */}
        <path d="M0 76 H 150 V 96 C 150 118, 128 118, 124 132 H 26 C 22 118, 0 118, 0 96 Z" />
        <rect x="14" y="132" width="122" height="14" />
        {/* Shaft */}
        <rect x="30" y="146" width="90" height="620" />
        {/* Carved blocks */}
        {blocks.map((y) => (
          <g key={y}>
            <rect x="16" y={y} width="118" height="104" />
            <rect x="24" y={y + 8} width="102" height="88" fill="none" />
            <g fill="none" transform={`translate(75 ${y + 52})`}>
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d="M0 0 C 7 -8, 8 -22, 0 -34 C -8 -22, -7 -8, 0 0 Z" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <rect x="12" y={y + 104} width="126" height="8" />
            <rect x="12" y={y - 8} width="126" height="8" />
          </g>
        ))}
        {/* Shaft banding between the blocks */}
        <g fill="none">
          {[280, 306, 465, 491, 650, 676].map((y) => (
            <path key={y} d={`M30 ${y} H 120`} />
          ))}
          {[52, 75, 98].map((x) => (
            <path key={x} d={`M${x} 288 V 300 M${x} 473 V 485 M${x} 658 V 670`} />
          ))}
        </g>
        {/* Lotus base and plinth */}
        <path d="M30 766 C 18 790, 10 806, 8 824 H 142 C 140 806, 132 790, 120 766 Z" />
        <rect x="2" y="824" width="146" height="20" />
        <rect x="0" y="844" width="150" height="56" />
      </g>
    </svg>
  )
}

function Diya({ delay, lit, lightAfter }: { delay: number; lit: boolean; lightAfter: number }) {
  return (
    <svg viewBox="0 0 40 52" className="h-9 w-7 sm:h-12 sm:w-9" aria-hidden="true">
      <defs>
        <radialGradient id="flameGlow">
          <stop offset="0" stopColor="#FFD98A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFD98A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.g
        style={{ originX: '20px', originY: '30px' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={lit ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: lightAfter, ease: 'backOut' }}
      >
        <g className="flicker" style={{ transformOrigin: '20px 30px', animationDelay: `${delay}s` }}>
          <circle cx="20" cy="17" r="17" fill="url(#flameGlow)" />
          <path d="M20 8 C 26 17, 25 26, 20 30 C 15 26, 14 17, 20 8 Z" fill="#FFC861" />
          <path d="M20 16 C 23 21, 22 26, 20 29 C 18 26, 17 21, 20 16 Z" fill="#FFF3C9" />
        </g>
      </motion.g>
      <path d="M2 31 C 6 48, 34 48, 38 31 C 28 35, 12 35, 2 31 Z" fill="#C6A15B" stroke="#70500F" strokeWidth="0.8" />
    </svg>
  )
}

/** The raised floor of the mandap, with its row of lit diyas. */
export function MandapFloor({ lit }: { lit: boolean }) {
  const lamps = [-0.3, -1.1, -0.6, -1.5, -0.9, -0.2]
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]">
      <div className="flex items-end justify-between px-5 sm:px-[110px] lg:px-[170px]">
        <div className="flex gap-2 sm:gap-5">
          {lamps.slice(0, 3).map((delay, i) => (
            <div key={i} className={i === 2 ? 'hidden sm:block' : undefined}>
              <Diya delay={delay} lit={lit} lightAfter={0.2 + (2 - i) * 0.3} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 sm:gap-5">
          {lamps.slice(3).map((delay, i) => (
            <div key={i} className={i === 0 ? 'hidden sm:block' : undefined}>
              <Diya delay={delay} lit={lit} lightAfter={0.2 + i * 0.3} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 border-y border-gold/70 bg-burgundy-deep sm:h-4" />
      <div className="h-2 bg-burgundy-night" />
    </div>
  )
}
