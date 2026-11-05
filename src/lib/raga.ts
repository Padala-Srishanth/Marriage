// An original, royalty-free piece generated in the browser: a bansuri-style
// flute over a tanpura drone, in raga Mohanam (Sa Ri Ga Pa Dha).
// It is rendered once ahead of time, so playback costs almost no CPU.

const SAMPLE_RATE = 32000
const BEAT = 0.75
const SA = 293.66 // D4

// Scale degrees as just-intonation ratios from Sa
const RATIOS = { S: 1, R: 9 / 8, G: 5 / 4, P: 3 / 2, D: 5 / 3, s: 2, r: 9 / 4, g: 5 / 2 } as const
type Swara = keyof typeof RATIOS

// [note, beats]. A null note is a breath.
type Step = [Swara | null, number]

const PHRASES: Step[] = [
  ['G', 3], ['P', 1], ['D', 2], ['P', 2], ['G', 4], [null, 4],
  ['R', 1], ['G', 1], ['P', 2], ['D', 2], ['s', 4], ['D', 2], ['P', 4], [null, 4],
  ['s', 2], ['r', 1], ['s', 1], ['D', 2], ['P', 2], ['G', 2], ['R', 2], ['S', 6], [null, 4],
  ['P', 2], ['D', 1], ['s', 1], ['r', 2], ['g', 4], ['r', 2], ['s', 2], ['D', 2], ['P', 4], [null, 4],
  ['G', 2], ['R', 2], ['S', 2], ['R', 1], ['G', 1], ['S', 8], [null, 4],
]

const TOTAL_BEATS = PHRASES.reduce((sum, [, beats]) => sum + beats, 0)
const LOOP_SECONDS = TOTAL_BEATS * BEAT
const TAIL_SECONDS = 4

function tanpuraPluck(ctx: BaseAudioContext, out: AudioNode, time: number, freq: number, level: number) {
  for (let partial = 1; partial <= 7; partial++) {
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

function addTanpura(ctx: BaseAudioContext, out: AudioNode) {
  const cycle = [SA * 0.75, SA, SA, SA * 0.5] // Pa, Sa, Sa, low Sa
  const spacing = BEAT * 2
  for (let i = 0; i * spacing < LOOP_SECONDS; i++) {
    tanpuraPluck(ctx, out, i * spacing, cycle[i % 4] / 2, i % 4 === 3 ? 0.17 : 0.11)
  }
}

function addFlute(ctx: BaseAudioContext, out: AudioNode) {
  const fundamental = ctx.createOscillator()
  const overtone = ctx.createOscillator()
  const vibrato = ctx.createOscillator()
  const vibratoDepth = ctx.createGain()
  const overtoneLevel = ctx.createGain()
  const envelope = ctx.createGain()

  overtone.type = 'triangle'
  overtoneLevel.gain.value = 0.09
  vibrato.frequency.value = 5
  vibrato.connect(vibratoDepth)
  vibratoDepth.connect(fundamental.detune)
  vibratoDepth.connect(overtone.detune)
  vibratoDepth.gain.setValueAtTime(0, 0)
  envelope.gain.setValueAtTime(0, 0)

  // Breath noise follows the same envelope as the tone
  const noise = ctx.createBuffer(1, SAMPLE_RATE * 2, SAMPLE_RATE)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
  const breath = ctx.createBufferSource()
  const breathTone = ctx.createBiquadFilter()
  const breathLevel = ctx.createGain()
  breath.buffer = noise
  breath.loop = true
  breathTone.type = 'bandpass'
  breathTone.frequency.value = 1900
  breathTone.Q.value = 0.8
  breathLevel.gain.value = 0.035

  fundamental.connect(envelope)
  overtone.connect(overtoneLevel).connect(envelope)
  breath.connect(breathTone).connect(breathLevel).connect(envelope)
  envelope.connect(out)

  let time = 2 * BEAT
  let sounding = false

  for (const [swara, beats] of PHRASES) {
    const length = beats * BEAT
    if (swara === null) {
      if (sounding) {
        envelope.gain.setTargetAtTime(0, time - 0.2, 0.16)
        vibratoDepth.gain.setTargetAtTime(0, time - 0.2, 0.1)
      }
      sounding = false
    } else {
      const freq = SA * RATIOS[swara]
      if (sounding) {
        // Gamaka: slide into the note from the previous one
        fundamental.frequency.setTargetAtTime(freq, time, 0.045)
        overtone.frequency.setTargetAtTime(freq * 2, time, 0.045)
      } else {
        fundamental.frequency.setValueAtTime(freq, time)
        overtone.frequency.setValueAtTime(freq * 2, time)
        envelope.gain.setTargetAtTime(0.2, time, 0.14)
        sounding = true
      }
      vibratoDepth.gain.setTargetAtTime(0, time, 0.05)
      if (beats >= 2) vibratoDepth.gain.setTargetAtTime(13, time + 0.5, 0.4)
    }
    time += length
  }

  for (const source of [fundamental, overtone, vibrato, breath]) {
    source.start(0)
    source.stop(LOOP_SECONDS + TAIL_SECONDS)
  }
}

function hallImpulse(ctx: BaseAudioContext) {
  const length = Math.floor(SAMPLE_RATE * 2.8)
  const impulse = ctx.createBuffer(2, length, SAMPLE_RATE)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    let smoothed = 0
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 3.2)
      smoothed = smoothed * 0.72 + (Math.random() * 2 - 1) * 0.28
      data[i] = smoothed * decay
    }
  }
  return impulse
}

/** Renders one seamless loop of the piece. */
export async function renderRaga() {
  const frames = Math.floor((LOOP_SECONDS + TAIL_SECONDS) * SAMPLE_RATE)
  const ctx = new OfflineAudioContext(2, frames, SAMPLE_RATE)

  const dry = ctx.createGain()
  const wetSend = ctx.createGain()
  const hall = ctx.createConvolver()
  dry.gain.value = 0.8
  wetSend.gain.value = 0.55
  hall.buffer = hallImpulse(ctx)
  dry.connect(ctx.destination)
  wetSend.connect(hall).connect(ctx.destination)

  const bus = ctx.createGain()
  bus.connect(dry)
  bus.connect(wetSend)
  addTanpura(ctx, bus)
  addFlute(ctx, bus)

  const rendered = await ctx.startRendering()

  // Fold the tail back onto the start so the loop has no audible seam,
  // then normalise the level.
  const loopFrames = Math.floor(LOOP_SECONDS * SAMPLE_RATE)
  const loop = new AudioBuffer({ length: loopFrames, numberOfChannels: 2, sampleRate: SAMPLE_RATE })
  let peak = 0
  for (let channel = 0; channel < 2; channel++) {
    const source = rendered.getChannelData(channel)
    const target = loop.getChannelData(channel)
    target.set(source.subarray(0, loopFrames))
    for (let i = loopFrames; i < source.length; i++) target[i - loopFrames] += source[i]
    for (let i = 0; i < loopFrames; i++) peak = Math.max(peak, Math.abs(target[i]))
  }
  const scale = peak > 0 ? 0.85 / peak : 1
  for (let channel = 0; channel < 2; channel++) {
    const target = loop.getChannelData(channel)
    for (let i = 0; i < loopFrames; i++) target[i] *= scale
  }
  return loop
}
