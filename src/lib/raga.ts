// An original, royalty-free wedding piece generated in the browser, in raga
// Mohanam (Sa Ri Ga Pa Dha): tanpura drone, santoor arpeggios, a bansuri-style
// flute melody, soft tabla in an eight-beat keharwa cycle and temple bells.
// It is rendered once ahead of time, so playback costs almost no CPU.

const SAMPLE_RATE = 22050
const BEAT = 0.5
const SA = 293.66 // D4

// Scale degrees as just-intonation ratios from Sa. Lower case is the upper octave,
// a leading underscore the lower one.
const RATIOS = {
  _P: 3 / 4, _D: 5 / 6,
  S: 1, R: 9 / 8, G: 5 / 4, P: 3 / 2, D: 5 / 3,
  s: 2, r: 9 / 4, g: 5 / 2, p: 3,
} as const
type Swara = keyof typeof RATIOS

// [note, beats]. A null note is a breath.
type Step = [Swara | null, number]

// Bars of eight beats, so the melody, the santoor and the tabla stay in step.
const INTRO_BARS = 2
const MELODY: Step[] = [
  // Opening phrase, rising gently
  ['G', 2], ['P', 1], ['D', 1], ['P', 2], ['G', 2],
  ['R', 1], ['G', 1], ['P', 2], ['G', 4],
  ['S', 1], ['R', 1], ['G', 1], ['P', 1], ['D', 2], ['s', 2],
  ['D', 2], ['P', 2], [null, 4],
  // Climbing to the upper Sa
  ['P', 1], ['D', 1], ['s', 2], ['r', 2], ['s', 2],
  ['D', 1], ['s', 1], ['r', 1], ['g', 1], ['r', 4],
  ['s', 2], ['D', 1], ['P', 1], ['G', 2], ['P', 2],
  ['D', 6], [null, 2],
  // Playful phrase with quick notes
  ['g', 1], ['r', 1], ['s', 1], ['D', 1], ['s', 1], ['r', 1], ['g', 2],
  ['p', 2], ['g', 1], ['r', 1], ['s', 4],
  ['D', 1], ['P', 1], ['G', 1], ['P', 1], ['D', 1], ['s', 1], ['D', 1], ['P', 1],
  ['G', 4], [null, 4],
  // Coming home to Sa
  ['G', 2], ['R', 1], ['S', 1], ['_D', 2], ['S', 2],
  ['R', 2], ['G', 2], ['P', 2], ['G', 1], ['R', 1],
  ['S', 8],
  [null, 8],
]

const MELODY_BEATS = MELODY.reduce((sum, [, beats]) => sum + beats, 0)
const TOTAL_BEATS = INTRO_BARS * 8 + MELODY_BEATS
const LOOP_SECONDS = TOTAL_BEATS * BEAT
const TAIL_SECONDS = 4
const ALL_BARS = TOTAL_BEATS / 8

// The first bars render in a fraction of the time, so music can begin at
// once while the full loop renders in the background.
export const QUICK_START_BARS = 5
export const QUICK_START_SECONDS = QUICK_START_BARS * 8 * BEAT

// A fixed output level, so the quick start and the full loop match exactly
const OUTPUT_GAIN = 2

// Santoor chords, one per bar, played as rising and falling eighth notes
const CHORDS: Swara[][] = [
  ['S', 'G', 'P', 's'],
  ['_D', 'S', 'G', 'P'],
  ['R', 'P', 'D', 'r'],
  ['S', 'G', 'P', 'D'],
]

function tanpuraPluck(ctx: BaseAudioContext, out: AudioNode, time: number, freq: number, level: number) {
  for (let partial = 1; partial <= 5; partial++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq * partial
    // Upper partials bloom late, which gives the tanpura its buzzing shimmer
    const peak = (level / partial) * (partial > 2 ? 0.8 : 1)
    const bloom = 0.04 + partial * 0.09
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(peak, time + bloom)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 5.2 - partial * 0.3)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 5.4)
  }
}

function addTanpura(ctx: BaseAudioContext, out: AudioNode, end: number) {
  const cycle = [SA * 0.75, SA, SA, SA * 0.5] // Pa, Sa, Sa, low Sa
  const spacing = BEAT * 2
  for (let i = 0; i * spacing < end; i++) {
    tanpuraPluck(ctx, out, i * spacing, cycle[i % 4] / 2, i % 4 === 3 ? 0.13 : 0.08)
  }
}

/** A hammered santoor string: bright attack, quick decay, two slightly detuned courses. */
function santoorNote(ctx: BaseAudioContext, out: AudioNode, time: number, freq: number, level: number) {
  for (const [ratio, detune, share] of [[1, -4, 0.65], [1, 5, 0.65], [2, 0, 0.28]] as const) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = ratio === 1 ? 'triangle' : 'sine'
    osc.frequency.value = freq * ratio
    osc.detune.value = detune
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(level * share, time + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6 / ratio)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 1.7)
  }
}

