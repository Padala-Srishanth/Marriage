import { motion, useReducedMotion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from './Reveal'
import { Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

// A cusped temple arch, drawn in a 300 x 400 box.
const archPath =
  'M0 400 V 118 C 0 100 18 92 30 84 C 30 62 56 54 72 52 C 80 30 112 26 126 22 C 136 12 146 6 150 0 C 154 6 164 12 174 22 C 188 26 220 30 228 52 C 244 54 270 62 270 84 C 282 92 300 100 300 118 V 400 Z'

function Portrait({ person, label }: { person: typeof wedding.groom; label: string }) {
  return (
    <figure className="flex min-w-0 flex-col items-center gap-3 sm:gap-5">
      <div className="relative aspect-[3/4] w-full max-w-[21rem]">
        <div className="absolute inset-[3.5%]" style={{ clipPath: 'url(#templeArch)' }}>
          {person.photo ? (
            <img src={person.photo} alt={person.short} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            // Monogram stand-in until the family adds a photograph in data/wedding.ts
            <div role="img" aria-label={person.short} className="silk flex h-full w-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gold/25">
                <Mandala className="h-[135%] w-[135%] max-w-none" />
              </div>
              <span className="gold-text relative px-4 font-script text-[clamp(4.5rem,20vw,10rem)] leading-none">{person.monogram}</span>
            </div>
          )}
        </div>
        <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path d={archPath} stroke="#70500F" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          <path
            d={archPath}
            stroke="#C6A15B"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            transform="translate(10.5 14) scale(0.93 0.965)"
          />
        </svg>
      </div>
      <figcaption className="flex flex-col items-center gap-0.5 text-center sm:gap-1.5">
        <span className="font-caps text-[0.65rem] uppercase tracking-[0.26em] text-gold-ink sm:text-sm">{label}</span>
        <span className="font-script text-[clamp(1.75rem,6.6vw,3.6rem)] leading-tight text-burgundy">{person.short}</span>
      </figcaption>
    </figure>
  )
}

export function CoupleSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  return (
    <section id="couple" className="gutter section-pad relative overflow-hidden bg-gradient-to-b from-champagne to-ivory text-ink">
      <ScallopEdge color="#FFF8EB" />
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="templeArch" clipPathUnits="objectBoundingBox" transform="scale(0.003333 0.0025)">
            <path d={archPath} />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 sm:gap-14">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-xl font-serif text-2xl italic leading-snug text-burgundy sm:text-[2.1rem]">{t('coupleNarrative')}</p>
          <OrnamentRule className="text-gold-ink" />
        </Reveal>

        <div className="grid w-full grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)]">
          <Reveal>
            <Portrait person={wedding.groom} label={t('theGroom')} />
          </Reveal>

          {/* The tera: at the muhurtham, the silk held between the couple is lowered. */}
          <div aria-hidden="true" className="relative mt-[12%] flex h-[68%] min-h-[9rem] items-center justify-center overflow-hidden sm:mt-[14%]">
            <div className="flex items-center justify-center text-gold-ink">
              <Mandala className="turn h-[3.5rem] w-[3.5rem] sm:h-32 sm:w-32 lg:h-44 lg:w-44" />
            </div>
            {!reduced && (
              <motion.div
                className="pleats absolute inset-0 border-x-2 border-gold shadow-lg"
                initial={{ y: 0 }}
                whileInView={{ y: '104%' }}
                viewport={{ once: true, margin: '-30% 0px' }}
                transition={{ duration: 1.7, delay: 0.5, ease: [0.6, 0, 0.4, 1] }}
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-gold" />
              </motion.div>
            )}
          </div>

          <Reveal>
            <Portrait person={wedding.bride} label={t('theBride')} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
