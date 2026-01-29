<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import { useAudioEngine } from '@/composables/useAudioEngine'
import ParameterSlider from './ParameterSlider.vue'
import Icon from '@/components/icons/Icon.vue'

const projectStore = useProjectStore()
const { toggle, stop } = useAudioEngine()
</script>

<template>
  <div class="h-20 bg-surface-900 border-t border-surface-700 flex items-center px-6 gap-6">
    <!-- Transport controls -->
    <div class="flex items-center gap-2">
      <!-- Stop -->
      <button
        @click="stop"
        class="w-10 h-10 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors"
      >
        <Icon name="StopIcon" :size="18" class="text-surface-400" />
      </button>

      <!-- Play/Pause -->
      <button
        @click="toggle"
        :class="[
          'w-14 h-14 rounded-xl flex items-center justify-center transition-all',
          projectStore.isPlaying
            ? 'gradient-primary glow-primary'
            : 'bg-primary-600 hover:bg-primary-500'
        ]"
      >
        <Icon
          :name="projectStore.isPlaying ? 'PauseIcon' : 'PlayIcon'"
          :size="24"
          class="text-white"
          :class="{ 'ml-0.5': !projectStore.isPlaying }"
        />
      </button>
    </div>

    <!-- Step indicator -->
    <div class="flex gap-0.5">
      <div
        v-for="i in 16"
        :key="i"
        :class="[
          'w-2 h-6 rounded-sm transition-all',
          projectStore.currentStep === i - 1 && projectStore.isPlaying
            ? 'bg-primary-500'
            : (i - 1) % 4 === 0
              ? 'bg-surface-600'
              : 'bg-surface-700'
        ]"
      />
    </div>

    <!-- BPM -->
    <div class="w-40">
      <ParameterSlider
        label="BPM"
        :value="projectStore.bpm"
        :min="60"
        :max="200"
        :step="1"
        @update="projectStore.setBpm($event)"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Master volume -->
    <div class="w-40">
      <ParameterSlider
        label="Master"
        :value="projectStore.masterVolume"
        :min="0"
        :max="1"
        :step="0.05"
        @update="projectStore.setMasterVolume($event)"
      />
    </div>
  </div>
</template>
