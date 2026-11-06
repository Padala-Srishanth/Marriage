import { Music2 } from 'lucide-react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { songOnYouTube, useMusic } from './MusicPlayer'
import { Reveal } from './Reveal'
import { OrnamentRule } from './ornaments/Motifs'

/** The wedding song's YouTube player, framed in gold. */
export function OurSong() {
  const { t } = useLanguage()
  const { attachSong } = useMusic()
  if (!songOnYouTube) return null

  return (
    <section id="song" className="gutter relative bg-champagne pb-20 text-center text-ink sm:pb-28">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-ink text-burgundy">
          <Music2 className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2 className="font-caps text-xl uppercase tracking-[0.18em] text-burgundy sm:text-2xl">{t('songHeading')}</h2>
        <p className="font-script text-4xl leading-tight text-burgundy sm:text-5xl">{wedding.song.title}</p>
        <OrnamentRule className="text-gold-ink" />
        <div className="w-full border border-gold p-1.5 shadow-[0_18px_50px_rgba(58,8,22,0.2)] sm:p-2">
          <div ref={attachSong} className="aspect-video w-full overflow-hidden bg-burgundy-night [&>iframe]:h-full [&>iframe]:w-full" />
        </div>
        <p className="max-w-md font-serif text-lg italic leading-snug text-ink/80">{t('songNote')}</p>
      </Reveal>
    </section>
  )
}
