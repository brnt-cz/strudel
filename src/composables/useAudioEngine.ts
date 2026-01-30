import { ref, watch, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { sampleLoader } from '@/services/SampleLoader'

type OscillatorType = 'sine' | 'sawtooth' | 'square' | 'triangle'

// Simple audio engine using WebAudio API
class AudioEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private schedulerInterval: number | null = null
  private nextStepTime = 0
  private currentStep = 0
  private isRunning = false
  private onTick: ((step: number) => void) | null = null

  async init(): Promise<void> {
    if (this.audioContext) return

    this.audioContext = new AudioContext()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.connect(this.audioContext.destination)

    // Initialize sample loader
    await sampleLoader.init(this.audioContext)

    // Silent warmup - initialize audio pipeline without audible sound
    this.warmup()
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  getMasterGain(): GainNode | null {
    return this.masterGain
  }

  private warmup(): void {
    if (!this.audioContext) return

    // Create a silent oscillator to "warm up" the audio system
    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    // Set gain to 0 - completely silent
    gainNode.gain.value = 0

    osc.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Play for a very short duration
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.001)
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume
    }
  }

  start(bpm: number, onTick: (step: number) => void): void {
    if (this.isRunning) return

    this.onTick = onTick
    this.isRunning = true
    this.currentStep = 0

    if (this.audioContext) {
      this.nextStepTime = this.audioContext.currentTime
      this.scheduler(bpm)
    }
  }

  stop(): void {
    this.isRunning = false
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval)
      this.schedulerInterval = null
    }
  }

  private scheduler(bpm: number): void {
    const stepDuration = 60 / bpm / 4 // 16th note duration

    this.schedulerInterval = window.setInterval(() => {
      if (!this.audioContext || !this.isRunning) return

      while (this.nextStepTime < this.audioContext.currentTime + 0.1) {
        this.onTick?.(this.currentStep)
        this.nextStepTime += stepDuration
        this.currentStep = (this.currentStep + 1) % 16
      }
    }, 25)
  }

  playOscillator(
    type: OscillatorType,
    frequency: number,
    duration: number,
    params: {
      gain?: number
      lpf?: number
      pan?: number
      delay?: number
      reverb?: number
    } = {}
  ): void {
    if (!this.audioContext || !this.masterGain) return

    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    const panner = this.audioContext.createStereoPanner()

    osc.type = type
    osc.frequency.value = frequency

    filter.type = 'lowpass'
    filter.frequency.value = params.lpf || 20000

    gainNode.gain.setValueAtTime(params.gain || 0.5, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    panner.pan.value = (params.pan || 0.5) * 2 - 1

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(panner)
    panner.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + duration)
  }

  playNoise(duration: number, params: { gain?: number; hpf?: number; lpf?: number } = {}): void {
    if (!this.audioContext || !this.masterGain) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    const hpf = this.audioContext.createBiquadFilter()
    const lpf = this.audioContext.createBiquadFilter()

    hpf.type = 'highpass'
    hpf.frequency.value = params.hpf || 5000

    lpf.type = 'lowpass'
    lpf.frequency.value = params.lpf || 10000

    gainNode.gain.setValueAtTime(params.gain || 0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    noise.connect(hpf)
    hpf.connect(lpf)
    lpf.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  // Simple drum synthesis
  playKick(gain: number = 0.8): void {
    if (!this.audioContext || !this.masterGain) return

    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

    osc.connect(gainNode)
    gainNode.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.3)
  }

  playSnare(gain: number = 0.6): void {
    if (!this.audioContext || !this.masterGain) return

    // Tone component
    const osc = this.audioContext.createOscillator()
    const oscGain = this.audioContext.createGain()

    osc.type = 'triangle'
    osc.frequency.value = 200

    oscGain.gain.setValueAtTime(gain * 0.5, this.audioContext.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

    osc.connect(oscGain)
    oscGain.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.1)

    // Noise component
    this.playNoise(0.15, { gain: gain * 0.5, hpf: 3000, lpf: 8000 })
  }

  playHihat(open: boolean = false, gain: number = 0.3): void {
    const duration = open ? 0.3 : 0.08
    this.playNoise(duration, { gain, hpf: 7000, lpf: 14000 })
  }

  playClap(gain: number = 0.5): void {
    this.playNoise(0.15, { gain, hpf: 1500, lpf: 5000 })
  }

  playTom(frequency: number, gain: number = 0.7): void {
    if (!this.audioContext || !this.masterGain) return

    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(frequency * 1.5, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(frequency, this.audioContext.currentTime + 0.05)

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25)

    osc.connect(gainNode)
    gainNode.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.25)
  }

  playCowbell(gain: number = 0.4): void {
    if (!this.audioContext || !this.masterGain) return

    // Two detuned square waves for metallic sound
    const osc1 = this.audioContext.createOscillator()
    const osc2 = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    osc1.type = 'square'
    osc2.type = 'square'
    osc1.frequency.value = 560
    osc2.frequency.value = 845

    filter.type = 'bandpass'
    filter.frequency.value = 700
    filter.Q.value = 3

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    osc1.start()
    osc2.start()
    osc1.stop(this.audioContext.currentTime + 0.4)
    osc2.stop(this.audioContext.currentTime + 0.4)
  }

  playCrash(gain: number = 0.4): void {
    if (!this.audioContext || !this.masterGain) return

    // Long noise burst with high frequencies
    this.playNoise(0.8, { gain, hpf: 4000, lpf: 16000 })
  }

  playRide(gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    // Shorter, more focused metallic sound
    this.playNoise(0.4, { gain, hpf: 6000, lpf: 12000 })
  }

  playShaker(gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    // Short noise burst
    this.playNoise(0.08, { gain, hpf: 8000, lpf: 14000 })
  }

  playRimshot(gain: number = 0.5): void {
    if (!this.audioContext || !this.masterGain) return

    // Click + short tone
    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    osc.type = 'triangle'
    osc.frequency.value = 1800

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03)

    osc.connect(gainNode)
    gainNode.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.03)

    // Add click
    this.playNoise(0.02, { gain: gain * 0.5, hpf: 2000, lpf: 8000 })
  }

  playPerc(gain: number = 0.5): void {
    if (!this.audioContext || !this.masterGain) return

    // Generic percussion - short pitched click
    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05)

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

    osc.connect(gainNode)
    gainNode.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.1)
  }

  // === NOISE SYNTHS ===

  playWhiteNoise(_frequency: number, duration: number, gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    noise.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  playPinkNoise(_frequency: number, duration: number, gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    // Pink noise - filtered white noise with -3dB/octave rolloff
    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Simple pink noise approximation using Paul Kellet's algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    noise.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  playBrownNoise(_frequency: number, duration: number, gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    // Brown noise - integrated white noise (random walk)
    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + (0.02 * white)) / 1.02
      data[i] = lastOut * 3.5 // Normalize
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    noise.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  playCrackle(frequency: number, duration: number, gain: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return

    // Crackle - sparse random pops
    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    const density = frequency / 1000 // Use frequency to control crackle density
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < density * 0.01) {
        // Random pop
        const popLength = Math.min(100, bufferSize - i)
        const amplitude = (Math.random() * 0.5 + 0.5)
        for (let j = 0; j < popLength; j++) {
          const env = 1 - (j / popLength)
          data[i + j] += amplitude * env * (Math.random() * 2 - 1)
        }
      }
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    noise.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start()
  }

  // === FM / COMPLEX SYNTHS ===

  playFM(frequency: number, duration: number, gain: number = 0.5): void {
    if (!this.audioContext || !this.masterGain) return

    // FM synthesis - carrier modulated by modulator
    const carrier = this.audioContext.createOscillator()
    const modulator = this.audioContext.createOscillator()
    const modGain = this.audioContext.createGain()
    const gainNode = this.audioContext.createGain()

    // Modulator frequency = 2x carrier (harmonic ratio)
    modulator.frequency.value = frequency * 2
    modGain.gain.value = frequency * 2 // Modulation depth

    carrier.frequency.value = frequency

    gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    // FM connection: modulator -> modGain -> carrier.frequency
    modulator.connect(modGain)
    modGain.connect(carrier.frequency)

    carrier.connect(gainNode)
    gainNode.connect(this.masterGain)

    modulator.start()
    carrier.start()
    modulator.stop(this.audioContext.currentTime + duration)
    carrier.stop(this.audioContext.currentTime + duration)
  }

  playSupersaw(frequency: number, duration: number, gain: number = 0.4): void {
    if (!this.audioContext || !this.masterGain) return

    // Supersaw - 7 detuned sawtooth oscillators
    const numOscs = 7
    const detune = [-40, -25, -15, 0, 15, 25, 40]
    const gainNode = this.audioContext.createGain()

    gainNode.gain.setValueAtTime(gain / numOscs, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    for (let i = 0; i < numOscs; i++) {
      const osc = this.audioContext.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = frequency
      osc.detune.value = detune[i]
      osc.connect(gainNode)
      osc.start()
      osc.stop(this.audioContext.currentTime + duration)
    }

    gainNode.connect(this.masterGain)
  }

  playSupersquare(frequency: number, duration: number, gain: number = 0.4): void {
    if (!this.audioContext || !this.masterGain) return

    // Supersquare - 5 detuned square oscillators with PWM-like effect
    const numOscs = 5
    const detune = [-30, -15, 0, 15, 30]
    const gainNode = this.audioContext.createGain()

    gainNode.gain.setValueAtTime(gain / numOscs, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    for (let i = 0; i < numOscs; i++) {
      const osc = this.audioContext.createOscillator()
      osc.type = 'square'
      osc.frequency.value = frequency
      osc.detune.value = detune[i]
      osc.connect(gainNode)
      osc.start()
      osc.stop(this.audioContext.currentTime + duration)
    }

    gainNode.connect(this.masterGain)
  }

  // === SAMPLE PLAYBACK ===

  playSample(buffer: AudioBuffer, gain: number = 0.8, playbackRate: number = 1): void {
    if (!this.audioContext || !this.masterGain) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    source.playbackRate.value = playbackRate

    gainNode.gain.value = gain

    source.connect(gainNode)
    gainNode.connect(this.masterGain)

    source.start()
  }

  dispose(): void {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

const engine = new AudioEngine()

export function useAudioEngine() {
  const store = useProjectStore()
  const isInitialized = ref(false)

  async function init(): Promise<void> {
    await engine.init()
    isInitialized.value = true
  }

  async function playSampleSound(drumBank: string, soundId: string, gain: number): Promise<boolean> {
    if (!sampleLoader.initialized) return false

    const buffer = await sampleLoader.loadSample(drumBank, soundId, 0)
    if (buffer) {
      engine.playSample(buffer, gain)
      return true
    }
    return false
  }

  function playSound(soundId: string, params: { gain?: number; lpf?: number; drumBank?: string } = {}): void {
    const gain = params.gain ?? 0.8

    // Try to play sample if drumBank is specified
    if (params.drumBank) {
      playSampleSound(params.drumBank, soundId, gain).then(played => {
        if (!played) {
          // Fall back to synthesized sound
          playSynthesizedSound(soundId, gain, params.lpf)
        }
      })
      return
    }

    // Play synthesized sound
    playSynthesizedSound(soundId, gain, params.lpf)
  }

  function playSynthesizedSound(soundId: string, gain: number, lpf?: number): void {
    switch (soundId) {
      case 'bd':
        engine.playKick(gain)
        break
      case 'sd':
        engine.playSnare(gain)
        break
      case 'hh':
        engine.playHihat(false, gain)
        break
      case 'oh':
        engine.playHihat(true, gain)
        break
      case 'cp':
        engine.playClap(gain)
        break
      case 'rim':
        engine.playRimshot(gain)
        break
      case 'lt':
        engine.playTom(80, gain) // Low tom - 80Hz
        break
      case 'mt':
        engine.playTom(120, gain) // Mid tom - 120Hz
        break
      case 'ht':
        engine.playTom(180, gain) // High tom - 180Hz
        break
      case 'cb':
        engine.playCowbell(gain)
        break
      case 'cr':
        engine.playCrash(gain)
        break
      case 'rd':
        engine.playRide(gain)
        break
      case 'sh':
        engine.playShaker(gain)
        break
      case 'perc':
        engine.playPerc(gain)
        break
      // Basic waveforms
      case 'sine':
      case 'sawtooth':
      case 'square':
      case 'triangle':
        engine.playOscillator(soundId as OscillatorType, 440, 0.3, { gain, lpf })
        break
      // Noise synths
      case 'white':
        engine.playWhiteNoise(440, 0.5, gain)
        break
      case 'pink':
        engine.playPinkNoise(440, 0.5, gain)
        break
      case 'brown':
        engine.playBrownNoise(440, 0.5, gain)
        break
      case 'crackle':
        engine.playCrackle(440, 0.5, gain)
        break
      // FM / Complex synths
      case 'fm':
        engine.playFM(440, 0.3, gain)
        break
      case 'supersaw':
        engine.playSupersaw(440, 0.3, gain)
        break
      case 'supersquare':
        engine.playSupersquare(440, 0.3, gain)
        break
      default:
        engine.playOscillator('sine', 220, 0.2, { gain })
    }
  }

  function noteToFrequency(note: string): number {
    const noteRegex = /^([a-g]#?)(\d)$/i
    const match = note.match(noteRegex)
    if (!match) return 440

    const noteNames: { [key: string]: number } = {
      'c': 0, 'c#': 1, 'd': 2, 'd#': 3, 'e': 4, 'f': 5,
      'f#': 6, 'g': 7, 'g#': 8, 'a': 9, 'a#': 10, 'b': 11
    }

    const noteName = match[1].toLowerCase()
    const octave = parseInt(match[2])
    const semitone = noteNames[noteName]

    // A4 = 440Hz, semitone 9 in octave 4
    const semitonesFromA4 = (octave - 4) * 12 + (semitone - 9)
    return 440 * Math.pow(2, semitonesFromA4 / 12)
  }

  function playNote(note: string, soundId: string, params: { gain?: number; lpf?: number } = {}): void {
    if (note === '~') return

    const frequency = noteToFrequency(note)
    const gain = params.gain ?? 0.5

    // Handle different synth types
    switch (soundId) {
      case 'sine':
      case 'sawtooth':
      case 'square':
      case 'triangle':
        engine.playOscillator(soundId as OscillatorType, frequency, 0.3, {
          gain,
          lpf: params.lpf ?? 5000
        })
        break
      case 'white':
        engine.playWhiteNoise(frequency, 0.3, gain)
        break
      case 'pink':
        engine.playPinkNoise(frequency, 0.3, gain)
        break
      case 'brown':
        engine.playBrownNoise(frequency, 0.3, gain)
        break
      case 'crackle':
        engine.playCrackle(frequency, 0.3, gain)
        break
      case 'fm':
        engine.playFM(frequency, 0.3, gain)
        break
      case 'supersaw':
        engine.playSupersaw(frequency, 0.3, gain)
        break
      case 'supersquare':
        engine.playSupersquare(frequency, 0.3, gain)
        break
      default:
        engine.playOscillator('sawtooth', frequency, 0.3, {
          gain,
          lpf: params.lpf ?? 5000
        })
    }
  }

  function start(): void {
    if (!isInitialized.value) {
      init().then(() => startPlayback())
    } else {
      startPlayback()
    }
  }

  function startPlayback(): void {
    engine.setMasterVolume(store.masterVolume)

    engine.start(store.bpm, (step) => {
      store.currentStep = step

      for (const track of store.activeTracks) {
        if (track.type === 'drum') {
          if (track.pattern[step]) {
            playSound(track.soundId, {
              gain: track.params.gain,
              lpf: track.params.lpf,
              drumBank: track.drumBank
            })
          }
        } else {
          // Melodie - hrát každý druhý krok (8 not v 16 krocích)
          if (step % 2 === 0) {
            const noteIndex = step / 2
            const note = track.notes[noteIndex]
            if (note && note !== '~') {
              playNote(note, track.soundId, {
                gain: track.params.gain,
                lpf: track.params.lpf
              })
            }
          }
        }
      }
    })

    store.play()
  }

  function stop(): void {
    engine.stop()
    store.stop()
  }

  function toggle(): void {
    if (store.isPlaying) {
      stop()
    } else {
      start()
    }
  }

  // Watch for volume changes
  watch(() => store.masterVolume, (volume) => {
    engine.setMasterVolume(volume)
  })

  onUnmounted(() => {
    stop()
  })

  // Initialize audio on first user interaction (click, keypress, etc.)
  function initOnInteraction(): void {
    if (isInitialized.value) return

    const handleInteraction = () => {
      init()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }

    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })
  }

  // Preview a sample from a drum bank
  async function previewSample(drumBank: string, soundType: string, variation: number = 0): Promise<void> {
    if (!isInitialized.value) {
      await init()
    }
    const buffer = await sampleLoader.loadSample(drumBank, soundType, variation)
    if (buffer) {
      engine.playSample(buffer, 0.8)
    } else {
      // Fall back to synthesized sound
      playSynthesizedSound(soundType, 0.8)
    }
  }

  // Get available drum machines
  function getAvailableMachines(): string[] {
    return sampleLoader.getAvailableMachines()
  }

  // Get available sound types for a machine
  function getMachineSoundTypes(machine: string): string[] {
    return sampleLoader.getSoundTypes(machine)
  }

  // Get sample count for a machine/sound
  function getSampleCount(machine: string, soundType: string): number {
    return sampleLoader.getSampleCount(machine, soundType)
  }

  // Preload samples for a machine
  async function preloadMachine(machine: string): Promise<void> {
    await sampleLoader.preloadMachine(machine)
  }

  return {
    isInitialized,
    init,
    initOnInteraction,
    start,
    stop,
    toggle,
    playSound,
    playNote,
    previewSample,
    getAvailableMachines,
    getMachineSoundTypes,
    getSampleCount,
    preloadMachine,
    sampleLoader
  }
}
