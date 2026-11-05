import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import type { StringKey } from '../i18n/strings'
import { Reveal } from './Reveal'
import { Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

function timeLeft() {
  const remaining = wedding.muhurtham.getTime() - Date.now()
  if (remaining <= 0) return null
  const seconds = Math.floor(remaining / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="niche relative min-w-0 bg-gold p-px">
      <div className="niche flex flex-col items-center gap-1 bg-burgundy-deep px-1 py-4 sm:gap-2 sm:py-8">
        <div className="relative h-[2.75rem] w-full overflow-hidden sm:h-[5rem] lg:h-[6rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className="absolute inset-0 flex items-center justify-center font-serif text-[2.5rem] font-medium leading-none text-gold-light [font-variant-numeric:lining-nums_tabular-nums] sm:text-7xl lg:text-[5.5rem]"
              initial={{ y: '70%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-70%', opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="font-caps text-[0.6rem] uppercase tracking-[0.12em] text-champagne sm:text-sm sm:tracking-[0.22em]">{label}</span>
      </div>
    </div>
  )
}

export function CountdownSection() {
  const { t } = useLanguage()
  const [left, setLeft] = useState(timeLeft)

  useEffect(() => {
    const timer = setInterval(() => setLeft(timeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const units: [number, StringKey][] = left
    ? [
        [left.days, 'days'],
        [left.hours, 'hours'],
        [left.minutes, 'minutes'],
        [left.seconds, 'seconds'],
      ]
    : []

  return (
    <section id="countdown" className="gutter section-pad silk relative isolate overflow-hidden text-center text-ivory">
      <ScallopEdge color="#FFF8EB" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.1]">
        <Mandala className="turn-slow h-[52rem] w-[52rem] max-w-none" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:gap-12">
        {left ? (
          <>
            <Reveal className="flex flex-col items-center gap-4">
              <h2 className="font-caps text-xl uppercase tracking-[0.2em] text-gold-light sm:text-3xl">{t('countdownHeading')}</h2>
              <OrnamentRule className="text-gold" />
            </Reveal>
            <Reveal className="grid w-full grid-cols-4 gap-2 sm:gap-5" delay={0.1}>
              {units.map(([value, key]) => (
                <Unit key={key} value={value} label={t(key)} />
              ))}
            </Reveal>
            <p className="font-serif text-lg italic text-champagne sm:text-xl">{t('countdownNote')}</p>
          </>
        ) : (
          <Reveal className="flex flex-col items-center gap-6">
            <OrnamentRule className="text-gold" />
            <p className="gold-text max-w-2xl px-2 py-2 font-script text-[clamp(2.6rem,8vw,5rem)] leading-[1.2]">{t('countdownDone')}</p>
            <OrnamentRule className="text-gold" />
          </Reveal>
        )}
      </div>
    </section>
  )
}
