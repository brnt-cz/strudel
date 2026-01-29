<script setup lang="ts">
import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { showSuccess } = useNotification()

const projectName = ref('Nový projekt')

function saveProject() {
  // TODO: Evolu integration
  showSuccess('Projekt uložen')
}
</script>

<template>
  <header class="h-14 bg-surface-900 border-b border-surface-700 flex items-center px-4 gap-4 shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-lg font-bold">
        S
      </div>
      <span class="text-lg font-semibold gradient-text hidden sm:block">Strudel Studio</span>
    </div>

    <!-- Project name -->
    <div class="flex-1 max-w-xs">
      <input
        v-model="projectName"
        type="text"
        class="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
        placeholder="Název projektu"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        @click="saveProject"
        class="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm font-medium transition-colors"
      >
        Uložit
      </button>

      <router-link
        to="/projects"
        class="px-3 py-1.5 bg-surface-800 hover:bg-surface-700 rounded-lg text-sm transition-colors"
      >
        Projekty
      </router-link>
    </div>
  </header>
</template>
