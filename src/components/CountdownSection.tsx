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

function Unit({ value, label, pulse, urgent }: { value: number; label: string; pulse: boolean; urgent: boolean }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="niche relative min-w-0 bg-gold p-px">
      <div className="niche relative flex flex-col items-center gap-1 bg-burgundy-deep px-1 py-4 sm:gap-2 sm:py-8">
        {/* A soft flash of gold with every passing second */}
        {pulse && (
          <motion.span
            key={text}
            aria-hidden="true"
            className="niche pointer-events-none absolute inset-0 bg-gold/25"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        )}
        <div className="relative h-[2.75rem] w-full overflow-hidden sm:h-[5rem] lg:h-[6rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className={`absolute inset-0 flex items-center justify-center font-serif text-[2.5rem] font-medium leading-none ${urgent ? 'text-[#FFE08A] [text-shadow:0_0_18px_rgba(255,224,138,0.85)]' : 'text-gold-light'} [font-variant-numeric:lining-nums_tabular-nums] sm:text-7xl lg:text-[5.5rem]`}
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

// Petals and talambralu burst across the screen at the exact moment of the muhurtham
const BURST = Array.from({ length: 90 }, (_, i) => {
  const angle = (i / 90) * Math.PI * 2 + Math.sin(i * 7.3)
  const reach = 180 + ((i * 53) % 260)
  return {
    x: Math.cos(angle) * reach,
    y: Math.sin(angle) * reach * 0.8 - 120,
    rotate: (i * 47) % 360,
    petal: i % 3 !== 0,
    colour: i % 3 === 0 ? (i % 2 ? '#E9B44C' : '#B3122E') : i % 2 ? '#C93A55' : '#E7A0A6',
  }
})

function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center">
      {BURST.map((piece, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: piece.petal ? 14 : 5,
            height: piece.petal ? 18 : 9,
            background: piece.colour,
            borderRadius: piece.petal ? '50% 50% 50% 0' : '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{ x: piece.x * 2, y: [0, piece.y, piece.y + 700], opacity: [1, 1, 0], scale: 1, rotate: piece.rotate * 3 }}
          transition={{ duration: 3.6, ease: 'easeOut', times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  )
}

export function CountdownSection() {
  const { t } = useLanguage()
  const [left, setLeft] = useState(timeLeft)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const next = timeLeft()
      setLeft((previous) => {
        if (previous && !next) setCelebrate(true)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!celebrate) return
    const done = setTimeout(() => setCelebrate(false), 4200)
    return () => clearTimeout(done)
  }, [celebrate])

  const finalMinute = !!left && left.days === 0 && left.hours === 0 && left.minutes === 0

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
      {celebrate && <Celebration />}
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
                <Unit key={key} value={value} label={t(key)} pulse={key === 'seconds'} urgent={finalMinute} />
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
