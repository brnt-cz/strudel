import { ref } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useProjectStore } from '@/stores/projectStore'
import type { Sound } from '@/types'

export function useDragDrop() {
  const uiStore = useUiStore()
  const projectStore = useProjectStore()

  const isDragging = ref(false)
  const isOverDropZone = ref(false)

  function onDragStart(sound: Sound, event: DragEvent) {
    isDragging.value = true
    uiStore.setDraggedSound(sound)

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('application/json', JSON.stringify(sound))
    }
  }

  function onDragEnd() {
    isDragging.value = false
    isOverDropZone.value = false
    uiStore.setDraggedSound(null)
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
    isOverDropZone.value = true
  }

  function onDragLeave() {
    isOverDropZone.value = false
  }

  function onDrop(event: DragEvent, drumBank?: string) {
    event.preventDefault()
    isOverDropZone.value = false

    const sound = uiStore.draggedSound
    if (sound) {
      projectStore.addTrack(sound.id, sound.type, drumBank)
      uiStore.addNotification(`Přidána stopa: ${sound.name}`, 'success')
    }

    uiStore.setDraggedSound(null)
    isDragging.value = false
  }

  // Touch support
  function onTouchStart(sound: Sound) {
    isDragging.value = true
    uiStore.setDraggedSound(sound)
  }

  function onTouchEnd(isInDropZone: boolean, drumBank?: string) {
    if (isInDropZone && uiStore.draggedSound) {
      projectStore.addTrack(uiStore.draggedSound.id, uiStore.draggedSound.type, drumBank)
      uiStore.addNotification(`Přidána stopa: ${uiStore.draggedSound.name}`, 'success')
    }

    isDragging.value = false
    uiStore.setDraggedSound(null)
  }

  return {
    isDragging,
    isOverDropZone,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
    onTouchEnd
  }
}
