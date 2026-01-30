// Sample loader for tidal-drum-machines samples

const SAMPLES_JSON_URL = 'https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json'

interface SampleMap {
  _base: string
  [key: string]: string | string[]
}

class SampleLoader {
  private audioContext: AudioContext | null = null
  private sampleMap: SampleMap | null = null
  private sampleCache: Map<string, AudioBuffer> = new Map()
  private loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map()
  private isInitialized = false

  async init(audioContext: AudioContext): Promise<void> {
    this.audioContext = audioContext

    if (!this.sampleMap) {
      try {
        const response = await fetch(SAMPLES_JSON_URL)
        this.sampleMap = await response.json()
        this.isInitialized = true
        console.log('[SampleLoader] Loaded sample map with', Object.keys(this.sampleMap!).length - 1, 'entries')
      } catch (error) {
        console.error('[SampleLoader] Failed to load sample map:', error)
      }
    }
  }

  /**
   * Get sample key for a machine and sound type
   * e.g., getMachineKey('RolandTR808', 'bd') => 'RolandTR808_bd'
   */
  getMachineKey(machine: string, soundType: string): string {
    return `${machine}_${soundType}`
  }

  /**
   * Check if samples exist for a machine/sound combination
   */
  hasSamples(machine: string, soundType: string): boolean {
    if (!this.sampleMap) return false
    const key = this.getMachineKey(machine, soundType)
    return key in this.sampleMap
  }

  /**
   * Get number of sample variations for a machine/sound
   */
  getSampleCount(machine: string, soundType: string): number {
    if (!this.sampleMap) return 0
    const key = this.getMachineKey(machine, soundType)
    const samples = this.sampleMap[key]
    if (!samples || typeof samples === 'string') return 0
    return samples.length
  }

  /**
   * Get list of available machines
   */
  getAvailableMachines(): string[] {
    if (!this.sampleMap) return []
    const machines = new Set<string>()
    for (const key of Object.keys(this.sampleMap)) {
      if (key === '_base') continue
      const machine = key.split('_')[0]
      machines.add(machine)
    }
    return Array.from(machines).sort()
  }

  /**
   * Get available sound types for a machine
   */
  getSoundTypes(machine: string): string[] {
    if (!this.sampleMap) return []
    const types: string[] = []
    const prefix = `${machine}_`
    for (const key of Object.keys(this.sampleMap)) {
      if (key.startsWith(prefix)) {
        types.push(key.substring(prefix.length))
      }
    }
    return types
  }

  /**
   * Load a sample from CDN
   */
  async loadSample(machine: string, soundType: string, variation: number = 0): Promise<AudioBuffer | null> {
    if (!this.audioContext || !this.sampleMap) {
      console.warn('[SampleLoader] Not initialized')
      return null
    }

    const key = this.getMachineKey(machine, soundType)
    const cacheKey = `${key}_${variation}`

    // Return from cache if available
    if (this.sampleCache.has(cacheKey)) {
      return this.sampleCache.get(cacheKey)!
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!
    }

    const samples = this.sampleMap[key]
    if (!samples || typeof samples === 'string') {
      console.warn(`[SampleLoader] No samples found for ${key}`)
      return null
    }

    const sampleIndex = Math.min(variation, samples.length - 1)
    const samplePath = samples[sampleIndex]
    const baseUrl = this.sampleMap._base as string
    const url = `${baseUrl}${encodeURI(samplePath)}`

    // Create loading promise
    const loadPromise = this.fetchAndDecodeAudio(url, cacheKey)
    this.loadingPromises.set(cacheKey, loadPromise)

    const buffer = await loadPromise
    this.loadingPromises.delete(cacheKey)

    return buffer
  }

  private async fetchAndDecodeAudio(url: string, cacheKey: string): Promise<AudioBuffer | null> {
    try {
      console.log(`[SampleLoader] Loading: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)

      // Cache the decoded buffer
      this.sampleCache.set(cacheKey, audioBuffer)
      console.log(`[SampleLoader] Cached: ${cacheKey}`)

      return audioBuffer
    } catch (error) {
      console.error(`[SampleLoader] Failed to load ${url}:`, error)
      return null
    }
  }

  /**
   * Preload all samples for a machine
   */
  async preloadMachine(machine: string): Promise<void> {
    const soundTypes = this.getSoundTypes(machine)
    const promises = soundTypes.map(type => this.loadSample(machine, type, 0))
    await Promise.all(promises)
    console.log(`[SampleLoader] Preloaded ${machine}`)
  }

  /**
   * Clear sample cache
   */
  clearCache(): void {
    this.sampleCache.clear()
    console.log('[SampleLoader] Cache cleared')
  }

  /**
   * Get cache size (number of loaded samples)
   */
  getCacheSize(): number {
    return this.sampleCache.size
  }

  get initialized(): boolean {
    return this.isInitialized
  }
}

// Singleton instance
export const sampleLoader = new SampleLoader()
