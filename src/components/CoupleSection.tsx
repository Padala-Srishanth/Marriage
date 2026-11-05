import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import type { StringKey } from '../i18n/strings'
import { Bride, Garland, Groom, SacredFire, Tera } from './ornaments/WeddingFigures'
import { OrnamentRule, ScallopEdge } from './ornaments/Motifs'

// The scene plays as the guest scrolls. Each beat owns a slice of the
// section's scroll progress, from 0 (section top reaches the screen top)
// to 1 (section bottom reaches the screen bottom).
const BEATS: Record<string, [number, number]> = {
  enter: [0, 0.1],
  curtain: [0.12, 0.22],
  approach: [0.24, 0.32],
  jeelakarra: [0.33, 0.4],
  garlandToBride: [0.42, 0.48],
  garlandToGroom: [0.49, 0.55],
  mangalsutra: [0.57, 0.64],
  rice: [0.65, 0.76],
  fire: [0.75, 0.79],
  saptapadi: [0.79, 0.88],
  knot: [0.88, 0.92],
  names: [0.92, 0.97],
}

const CAPTIONS: { key: StringKey; range: readonly [number, number] }[] = [
  { key: 'sceneTera', range: [0, 0.12] },
  { key: 'sceneMuhurtham', range: [0.12, 0.32] },
  { key: 'sceneJeelakarra', range: [0.32, 0.41] },
  { key: 'sceneGarlands', range: [0.41, 0.56] },
  { key: 'sceneMangalsutra', range: [0.56, 0.65] },
  { key: 'sceneTalambralu', range: [0.65, 0.78] },
  { key: 'sceneSaptapadi', range: [0.78, 0.88] },
  { key: 'sceneTogether', range: [0.88, 1.01] },
]

const FLOOR = 452
const CENTRE = 400

function Caption({ progress, text, range: [start, end] }: { progress: MotionValue<number>; text: string; range: readonly [number, number] }) {
  const fade = 0.025
  const opacity = useTransform(progress, [start, start + fade, end - fade, end], [0, 1, 1, end > 1 ? 1 : 0])
  const y = useTransform(progress, [start, start + fade], [12, 0])
  return (
    <motion.p style={{ opacity, y }} className="absolute inset-x-0 top-0 font-serif text-xl italic leading-snug text-burgundy sm:text-2xl">
      {text}
    </motion.p>
  )
}

// Talambralu: turmeric-yellow and kumkum-red rice showered over the couple
const GRAINS = Array.from({ length: 90 }, (_, i) => {
  const seed = Math.sin(i * 91.7) * 10000
  const r = seed - Math.floor(seed)
  const r2 = Math.sin(i * 12.9) * 0.5 + 0.5
  return {
    x: CENTRE - 120 + r * 240,
    from: 40 + r2 * 60,
    to: 250 + r * 190,
    start: BEATS.rice[0] + (i % 10) * 0.009 + r2 * 0.02,
    colour: i % 3 === 0 ? '#B3122E' : '#E9B44C',
    tilt: r * 180,
  }
})

function Grain({ progress, grain }: { progress: MotionValue<number>; grain: (typeof GRAINS)[number] }) {
  const end = grain.start + 0.09
  const y = useTransform(progress, [grain.start, end], [grain.from, grain.to])
  const opacity = useTransform(progress, [grain.start - 0.001, grain.start, end - 0.01, end], [0, 1, 1, 0])
  return (
    <motion.g style={{ y, opacity }}>
      <ellipse cx={grain.x} cy="0" rx="2.8" ry="5.2" fill={grain.colour} transform={`rotate(${grain.tilt} ${grain.x} 0)`} />
    </motion.g>
  )
}

