import type { SoundBank } from '@/types'

export const drumBanks = [
  'RolandTR808',
  'RolandTR909',
  'RolandCR78',
  'AkaiLinn'
] as const

export type DrumBank = typeof drumBanks[number]

export const soundBanks: SoundBank[] = [
  {
    id: 'drums',
    name: 'Bicí',
    icon: 'DrumIcon',
    type: 'drum',
    sounds: [
      { id: 'bd', name: 'Kick', color: '#ef4444', type: 'drum' },
      { id: 'sd', name: 'Snare', color: '#f97316', type: 'drum' },
      { id: 'hh', name: 'Hi-Hat', color: '#eab308', type: 'drum' },
      { id: 'oh', name: 'Open HH', color: '#84cc16', type: 'drum' },
      { id: 'cp', name: 'Clap', color: '#22c55e', type: 'drum' },
      { id: 'rim', name: 'Rimshot', color: '#14b8a6', type: 'drum' },
      { id: 'tom', name: 'Tom', color: '#06b6d4', type: 'drum' },
      { id: 'crash', name: 'Crash', color: '#0ea5e9', type: 'drum' }
    ]
  },
  {
    id: 'synths',
    name: 'Syntetizéry',
    icon: 'KeyboardIcon',
    type: 'synth',
    sounds: [
      { id: 'sine', name: 'Sine', color: '#8b5cf6', type: 'synth' },
      { id: 'sawtooth', name: 'Saw', color: '#a855f7', type: 'synth' },
      { id: 'square', name: 'Square', color: '#d946ef', type: 'synth' },
      { id: 'triangle', name: 'Triangle', color: '#ec4899', type: 'synth' },
      { id: 'supersaw', name: 'Supersaw', color: '#f43f5e', type: 'synth' }
    ]
  },
  {
    id: 'bass',
    name: 'Basy',
    icon: 'BassIcon',
    type: 'bass',
    sounds: [
      { id: 'bass1', name: 'Sub Bass', color: '#6366f1', type: 'bass' },
      { id: 'bass2', name: 'Acid Bass', color: '#4f46e5', type: 'bass' },
      { id: 'bass3', name: 'Pluck Bass', color: '#4338ca', type: 'bass' }
    ]
  }
]

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
