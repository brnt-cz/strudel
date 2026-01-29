<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import Icon from '@/components/icons/Icon.vue'

const uiStore = useUiStore()

function getIcon(type: string) {
  switch (type) {
    case 'success': return 'CheckIcon' as const
    case 'error': return 'CloseIcon' as const
    default: return 'MusicIcon' as const
  }
}

function getBgColor(type: string) {
  switch (type) {
    case 'success': return 'bg-green-600'
    case 'error': return 'bg-red-600'
    default: return 'bg-blue-600'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="notification">
        <div
          v-for="notification in uiStore.notifications"
          :key="notification.id"
          class="flex items-center gap-3 px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl shadow-lg min-w-[280px]"
        >
          <div
            :class="[getBgColor(notification.type), 'w-6 h-6 rounded-full flex items-center justify-center']"
          >
            <Icon :name="getIcon(notification.type)" :size="14" class="text-white" />
          </div>
          <span class="text-sm flex-1">{{ notification.message }}</span>
          <button
            @click="uiStore.removeNotification(notification.id)"
            class="text-surface-400 hover:text-white transition-colors"
          >
            <Icon name="CloseIcon" :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
