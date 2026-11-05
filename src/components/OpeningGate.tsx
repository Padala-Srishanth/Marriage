import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useMusic } from './MusicPlayer'
import { Kalash, MangoToran, Mandala, OrnamentRule } from './ornaments/Motifs'
import { wedding } from '../data/wedding'

// The opening, in seconds from the tap
const DOORS_START = 0.55
const DOORS_LENGTH = 2.1
const ZOOM_START = 0.9
const FADE_START = 2.2
const DONE = 2.8

const doorEase = [0.65, 0, 0.25, 1] as const

function Door({ side, opening }: { side: 'left' | 'right'; opening: boolean }) {
  const reduced = useReducedMotion()
  const isLeft = side === 'left'
  const swing = { duration: DOORS_LENGTH, delay: DOORS_START, ease: doorEase }

  return (
    <motion.div
      className="silk relative h-full w-1/2 overflow-hidden"
      style={{ transformOrigin: isLeft ? 'left center' : 'right center', backfaceVisibility: 'hidden' }}
      animate={opening ? (reduced ? { opacity: 0 } : { rotateY: isLeft ? -104 : 104 }) : undefined}
      transition={reduced ? { duration: 0.4 } : swing}
    >
      <div className="door-studs absolute inset-0 opacity-20" />

      {/* Carved panels: a rosette above, a purna kalash below */}
      <div className="absolute inset-x-[11%] top-[15%] h-[27%] border border-gold/70">
        <div className="absolute inset-2 border border-gold/30" />
        <div className="absolute inset-0 flex items-center justify-center text-gold/55">
          <Mandala className="aspect-square h-auto w-[78%] max-h-[88%] max-w-none" />
        </div>
      </div>
      <div className="absolute inset-x-[11%] bottom-[9%] top-[46%] border border-gold/70">
        <div className="absolute inset-2 border border-gold/30" />
        <div className="absolute inset-0 flex items-center justify-center text-gold/55">
          <Kalash className="h-[52%] w-auto" />
        </div>
      </div>

      {/* Brass edge where the two doors meet */}
      <div
        className={`absolute inset-y-0 w-2.5 border-gold/80 bg-gradient-to-b from-[#8A6420] via-[#E9CF8E] to-[#8A6420] sm:w-3.5 ${isLeft ? 'right-0 border-l' : 'left-0 border-r'}`}
      />

      {/* The leaf darkens as it turns away from the lamplight */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={opening && !reduced ? { opacity: 0.6 } : undefined}
        transition={swing}
      />
    </motion.div>
  )
}

/** Muggu drawn in rice flour at the threshold, as on every Telugu doorstep. */
function ThresholdMuggu() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 2.2, delay, ease: 'easeInOut' as const },
  })
  return (
    <svg viewBox="-130 -118 260 124" className="h-[86px] w-[180px] sm:h-[118px] sm:w-[250px]" fill="none" stroke="#FFF8EB" strokeOpacity="0.85" strokeWidth="1.4" aria-hidden="true">
      {[44, 78, 110].map((r, i) => (
        <motion.path key={r} d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} {...draw(0.2 + i * 0.25)} />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 8) * 180
        return (
          <g key={i} transform={`rotate(${angle - 90})`}>
            <motion.path d="M 0 -48 C 9 -56, 9 -68, 0 -74 C -9 -68, -9 -56, 0 -48 Z" {...draw(0.9 + i * 0.08)} />
          </g>
        )
      })}
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI - (i / 12) * Math.PI
        return <motion.circle key={i} cx={Math.cos(a) * 94} cy={-Math.sin(a) * 94} r="2.2" fill="#B3122E" stroke="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.05 }} />
      })}
      <motion.circle r="6" fill="#E9B44C" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
    </svg>
  )
}

function ThresholdLamp({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 40 56" className="h-12 w-9 sm:h-16 sm:w-12" aria-hidden="true">
      <motion.g style={{ originX: '20px', originY: '34px' }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay, duration: 0.7, ease: 'backOut' }}>
        <g className="flicker" style={{ transformOrigin: '20px 34px' }}>
          <circle cx="20" cy="20" r="19" fill="#FFD98A" fillOpacity="0.25" />
          <path d="M20 8 C 27 18, 26 29, 20 34 C 14 29, 13 18, 20 8 Z" fill="#FFC861" />
          <path d="M20 17 C 23 22, 22 29, 20 32 C 18 29, 17 22, 20 17 Z" fill="#FFF3C9" />
        </g>
      </motion.g>
      <path d="M2 35 C 6 52, 34 52, 38 35 C 28 39, 12 39, 2 35 Z" fill="#C6A15B" stroke="#70500F" strokeWidth="0.8" />
    </svg>
  )
}

// Rose petals rush out of the doorway towards the guest
const PETALS = Array.from({ length: 34 }, (_, i) => {
  const angle = (i / 34) * Math.PI * 2 + Math.sin(i * 3.1) * 0.3
  const reach = 0.55 + ((i * 37) % 45) / 100
  return {
    x: Math.cos(angle) * reach * 60,
    y: Math.sin(angle) * reach * 55,
    spin: ((i * 71) % 540) - 270,
    colour: i % 3 === 0 ? '#E7A0A6' : i % 2 ? '#C93A55' : '#9B1B30',
    delay: ZOOM_START + (i % 6) * 0.05,
  }
})