// Jeelakarra bellam: a paste of cumin and jaggery carried from one hand to the other's head
function Paste({ progress, from, to, range: [start, end] }: { progress: MotionValue<number>; from: [number, number]; to: [number, number]; range: readonly [number, number] }) {
  const t = useTransform(progress, [start, end], [0, 1])
  const lift = 70
  const x = useTransform(t, (v) => from[0] + (to[0] - from[0]) * v)
  const y = useTransform(t, (v) => from[1] + (to[1] - from[1]) * v - lift * 4 * v * (1 - v))
  const opacity = useTransform(progress, [start - 0.005, start, end, end + 0.06], [0, 1, 1, 0.65])
  const halo = useTransform(progress, [end - 0.01, end + 0.02, end + 0.08], [0, 1, 0.35])
  return (
    <>
      <motion.circle cx={to[0]} cy={to[1]} r="26" fill="url(#sceneGlow)" style={{ opacity: halo }} />
      <motion.circle r="6" fill="#8B5A2B" stroke="#EBD49C" strokeWidth="1.5" style={{ x, y, opacity }} />
    </>
  )
}

function Sparkle({ progress, at, start }: { progress: MotionValue<number>; at: [number, number]; start: number }) {
  const scale = useTransform(progress, [start, start + 0.012, start + 0.03], [0, 1.4, 0.8])
  const opacity = useTransform(progress, [start, start + 0.008], [0, 1])
  const [x, y] = at
  return (
    <motion.path
      d={`M ${x} ${y - 8} L ${x + 2} ${y - 2} L ${x + 8} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 8} L ${x - 2} ${y + 2} L ${x - 8} ${y} L ${x - 2} ${y - 2} Z`}
      fill="#FFE3A6"
      style={{ scale, opacity, originX: `${x}px`, originY: `${y}px` }}
    />
  )
}

// Saptapadi: seven footprints appear one by one around the sacred fire
const STEPS = Array.from({ length: 7 }, (_, i) => {
  const angle = Math.PI * (0.92 - (i / 6) * 0.84)
  return {
    x: CENTRE + Math.cos(angle) * 118,
    y: FLOOR + 32 + Math.sin(angle) * 22,
    turn: 90 - (angle * 180) / Math.PI,
    start: BEATS.saptapadi[0] + (i / 7) * (BEATS.saptapadi[1] - BEATS.saptapadi[0]),
  }
})

