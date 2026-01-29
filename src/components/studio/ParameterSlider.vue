<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  value: number
  min: number
  max: number
  step: number
  color?: string
  unit?: string
}>(), {
  color: '#a855f7',
  unit: ''
})

const emit = defineEmits<{
  update: [value: number]
}>()

const displayValue = computed(() => {
  if (props.max > 1000) {
    return props.value >= 1000
      ? `${(props.value / 1000).toFixed(1)}k`
      : props.value.toString()
  }
  return props.value.toFixed(2)
})

const progressPercent = computed(() => {
  return ((props.value - props.min) / (props.max - props.min)) * 100
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update', parseFloat(target.value))
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between text-xs">
      <span class="text-surface-400">{{ label }}</span>
      <span class="text-surface-300">{{ displayValue }}{{ unit }}</span>
    </div>
    <div class="relative">
      <input
        type="range"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        @input="handleInput"
        class="w-full h-2 rounded-full appearance-none cursor-pointer slider"
        :style="{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${progressPercent}%, #374151 ${progressPercent}%, #374151 100%)`
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
