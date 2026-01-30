<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNotification from '@/components/layout/AppNotification.vue'
import { useAudioEngine } from '@/composables/useAudioEngine'

const { initOnInteraction } = useAudioEngine()

// Initialize audio on first user interaction to eliminate startup delay
onMounted(() => {
  initOnInteraction()
})
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1 flex overflow-hidden">
      <RouterView />
    </main>
    <AppNotification />
  </div>
</template>
