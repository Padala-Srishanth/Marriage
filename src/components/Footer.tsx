import { motion } from 'framer-motion'
import { Check, Link2, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { isFramed } from '../lib/env'
import { Reveal } from './Reveal'
import { OrnamentRule, ScallopEdge } from './ornaments/Motifs'

function pageUrl() {
  return isFramed ? wedding.previewUrl : window.location.origin + window.location.pathname
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = text
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const copied = document.execCommand('copy')
    field.remove()
    return copied
  }
}

function ShareInvitation() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${t('shareMessage')}\n${pageUrl()}`)}`

  const copy = async () => {
    if (await copyText(pageUrl())) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="font-caps text-sm uppercase tracking-[0.26em] text-gold-light">{t('shareHeading')}</h2>
      <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
        <a className="btn-gold" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t('whatsapp')}
        </a>
        <button type="button" className="btn-outline border-gold text-gold-light hover:bg-gold/15" onClick={copy}>
          {copied ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
          <span aria-live="polite">{copied ? t('copied') : t('copyLink')}</span>
        </button>
      </div>
    </div>
  )
}

const petal = 'M0 0 C 15 -22, 15 -62, 0 -88 C -15 -62, -15 -22, 0 0 Z'

function LotusBloom() {
  const rings = [
    { angles: [-72, -54, -36, -18, 0, 18, 36, 54, 72], scale: 1, start: 0.9 },
    { angles: [-48, -24, 0, 24, 48], scale: 0.7, start: 0.3 },
  ]
  return (
    <svg viewBox="-110 -100 220 112" className="h-36 w-72 sm:h-44 sm:w-[22rem]" aria-hidden="true">
      {rings.map((ring) =>
        ring.angles.map((angle) => (
          <g key={`${ring.scale}-${angle}`} transform={`rotate(${angle}) scale(${ring.scale})`}>
            <motion.path
              d={petal}
              stroke="#C6A15B"
              strokeWidth="1.3"
              fill="#C6A15B"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              whileInView={{ pathLength: 1, fillOpacity: ring.scale === 1 ? 0.12 : 0.28 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: ring.start + (Math.abs(angle) / 18) * 0.18, ease: 'easeOut' }}
            />
          </g>
        )),
      )}
      <motion.path
        d="M -70 4 Q 0 18 70 4"
        fill="none"
        stroke="#C6A15B"
        strokeWidth="1.6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
      <circle r="5" fill="#EBD49C" />
    </svg>
  )
}

/** Seven diyas that light one after another as the guest reaches the end. */
function LampRow() {
  return (
    <div aria-hidden="true" className="flex items-end justify-center gap-3 sm:gap-6">
      {Array.from({ length: 7 }, (_, i) => (
        <svg key={i} viewBox="0 0 40 56" className="h-12 w-9 sm:h-14 sm:w-10">
          <motion.g
            style={{ originX: '20px', originY: '34px' }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + Math.abs(i - 3) * 0.35, ease: 'backOut' }}
          >
            <g className="flicker" style={{ transformOrigin: '20px 34px', animationDelay: `${-i * 0.4}s` }}>
              <circle cx="20" cy="20" r="18" fill="#FFD98A" fillOpacity="0.22" />
              <path d="M20 9 C 27 19, 26 29, 20 34 C 14 29, 13 19, 20 9 Z" fill="#FFC861" />
              <path d="M20 18 C 23 23, 22 29, 20 32 C 18 29, 17 23, 20 18 Z" fill="#FFF3C9" />
            </g>
          </motion.g>
          <path d="M2 35 C 6 52, 34 52, 38 35 C 28 39, 12 39, 2 35 Z" fill="#C6A15B" stroke="#70500F" strokeWidth="0.8" />
        </svg>
      ))}
    </div>
  )
}

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="gutter relative overflow-hidden bg-burgundy-night pb-28 pt-20 text-center text-champagne sm:pt-28">
      <ScallopEdge color="#E9D7B5" />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-9">
        <Reveal className="w-full">
          <ShareInvitation />
        </Reveal>

        <OrnamentRule className="text-gold" />

        <Reveal>
          <blockquote className="font-serif text-[1.65rem] italic leading-snug text-ivory sm:text-[2.4rem]">
            <p>{t('footerLine1')}</p>
            <p>{t('footerLine2')}</p>
          </blockquote>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-1">
          <p className="font-serif text-xl italic text-champagne">{t('withLove')}</p>
          <p className="font-caps text-lg uppercase tracking-[0.26em] text-gold-light sm:text-xl">{t('family')}</p>
        </Reveal>

        <div className="flex w-full flex-col items-center gap-3 text-gold">
          <LotusBloom />
          <p className="gold-text px-4 py-1 font-script text-[2.9rem] leading-[1.15] sm:text-[4.2rem]">
            {wedding.groom.short}
            <span className="block text-[0.7em] leading-none">&amp;</span>
            {wedding.bride.short}
          </p>
        </div>

        <p className="font-caps text-xl tracking-[0.34em] text-ivory [font-variant-numeric:lining-nums]">21.11.2026</p>
        <LampRow />
      </div>
    </footer>
  )
}
