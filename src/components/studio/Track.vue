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
const activeEffectTab = ref<'basic' | 'filter' | 'delay' | 'distort' | 'mod' | 'env'>('basic')

const trackStyle = computed(() => ({
  borderLeftColor: props.track.color,
  borderLeftWidth: '4px'
}))

const effectTabs = [
  { id: 'basic' as const, label: 'Základní' },
  { id: 'filter' as const, label: 'Filtr' },
  { id: 'delay' as const, label: 'Delay/Reverb' },
  { id: 'distort' as const, label: 'Distortion' },
  { id: 'mod' as const, label: 'Modulace' },
  { id: 'env' as const, label: 'Obálka' },
]

const vowelOptions = [
  { value: '', label: 'Vyp' },
  { value: 'a', label: 'A' },
  { value: 'e', label: 'E' },
  { value: 'i', label: 'I' },
  { value: 'o', label: 'O' },
  { value: 'u', label: 'U' },
]

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function removeTrack() {
  projectStore.removeTrack(props.track.id)
}

function updateDrumBank(bank: string) {
  projectStore.updateTrack(props.track.id, { drumBank: bank })
}

function updateVowel(vowel: string) {
  projectStore.updateTrackParams(props.track.id, { vowel })
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

    <!-- Effects (expanded) -->
    <Transition name="expand">
      <div v-if="isExpanded" class="border-t border-surface-700 bg-surface-850">
        <!-- Effect tabs -->
        <div class="flex border-b border-surface-700 overflow-x-auto">
          <button
            v-for="tab in effectTabs"
            :key="tab.id"
            @click="activeEffectTab = tab.id"
            :class="[
              'px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors',
              activeEffectTab === tab.id
                ? 'text-white border-b-2'
                : 'text-surface-400 hover:text-white'
            ]"
            :style="activeEffectTab === tab.id ? { borderColor: track.color } : {}"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Effect content -->
        <div class="p-3">
          <!-- Basic -->
          <div v-if="activeEffectTab === 'basic'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              label="Pan"
              :value="track.params.pan"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { pan: $event })"
            />
            <ParameterSlider
              label="Rychlost"
              :value="track.params.speed"
              :min="0.25"
              :max="2"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { speed: $event })"
            />
          </div>

          <!-- Filter -->
          <div v-if="activeEffectTab === 'filter'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              label="LP Resonance"
              :value="track.params.lpq"
              :min="0"
              :max="20"
              :step="0.5"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { lpq: $event })"
            />
            <ParameterSlider
              label="High-pass"
              :value="track.params.hpf"
              :min="20"
              :max="5000"
              :step="20"
              :color="track.color"
              unit="Hz"
              @update="projectStore.updateTrackParams(track.id, { hpf: $event })"
            />
            <ParameterSlider
              label="HP Resonance"
              :value="track.params.hpq"
              :min="0"
              :max="20"
              :step="0.5"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { hpq: $event })"
            />
          </div>

          <!-- Delay/Reverb -->
          <div v-if="activeEffectTab === 'delay'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ParameterSlider
              label="Delay Mix"
              :value="track.params.delay"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { delay: $event })"
            />
            <ParameterSlider
              label="Delay Time"
              :value="track.params.delayTime"
              :min="0.05"
              :max="1"
              :step="0.05"
              :color="track.color"
              unit="s"
              @update="projectStore.updateTrackParams(track.id, { delayTime: $event })"
            />
            <ParameterSlider
              label="Feedback"
              :value="track.params.delayFeedback"
              :min="0"
              :max="0.9"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { delayFeedback: $event })"
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
            <ParameterSlider
              label="Room Size"
              :value="track.params.reverbSize"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { reverbSize: $event })"
            />
          </div>

          <!-- Distortion -->
          <div v-if="activeEffectTab === 'distort'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ParameterSlider
              label="Distortion"
              :value="track.params.distort"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { distort: $event })"
            />
            <ParameterSlider
              label="Bitcrush"
              :value="track.params.crush"
              :min="1"
              :max="16"
              :step="1"
              :color="track.color"
              unit="bit"
              @update="projectStore.updateTrackParams(track.id, { crush: $event })"
            />
          </div>

          <!-- Modulation -->
          <div v-if="activeEffectTab === 'mod'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ParameterSlider
              label="Phaser"
              :value="track.params.phaser"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { phaser: $event })"
            />
            <ParameterSlider
              label="Phaser Depth"
              :value="track.params.phaserDepth"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { phaserDepth: $event })"
            />
            <div class="space-y-1">
              <label class="text-xs text-surface-400">Vowel</label>
              <div class="flex gap-1">
                <button
                  v-for="opt in vowelOptions"
                  :key="opt.value"
                  @click="updateVowel(opt.value)"
                  :class="[
                    'flex-1 py-1.5 text-xs font-medium rounded transition-colors',
                    track.params.vowel === opt.value
                      ? 'text-white'
                      : 'bg-surface-700 text-surface-400 hover:text-white'
                  ]"
                  :style="track.params.vowel === opt.value ? { backgroundColor: track.color } : {}"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Envelope -->
          <div v-if="activeEffectTab === 'env'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ParameterSlider
              label="Attack"
              :value="track.params.attack"
              :min="0.001"
              :max="1"
              :step="0.01"
              :color="track.color"
              unit="s"
              @update="projectStore.updateTrackParams(track.id, { attack: $event })"
            />
            <ParameterSlider
              label="Decay"
              :value="track.params.decay"
              :min="0.01"
              :max="1"
              :step="0.01"
              :color="track.color"
              unit="s"
              @update="projectStore.updateTrackParams(track.id, { decay: $event })"
            />
            <ParameterSlider
              label="Sustain"
              :value="track.params.sustain"
              :min="0"
              :max="1"
              :step="0.05"
              :color="track.color"
              @update="projectStore.updateTrackParams(track.id, { sustain: $event })"
            />
            <ParameterSlider
              label="Release"
              :value="track.params.release"
              :min="0.01"
              :max="2"
              :step="0.01"
              :color="track.color"
              unit="s"
              @update="projectStore.updateTrackParams(track.id, { release: $event })"
            />
          </div>
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
  transition: opacity 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