function addSantoor(ctx: BaseAudioContext, out: AudioNode, endBar: number) {
  for (let bar = 0; bar < endBar; bar++) {
    const chord = CHORDS[bar % CHORDS.length]
    const pattern = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 1, 0, 1]
    // Fewer notes while the flute rests so the texture breathes
    const quiet = bar >= INTRO_BARS && bar % 4 === 3
    pattern.forEach((index, step) => {
      if (quiet && step % 2) return
      const time = (bar * 8 + step * 0.5) * BEAT
      const level = step % 4 === 0 ? 0.11 : 0.07
      santoorNote(ctx, out, time, SA * RATIOS[chord[index]], level)
    })
  }
}

// Seeded noise, so every render of the piece is identical sample for sample
let seed = 1
function random() {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function noiseBuffer(ctx: BaseAudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(SAMPLE_RATE * seconds), SAMPLE_RATE)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = random() * 2 - 1
  return buffer
}

/** Bayan: the low, bending stroke of the tabla. */
function bayan(ctx: BaseAudioContext, out: AudioNode, time: number, level: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.setValueAtTime(110, time)
  osc.frequency.exponentialRampToValueAtTime(68, time + 0.35)
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(level, time + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7)
  osc.connect(gain).connect(out)
  osc.start(time)
  osc.stop(time + 0.75)
}

/** Dayan: the ringing high stroke, a tuned ping with a touch of skin noise. */
function dayan(ctx: BaseAudioContext, out: AudioNode, time: number, level: number, noise: AudioBuffer) {
  for (const [ratio, share] of [[1, 1], [2.02, 0.4]] as const) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = SA * 2 * ratio
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(level * share, time + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 0.35)
  }
  const hit = ctx.createBufferSource()
  const tone = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  hit.buffer = noise
  tone.type = 'bandpass'
  tone.frequency.value = 3200
  gain.gain.setValueAtTime(level * 0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
  hit.connect(tone).connect(gain).connect(out)
  hit.start(time)
  hit.stop(time + 0.06)
}

// Keharwa, eight beats: dha ge na ti | na ka dhi na
const KEHARWA: { beat: number; low?: number; high?: number }[] = [
  { beat: 0, low: 0.3, high: 0.1 },
  { beat: 1, low: 0.16 },
  { beat: 2, high: 0.12 },
  { beat: 3, high: 0.07 },
  { beat: 3.5, high: 0.05 },
  { beat: 4, high: 0.1 },
  { beat: 5, high: 0.07 },
  { beat: 6, low: 0.22, high: 0.09 },
  { beat: 7, high: 0.1 },
  { beat: 7.5, high: 0.05 },
]

function addTabla(ctx: BaseAudioContext, out: AudioNode, endBar: number) {
  const noise = noiseBuffer(ctx, 0.1)
  for (let bar = INTRO_BARS; bar < Math.min(endBar, ALL_BARS - 1); bar++) {
    for (const stroke of KEHARWA) {
      const time = (bar * 8 + stroke.beat) * BEAT
      if (stroke.low) bayan(ctx, out, time, stroke.low)
      if (stroke.high) dayan(ctx, out, time, stroke.high, noise)
    }
  }
}

/** A temple bell, struck at the top of the piece and as the flute enters. */
function bell(ctx: BaseAudioContext, out: AudioNode, time: number, level: number) {
  for (const [ratio, share, decay] of [[1, 1, 4], [2.76, 0.45, 2.6], [5.4, 0.22, 1.5], [8.93, 0.1, 0.9]] as const) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = SA * 2 * ratio
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(level * share, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + decay + 0.1)
  }
}

