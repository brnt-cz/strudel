import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Track, Project, TrackParams } from '@/types'
import { DEFAULT_TRACK_PARAMS, createDefaultPattern, createDefaultNotes } from '@/types'
import { getSoundById } from '@/data/soundBanks'

export const useProjectStore = defineStore('project', () => {
  // State
  const currentProject = ref<Project | null>(null)
  const tracks = ref<Track[]>([])
  const bpm = ref(120)
  const masterVolume = ref(0.7)
  const isPlaying = ref(false)
  const currentStep = ref(0)

  // Getters
  const activeTracks = computed(() => {
    const soloTracks = tracks.value.filter(t => t.solo)
    if (soloTracks.length > 0) {
      return soloTracks
    }
    return tracks.value.filter(t => !t.muted)
  })

  const hasSoloTracks = computed(() => tracks.value.some(t => t.solo))

  const cps = computed(() => bpm.value / 60 / 4)

  // Actions
  function addTrack(soundId: string, type: 'drum' | 'synth' | 'bass', drumBank?: string) {
    const sound = getSoundById(soundId)
    if (!sound) return

    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: sound.name,
      type,
      soundId,
      color: sound.color,
      pattern: createDefaultPattern(),
      notes: createDefaultNotes(),
      params: { ...DEFAULT_TRACK_PARAMS },
      drumBank: type === 'drum' ? (drumBank || 'RolandTR808') : undefined,
      scale: type !== 'drum' ? 'minor' : undefined,
      rootNote: type !== 'drum' ? 'c' : undefined,
      octave: type !== 'drum' ? 3 : undefined,
      muted: false,
      solo: false
    }

    tracks.value.push(newTrack)
    return newTrack
  }

  function updateTrack(id: string, updates: Partial<Track>) {
    const index = tracks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tracks.value[index] = { ...tracks.value[index], ...updates }
    }
  }

  function updateTrackParams(id: string, params: Partial<TrackParams>) {
    const track = tracks.value.find(t => t.id === id)
    if (track) {
      track.params = { ...track.params, ...params }
    }
  }

  function removeTrack(id: string) {
    tracks.value = tracks.value.filter(t => t.id !== id)
  }

  function toggleStep(trackId: string, stepIndex: number) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track && track.pattern) {
      track.pattern[stepIndex] = !track.pattern[stepIndex]
    }
  }

  function updateNote(trackId: string, noteIndex: number, note: string) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track && track.notes) {
      track.notes[noteIndex] = note
    }
  }

  function toggleMute(trackId: string) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track) {
      track.muted = !track.muted
    }
  }

  function toggleSolo(trackId: string) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track) {
      track.solo = !track.solo
    }
  }

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function stop() {
    isPlaying.value = false
    currentStep.value = 0
  }

  function tick() {
    currentStep.value = (currentStep.value + 1) % 16
  }

  function setBpm(value: number) {
    bpm.value = Math.max(60, Math.min(200, value))
  }

  function setMasterVolume(value: number) {
    masterVolume.value = Math.max(0, Math.min(1, value))
  }

  function clearProject() {
    tracks.value = []
    currentProject.value = null
    bpm.value = 120
    masterVolume.value = 0.7
    isPlaying.value = false
    currentStep.value = 0
  }

  function moveTrack(fromIndex: number, toIndex: number) {
    const track = tracks.value.splice(fromIndex, 1)[0]
    tracks.value.splice(toIndex, 0, track)
  }

  return {
    // State
    currentProject,
    tracks,
    bpm,
    masterVolume,
    isPlaying,
    currentStep,
    // Getters
    activeTracks,
    hasSoloTracks,
    cps,
    // Actions
    addTrack,
    updateTrack,
    updateTrackParams,
    removeTrack,
    toggleStep,
    updateNote,
    toggleMute,
    toggleSolo,
    play,
    pause,
    stop,
    tick,
    setBpm,
    setMasterVolume,
    clearProject,
    moveTrack
  }
})
