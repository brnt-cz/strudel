<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SoundPalette from '@/components/studio/SoundPalette.vue'
import TrackArea from '@/components/studio/TrackArea.vue'
import TransportBar from '@/components/studio/TransportBar.vue'
import CodePreview from '@/components/code/CodePreview.vue'

const uiStore = useUiStore()
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar>
        <SoundPalette v-if="uiStore.activeTab === 'sounds'" />
        <div v-else class="p-4 text-surface-400 text-sm">
          <p>Seznam projektů bude zde...</p>
        </div>
      </AppSidebar>

      <!-- Main area -->
      <TrackArea />

      <!-- Code preview -->
      <CodePreview v-if="uiStore.showCodePreview" />
    </div>

    <!-- Transport bar -->
    <TransportBar />
  </div>
</template>
