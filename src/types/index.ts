export type TrackType = 'drum' | 'synth' | 'bass'

export interface TrackParams {
  gain: number       // 0 - 1.5
  lpf: number        // 20 - 20000 Hz
  hpf: number        // 20 - 20000 Hz
  delay: number      // 0 - 1
  delayTime: number  // 0.1 - 1
  reverb: number     // 0 - 1
  pan: number        // 0 - 1 (0.5 = center)
  speed: number      // 0.25 - 2
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
  gain: 0.8,
  lpf: 20000,
  hpf: 20,
  delay: 0,
  delayTime: 0.25,
  reverb: 0,
  pan: 0.5,
  speed: 1
}

export function createDefaultPattern(): boolean[] {
  return Array(16).fill(false)
}

export function createDefaultNotes(): string[] {
  return Array(8).fill('~')
}
