import { motion, type Variants } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { MandapCanopy, MandapFloor, MandapPillar } from './ornaments/Mandap'
import { Mandala, OrnamentRule } from './ornaments/Motifs'

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] } }),
}

// The names write themselves in from left to right, like ink from a pen.
const inked: Variants = {
  hidden: { clipPath: 'inset(-20% 100% -20% 0%)', opacity: 0.4 },
  shown: (delay: number) => ({
    clipPath: 'inset(-20% -5% -20% 0%)',
    opacity: 1,
    transition: { duration: 1.9, delay, ease: [0.45, 0, 0.2, 1] },
  }),
}

export function HeroSection({ started }: { started: boolean }) {
  const { t } = useLanguage()
  const state = started ? 'shown' : 'hidden'

  return (
    <section
      aria-label={t('weddingInvitation')}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-burgundy-night px-[46px] pb-24 pt-[120px] text-center text-champagne sm:px-[110px] sm:pb-24 sm:pt-[132px]"
    >
      {/* Lamp light pooling at the centre of the hall */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 62% 56% at 50% 54%, #a4623a 0%, #7a2536 34%, #5B1025 56%, #2c0611 100%)',
        }}
      />
      <div
        className="breathe absolute left-1/2 top-[-12%] -z-10 h-[90%] w-[140%] -translate-x-1/2 opacity-70"
        style={{
          background:
            'conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgb(255 214 150 / 0.18) 8deg, transparent 15deg, rgb(255 214 150 / 0.12) 22deg, transparent 30deg, transparent 360deg)',
          maskImage: 'linear-gradient(black 40%, transparent)',
          WebkitMaskImage: 'linear-gradient(black 40%, transparent)',
        }}
      />
      <div className="absolute inset-0 -z-10 flex items-center justify-center text-gold opacity-[0.2]">
        <Mandala className="turn-slow h-[min(112vh,150vw)] w-[min(112vh,150vw)] max-w-none" />
      </div>

      <MandapPillar side="left" />
      <MandapPillar side="right" />
      <MandapCanopy />
      <MandapFloor />

      <div className="relative z-[3] flex w-full max-w-3xl flex-col items-center">
        <motion.p
          lang="te"
          className="font-telugu text-[1.15rem] leading-snug text-gold-light sm:text-2xl"
          variants={rise}
          custom={0.5}
          initial="hidden"
          animate={state}
        >
          శ్రీరస్తు! శుభమస్తు! అవిఘ్నమస్తు!
        </motion.p>

        <motion.div className="mt-3 sm:mt-5" variants={rise} custom={0.75} initial="hidden" animate={state}>
          <p className="font-caps text-lg uppercase tracking-[0.42em] text-ivory sm:text-2xl">{t('lenkalas')}</p>
          <p className="mt-1 font-caps text-[0.68rem] uppercase tracking-[0.3em] text-champagne sm:text-sm">
            {t('weddingInvitation')}
          </p>
        </motion.div>

        <motion.p
          className="mt-3 max-w-md font-serif text-[1.05rem] italic leading-snug text-ivory/90 sm:mt-5 sm:text-xl"
          variants={rise}
          custom={1}
          initial="hidden"
          animate={state}
        >
          {t('heroInvite')}
        </motion.p>

        <h1 className="my-1 flex flex-col items-center">
          <motion.span
            className="gold-text inline-block px-[0.3em] py-[0.1em] font-script text-[clamp(3.1rem,min(14vw,10.5vh),7.6rem)] leading-[1.05] drop-shadow-[0_2px_14px_rgba(255,214,150,0.25)]"
            variants={inked}
            custom={1.15}
            initial="hidden"
            animate={state}
          >
            {wedding.groom.short}
          </motion.span>
          <motion.span
            className="font-script text-[clamp(2.2rem,min(8vw,6vh),4rem)] leading-[0.95] text-gold-light"
            initial={{ opacity: 0, scale: 0.4, rotate: -14 }}
            animate={started ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ duration: 1.1, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
          >
            &amp;
          </motion.span>
          <motion.span
            className="gold-text inline-block px-[0.3em] py-[0.1em] font-script text-[clamp(3.1rem,min(14vw,10.5vh),7.6rem)] leading-[1.05] drop-shadow-[0_2px_14px_rgba(255,214,150,0.25)]"
            variants={inked}
            custom={2.7}
            initial="hidden"
            animate={state}
          >
            {wedding.bride.short}
          </motion.span>
        </h1>

        <motion.div className="flex flex-col items-center gap-1.5 sm:gap-2" variants={rise} custom={3.8} initial="hidden" animate={state}>
          <OrnamentRule className="text-gold" />
          <p className="mt-1 font-caps text-base uppercase tracking-[0.2em] text-ivory sm:text-xl">{t('dateLong')}</p>
          <p className="whitespace-pre-wrap font-caps text-[0.72rem] uppercase tracking-[0.16em] text-champagne sm:text-sm">{t('timeLagnam')}</p>
          <p className="font-caps text-[0.72rem] uppercase tracking-[0.16em] text-champagne sm:text-sm">{t('venueShort')}</p>
        </motion.div>
      </div>

      <motion.a
        href="#invitation"
        aria-label={t('scroll')}
        className="absolute bottom-7 left-1/2 z-[4] flex h-14 w-11 -translate-x-1/2 flex-col items-center justify-end gap-1 sm:bottom-9"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 4.4 }}
      >
        <span className="drip block h-9 w-px bg-gold-light" />
        <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-gold-light" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M1 1 L 8 8 L 15 1" />
        </svg>
      </motion.a>
    </section>
  )
}
