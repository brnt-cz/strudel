import { ref, watch, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

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

    // Silent warmup - initialize audio pipeline without audible sound
    this.warmup()
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

  function playSound(soundId: string, params: { gain?: number; lpf?: number } = {}): void {
    const gain = params.gain ?? 0.8

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
      case 'sine':
      case 'sawtooth':
      case 'square':
      case 'triangle':
        engine.playOscillator(soundId as OscillatorType, 440, 0.3, { gain, lpf: params.lpf })
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
    const oscType = ['sine', 'sawtooth', 'square', 'triangle'].includes(soundId)
      ? soundId as OscillatorType
      : 'sawtooth'

    engine.playOscillator(oscType, frequency, 0.3, {
      gain: params.gain ?? 0.5,
      lpf: params.lpf ?? 5000
    })
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
              lpf: track.params.lpf
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

  return {
    isInitialized,
    init,
    initOnInteraction,
    start,
    stop,
    toggle,
    playSound,
    playNote
  }
}
