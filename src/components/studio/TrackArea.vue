<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import { useUiStore } from '@/stores/uiStore'
import { useDragDrop } from '@/composables/useDragDrop'
import Track from './Track.vue'
import Icon from '@/components/icons/Icon.vue'

const projectStore = useProjectStore()
const uiStore = useUiStore()
const { isOverDropZone, onDragOver, onDragLeave, onDrop } = useDragDrop()
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Track list -->
    <div
      class="flex-1 overflow-y-auto p-4 space-y-3"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop($event)"
    >
      <TransitionGroup name="track-list">
        <Track
          v-for="track in projectStore.tracks"
          :key="track.id"
          :track="track"
        />
      </TransitionGroup>

      <!-- Empty state / Drop zone -->
      <div
        v-if="projectStore.tracks.length === 0 || uiStore.draggedSound"
        :class="[
          'border-2 border-dashed rounded-xl p-8 text-center transition-all',
          isOverDropZone
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-surface-700 bg-surface-800/50'
        ]"
      >
        <div v-if="projectStore.tracks.length === 0" class="space-y-2">
          <Icon name="MusicIcon" :size="48" class="mx-auto text-surface-500" />
          <p class="text-surface-300 font-medium">Přetáhni sem zvuky</p>
          <p class="text-surface-400 text-sm">
            Vyber zvuky z palety vlevo a přetáhni je sem pro vytvoření stop
          </p>
        </div>
        <div v-else class="text-primary-400 font-medium">
          Pusť zde pro přidání stopy
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-list-enter-active,
.track-list-leave-active {
  transition: all 0.3s ease;
}

.track-list-enter-from,
.track-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.track-list-move {
  transition: transform 0.3s ease;
}
</style>
