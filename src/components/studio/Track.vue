<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Track } from '@/types'
import StepSequencer from './StepSequencer.vue'
import NoteEditor from './NoteEditor.vue'
import ParameterSlider from './ParameterSlider.vue'
import Icon from '@/components/icons/Icon.vue'
import { drumBanks } from '@/data/soundBanks'

const props = defineProps<{
  track: Track
}>()

const projectStore = useProjectStore()
const isExpanded = ref(false)

const trackStyle = computed(() => ({
  borderLeftColor: props.track.color,
  borderLeftWidth: '4px'
}))

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function removeTrack() {
  projectStore.removeTrack(props.track.id)
}

function updateDrumBank(bank: string) {
  projectStore.updateTrack(props.track.id, { drumBank: bank })
}
</script>

<template>
  <div
    class="bg-surface-800 rounded-xl overflow-hidden border border-surface-700"
    :style="trackStyle"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 p-3">
      <!-- Expand button -->
      <button
        @click="toggleExpand"
        class="w-6 h-6 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
      >
        <Icon
          name="ChevronRightIcon"
          :size="16"
          :class="{ 'rotate-90': isExpanded }"
          class="transition-transform"
        />
      </button>

      <!-- Name -->
      <div class="flex-1 min-w-0">
        <h3 class="font-medium truncate">{{ track.name }}</h3>
        <p class="text-xs text-surface-400">{{ track.type === 'drum' ? 'Bicí' : track.type === 'synth' ? 'Synth' : 'Bass' }}</p>
      </div>

      <!-- Drum bank selector -->
      <select
        v-if="track.type === 'drum'"
        :value="track.drumBank"
        @change="updateDrumBank(($event.target as HTMLSelectElement).value)"
        class="bg-surface-700 border border-surface-600 rounded px-2 py-1 text-xs"
      >
        <option v-for="bank in drumBanks" :key="bank" :value="bank">
          {{ bank }}
        </option>
      </select>

      <!-- Mute/Solo -->
      <div class="flex gap-1">
        <button
          @click="projectStore.toggleMute(track.id)"
          :class="[
            'w-8 h-8 rounded text-xs font-bold transition-colors',
            track.muted
              ? 'bg-red-600 text-white'
              : 'bg-surface-700 text-surface-400 hover:text-white'
          ]"
        >
          M
        </button>
        <button
          @click="projectStore.toggleSolo(track.id)"
          :class="[
            'w-8 h-8 rounded text-xs font-bold transition-colors',
            track.solo
              ? 'bg-yellow-600 text-white'
              : 'bg-surface-700 text-surface-400 hover:text-white'
          ]"
        >
          S
        </button>
      </div>

      <!-- Delete -->
      <button
        @click="removeTrack"
        class="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors"
      >
        <Icon name="TrashIcon" :size="16" />
      </button>
    </div>

    <!-- Sequencer -->
    <div class="px-3 pb-3">
      <StepSequencer
        v-if="track.type === 'drum'"
        :track="track"
      />
      <NoteEditor
        v-else
        :track="track"
      />
    </div>

    <!-- Parameters (expanded) -->
    <Transition name="expand">
      <div v-if="isExpanded" class="border-t border-surface-700 p-3 space-y-3 bg-surface-850">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ParameterSlider
            label="Hlasitost"
            :value="track.params.gain"
            :min="0"
            :max="1.5"
            :step="0.05"
            :color="track.color"
            @update="projectStore.updateTrackParams(track.id, { gain: $event })"
          />
          <ParameterSlider
            label="Low-pass"
            :value="track.params.lpf"
            :min="100"
            :max="20000"
            :step="100"
            :color="track.color"
            unit="Hz"
            @update="projectStore.updateTrackParams(track.id, { lpf: $event })"
          />
          <ParameterSlider
            label="Delay"
            :value="track.params.delay"
            :min="0"
            :max="1"
            :step="0.05"
            :color="track.color"
            @update="projectStore.updateTrackParams(track.id, { delay: $event })"
          />
          <ParameterSlider
            label="Reverb"
            :value="track.params.reverb"
            :min="0"
            :max="1"
            :step="0.05"
            :color="track.color"
            @update="projectStore.updateTrackParams(track.id, { reverb: $event })"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bg-surface-850 {
  background-color: #1a1f2e;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
}
</style>
