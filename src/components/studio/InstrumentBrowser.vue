<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAudioEngine } from '@/composables/useAudioEngine'
import Icon from '@/components/icons/Icon.vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
}>()

const { previewGMInstrument, getGMInstrumentsByCategory, isInitialized, init } = useAudioEngine()

const selectedInstrument = ref(props.modelValue || 'gm_piano')
const expandedCategory = ref<string | null>('Piano')
const loadingInstrument = ref<string | null>(null)
const previewNote = ref('c4')

const categories = computed(() => getGMInstrumentsByCategory())

const notes = ['c3', 'e3', 'g3', 'c4', 'e4', 'g4', 'c5']

function toggleCategory(category: string) {
  expandedCategory.value = expandedCategory.value === category ? null : category
}

function selectInstrument(instrument: string) {
  selectedInstrument.value = instrument
}

async function playPreview(instrument: string, note: string = previewNote.value) {
  if (!isInitialized.value) {
    await init()
  }
  loadingInstrument.value = instrument
  try {
    await previewGMInstrument(instrument, note)
  } finally {
    setTimeout(() => {
      loadingInstrument.value = null
    }, 300)
  }
}

function formatInstrumentName(name: string): string {
  return name
    .replace('gm_', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function confirmSelection() {
  emit('update:modelValue', selectedInstrument.value)
  emit('close')
}

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
      <h3 class="text-lg font-semibold text-white">GM Instruments</h3>
      <button @click="emit('close')" class="text-surface-400 hover:text-white">
        <Icon name="CloseIcon" :size="20" />
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- Category list -->
      <div class="w-56 shrink-0 border-r border-surface-700 overflow-y-auto">
        <div v-for="category in categories" :key="category.category" class="border-b border-surface-700/50">
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

          <div v-if="expandedCategory === category.category" class="bg-surface-900/50">
            <button
              v-for="instrument in category.instruments"
              :key="instrument"
              @click="selectInstrument(instrument)"
              :class="[
                'w-full px-6 py-1.5 text-left text-sm transition-colors',
                selectedInstrument === instrument
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
              ]"
            >
              {{ formatInstrumentName(instrument) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Instrument preview -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="selectedInstrument" class="space-y-6">
          <!-- Instrument name -->
          <div class="text-center">
            <h4 class="text-2xl font-bold text-white mb-2">
              {{ formatInstrumentName(selectedInstrument) }}
            </h4>
            <p class="text-surface-400 text-sm">{{ selectedInstrument }}</p>
          </div>

          <!-- Piano keyboard preview -->
          <div class="flex justify-center gap-1">
            <button
              v-for="note in notes"
              :key="note"
              @click="playPreview(selectedInstrument, note)"
              :class="[
                'relative h-24 rounded-b-lg transition-all shadow-lg',
                'flex items-end justify-center pb-2 text-xs font-medium',
                'active:scale-95',
                note.includes('#')
                  ? 'w-8 h-16 bg-surface-900 text-surface-400 -mx-2 z-10'
                  : 'w-12 bg-white text-surface-600',
                loadingInstrument === selectedInstrument && previewNote === note
                  ? 'bg-primary-500 text-white'
                  : ''
              ]"
            >
              {{ note.toUpperCase() }}
            </button>
          </div>

          <!-- Quick play button -->
          <div class="flex justify-center">
            <button
              @click="playPreview(selectedInstrument)"
              :class="[
                'px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2',
                'active:scale-95',
                loadingInstrument === selectedInstrument
                  ? 'bg-primary-500 text-white animate-pulse'
                  : 'bg-primary-600 text-white hover:bg-primary-500'
              ]"
            >
              <Icon name="PlayIcon" :size="20" />
              Přehrát {{ previewNote.toUpperCase() }}
            </button>
          </div>

          <!-- Note selector -->
          <div class="text-center">
            <label class="text-surface-400 text-sm mb-2 block">Výchozí nota</label>
            <select
              v-model="previewNote"
              class="bg-surface-700 border border-surface-600 rounded-lg px-4 py-2 text-white"
            >
              <option v-for="note in notes" :key="note" :value="note">
                {{ note.toUpperCase() }}
              </option>
            </select>
          </div>

          <!-- Info -->
          <div class="bg-surface-700/30 rounded-lg p-4 text-sm text-surface-400">
            <p>
              GM (General MIDI) nástroje jsou načítány ze soundfontů.
              První přehrání může chvíli trvat (stahování ~300KB).
            </p>
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
