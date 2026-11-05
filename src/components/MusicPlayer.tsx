import { Music2, VolumeX } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../i18n/LanguageContext'
import { QUICK_START_BARS, QUICK_START_SECONDS, renderRaga } from '../lib/raga'

type MusicValue = { playing: boolean; play: () => void; pause: () => void; chime: () => void }

const MusicContext = createContext<MusicValue | null>(null)

const VOLUME = 0.55
const FADE_SECONDS = 1.6

/** Audio only ever starts from a click or tap, never on page load. */
export function MusicProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const ctx = useRef<AudioContext | null>(null)
  const master = useRef<GainNode | null>(null)
  const started = useRef(false)

  const startGenerated = useCallback(() => {
    // The context must be created inside the click for phones to allow sound.
    if (!master.current) {
      ctx.current ??= new AudioContext()
      master.current = ctx.current.createGain()
      master.current.gain.value = 0
      master.current.connect(ctx.current.destination)
    }
    const context = ctx.current!
    const gain = master.current!
    void context.resume()
    gain.gain.cancelScheduledValues(context.currentTime)
    gain.gain.setTargetAtTime(VOLUME, context.currentTime, FADE_SECONDS / 3)

    if (!started.current) {
      started.current = true
      // Play the quickly rendered opening, then hand over to the full loop
      // at the matching point, so the music never waits on the slower render.
      // Both renders start together; the full one usually finishes well before the handover.
      const fullLoop = renderRaga()
      void renderRaga(QUICK_START_BARS).then((opening) => {
        const startedAt = context.currentTime + 0.05
        const first = context.createBufferSource()
        first.buffer = opening
        first.connect(gain)
        first.start(startedAt)

        void fullLoop.then((loop) => {
          const source = context.createBufferSource()
          source.buffer = loop
          source.loop = true
          source.connect(gain)
          const handover = startedAt + QUICK_START_SECONDS
          if (context.currentTime < handover - 0.05) {
            source.start(handover, QUICK_START_SECONDS)
          } else {
            const now = context.currentTime + 0.05
            source.start(now, (now - startedAt) % loop.duration)
          }
        })
      })
    }
  }, [])

  // A temple bell struck once: a few inharmonic partials with long decays
  const chime = useCallback(() => {
    ctx.current ??= new AudioContext()
    const context = ctx.current
    void context.resume()
    const now = context.currentTime + 0.05
    const partials: [number, number, number][] = [
      [1, 0.22, 3.4],
      [2.76, 0.1, 2.2],
      [5.4, 0.05, 1.3],
      [8.93, 0.025, 0.8],
    ]
    for (const [ratio, level, decay] of partials) {
      const osc = context.createOscillator()
      const gain = context.createGain()
      osc.frequency.value = 523.25 * ratio
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(level, now + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay)
      osc.connect(gain).connect(context.destination)
      osc.start(now)
      osc.stop(now + decay + 0.1)
    }
  }, [])

  const play = useCallback(() => {
    setPlaying(true)
    if (wedding.musicUrl) {
      audio.current ??= Object.assign(new Audio(wedding.musicUrl), { loop: true, volume: VOLUME })
      void audio.current.play().catch(() => setPlaying(false))
    } else {
      startGenerated()
    }
  }, [startGenerated])

  const pause = useCallback(() => {
    setPlaying(false)
    audio.current?.pause()
    if (ctx.current && master.current) {
      const context = ctx.current
      master.current.gain.cancelScheduledValues(context.currentTime)
      master.current.gain.setTargetAtTime(0, context.currentTime, 0.2)
    }
  }, [])

  // Stay quiet while the guest is in another app or tab.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        audio.current?.pause()
        void ctx.current?.suspend()
      } else if (playing) {
        void audio.current?.play()
        void ctx.current?.resume()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playing])

  const value = useMemo(() => ({ playing, play, pause, chime }), [playing, play, pause, chime])
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const value = useContext(MusicContext)
  if (!value) throw new Error('useMusic must be used inside MusicProvider')
  return value
}

const dockButton =
  'flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-gold bg-burgundy-night/90 px-3 text-gold-light shadow-[0_6px_22px_rgba(0,0,0,0.4)] backdrop-blur transition hover:bg-burgundy'

export function MusicPlayer() {
  const { t } = useLanguage()
  const { playing, play, pause } = useMusic()

  return (
    <button
      type="button"
      className={dockButton}
      aria-pressed={playing}
      aria-label={playing ? t('musicOff') : t('musicOn')}
      title={playing ? t('musicOff') : t('musicOn')}
      onClick={playing ? pause : play}
    >
      {playing ? (
        <>
          <Music2 className="h-4 w-4" aria-hidden="true" />
          <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
            {[0, 0.25, 0.5, 0.15].map((delay) => (
              <span key={delay} className="eq-bar h-full w-[2px] bg-gold-light" style={{ animationDelay: `${delay}s` }} />
            ))}
          </span>
        </>
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}

export function LanguageToggle() {
  const { lang, toggle, t } = useLanguage()
  return (
    <button type="button" className={`${dockButton} font-sans text-sm font-semibold`} aria-label={t('switchLanguage')} title={t('switchLanguage')} onClick={toggle}>
      {lang === 'en' ? <span lang="te" className="font-telugu text-lg leading-none">తెలుగు</span> : 'English'}
    </button>
  )
}
