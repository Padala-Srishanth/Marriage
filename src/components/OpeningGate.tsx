import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useMusic } from './MusicPlayer'
import { MangoToran, OrnamentRule } from './ornaments/Motifs'
import { wedding } from '../data/wedding'

function Door({ side, opening }: { side: 'left' | 'right'; opening: boolean }) {
  const reduced = useReducedMotion()
  const hinge = side === 'left' ? 'left center' : 'right center'
  const angle = side === 'left' ? -112 : 112
  return (
    <motion.div
      className={`silk door-studs-host relative h-full w-1/2 overflow-hidden ${side === 'left' ? 'border-r-2' : 'border-l-2'} border-gold`}
      style={{ transformOrigin: hinge, backfaceVisibility: 'hidden' }}
      animate={opening ? (reduced ? { opacity: 0 } : { rotateY: angle }) : undefined}
      transition={{ duration: reduced ? 0.4 : 1.9, ease: [0.65, 0, 0.3, 1] }}
    >
      <div className="door-studs absolute inset-0 opacity-30" />
      <div className="absolute inset-3 border border-gold/50 sm:inset-6" />
      <div className="absolute inset-5 border border-gold/25 sm:inset-9" />
      {/* Brass strap across each door leaf */}
      {[18, 82].map((top) => (
        <div key={top} className="absolute inset-x-0 h-3 border-y border-gold/70 bg-burgundy-deep" style={{ top: `${top}%` }} />
      ))}
    </motion.div>
  )
}

export function OpeningGate({ onOpening, onDone }: { onOpening: () => void; onDone: () => void }) {
  const { t } = useLanguage()
  const { play } = useMusic()
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
    if (withMusic) play()
    setOpening(true)
    onOpening()
    setTimeout(onDone, reduced ? 450 : 1950)
  }

  return (
    <div className="fixed inset-0 z-[60] flex" style={{ perspective: '1600px' }} role="dialog" aria-label={t('weddingInvitation')}>
      <Door side="left" opening={opening} />
      <Door side="right" opening={opening} />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0"
        animate={opening ? { y: -160, opacity: 0 } : undefined}
        transition={{ duration: 0.9, ease: 'easeIn' }}
      >
        <MangoToran className="h-[84px] w-full sm:h-[118px]" />
      </motion.div>

      <AnimatePresence>
        {!opening && (
          <motion.div
            className="gutter absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="niche relative flex w-full max-w-[29rem] flex-col items-center gap-3 border border-gold bg-burgundy-night/95 px-5 py-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:gap-4 sm:px-10 sm:py-11"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p lang="te" className="font-telugu text-lg leading-snug text-gold-light sm:text-xl">
                శ్రీరస్తు! శుభమస్తు! అవిఘ్నమస్తు!
              </p>
              <OrnamentRule className="text-gold" />
              <p className="font-caps text-[0.7rem] uppercase tracking-[0.3em] text-champagne sm:text-xs">
                {t('lenkalas')} {t('weddingInvitation')}
              </p>
              <h1 className="gold-text px-3 py-1 font-script text-[3.1rem] leading-[1.05] sm:text-[4.1rem]">
                {wedding.groom.short}
                <span className="block text-[0.65em] leading-[1]">&amp;</span>
                {wedding.bride.short}
              </h1>
              <p className="font-caps text-sm tracking-[0.2em] text-champagne">{t('dateLong')}</p>
              <button ref={button} type="button" className="btn-gold mt-2 w-full sm:w-auto sm:min-w-[16rem]" onClick={() => open(true)}>
                {t('openInvitation')}
              </button>
              <button
                type="button"
                className="min-h-[44px] px-4 font-sans text-sm text-champagne underline decoration-gold/60 underline-offset-4 transition hover:text-gold-light"
                onClick={() => open(false)}
              >
                {t('openSilently')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
