export type TrackType = 'drum' | 'synth' | 'bass'

export interface TrackParams {
  // Základní
  gain: number         // 0 - 1.5
  pan: number          // 0 - 1 (0.5 = center)
  speed: number        // 0.25 - 2

  // Filtry
  lpf: number          // 20 - 20000 Hz
  lpq: number          // 0 - 20 (resonance)
  hpf: number          // 20 - 20000 Hz
  hpq: number          // 0 - 20 (resonance)

  // Delay
  delay: number        // 0 - 1
  delayTime: number    // 0.1 - 1
  delayFeedback: number // 0 - 0.9

  // Reverb
  reverb: number       // 0 - 1
  reverbSize: number   // 0 - 1

  // Distortion
  distort: number      // 0 - 1
  crush: number        // 1 - 16 (bit depth)

  // Modulation
  phaser: number       // 0 - 1
  phaserDepth: number  // 0 - 1
  vowel: string        // 'a' | 'e' | 'i' | 'o' | 'u' | ''

  // Envelope
  attack: number       // 0 - 1
  decay: number        // 0 - 1
  sustain: number      // 0 - 1
  release: number      // 0 - 1
}

export interface Track {
  id: string
  name: string
  type: TrackType
  soundId: string
  color: string

  // Pro bicí (16 kroků)
  pattern: boolean[]

  // Pro melodie (8 not)
  notes: string[]

  // Parametry zvuku
  params: TrackParams

  // Extra pro bicí
  drumBank?: string

  // Extra pro melodie
  scale?: string
  rootNote?: string
  octave?: number

  // Stav
  muted: boolean
  solo: boolean
}

export interface Project {
  id: string
  name: string
  tracks: Track[]
  bpm: number
  masterVolume: number
  createdAt: Date
  updatedAt: Date
}

export interface Sound {
  id: string
  name: string
  color: string
  type: TrackType
  category?: string
}

export interface SoundBank {
  id: string
  name: string
  icon: string
  type: TrackType
  sounds: Sound[]
}

export const DEFAULT_TRACK_PARAMS: TrackParams = {
  // Základní
  gain: 0.8,
  pan: 0.5,
  speed: 1,

  // Filtry
  lpf: 20000,
  lpq: 0,
  hpf: 20,
  hpq: 0,

  // Delay
  delay: 0,
  delayTime: 0.25,
  delayFeedback: 0.5,

  // Reverb
  reverb: 0,
  reverbSize: 0.5,

  // Distortion
  distort: 0,
  crush: 16,

  // Modulation
  phaser: 0,
  phaserDepth: 0.5,
  vowel: '',

  // Envelope
  attack: 0.001,
  decay: 0.1,
  sustain: 0.5,
  release: 0.1
}

export function createDefaultPattern(): boolean[] {
  return Array(16).fill(false)
}

export function createDefaultNotes(): string[] {
  return Array(8).fill('~')
}
