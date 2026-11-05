import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from './Reveal'
import { CornerFlourish, Kalash, Lotus, Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

const unfold = { duration: 1.45, ease: [0.6, 0.02, 0.2, 1] as const }

function CoverPanel({ side, open }: { side: 'left' | 'right'; open: boolean }) {
  const reduced = useReducedMotion()
  const isLeft = side === 'left'
  return (
    <motion.div
      aria-hidden="true"
      className={`silk absolute inset-y-0 w-1/2 overflow-hidden border-gold ${isLeft ? 'left-0 border-r' : 'right-0 border-l'}`}
      style={{ transformOrigin: isLeft ? 'left center' : 'right center' }}
      initial={false}
      animate={
        open
          ? { rotateY: reduced ? 0 : isLeft ? -125 : 125, opacity: 0, pointerEvents: 'none' }
          : { rotateY: 0, opacity: 1, pointerEvents: 'auto' }
      }
      transition={{ ...unfold, opacity: { duration: 0.5, delay: open ? 0.95 : 0 } }}
    >
      <div className={`absolute inset-y-3 border-y border-gold/70 ${isLeft ? 'left-3 right-0 border-l' : 'left-0 right-3 border-r'}`} />
      <div className={`absolute inset-y-5 border-y border-gold/35 ${isLeft ? 'left-5 right-0 border-l' : 'left-0 right-5 border-r'}`} />
      {/* A single rosette spans the seam; each flap carries half of it */}
      <div className={`absolute top-1/2 aspect-square w-[170%] -translate-y-1/2 text-gold/80 sm:w-[150%] ${isLeft ? 'left-full -translate-x-1/2' : 'right-full translate-x-1/2'}`}>
        <Mandala className="h-full w-full" />
      </div>
    </motion.div>
  )
}

export function InvitationSection() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <section id="invitation" className="muggu-bg gutter section-pad relative overflow-hidden bg-ivory text-ink">
      <ScallopEdge color="#22040D" />
      <div className="mx-auto flex max-w-[42rem] flex-col items-center gap-9 sm:gap-11">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <Kalash className="h-20 w-16 text-gold-ink" />
          <h2 className="font-caps text-2xl uppercase tracking-[0.2em] text-burgundy sm:text-3xl">{t('invitationEyebrow')}</h2>
          <OrnamentRule className="text-gold-ink" />
        </Reveal>

        <Reveal className="w-full">
          <div className="relative w-full" style={{ perspective: '1800px' }}>
            {/* The inside of the card */}
            <div className="relative overflow-hidden bg-[#FFFDF6] px-6 py-12 text-center shadow-[0_24px_70px_rgba(58,8,22,0.25)] sm:px-14 sm:py-16">
              <CornerFlourish className="absolute left-2 top-2 h-14 w-14 text-gold-ink sm:h-20 sm:w-20" />
              <CornerFlourish className="absolute right-2 top-2 h-14 w-14 -scale-x-100 text-gold-ink sm:h-20 sm:w-20" />
              <CornerFlourish className="absolute bottom-2 left-2 h-14 w-14 -scale-y-100 text-gold-ink sm:h-20 sm:w-20" />
              <CornerFlourish className="absolute bottom-2 right-2 h-14 w-14 -scale-100 text-gold-ink sm:h-20 sm:w-20" />

              <div className="relative flex flex-col items-center gap-5">
                <Lotus className="h-7 w-14 text-gold-ink" />
                <p className="max-w-md font-serif text-xl italic leading-snug text-ink sm:text-[1.45rem]">{t('invitationMessage')}</p>
                <OrnamentRule className="text-gold-ink" />

                <dl className="flex w-full flex-col items-center gap-1.5">
                  <dt className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink">{t('groomLabel')}</dt>
                  <dd className="font-serif text-[1.85rem] font-medium leading-tight text-burgundy sm:text-4xl">{wedding.groom.formal}</dd>
                  <dd aria-hidden="true" className="font-script text-4xl leading-none text-gold-ink">&amp;</dd>
                  <dt className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink">{t('brideLabel')}</dt>
                  <dd className="font-serif text-[1.85rem] font-medium leading-tight text-burgundy sm:text-4xl">{wedding.bride.formal}</dd>
                </dl>

                <OrnamentRule className="text-gold-ink" />

                <dl className="flex flex-col items-center gap-1 font-sans text-[0.95rem] leading-relaxed text-ink">
                  <dt className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink">{t('brideParents')}</dt>
                  <dd className="mb-3">{wedding.brideParents}</dd>
                  <dt className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink">{t('hostedBy')}</dt>
                  <dd>{wedding.hosts}</dd>
                </dl>

                {open && (
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="min-h-[44px] px-4 font-sans text-sm font-semibold text-gold-ink underline decoration-gold underline-offset-4"
                  >
                    {t('closeCard')}
                  </button>
                )}
              </div>
            </div>

            <CoverPanel side="left" open={open} />
            <CoverPanel side="right" open={open} />

            {/* Wax seal over the seam */}
            <AnimatePresence>
              {!open && (
                <motion.button
                  type="button"
                  aria-label={t('openCard')}
                  onClick={() => setOpen(true)}
                  className="group absolute inset-0 flex w-full flex-col items-center justify-center gap-4"
                  exit={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.45 }}
                >
                  <motion.span
                    className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-light bg-maroon font-script text-[2.1rem] text-gold-light shadow-[0_8px_28px_rgba(0,0,0,0.55),inset_0_0_18px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105 sm:h-36 sm:w-36 sm:text-[2.8rem]"
                    animate={{ boxShadow: ['0 0 0 0 rgba(235,212,156,0.55)', '0 0 0 18px rgba(235,212,156,0)'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                  >
                    <span className="absolute inset-2 rounded-full border border-gold/60" />
                    {wedding.groom.monogram}&thinsp;&amp;&thinsp;{wedding.bride.monogram}
                  </motion.span>
                  <span className="rounded-sm bg-burgundy-night/85 px-4 py-2 font-sans text-sm font-semibold text-gold-light">
                    {t('tapToOpen')}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
