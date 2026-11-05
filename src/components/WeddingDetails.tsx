import { motion } from 'framer-motion'
import { CalendarPlus, Download, MapPin, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { downloadIcs, googleCalendarUrl } from '../lib/calendar'
import { isFramed } from '../lib/env'
import { Reveal } from './Reveal'
import { Kalash, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

function SideNote({ icon: Icon, title, children, delay }: { icon: LucideIcon; title: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col items-center gap-3 px-2 text-center">
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-ink text-burgundy"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
      </motion.span>
      <h3 className="font-caps text-sm uppercase tracking-[0.28em] text-gold-ink">{title}</h3>
      {children}
    </Reveal>
  )
}

export function WeddingDetails() {
  const { t } = useLanguage()

  return (
    <section id="details" className="muggu-bg gutter section-pad relative overflow-hidden bg-ivory text-ink">
      <ScallopEdge color="#3A0816" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:gap-14">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-caps text-2xl uppercase tracking-[0.2em] text-burgundy sm:text-3xl">{t('detailsHeading')}</h2>
          <OrnamentRule className="text-gold-ink" />
        </Reveal>

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_minmax(0,1.5fr)_1fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <SideNote icon={MapPin} title={t('venue')} delay={0.1}>
              <p className="font-serif text-[2rem] font-medium leading-tight text-burgundy">{t('venueName')}</p>
              <p className="whitespace-pre-line font-sans leading-relaxed text-ink">{t('venueAddress')}</p>
            </SideNote>
          </div>

          {/* The hour of the muhurtham is the one fact every guest needs */}
          <Reveal className="order-1 lg:order-2">
            <div
              className="silk relative mx-auto flex w-full overflow-hidden max-w-[32rem] flex-col items-center gap-3 border border-gold px-5 pb-10 pt-20 text-center text-ivory sm:pb-12 sm:pt-28"
              style={{ borderRadius: '50% 50% 0 0 / 22% 22% 0 0' }}
            >
              <Kalash className="h-16 w-14 text-gold-light sm:h-20 sm:w-16" />
              <h3 className="font-caps text-sm uppercase tracking-[0.26em] text-gold-light sm:text-base">{t('muhurtham')}</h3>
              <p className="font-serif text-xl italic text-champagne sm:text-2xl">{t('dateFull')}</p>
              <div className="relative flex w-full items-center justify-center">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-56 w-56 shrink-0 sm:h-80 sm:w-80"
                    initial={{ y: 110, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <svg viewBox="-100 -100 200 200" className="turn-slow h-full w-full">
                      <defs>
                        <radialGradient id="morningSun">
                          <stop offset="0" stopColor="#FFD98A" stopOpacity="0.55" />
                          <stop offset="0.5" stopColor="#E9B44C" stopOpacity="0.22" />
                          <stop offset="1" stopColor="#E9B44C" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle r="96" fill="url(#morningSun)" />
                      {Array.from({ length: 24 }, (_, i) => (
                        <path key={i} d="M0 -50 L 3 -82 L 0 -94 L -3 -82 Z" fill="#EBD49C" fillOpacity="0.3" transform={`rotate(${i * 15})`} />
                      ))}
                      <circle r="44" fill="none" stroke="#EBD49C" strokeOpacity="0.35" />
                    </svg>
                  </motion.div>
                </div>
                <p className="relative flex items-baseline justify-center gap-3 font-serif font-medium leading-none text-ivory [font-variant-numeric:lining-nums]">
                  <span className="text-[5.2rem] sm:text-[8rem]">10:04</span>
                  <span className="font-caps text-xl text-gold-light sm:text-2xl">{t('amSuffix')}</span>
                </p>
              </div>
              <p className="font-caps text-base uppercase tracking-[0.2em] text-gold-light sm:text-lg">{t('lagnam')}</p>
              <div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:min-w-[19rem]">
                <a className="btn-gold" href={googleCalendarUrl()} target="_blank" rel="noreferrer">
                  <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('googleCalendar')}
                </a>
                {/* Sandboxed previews refuse downloads; the published site does not. */}
                {!isFramed && (
                  <button type="button" className="btn-outline border-gold text-gold-light hover:bg-gold/15" onClick={downloadIcs}>
                    <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('icsCalendar')}
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          <div className="order-3">
            <SideNote icon={UtensilsCrossed} title={t('lunch')} delay={0.2}>
              <p className="font-serif text-[2rem] font-medium leading-tight text-burgundy">{t('lunchText')}</p>
            </SideNote>
          </div>
        </div>
      </div>
    </section>
  )
}
