import { ExternalLink, Navigation } from 'lucide-react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { isFramed } from '../lib/env'
import { Reveal } from './Reveal'
import { Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

export function VenueSection() {
  const { t } = useLanguage()

  return (
    <section
      id="venue"
      className="muggu-bg gutter section-pad relative overflow-hidden bg-forest text-ivory"
      style={{ ['--muggu-opacity' as string]: 0.09 }}
    >
      <ScallopEdge color="#FFF8EB" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <h2 className="font-caps text-2xl uppercase leading-snug tracking-[0.14em] text-gold-light sm:text-[2rem]">{t('venueHeading')}</h2>
          <OrnamentRule className="text-gold" />
          <p className="font-script text-[3.6rem] leading-[1.1] text-ivory sm:text-7xl">{wedding.venue.name}</p>
          <p className="font-sans text-lg text-champagne">{t('venueLine')}</p>
          <a className="btn-gold group mt-2 w-full sm:w-auto" href={wedding.venue.directionsUrl} target="_blank" rel="noreferrer">
            <Navigation className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
            {t('directions')}
          </a>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="border border-gold p-2 transition-shadow duration-500 hover:shadow-[0_18px_60px_rgba(198,161,91,0.28)] sm:p-3">
            <div className="relative aspect-[4/3] overflow-hidden border border-gold/50 bg-forest-deep">
              {isFramed ? (
                <a
                  href={wedding.venue.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-gold-light"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-gold/15" aria-hidden="true">
                    <Mandala className="h-[130%] w-[130%] max-w-none" />
                  </span>
                  <Navigation className="relative h-9 w-9" strokeWidth={1.3} aria-hidden="true" />
                  <span className="relative inline-flex items-center gap-2 font-sans font-semibold">
                    {t('openMap')}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              ) : (
                <iframe
                  title={t('mapTitle')}
                  src={wedding.venue.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