function PetalBurst() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
      {PETALS.map((petal, i) => (
        <motion.span
          key={i}
          className="absolute h-4 w-3 rounded-[50%_50%_50%_0]"
          style={{ background: petal.colour }}
          initial={{ x: 0, y: 0, scale: 0.3, opacity: 0, rotate: 0 }}
          animate={{ x: `${petal.x}vw`, y: `${petal.y}vh`, scale: 2.4, opacity: [0, 1, 1, 0], rotate: petal.spin }}
          transition={{ duration: 1.7, delay: petal.delay, ease: [0.2, 0.6, 0.4, 1] }}
        />
      ))}
    </div>
  )
}

export function OpeningGate({ onOpening, onDone }: { onOpening: () => void; onDone: () => void }) {
  const { t } = useLanguage()
  const { play, chime } = useMusic()
  const reduced = useReducedMotion()
  const [opening, setOpening] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    button.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const open = (withMusic: boolean) => {
    if (opening) return
    if (withMusic) {
      play()
      chime()
    }
    setOpening(true)
    onOpening()
    setTimeout(onDone, reduced ? 450 : DONE * 1000)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      role="dialog"
      aria-label={t('weddingInvitation')}
      animate={opening ? { opacity: 0 } : undefined}
      transition={reduced ? { duration: 0.4 } : { duration: DONE - FADE_START, delay: FADE_START }}
    >
      {/* Everything inside moves forward together, as if stepping through the doorway */}
      <motion.div
        className="absolute inset-0"
        animate={opening && !reduced ? { scale: 1.32 } : undefined}
        transition={{ duration: DONE - ZOOM_START, delay: ZOOM_START, ease: [0.5, 0, 0.75, 0] }}
      >
        <div className="absolute inset-0 flex" style={{ perspective: '1500px' }}>
          <Door side="left" opening={opening} />
          <Door side="right" opening={opening} />
        </div>

        {/* Lamplight leaking through the gap, then flooding out as the doors part */}
        <motion.div
          aria-hidden="true"
          className="breathe pointer-events-none absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#FFE3A6] shadow-[0_0_18px_6px_rgba(255,214,150,0.55)]"
          animate={opening ? { opacity: 0 } : undefined}
          transition={{ duration: 0.6, delay: DOORS_START + 0.3 }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 50% 50%, rgba(255,232,180,0.95), rgba(255,200,120,0.35) 45%, transparent 75%)' }}
          initial={{ opacity: 0 }}
          animate={opening && !reduced ? { opacity: [0, 0.9, 0] } : undefined}
          transition={{ duration: 1.9, delay: 0.25, times: [0, 0.4, 1] }}
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
          animate={opening ? { y: -170, opacity: 0 } : undefined}
          transition={{ duration: 1, delay: 0.2, ease: 'easeIn' }}
        >
          <MangoToran className="h-[84px] w-full sm:h-[118px]" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-center gap-3 pb-[max(14px,env(safe-area-inset-bottom,0px))] sm:gap-8"
          animate={opening ? { y: 90, opacity: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeIn' }}
        >
          <ThresholdLamp delay={1.6} />
          <ThresholdMuggu />
          <ThresholdLamp delay={1.9} />
        </motion.div>
      </motion.div>

      {opening && !reduced && <PetalBurst />}

      {/* The name plaque hangs from two gold cords */}
      <AnimatePresence>
        {!opening && (
          <motion.div
            className="gutter absolute inset-0 z-[4] flex items-center justify-center pb-16 pt-14 sm:pb-24"
            exit={{ y: -70, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          >
            <motion.div
              className="relative w-full max-w-[27rem]"
              style={{ transformOrigin: '50% -40vh' }}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : [0, 0.7, -0.5, 0.3, 0] }}
              transition={{ opacity: { duration: 1 }, y: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }, rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
            >
              {[18, 82].map((left) => (
                <span key={left} aria-hidden="true" className="absolute bottom-[calc(100%-2.5rem)] h-[60vh] w-px bg-gradient-to-b from-transparent via-gold/70 to-gold" style={{ left: `${left}%` }} />
              ))}

              <div
                className="relative flex flex-col items-center gap-3 border border-gold bg-burgundy-night/90 px-6 pb-7 pt-12 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:gap-4 sm:px-10 sm:pb-10 sm:pt-16"
                style={{ borderRadius: '50% 50% 6px 6px / 16% 16% 6px 6px' }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-gold/35" style={{ borderRadius: '50% 50% 4px 4px / 16% 16% 4px 4px' }} />
                <p lang="te" className="font-telugu text-lg leading-snug text-gold-light sm:text-xl">
                  శ్రీరస్తు! శుభమస్తు! అవిఘ్నమస్తు!
                </p>
                <OrnamentRule className="text-gold" />
                <p className="font-caps text-[0.7rem] uppercase tracking-[0.3em] text-champagne sm:text-xs">
                  {t('lenkalas')} {t('weddingInvitation')}
                </p>
                <h1 className="gold-text px-3 py-1 font-script text-[3rem] leading-[1.05] sm:text-[4rem]">
                  {wedding.groom.short}
                  <span className="block text-[0.65em] leading-[1]">&amp;</span>
                  {wedding.bride.short}
                </h1>
                <p className="font-caps text-sm tracking-[0.2em] text-champagne">{t('dateLong')}</p>
                <button ref={button} type="button" className="btn-gold mt-1 w-full sm:w-auto sm:min-w-[16rem]" onClick={() => open(true)}>
                  {t('openInvitation')}
                </button>
                <button
                  type="button"
                  className="min-h-[44px] px-4 font-sans text-sm text-champagne underline decoration-gold/60 underline-offset-4 transition hover:text-gold-light"
                  onClick={() => open(false)}
                >
                  {t('openSilently')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
