import { motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from './Reveal'
import { Lotus, Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

// A raised palm, fingers up: the gesture elders use to bless
const palm =
  'M18 88 C14 70 10 58 8 46 C6 36 4 30 7 27 C10 24 14 28 16 36 L19 48 L19 14 C19 9 25 9 25 14 L26 40 L27 8 C27 3 33 3 33 8 L34 40 L36 11 C36 6 42 6 42 11 L42 42 L45 20 C45 15 51 16 50 21 L48 50 C47 66 44 78 42 88 Z'

function BlessingHands() {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 2, ease: 'easeInOut' as const },
  }
  return (
    <motion.div
      aria-hidden="true"
      className="flex items-end gap-3 text-gold-ink"
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {[-1, 1].map((side) => (
        <svg key={side} viewBox="0 0 58 92" className="h-16 w-10 sm:h-20 sm:w-12" style={{ transform: `scaleX(${side}) rotate(${-8 * side}deg)` }} fill="none" stroke="currentColor" strokeWidth="1.4">
          <motion.path d={palm} {...draw} />
          <motion.circle cx="30" cy="62" r="3" fill="#B3122E" stroke="none" {...draw} transition={{ duration: 0.6, delay: 1.8 }} />
        </svg>
      ))}
    </motion.div>
  )
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: 8 + ((i * 37) % 84),
  delay: 0.8 + (i % 7) * 0.25,
  drift: ((i * 29) % 60) - 30,
  colour: i % 2 ? '#E9B44C' : '#D97A2B',
}))

function FallingMarigolds() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden">
      {PETALS.map((petal, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-3 w-3 rounded-[50%_50%_50%_0]"
          style={{ left: `${petal.left}%`, background: petal.colour }}
          initial={{ y: -30, x: 0, opacity: 0, rotate: 0 }}
          whileInView={{ y: 420, x: petal.drift, opacity: [0, 1, 1, 0], rotate: 280 }}
          viewport={{ once: true }}
          transition={{ duration: 4.2, delay: petal.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

export function FamilySection() {
  const { t } = useLanguage()

  return (
    <section id="family" className="gutter section-pad relative isolate overflow-hidden bg-champagne text-center text-ink">
      <ScallopEdge color="#173C32" />
      <FallingMarigolds />
      <div className="pointer-events-none absolute -bottom-[16rem] left-1/2 -z-10 -translate-x-1/2 text-gold-ink opacity-[0.16]" aria-hidden="true">
        <Mandala className="h-[36rem] w-[36rem] max-w-none sm:h-[44rem] sm:w-[44rem]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:gap-10">
        <Reveal className="flex flex-col items-center gap-4">
          <BlessingHands />
          <h2 className="font-caps text-2xl uppercase leading-snug tracking-[0.14em] text-burgundy sm:text-[2rem]">{t('familyHeading')}</h2>
          <OrnamentRule className="text-gold-ink" />
        </Reveal>

        {/* The two families arrive from opposite sides and meet in the middle */}
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          {wedding.elders.map((names, index) => (
            <div key={names} className="flex flex-col items-center gap-4 sm:gap-5">
              {index > 0 && <Lotus className="h-6 w-12 text-gold-ink" />}
              <motion.p
                className="font-serif text-[1.8rem] font-medium leading-tight text-burgundy sm:text-[2.6rem]"
                initial={{ x: index % 2 ? 90 : -90, opacity: 0.15 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1.2, delay: 0.15 + index * 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {names}
              </motion.p>
            </div>
          ))}
        </div>

        <Reveal className="flex flex-col items-center gap-2 border-y border-gold-ink/60 px-5 py-6 sm:px-14" delay={0.5}>
          <p className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink sm:text-sm">{t('hostedBy')}</p>
          <p className="font-serif text-[1.8rem] font-medium leading-tight text-burgundy sm:text-[2.6rem]">{wedding.hosts}</p>
        </Reveal>
      </div>
    </section>
  )
}
