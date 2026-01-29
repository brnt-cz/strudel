export interface DrumPreset {
  id: string
  name: string
  patterns: {
    bd: boolean[]
    sd: boolean[]
    hh: boolean[]
    oh?: boolean[]
  }
}

export const drumPresets: DrumPreset[] = [
  {
    id: 'basic-rock',
    name: 'Basic Rock',
    patterns: {
      bd: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      sd: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hh: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]
    }
  },
  {
    id: 'four-floor',
    name: 'Four on Floor',
    patterns: {
      bd: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      sd: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hh: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      oh: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
    }
  },
  {
    id: 'trap',
    name: 'Trap',
    patterns: {
      bd: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
      sd: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
      hh: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    }
  },
  {
    id: 'breakbeat',
    name: 'Breakbeat',
    patterns: {
      bd: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
      sd: [false, false, false, false, true, false, false, true, false, false, false, false, true, false, false, false],
      hh: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]
    }
  },
  {
    id: 'reggae',
    name: 'Reggae',
    patterns: {
      bd: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
      sd: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      hh: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
    }
  }
]

export function getPresetById(id: string): DrumPreset | undefined {
  return drumPresets.find(p => p.id === id)
}
