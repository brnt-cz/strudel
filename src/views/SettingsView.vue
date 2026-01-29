<script setup lang="ts">
import { useProjectStore } from '@/stores/projectStore'
import { useNotification } from '@/composables/useNotification'

const projectStore = useProjectStore()
const { showSuccess, showError } = useNotification()

function clearAllData() {
  if (confirm('Opravdu chceš smazat všechna data? Tato akce je nevratná.')) {
    projectStore.clearProject()
    showSuccess('Všechna data byla smazána')
  }
}

function exportData() {
  const data = {
    tracks: projectStore.tracks,
    bpm: projectStore.bpm,
    masterVolume: projectStore.masterVolume
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'strudel-studio-export.json'
  a.click()
  URL.revokeObjectURL(url)

  showSuccess('Data exportována')
}

async function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.tracks) {
        projectStore.tracks = data.tracks
      }
      if (data.bpm) {
        projectStore.bpm = data.bpm
      }
      if (data.masterVolume) {
        projectStore.masterVolume = data.masterVolume
      }

      showSuccess('Data importována')
    } catch {
      showError('Chyba při importu dat')
    }
  }

  input.click()
}
</script>

<template>
  <div class="flex-1 p-8 overflow-auto">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-8">Nastavení</h1>

      <!-- Sections -->
      <div class="space-y-6">
        <!-- Data management -->
        <section class="bg-surface-800 border border-surface-700 rounded-xl p-6">
          <h2 class="text-lg font-semibold mb-4">Správa dat</h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Export dat</p>
                <p class="text-sm text-surface-400">Stáhni všechna data jako JSON soubor</p>
              </div>
              <button
                @click="exportData"
                class="px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm transition-colors"
              >
                Exportovat
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Import dat</p>
                <p class="text-sm text-surface-400">Nahraj data z JSON souboru</p>
              </div>
              <button
                @click="importData"
                class="px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm transition-colors"
              >
                Importovat
              </button>
            </div>

            <hr class="border-surface-700" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-red-400">Smazat všechna data</p>
                <p class="text-sm text-surface-400">Trvale smaže všechny projekty a nastavení</p>
              </div>
              <button
                @click="clearAllData"
                class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Smazat vše
              </button>
            </div>
          </div>
        </section>

        <!-- About -->
        <section class="bg-surface-800 border border-surface-700 rounded-xl p-6">
          <h2 class="text-lg font-semibold mb-4">O aplikaci</h2>

          <div class="space-y-2 text-sm text-surface-300">
            <p><strong>Strudel Studio</strong> je vizuální hudební studio pro tvorbu algoritmické hudby.</p>
            <p>Generuje kód pro <a href="https://strudel.cc" target="_blank" class="text-primary-400 hover:underline">Strudel.cc</a> - live coding prostředí pro hudbu.</p>
          </div>
        </section>
      </div>

      <!-- Back link -->
      <div class="mt-8">
        <router-link to="/" class="text-primary-400 hover:text-primary-300 transition-colors">
          ← Zpět do studia
        </router-link>
      </div>
    </div>
  </div>
</template>
