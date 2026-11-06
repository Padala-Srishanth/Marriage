// A minimal loader and typing for the YouTube IFrame Player API.

export type YouTubePlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (volume: number) => void
  getPlayerState: () => number
  destroy: () => void
}

type PlayerOptions = {
  host: string
  videoId: string
  width: string
  height: string
  playerVars: Record<string, string | number>
  events: {
    onReady: () => void
    onStateChange: (event: { data: number }) => void
  }
}

type YouTubeApi = { Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer }

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

export const YT_PLAYING = 1
export const YT_PAUSED = 2

let loading: Promise<YouTubeApi> | null = null

export function loadYouTubeApi() {
  loading ??= new Promise<YouTubeApi>((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!)
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return loading
}
