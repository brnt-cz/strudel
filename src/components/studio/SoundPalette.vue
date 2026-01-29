<script setup lang="ts">
import { soundBanks, drumBanks } from '@/data/soundBanks'
import { useDragDrop } from '@/composables/useDragDrop'
import { useAudioEngine } from '@/composables/useAudioEngine'
import Icon from '@/components/icons/Icon.vue'
import type { Sound } from '@/types'

const { onDragStart, onDragEnd } = useDragDrop()
const { playSound, init } = useAudioEngine()

async function previewSound(sound: Sound) {
  await init()
  playSound(sound.id)
}
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- Sound banks -->
    <div v-for="bank in soundBanks" :key="bank.id" class="space-y-2">
      <h3 class="text-sm font-semibold text-surface-300 flex items-center gap-2">
        <Icon :name="bank.icon as any" :size="16" class="text-surface-400" />
        {{ bank.name }}
      </h3>

      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="sound in bank.sounds"
          :key="sound.id"
          draggable="true"
          @dragstart="onDragStart(sound, $event)"
          @dragend="onDragEnd"
          @click="previewSound(sound)"
          class="group relative px-3 py-2 rounded-lg bg-surface-800 border-2 border-transparent hover:border-primary-500/50 cursor-grab active:cursor-grabbing transition-all"
          :style="{ borderLeftColor: sound.color, borderLeftWidth: '3px' }"
        >
          <span class="text-sm font-medium">{{ sound.name }}</span>
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"
            :style="{ backgroundColor: sound.color }"
          />
        </div>
      </div>
    </div>

    <!-- Drum banks info -->
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-surface-300">Drum banky</h3>
      <p class="text-xs text-surface-400">
        Bicí používají tyto zvukové banky:
      </p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="bank in drumBanks"
          :key="bank"
          class="px-2 py-0.5 text-xs bg-surface-800 rounded"
        >
          {{ bank }}
        </span>
      </div>
    </div>
  </div>
</template>
