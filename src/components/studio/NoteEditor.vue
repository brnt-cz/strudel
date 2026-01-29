<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Track } from '@/types'
import { generateNoteOptions, type RootNote, type ScaleName, scaleNames, rootNotes } from '@/data/scales'

const props = defineProps<{
  track: Track
}>()

const projectStore = useProjectStore()

const notes = computed(() => props.track.notes)

const noteOptions = computed(() =>
  generateNoteOptions(
    (props.track.rootNote as RootNote) || 'c',
    (props.track.scale as ScaleName) || 'minor',
    (props.track.octave || 3) as 1 | 2 | 3 | 4 | 5 | 6
  )
)

function updateNote(index: number, note: string) {
  projectStore.updateNote(props.track.id, index, note)
}

function updateScale(scale: string) {
  projectStore.updateTrack(props.track.id, { scale })
}

function updateRootNote(rootNote: string) {
  projectStore.updateTrack(props.track.id, { rootNote })
}

function updateOctave(octave: number) {
  projectStore.updateTrack(props.track.id, { octave })
}

function isCurrentNote(index: number) {
  return projectStore.isPlaying && Math.floor(projectStore.currentStep / 2) === index
}
</script>

<template>
  <div class="space-y-3">
    <!-- Scale controls -->
    <div class="flex gap-2 text-sm">
      <select
        :value="track.rootNote || 'c'"
        @change="updateRootNote(($event.target as HTMLSelectElement).value)"
        class="bg-surface-700 border border-surface-600 rounded px-2 py-1"
      >
        <option v-for="note in rootNotes" :key="note" :value="note">
          {{ note.toUpperCase() }}
        </option>
      </select>

      <select
        :value="track.scale || 'minor'"
        @change="updateScale(($event.target as HTMLSelectElement).value)"
        class="bg-surface-700 border border-surface-600 rounded px-2 py-1 flex-1"
      >
        <option v-for="scale in scaleNames" :key="scale.id" :value="scale.id">
          {{ scale.name }}
        </option>
      </select>

      <select
        :value="track.octave || 3"
        @change="updateOctave(Number(($event.target as HTMLSelectElement).value))"
        class="bg-surface-700 border border-surface-600 rounded px-2 py-1"
      >
        <option v-for="oct in [1, 2, 3, 4, 5]" :key="oct" :value="oct">
          Oct {{ oct }}
        </option>
      </select>
    </div>

    <!-- Note selectors -->
    <div class="flex gap-1">
      <template v-for="(note, index) in notes" :key="index">
        <div v-if="index > 0 && index % 4 === 0" class="w-1" />

        <select
          :value="note"
          @change="updateNote(index, ($event.target as HTMLSelectElement).value)"
          :class="[
            'flex-1 min-w-0 bg-surface-700 border rounded px-1 py-1.5 text-xs text-center transition-all',
            isCurrentNote(index)
              ? 'border-white ring-1 ring-white'
              : 'border-surface-600'
          ]"
          :style="note !== '~' ? { borderColor: track.color, backgroundColor: track.color + '20' } : {}"
        >
          <option v-for="opt in noteOptions" :key="opt" :value="opt">
            {{ opt === '~' ? '—' : opt }}
          </option>
        </select>
      </template>
    </div>
  </div>
</template>
