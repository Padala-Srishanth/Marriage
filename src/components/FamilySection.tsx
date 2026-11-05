import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from './Reveal'
import { Lotus, Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

export function FamilySection() {
  const { t } = useLanguage()

  return (
    <section id="family" className="gutter section-pad relative isolate overflow-hidden bg-champagne text-center text-ink">
      <ScallopEdge color="#173C32" />
      <div className="pointer-events-none absolute -bottom-[16rem] left-1/2 -z-10 -translate-x-1/2 text-gold-ink opacity-[0.16]" aria-hidden="true">
        <Mandala className="h-[36rem] w-[36rem] max-w-none sm:h-[44rem] sm:w-[44rem]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:gap-10">
        <Reveal className="flex flex-col items-center gap-4">
          <h2 className="font-caps text-2xl uppercase leading-snug tracking-[0.14em] text-burgundy sm:text-[2rem]">{t('familyHeading')}</h2>
          <OrnamentRule className="text-gold-ink" />
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4 sm:gap-5" delay={0.1}>
          {wedding.elders.map((names, index) => (
            <div key={names} className="flex flex-col items-center gap-4 sm:gap-5">
              {index > 0 && <Lotus className="h-6 w-12 text-gold-ink" />}
              <p className="font-serif text-[1.8rem] font-medium leading-tight text-burgundy sm:text-[2.6rem]">{names}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="flex flex-col items-center gap-2 border-y border-gold-ink/60 px-5 py-6 sm:px-14" delay={0.2}>
          <p className="font-caps text-xs uppercase tracking-[0.3em] text-gold-ink sm:text-sm">{t('hostedBy')}</p>
          <p className="font-script text-[2.5rem] leading-tight text-burgundy sm:text-6xl">{wedding.hosts}</p>
        </Reveal>
      </div>
    </section>
  )
}
