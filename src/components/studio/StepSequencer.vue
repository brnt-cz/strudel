<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Track } from '@/types'

const props = defineProps<{
  track: Track
}>()

const projectStore = useProjectStore()

const steps = computed(() => props.track.pattern)

function toggleStep(index: number) {
  projectStore.toggleStep(props.track.id, index)
}

function isCurrentStep(index: number) {
  return projectStore.isPlaying && projectStore.currentStep === index
}
</script>

<template>
  <div class="flex gap-1">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Beat separator -->
      <div v-if="index > 0 && index % 4 === 0" class="w-1" />

      <button
        @click="toggleStep(index)"
        :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded transition-all flex-shrink-0',
          step
            ? 'scale-95'
            : 'bg-surface-700 hover:bg-surface-600',
          isCurrentStep(index) && 'ring-2 ring-white ring-offset-1 ring-offset-surface-800'
        ]"
        :style="step ? { backgroundColor: track.color } : {}"
      />
    </template>
  </div>
</template>
