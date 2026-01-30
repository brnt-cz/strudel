<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAudioEngine } from '@/composables/useAudioEngine'
import { getDrumBanksByCategory } from '@/data/soundBanks'
import Icon from '@/components/icons/Icon.vue'

const props = defineProps<{
  modelValue?: string // selected drum bank
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
}>()

const { previewSample, getMachineSoundTypes, getSampleCount, isInitialized, init } = useAudioEngine()

const selectedBank = ref(props.modelValue || 'RolandTR808')
const expandedCategory = ref<string | null>('Roland')
const loadingSound = ref<string | null>(null)

const categories = computed(() => getDrumBanksByCategory())

const availableSounds = computed(() => {
  if (!selectedBank.value) return []
  const types = getMachineSoundTypes(selectedBank.value)
  return types.map(type => ({
    type,
    count: getSampleCount(selectedBank.value, type),
    name: getSoundName(type)
  }))
})

function getSoundName(type: string): string {
  const names: Record<string, string> = {
    bd: 'Kick',
    sd: 'Snare',
    hh: 'Hi-Hat',
    oh: 'Open Hat',
    cp: 'Clap',
    cr: 'Crash',
    rd: 'Ride',
    lt: 'Low Tom',
    mt: 'Mid Tom',
    ht: 'High Tom',
    cb: 'Cowbell',
    rim: 'Rimshot',
    sh: 'Shaker',
    tb: 'Tambourine',
    perc: 'Perc',
    misc: 'Misc'
  }
  return names[type] || type.toUpperCase()
}

function toggleCategory(category: string) {
  expandedCategory.value = expandedCategory.value === category ? null : category
}

function selectBank(bank: string) {
  selectedBank.value = bank
  emit('update:modelValue', bank)
}

async function playPreview(soundType: string, variation: number = 0) {
  if (!isInitialized.value) {
    await init()
  }
  loadingSound.value = `${soundType}_${variation}`
  try {
    await previewSample(selectedBank.value, soundType, variation)
  } finally {
    loadingSound.value = null
  }
}

function confirmSelection() {
  emit('update:modelValue', selectedBank.value)
  emit('close')
}

watch(() => props.modelValue, (val) => {
  if (val) selectedBank.value = val
})

onMounted(async () => {
  if (!isInitialized.value) {
    await init()
  }
})
</script>

<template>
  <div class="bg-surface-800 rounded-xl border border-surface-700 overflow-hidden w-[900px] h-[600px] flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-surface-700 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">Drum Machines</h3>
      <button @click="emit('close')" class="text-surface-400 hover:text-white">
        <Icon name="CloseIcon" :size="20" />
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- Bank list -->
      <div class="w-64 shrink-0 border-r border-surface-700 overflow-y-auto">
        <div v-for="category in categories" :key="category.category" class="border-b border-surface-700/50">
          <!-- Category header -->
          <button
            @click="toggleCategory(category.category)"
            class="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-surface-700/50 transition-colors"
          >
            <span class="text-surface-300 font-medium text-sm">{{ category.category }}</span>
            <Icon
              :name="expandedCategory === category.category ? 'ChevronDownIcon' : 'ChevronRightIcon'"
              :size="16"
              class="text-surface-500"
            />
          </button>

          <!-- Banks in category -->
          <div v-if="expandedCategory === category.category" class="bg-surface-900/50">
            <button
              v-for="bank in category.banks"
              :key="bank"
              @click="selectBank(bank)"
              :class="[
                'w-full px-6 py-1.5 text-left text-sm transition-colors',
                selectedBank === bank
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
              ]"
            >
              {{ bank }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sound preview -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="selectedBank" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-white font-medium">{{ selectedBank }}</h4>
            <span class="text-surface-500 text-sm">{{ availableSounds.length }} sounds</span>
          </div>

          <!-- Sound grid -->
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="sound in availableSounds"
              :key="sound.type"
              class="bg-surface-700/50 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-white text-sm font-medium">{{ sound.name }}</span>
                <span class="text-surface-500 text-xs">{{ sound.count }}x</span>
              </div>

              <!-- Variation buttons -->
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="i in Math.min(sound.count, 8)"
                  :key="i"
                  @click="playPreview(sound.type, i - 1)"
                  :class="[
                    'w-8 h-8 rounded-md text-xs font-bold transition-all border shadow-sm',
                    'flex items-center justify-center',
                    'active:scale-95 active:shadow-none',
                    loadingSound === `${sound.type}_${i - 1}`
                      ? 'bg-primary-500 text-white border-primary-400 shadow-primary-500/30 animate-pulse'
                      : 'bg-surface-600 text-surface-200 border-surface-500 hover:bg-primary-600 hover:text-white hover:border-primary-500 hover:shadow-md'
                  ]"
                >
                  {{ i }}
                </button>
                <span v-if="sound.count > 8" class="text-surface-500 text-xs self-center ml-1">
                  +{{ sound.count - 8 }}
                </span>
              </div>
            </div>
          </div>

          <!-- No sounds message -->
          <div v-if="availableSounds.length === 0" class="text-center py-8 text-surface-500">
            <Icon name="WaveformIcon" :size="48" class="mx-auto mb-2 opacity-50" />
            <p>Loading samples...</p>
            <p class="text-xs mt-1">Click on any drum machine to load sounds</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-surface-700 flex justify-end gap-2">
      <button
        @click="emit('close')"
        class="px-4 py-2 rounded-lg bg-surface-700 text-surface-300 hover:bg-surface-600 transition-colors"
      >
        Zrušit
      </button>
      <button
        @click="confirmSelection"
        class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors"
      >
        Vybrat
      </button>
    </div>
  </div>
</template>
