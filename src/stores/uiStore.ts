import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sound } from '@/types'

export type NotificationType = 'success' | 'error' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
}

export const useUiStore = defineStore('ui', () => {
  // State
  const activeTab = ref<'sounds' | 'projects'>('sounds')
  const draggedSound = ref<Sound | null>(null)
  const notifications = ref<Notification[]>([])
  const showCodePreview = ref(true)
  const selectedTrackId = ref<string | null>(null)
  const isMobileMenuOpen = ref(false)

  // Actions
  function setActiveTab(tab: 'sounds' | 'projects') {
    activeTab.value = tab
  }

  function setDraggedSound(sound: Sound | null) {
    draggedSound.value = sound
  }

  function addNotification(message: string, type: NotificationType = 'info', duration = 3000) {
    const id = crypto.randomUUID()
    notifications.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function toggleCodePreview() {
    showCodePreview.value = !showCodePreview.value
  }

  function selectTrack(trackId: string | null) {
    selectedTrackId.value = trackId
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  return {
    // State
    activeTab,
    draggedSound,
    notifications,
    showCodePreview,
    selectedTrackId,
    isMobileMenuOpen,
    // Actions
    setActiveTab,
    setDraggedSound,
    addNotification,
    removeNotification,
    toggleCodePreview,
    selectTrack,
    toggleMobileMenu,
    closeMobileMenu
  }
})
