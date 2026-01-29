<script setup lang="ts">
import { computed } from 'vue'
import * as icons from './index'

const props = withDefaults(defineProps<{
  name: keyof typeof icons
  size?: number | string
}>(), {
  size: 20
})

const svgContent = computed(() => icons[props.name])
const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
</script>

<template>
  <span
    class="inline-flex items-center justify-center shrink-0"
    :style="{ width: sizeValue, height: sizeValue }"
    v-html="svgContent"
  />
</template>

<style scoped>
span :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