function addFlute(ctx: BaseAudioContext, out: AudioNode, end: number) {
  const fundamental = ctx.createOscillator()
  const overtone = ctx.createOscillator()
  const vibrato = ctx.createOscillator()
  const vibratoDepth = ctx.createGain()
  const overtoneLevel = ctx.createGain()
  const envelope = ctx.createGain()

  overtone.type = 'triangle'
  overtoneLevel.gain.value = 0.09
  vibrato.frequency.value = 5.2
  vibrato.connect(vibratoDepth)
  vibratoDepth.connect(fundamental.detune)
  vibratoDepth.connect(overtone.detune)
  vibratoDepth.gain.setValueAtTime(0, 0)
  envelope.gain.setValueAtTime(0, 0)

  // Breath noise follows the same envelope as the tone
  const breath = ctx.createBufferSource()
  const breathTone = ctx.createBiquadFilter()
  const breathLevel = ctx.createGain()
  breath.buffer = noiseBuffer(ctx, 2)
  breath.loop = true
  breathTone.type = 'bandpass'
  breathTone.frequency.value = 1900
  breathTone.Q.value = 0.8
  breathLevel.gain.value = 0.035

  fundamental.connect(envelope)
  overtone.connect(overtoneLevel).connect(envelope)
  breath.connect(breathTone).connect(breathLevel).connect(envelope)
  envelope.connect(out)

  let time = INTRO_BARS * 8 * BEAT
  let sounding = false

  for (const [swara, beats] of MELODY) {
    if (time >= end) break
    const length = beats * BEAT
    if (swara === null) {
      if (sounding) {
        envelope.gain.setTargetAtTime(0, time - 0.15, 0.14)
        vibratoDepth.gain.setTargetAtTime(0, time - 0.15, 0.1)
      }
      sounding = false
    } else {
      const freq = SA * RATIOS[swara]
      if (sounding) {
        // Gamaka: slide into the note from the previous one
        fundamental.frequency.setTargetAtTime(freq, time, 0.035)
        overtone.frequency.setTargetAtTime(freq * 2, time, 0.035)
        // A soft tongued accent on each new note
        envelope.gain.setTargetAtTime(0.14, time, 0.02)
        envelope.gain.setTargetAtTime(0.19, time + 0.06, 0.06)
      } else {
        fundamental.frequency.setValueAtTime(freq, time)
        overtone.frequency.setValueAtTime(freq * 2, time)
        envelope.gain.setTargetAtTime(0.19, time, 0.1)
        sounding = true
      }
      vibratoDepth.gain.setTargetAtTime(0, time, 0.04)
      if (beats >= 2) vibratoDepth.gain.setTargetAtTime(12, time + 0.35, 0.3)
    }
    time += length
  }

  for (const source of [fundamental, overtone, vibrato, breath]) {
    source.start(0)
    source.stop(end + TAIL_SECONDS)
  }
}

function hallImpulse(ctx: BaseAudioContext) {
  const length = Math.floor(SAMPLE_RATE * 2.2)
  const impulse = ctx.createBuffer(2, length, SAMPLE_RATE)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    let smoothed = 0
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 3.2)
      smoothed = smoothed * 0.72 + (random() * 2 - 1) * 0.28
      data[i] = smoothed * decay
    }
  }
  return impulse
}

/** Places a voice left or right of centre and feeds it into the mix. */
function voice(ctx: BaseAudioContext, bus: AudioNode, pan: number, level: number) {
  const gain = ctx.createGain()
  const panner = ctx.createStereoPanner()
  gain.gain.value = level
  panner.pan.value = pan
  gain.connect(panner).connect(bus)
  return gain
}

/**
 * Renders one seamless loop of the piece, or with `bars` only its opening,
 * which lines up sample for sample with the start of the full loop.
 */
export async function renderRaga(bars = ALL_BARS) {
  seed = 1
  const whole = bars >= ALL_BARS
  const seconds = Math.min(bars, ALL_BARS) * 8 * BEAT
  const frames = Math.floor((seconds + (whole ? TAIL_SECONDS : 0)) * SAMPLE_RATE)
  const ctx = new OfflineAudioContext(2, frames, SAMPLE_RATE)

  const dry = ctx.createGain()
  const wetSend = ctx.createGain()
  const hall = ctx.createConvolver()
  dry.gain.value = 0.8
  wetSend.gain.value = 0.45
  hall.buffer = hallImpulse(ctx)
  dry.connect(ctx.destination)
  wetSend.connect(hall).connect(ctx.destination)

  const bus = ctx.createGain()
  bus.connect(dry)
  bus.connect(wetSend)

  addTanpura(ctx, voice(ctx, bus, 0, 1), seconds)
  addSantoor(ctx, voice(ctx, bus, -0.3, 1), bars)
  addTabla(ctx, voice(ctx, bus, 0.25, 0.9), bars)
  addFlute(ctx, voice(ctx, bus, 0.1, 1), seconds)
  const bells = voice(ctx, bus, -0.15, 1)
  bell(ctx, bells, 0.05, 0.09)
  bell(ctx, bells, INTRO_BARS * 8 * BEAT - 0.1, 0.06)

  const rendered = await ctx.startRendering()
  if (!whole) {
    for (let channel = 0; channel < 2; channel++) {
      const data = rendered.getChannelData(channel)
      for (let i = 0; i < data.length; i++) data[i] = Math.max(-1, Math.min(1, data[i] * OUTPUT_GAIN))
    }
    return rendered
  }

  // Fold the tail back onto the start so the loop has no audible seam.
  const loopFrames = Math.floor(LOOP_SECONDS * SAMPLE_RATE)
  const loop = new AudioBuffer({ length: loopFrames, numberOfChannels: 2, sampleRate: SAMPLE_RATE })
  for (let channel = 0; channel < 2; channel++) {
    const source = rendered.getChannelData(channel)
    const target = loop.getChannelData(channel)
    target.set(source.subarray(0, loopFrames))
    for (let i = loopFrames; i < source.length; i++) target[i - loopFrames] += source[i]
    for (let i = 0; i < loopFrames; i++) target[i] = Math.max(-1, Math.min(1, target[i] * OUTPUT_GAIN))
  }
  return loop
}
