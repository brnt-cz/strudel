<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import Icon from '@/components/icons/Icon.vue'

const uiStore = useUiStore()

const tabs = [
  { id: 'sounds' as const, label: 'Zvuky', icon: 'MusicIcon' as const },
  { id: 'projects' as const, label: 'Projekty', icon: 'FolderIcon' as const }
]
</script>

<template>
  <aside class="w-64 bg-surface-900 border-r border-surface-700 flex flex-col shrink-0">
    <!-- Tabs -->
    <div class="flex border-b border-surface-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="uiStore.setActiveTab(tab.id)"
        :class="[
          'flex-1 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-1.5',
          uiStore.activeTab === tab.id
            ? 'text-white'
            : 'text-surface-400 hover:text-white'
        ]"
      >
        <Icon :name="tab.icon" :size="16" />
        {{ tab.label }}
        <div
          v-if="uiStore.activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary"
        />
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </aside>
</template>
