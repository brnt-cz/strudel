import { useUiStore, type NotificationType } from '@/stores/uiStore'

export function useNotification() {
  const uiStore = useUiStore()

  function showNotification(message: string, type: NotificationType = 'info', duration = 3000) {
    return uiStore.addNotification(message, type, duration)
  }

  function showSuccess(message: string, duration = 3000) {
    return showNotification(message, 'success', duration)
  }

  function showError(message: string, duration = 5000) {
    return showNotification(message, 'error', duration)
  }

  function showInfo(message: string, duration = 3000) {
    return showNotification(message, 'info', duration)
  }

  function dismiss(id: string) {
    uiStore.removeNotification(id)
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    dismiss
  }
}
