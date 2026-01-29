<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()

// Placeholder projects
const projects = ref([
  { id: '1', name: 'Demo Beat', updatedAt: new Date() },
  { id: '2', name: 'Ambient Track', updatedAt: new Date() }
])

function createNewProject() {
  router.push('/')
}

function openProject(_id: string) {
  router.push('/')
}
</script>

<template>
  <div class="flex-1 p-8 overflow-auto">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Projekty</h1>
        <button
          @click="createNewProject"
          class="px-4 py-2 gradient-primary rounded-lg font-medium transition-opacity hover:opacity-90 flex items-center gap-2"
        >
          <Icon name="PlusIcon" :size="16" />
          Nový projekt
        </button>
      </div>

      <!-- Projects grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          @click="openProject(project.id)"
          class="bg-surface-800 border border-surface-700 rounded-xl p-4 cursor-pointer hover:border-primary-500/50 transition-colors"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Icon name="MusicIcon" :size="20" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium truncate">{{ project.name }}</h3>
              <p class="text-xs text-surface-400">
                {{ project.updatedAt.toLocaleDateString('cs-CZ') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="projects.length === 0"
          class="col-span-full text-center py-12 text-surface-400"
        >
          <Icon name="FolderIcon" :size="48" class="mx-auto mb-4 text-surface-500" />
          <p>Zatím nemáš žádné projekty</p>
        </div>
      </div>

      <!-- Back link -->
      <div class="mt-8">
        <router-link to="/" class="text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1">
          <Icon name="ChevronRightIcon" :size="16" class="rotate-180" />
          Zpět do studia
        </router-link>
      </div>
    </div>
  </div>
</template>
