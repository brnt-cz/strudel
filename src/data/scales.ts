export const scales = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10]
} as const

export type ScaleName = keyof typeof scales

export const scaleNames: { id: ScaleName; name: string }[] = [
  { id: 'chromatic', name: 'Chromatická' },
  { id: 'major', name: 'Durová' },
  { id: 'minor', name: 'Mollová' },
  { id: 'dorian', name: 'Dórská' },
  { id: 'phrygian', name: 'Frygická' },
  { id: 'lydian', name: 'Lydická' },
  { id: 'mixolydian', name: 'Mixolydická' },
  { id: 'pentatonicMajor', name: 'Pentatonika dur' },
  { id: 'pentatonicMinor', name: 'Pentatonika moll' },
  { id: 'blues', name: 'Blues' }
]

export const rootNotes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'] as const
export type RootNote = typeof rootNotes[number]

export const octaves = [1, 2, 3, 4, 5, 6] as const
export type Octave = typeof octaves[number]

export const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'] as const

export function getNotesInScale(rootNote: RootNote, scaleName: ScaleName, octave: Octave): string[] {
  const rootIndex = noteNames.indexOf(rootNote)
  const scaleIntervals = scales[scaleName]

  return scaleIntervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12
    const noteOctave = octave + Math.floor((rootIndex + interval) / 12)
    return `${noteNames[noteIndex]}${noteOctave}`
  })
}

export function generateNoteOptions(rootNote: RootNote = 'c', scaleName: ScaleName = 'major', baseOctave: Octave = 3): string[] {
  const notes: string[] = ['~'] // rest

  for (let oct = baseOctave - 1; oct <= baseOctave + 1; oct++) {
    if (oct >= 1 && oct <= 6) {
      notes.push(...getNotesInScale(rootNote, scaleName, oct as Octave))
    }
  }

  return [...new Set(notes)]
}
