import type { SoundBank } from '@/types'

// All available drum machines from tidal-drum-machines
export const drumBanks = [
  // Roland
  'RolandTR808',
  'RolandTR909',
  'RolandTR707',
  'RolandTR727',
  'RolandTR606',
  'RolandTR626',
  'RolandTR505',
  'RolandCR78',
  'RolandCompurhythm1000',
  'RolandCompurhythm8000',
  'RolandR8',
  'RolandMC303',
  'RolandMC202',
  // Akai / Linn
  'AkaiLinn',
  'AkaiMPC60',
  'AkaiXR10',
  'LinnDrum',
  'LinnLM1',
  'LinnLM2',
  'Linn9000',
  'MPC1000',
  // Korg
  'KorgKPR77',
  'KorgKR55',
  'KorgMinipops',
  'KorgDDM110',
  'KorgM1',
  'KorgPoly800',
  // Boss
  'BossDR110',
  'BossDR220',
  'BossDR55',
  'BossDR550',
  'BossDR660',
  // Emu
  'EmuDrumulator',
  'EmuSP12',
  'EmuModular',
  // Yamaha
  'YamahaRX5',
  'YamahaRX21',
  'YamahaRY30',
  'YamahaRM50',
  // Alesis
  'AlesisHR16',
  'AlesisSR16',
  // Oberheim
  'OberheimDMX',
  // Sequential
  'SequentialCircuitsDrumtracks',
  'SequentialCircuitsTom',
  // Simmons
  'SimmonsSDS5',
  'SimmonsSDS400',
  // Casio
  'CasioRZ1',
  'CasioSK1',
  'CasioVL1',
  // Other
  'RhythmAce',
  'MFB512',
  'SakataDPM48',
  'ViscoSpaceDrum',
  'SergeModular',
  'DoepferMS404',
] as const

export type DrumBank = typeof drumBanks[number]

// Drum sounds (standard abbreviations)
const drumSounds = [
  { id: 'bd', name: 'Kick', color: '#ef4444' },
  { id: 'sd', name: 'Snare', color: '#f97316' },
  { id: 'hh', name: 'Hi-Hat', color: '#eab308' },
  { id: 'oh', name: 'Open HH', color: '#84cc16' },
  { id: 'cp', name: 'Clap', color: '#22c55e' },
  { id: 'rim', name: 'Rimshot', color: '#14b8a6' },
  { id: 'lt', name: 'Low Tom', color: '#06b6d4' },
  { id: 'mt', name: 'Mid Tom', color: '#0ea5e9' },
  { id: 'ht', name: 'High Tom', color: '#3b82f6' },
  { id: 'cb', name: 'Cowbell', color: '#6366f1' },
  { id: 'cr', name: 'Crash', color: '#8b5cf6' },
  { id: 'rd', name: 'Ride', color: '#a855f7' },
  { id: 'sh', name: 'Shaker', color: '#d946ef' },
  { id: 'perc', name: 'Perc', color: '#ec4899' },
]

// Basic waveform synths
const basicSynths = [
  { id: 'sine', name: 'Sine', color: '#8b5cf6' },
  { id: 'sawtooth', name: 'Sawtooth', color: '#a855f7' },
  { id: 'square', name: 'Square', color: '#d946ef' },
  { id: 'triangle', name: 'Triangle', color: '#ec4899' },
]

// Noise types
const noiseSynths = [
  { id: 'white', name: 'White Noise', color: '#94a3b8' },
  { id: 'pink', name: 'Pink Noise', color: '#f472b6' },
  { id: 'brown', name: 'Brown Noise', color: '#a78bfa' },
  { id: 'crackle', name: 'Crackle', color: '#fbbf24' },
]

// FM / Complex synths
const fmSynths = [
  { id: 'fm', name: 'FM Synth', color: '#06b6d4' },
  { id: 'supersaw', name: 'Supersaw', color: '#f43f5e' },
  { id: 'supersquare', name: 'Supersquare', color: '#10b981' },
]

// Bass sounds
const bassSounds = [
  { id: 'sawtooth', name: 'Saw Bass', color: '#6366f1' },
  { id: 'square', name: 'Square Bass', color: '#4f46e5' },
  { id: 'triangle', name: 'Sub Bass', color: '#4338ca' },
  { id: 'fm', name: 'FM Bass', color: '#3730a3' },
]

export const soundBanks: SoundBank[] = [
  {
    id: 'drums',
    name: 'Bicí',
    icon: 'DrumIcon',
    type: 'drum',
    sounds: drumSounds.map(s => ({ ...s, type: 'drum' as const }))
  },
  {
    id: 'synths',
    name: 'Syntetizéry',
    icon: 'KeyboardIcon',
    type: 'synth',
    sounds: basicSynths.map(s => ({ ...s, type: 'synth' as const }))
  },
  {
    id: 'noise',
    name: 'Noise',
    icon: 'WaveformIcon',
    type: 'synth',
    sounds: noiseSynths.map(s => ({ ...s, type: 'synth' as const }))
  },
  {
    id: 'fm',
    name: 'FM / Complex',
    icon: 'WaveformIcon',
    type: 'synth',
    sounds: fmSynths.map(s => ({ ...s, type: 'synth' as const }))
  },
  {
    id: 'bass',
    name: 'Basy',
    icon: 'BassIcon',
    type: 'bass',
    sounds: bassSounds.map(s => ({ ...s, type: 'bass' as const }))
  }
]

// Vowel options for formant filter
export const vowelOptions = ['a', 'e', 'i', 'o', 'u', 'ae', 'aa', 'oe', 'ue', 'y'] as const
export type Vowel = typeof vowelOptions[number]

export function getSoundById(soundId: string): SoundBank['sounds'][number] | undefined {
  for (const bank of soundBanks) {
    const sound = bank.sounds.find(s => s.id === soundId)
    if (sound) return sound
  }
  return undefined
}

export function getSoundBankByType(type: string): SoundBank | undefined {
  return soundBanks.find(b => b.type === type)
}

export function getDrumBanksByCategory(): { category: string; banks: string[] }[] {
  return [
    { category: 'Roland', banks: drumBanks.filter(b => b.startsWith('Roland')) },
    { category: 'Akai / Linn', banks: drumBanks.filter(b => b.startsWith('Akai') || b.startsWith('Linn') || b.startsWith('MPC')) },
    { category: 'Korg', banks: drumBanks.filter(b => b.startsWith('Korg')) },
    { category: 'Boss', banks: drumBanks.filter(b => b.startsWith('Boss')) },
    { category: 'Emu', banks: drumBanks.filter(b => b.startsWith('Emu')) },
    { category: 'Yamaha', banks: drumBanks.filter(b => b.startsWith('Yamaha')) },
    { category: 'Ostatní', banks: drumBanks.filter(b =>
      !b.startsWith('Roland') && !b.startsWith('Akai') && !b.startsWith('Linn') &&
      !b.startsWith('MPC') && !b.startsWith('Korg') && !b.startsWith('Boss') &&
      !b.startsWith('Emu') && !b.startsWith('Yamaha')
    )}
  ]
}