function Footprint({ progress, step }: { progress: MotionValue<number>; step: (typeof STEPS)[number] }) {
  const opacity = useTransform(progress, [step.start, step.start + 0.01], [0, 1])
  const glow = useTransform(progress, [step.start, step.start + 0.01, step.start + 0.04], [0, 1, 0.3])
  return (
    <g transform={`translate(${step.x} ${step.y}) rotate(${step.turn})`}>
      <motion.circle r="14" fill="url(#sceneGlow)" style={{ opacity: glow }} />
      <motion.g style={{ opacity }} fill="#C6A15B">
        <ellipse cy="2" rx="4.2" ry="7" />
        {[-3.4, -1.2, 1.2, 3.4].map((x, i) => (
          <circle key={x} cx={x} cy={-7.5 + Math.abs(i - 1.5) * 0.8} r="1.3" />
        ))}
      </motion.g>
    </g>
  )
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')
    const onChange = () => setNarrow(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return narrow
}

export function CoupleSection() {
  const { t } = useLanguage()
  const narrow = useNarrow()
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 })

  // The couple walk in from either side, wait at the curtain, then come together
  const groomX = useTransform(progress, [0, BEATS.enter[1], BEATS.approach[0], BEATS.approach[1]], [-120, 250, 250, 336])
  const brideX = useTransform(progress, [0, BEATS.enter[1], BEATS.approach[0], BEATS.approach[1]], [920, 550, 550, 464])
  const figureOpacity = useTransform(progress, [0, 0.05], [0, 1])

  const mandapDraw = useTransform(progress, [0, BEATS.enter[1]], [0, 1])
  const curtainDrop = useTransform(progress, BEATS.curtain, [0, 250])

  const brideGarlandY = useTransform(progress, BEATS.garlandToBride, [-90, 0])
  const brideGarlandOpacity = useTransform(progress, [BEATS.garlandToBride[0], BEATS.garlandToBride[0] + 0.03], [0, 1])
  const groomGarlandY = useTransform(progress, BEATS.garlandToGroom, [-90, 0])
  const groomGarlandOpacity = useTransform(progress, [BEATS.garlandToGroom[0], BEATS.garlandToGroom[0] + 0.03], [0, 1])

  const mangalsutra = useTransform(progress, [BEATS.mangalsutra[0], BEATS.mangalsutra[0] + 0.04], [0, 1])

  const knot = useTransform(progress, BEATS.knot, [0, 1])
  const fireScale = useTransform(progress, BEATS.fire, [0.2, 1])
  const fireOpacity = useTransform(progress, [BEATS.fire[0], BEATS.fire[0] + 0.02], [0, 1])
  const glow = useTransform(progress, [BEATS.knot[0], 1], [0, 0.85])

  const namesOpacity = useTransform(progress, BEATS.names, [0, 1])
  const namesY = useTransform(progress, BEATS.names, [16, 0])
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0])
  const bar = useTransform(progress, [0, 1], [0, 1])

  const viewBox = narrow ? '165 60 470 455' : '60 40 680 470'

  return (
    <section id="couple" ref={section} className="relative h-[460vh] bg-gradient-to-b from-champagne via-ivory to-champagne text-ink sm:h-[520vh]">
      <ScallopEdge color="#FFF8EB" />

      <div className="gutter sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-3 overflow-hidden pb-20 pt-14 sm:pb-8 text-center sm:gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="max-w-xl font-serif text-xl italic leading-snug text-burgundy sm:text-[1.75rem]">{t('coupleNarrative')}</p>
          <OrnamentRule className="text-gold-ink" />
        </div>

        <svg viewBox={viewBox} className="min-h-0 w-full max-w-4xl flex-1" role="img" aria-label={t('sceneLabel')}>
          <defs>
            <radialGradient id="sceneGlow">
              <stop offset="0" stopColor="#FFD98A" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFD98A" stopOpacity="0" />
            </radialGradient>
            <clipPath id="aboveFloor">
              <rect x="0" y="0" width="800" height={FLOOR} />
            </clipPath>
          </defs>

          {/* Mandap, drawn in as the couple arrive */}
          <g fill="none" stroke="#C6A15B" strokeWidth="1.6">
            <motion.path d="M 160 452 V 170 C 160 110 260 80 400 70 C 540 80 640 110 640 170 V 452" style={{ pathLength: mandapDraw }} />
            <motion.path d="M 182 452 V 178 C 182 126 270 100 400 92 C 530 100 618 126 618 178 V 452" strokeOpacity="0.55" style={{ pathLength: mandapDraw }} />
            <motion.path d="M 120 452 H 680" strokeWidth="2.2" style={{ pathLength: mandapDraw }} />
          </g>
          <motion.ellipse cx={CENTRE} cy="250" rx="260" ry="200" fill="url(#sceneGlow)" style={{ opacity: glow }} />
          <g>
            {Array.from({ length: 21 }, (_, i) => {
              const tt = i / 20
              const x = 190 + tt * 420
              const y = 118 + Math.sin(tt * Math.PI) * 56
              return <motion.circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? '#C6A15B' : '#E9B44C'} style={{ opacity: mandapDraw }} />
            })}
          </g>

          {/* Groom */}
          <motion.g style={{ x: groomX, opacity: figureOpacity }}>
            <g transform={`translate(0 ${FLOOR})`}>
              <Groom />
              <motion.g style={{ y: groomGarlandY, opacity: groomGarlandOpacity }}>
                <Garland />
              </motion.g>
            </g>
          </motion.g>

          {/* Bride */}
          <motion.g style={{ x: brideX, opacity: figureOpacity }}>
            <g transform={`translate(0 ${FLOOR})`}>
              <Bride />
              <motion.g style={{ y: brideGarlandY, opacity: brideGarlandOpacity }}>
                <Garland />
              </motion.g>
              {/* Mangalsutra, drawn on over the garland */}
              <motion.path
                d="M -14 -238 C -17 -214 -8 -199 0 -197 C 8 -199 17 -214 14 -238"
                fill="none"
                stroke="#FFE3A6"
                strokeWidth="1.6"
                style={{ pathLength: mangalsutra, opacity: mangalsutra }}
              />
              <motion.g style={{ opacity: mangalsutra }} fill="#F6E3B0" stroke="#70500F" strokeWidth="0.6">
                <circle cx="-3.5" cy="-193" r="3.6" />
                <circle cx="3.5" cy="-193" r="3.6" />
              </motion.g>
            </g>
          </motion.g>

          {/* Jeelakarra bellam, once the couple stand together */}
          <Paste progress={progress} from={[336 + 52, FLOOR - 115]} to={[464, FLOOR - 288]} range={BEATS.jeelakarra} />
          <Paste progress={progress} from={[464 - 48, FLOOR - 124]} to={[336, FLOOR - 290]} range={BEATS.jeelakarra} />

          {/* The three knots of the mangalsutra */}
          {[-9, 0, 9].map((dx, i) => (
            <Sparkle key={dx} progress={progress} at={[464 + dx, FLOOR - 206 + Math.abs(dx) * 0.3]} start={BEATS.mangalsutra[0] + 0.03 + i * 0.012} />
          ))}

          {/* Brahma mudi: the groom's kanduva knotted to the bride's pallu */}
          <motion.path
            d={`M ${336 + 40} ${FLOOR - 128} C 390 ${FLOOR - 104}, 410 ${FLOOR - 104}, ${464 - 42} ${FLOOR - 120}`}
            fill="none"
            stroke="#C6A15B"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ pathLength: knot, opacity: knot }}
          />
          <motion.circle cx={CENTRE} cy={FLOOR - 110} r="6" fill="#C6A15B" style={{ opacity: knot }} />

          {/* The tera, lowered at the muhurtham */}
          <g clipPath="url(#aboveFloor)">
            <motion.g style={{ y: curtainDrop }}>
              <g transform={`translate(${CENTRE} ${FLOOR})`}>
                <Tera />
              </g>
            </motion.g>
          </g>

          {/* Talambralu */}
          {GRAINS.map((grain, i) => (
            <Grain key={i} progress={progress} grain={grain} />
          ))}

          {/* Saptapadi */}
          {STEPS.map((step, i) => (
            <Footprint key={i} progress={progress} step={step} />
          ))}

          {/* Sacred fire */}
          <motion.g style={{ opacity: fireOpacity, scale: fireScale, originX: '400px', originY: `${FLOOR + 30}px` }}>
            <g transform={`translate(${CENTRE} ${FLOOR + 30})`}>
              <SacredFire />
            </g>
          </motion.g>
        </svg>

        <div className="relative h-[7.25rem] w-full max-w-2xl shrink-0 sm:h-[8.5rem]">
          {CAPTIONS.map((caption) => (
            <Caption key={caption.key} progress={progress} text={t(caption.key)} range={caption.range} />
          ))}
          <motion.p
            style={{ opacity: namesOpacity, y: namesY }}
            className="absolute inset-x-0 top-14 px-2 font-script text-[1.85rem] leading-tight text-burgundy sm:top-12 sm:text-5xl"
          >
            {wedding.groom.short} &amp; {wedding.bride.short}
          </motion.p>
        </div>

        <motion.p style={{ opacity: hintOpacity }} className="absolute bottom-6 font-caps text-[0.7rem] uppercase tracking-[0.3em] text-gold-ink">
          {t('sceneHint')}
        </motion.p>
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gold/20" aria-hidden="true">
          <motion.div className="h-full origin-left bg-gold" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  )
}
