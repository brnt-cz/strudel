<script setup lang="ts">
import { ref } from 'vue'
import { useStrudelCode } from '@/composables/useStrudelCode'
import { useNotification } from '@/composables/useNotification'
import Icon from '@/components/icons/Icon.vue'

const { strudelCode, copyCode, openInStrudel } = useStrudelCode()
const { showSuccess } = useNotification()

const isCopied = ref(false)

async function handleCopy() {
  await copyCode()
  isCopied.value = true
  showSuccess('Kód zkopírován')
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="w-80 bg-surface-900 border-l border-surface-700 flex flex-col shrink-0">
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b border-surface-700">
      <h3 class="font-semibold text-sm">Strudel kód</h3>
      <div class="flex gap-1">
        <button
          @click="handleCopy"
          :class="[
            'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
            isCopied
              ? 'bg-green-600 text-white'
              : 'bg-surface-800 hover:bg-surface-700 text-surface-300'
          ]"
        >
          <Icon :name="isCopied ? 'CheckIcon' : 'CopyIcon'" :size="12" />
          {{ isCopied ? 'Zkopírováno' : 'Kopírovat' }}
        </button>
      </div>
    </div>

    <!-- Code -->
    <div class="flex-1 overflow-auto p-3">
      <pre class="text-xs font-mono text-green-400 whitespace-pre-wrap break-all">{{ strudelCode }}</pre>
    </div>

    <!-- Actions -->
    <div class="p-3 border-t border-surface-700">
      <button
        @click="openInStrudel"
        class="w-full py-2 gradient-primary hover:opacity-90 rounded-lg text-sm font-medium transition-opacity flex items-center justify-center gap-2"
      >
        <span>Otevřít v Strudel.cc</span>
        <Icon name="ExternalLinkIcon" :size="14" />
      </button>
    </div>
  </div>
</template>
