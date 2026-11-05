import { Check, Link2, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { isFramed } from '../lib/env'
import { Reveal } from './Reveal'
import { Mandala, OrnamentRule, ScallopEdge } from './ornaments/Motifs'

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
          <Mandala draw className="h-44 w-44 sm:h-56 sm:w-56" />
          <p className="gold-text px-4 py-1 font-script text-[2.9rem] leading-[1.15] sm:text-[4.2rem]">
            {wedding.groom.short}
            <span className="block text-[0.7em] leading-none">&amp;</span>
            {wedding.bride.short}
          </p>
        </div>

        <p className="font-caps text-xl tracking-[0.34em] text-ivory [font-variant-numeric:lining-nums]">21.11.2026</p>
        <OrnamentRule className="text-gold" />
      </div>
    </footer>
  )
}
