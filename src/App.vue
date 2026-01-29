<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNotification from '@/components/layout/AppNotification.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 flex overflow-hidden">
      <RouterView />
    </main>
    <AppNotification />
  </div>
</template>
