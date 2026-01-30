// Soundfont loader for GM (General MIDI) instruments
// Based on webaudiofont format from surikov/webaudiofontdata

const SOUNDFONT_BASE_URL = 'https://surikov.github.io/webaudiofontdata/sound/'

// GM instrument mapping - instrument name to file prefix
const GM_INSTRUMENTS: Record<string, string> = {
  // Piano
  'gm_piano': '0000_GeneralUserGS_sf2_file',
  'gm_bright_piano': '0010_GeneralUserGS_sf2_file',
  'gm_electric_grand': '0020_GeneralUserGS_sf2_file',
  'gm_honky_tonk': '0030_GeneralUserGS_sf2_file',
  'gm_epiano1': '0040_GeneralUserGS_sf2_file',
  'gm_epiano2': '0050_GeneralUserGS_sf2_file',
  'gm_harpsichord': '0060_GeneralUserGS_sf2_file',
  'gm_clavinet': '0070_GeneralUserGS_sf2_file',

  // Chromatic Percussion
  'gm_celesta': '0080_GeneralUserGS_sf2_file',
  'gm_glockenspiel': '0090_GeneralUserGS_sf2_file',
  'gm_music_box': '0100_GeneralUserGS_sf2_file',
  'gm_vibraphone': '0110_GeneralUserGS_sf2_file',
  'gm_marimba': '0120_GeneralUserGS_sf2_file',
  'gm_xylophone': '0130_GeneralUserGS_sf2_file',
  'gm_tubular_bells': '0140_GeneralUserGS_sf2_file',
  'gm_dulcimer': '0150_GeneralUserGS_sf2_file',

  // Organ
  'gm_drawbar_organ': '0160_GeneralUserGS_sf2_file',
  'gm_percussive_organ': '0170_GeneralUserGS_sf2_file',
  'gm_rock_organ': '0180_GeneralUserGS_sf2_file',
  'gm_church_organ': '0190_GeneralUserGS_sf2_file',
  'gm_reed_organ': '0200_GeneralUserGS_sf2_file',
  'gm_accordion': '0210_GeneralUserGS_sf2_file',
  'gm_harmonica': '0220_GeneralUserGS_sf2_file',
  'gm_bandoneon': '0230_GeneralUserGS_sf2_file',

  // Guitar
  'gm_acoustic_guitar_nylon': '0240_GeneralUserGS_sf2_file',
  'gm_acoustic_guitar_steel': '0250_GeneralUserGS_sf2_file',
  'gm_electric_guitar_jazz': '0260_GeneralUserGS_sf2_file',
  'gm_electric_guitar_clean': '0270_GeneralUserGS_sf2_file',
  'gm_electric_guitar_muted': '0280_GeneralUserGS_sf2_file',
  'gm_overdriven_guitar': '0290_GeneralUserGS_sf2_file',
  'gm_distortion_guitar': '0300_GeneralUserGS_sf2_file',
  'gm_guitar_harmonics': '0310_GeneralUserGS_sf2_file',

  // Bass
  'gm_acoustic_bass': '0320_GeneralUserGS_sf2_file',
  'gm_electric_bass_finger': '0330_GeneralUserGS_sf2_file',
  'gm_electric_bass_pick': '0340_GeneralUserGS_sf2_file',
  'gm_fretless_bass': '0350_GeneralUserGS_sf2_file',
  'gm_slap_bass_1': '0360_GeneralUserGS_sf2_file',
  'gm_slap_bass_2': '0370_GeneralUserGS_sf2_file',
  'gm_synth_bass_1': '0380_GeneralUserGS_sf2_file',
  'gm_synth_bass_2': '0390_GeneralUserGS_sf2_file',

  // Strings
  'gm_violin': '0400_GeneralUserGS_sf2_file',
  'gm_viola': '0410_GeneralUserGS_sf2_file',
  'gm_cello': '0420_GeneralUserGS_sf2_file',
  'gm_contrabass': '0430_GeneralUserGS_sf2_file',
  'gm_tremolo_strings': '0440_GeneralUserGS_sf2_file',
  'gm_pizzicato_strings': '0450_GeneralUserGS_sf2_file',
  'gm_orchestral_harp': '0460_GeneralUserGS_sf2_file',
  'gm_timpani': '0470_GeneralUserGS_sf2_file',

  // Ensemble
  'gm_string_ensemble_1': '0480_GeneralUserGS_sf2_file',
  'gm_string_ensemble_2': '0490_GeneralUserGS_sf2_file',
  'gm_synth_strings_1': '0500_GeneralUserGS_sf2_file',
  'gm_synth_strings_2': '0510_GeneralUserGS_sf2_file',
  'gm_choir_aahs': '0520_GeneralUserGS_sf2_file',
  'gm_voice_oohs': '0530_GeneralUserGS_sf2_file',
  'gm_synth_choir': '0540_GeneralUserGS_sf2_file',
  'gm_orchestra_hit': '0550_GeneralUserGS_sf2_file',

  // Brass
  'gm_trumpet': '0560_GeneralUserGS_sf2_file',
  'gm_trombone': '0570_GeneralUserGS_sf2_file',
  'gm_tuba': '0580_GeneralUserGS_sf2_file',
  'gm_muted_trumpet': '0590_GeneralUserGS_sf2_file',
  'gm_french_horn': '0600_GeneralUserGS_sf2_file',
  'gm_brass_section': '0610_GeneralUserGS_sf2_file',
  'gm_synth_brass_1': '0620_GeneralUserGS_sf2_file',
  'gm_synth_brass_2': '0630_GeneralUserGS_sf2_file',

  // Reed
  'gm_soprano_sax': '0640_GeneralUserGS_sf2_file',
  'gm_alto_sax': '0650_GeneralUserGS_sf2_file',
  'gm_tenor_sax': '0660_GeneralUserGS_sf2_file',
  'gm_baritone_sax': '0670_GeneralUserGS_sf2_file',
  'gm_oboe': '0680_GeneralUserGS_sf2_file',
  'gm_english_horn': '0690_GeneralUserGS_sf2_file',
  'gm_bassoon': '0700_GeneralUserGS_sf2_file',
  'gm_clarinet': '0710_GeneralUserGS_sf2_file',

  // Pipe
  'gm_piccolo': '0720_GeneralUserGS_sf2_file',
  'gm_flute': '0730_GeneralUserGS_sf2_file',
  'gm_recorder': '0740_GeneralUserGS_sf2_file',
  'gm_pan_flute': '0750_GeneralUserGS_sf2_file',
  'gm_blown_bottle': '0760_GeneralUserGS_sf2_file',
  'gm_shakuhachi': '0770_GeneralUserGS_sf2_file',
  'gm_whistle': '0780_GeneralUserGS_sf2_file',
  'gm_ocarina': '0790_GeneralUserGS_sf2_file',

  // Synth Lead
  'gm_lead_1_square': '0800_GeneralUserGS_sf2_file',
  'gm_lead_2_sawtooth': '0810_GeneralUserGS_sf2_file',
  'gm_lead_3_calliope': '0820_GeneralUserGS_sf2_file',
  'gm_lead_4_chiff': '0830_GeneralUserGS_sf2_file',
  'gm_lead_5_charang': '0840_GeneralUserGS_sf2_file',
  'gm_lead_6_voice': '0850_GeneralUserGS_sf2_file',
  'gm_lead_7_fifths': '0860_GeneralUserGS_sf2_file',
  'gm_lead_8_bass_lead': '0870_GeneralUserGS_sf2_file',

  // Synth Pad
  'gm_pad_new_age': '0880_GeneralUserGS_sf2_file',
  'gm_pad_warm': '0890_GeneralUserGS_sf2_file',
  'gm_pad_poly': '0900_GeneralUserGS_sf2_file',
  'gm_pad_choir': '0910_GeneralUserGS_sf2_file',
  'gm_pad_bowed': '0920_GeneralUserGS_sf2_file',
  'gm_pad_metallic': '0930_GeneralUserGS_sf2_file',
  'gm_pad_halo': '0940_GeneralUserGS_sf2_file',
  'gm_pad_sweep': '0950_GeneralUserGS_sf2_file',

  // Synth Effects
  'gm_fx_rain': '0960_GeneralUserGS_sf2_file',
  'gm_fx_soundtrack': '0970_GeneralUserGS_sf2_file',
  'gm_fx_crystal': '0980_GeneralUserGS_sf2_file',
  'gm_fx_atmosphere': '0990_GeneralUserGS_sf2_file',
  'gm_fx_brightness': '1000_GeneralUserGS_sf2_file',
  'gm_fx_goblins': '1010_GeneralUserGS_sf2_file',
  'gm_fx_echoes': '1020_GeneralUserGS_sf2_file',
  'gm_fx_sci_fi': '1030_GeneralUserGS_sf2_file',

  // Ethnic
  'gm_sitar': '1040_GeneralUserGS_sf2_file',
  'gm_banjo': '1050_GeneralUserGS_sf2_file',
  'gm_shamisen': '1060_GeneralUserGS_sf2_file',
  'gm_koto': '1070_GeneralUserGS_sf2_file',
  'gm_kalimba': '1080_GeneralUserGS_sf2_file',
  'gm_bagpipe': '1090_GeneralUserGS_sf2_file',
  'gm_fiddle': '1100_GeneralUserGS_sf2_file',
  'gm_shanai': '1110_GeneralUserGS_sf2_file',

  // Percussive
  'gm_tinkle_bell': '1120_GeneralUserGS_sf2_file',
  'gm_agogo': '1130_GeneralUserGS_sf2_file',
  'gm_steel_drums': '1140_GeneralUserGS_sf2_file',
  'gm_woodblock': '1150_GeneralUserGS_sf2_file',
  'gm_taiko_drum': '1160_GeneralUserGS_sf2_file',
  'gm_melodic_tom': '1170_GeneralUserGS_sf2_file',
  'gm_synth_drum': '1180_GeneralUserGS_sf2_file',
  'gm_reverse_cymbal': '1190_GeneralUserGS_sf2_file',

  // Sound Effects
  'gm_guitar_fret_noise': '1200_GeneralUserGS_sf2_file',
  'gm_breath_noise': '1210_GeneralUserGS_sf2_file',
  'gm_seashore': '1220_GeneralUserGS_sf2_file',
  'gm_bird_tweet': '1230_GeneralUserGS_sf2_file',
  'gm_telephone': '1240_GeneralUserGS_sf2_file',
  'gm_helicopter': '1250_GeneralUserGS_sf2_file',
  'gm_applause': '1260_GeneralUserGS_sf2_file',
  'gm_gunshot': '1270_GeneralUserGS_sf2_file',
}

interface SoundfontZone {
  midi: number
  originalPitch: number
  keyRangeLow: number
  keyRangeHigh: number
  loopStart: number
  loopEnd: number
  coarseTune: number
  fineTune: number
  sampleRate: number
  ahdsr: boolean
  file: string // base64 encoded audio
  buffer?: AudioBuffer // decoded buffer
}

interface SoundfontData {
  zones: SoundfontZone[]
}

class SoundfontLoader {
  private audioContext: AudioContext | null = null
  private soundfontCache: Map<string, SoundfontData> = new Map()
  private loadingPromises: Map<string, Promise<SoundfontData | null>> = new Map()

  async init(audioContext: AudioContext): Promise<void> {
    this.audioContext = audioContext
  }

  /**
   * Get list of available GM instruments
   */
  getAvailableInstruments(): string[] {
    return Object.keys(GM_INSTRUMENTS).sort()
  }

  /**
   * Get instrument categories
   */
  getInstrumentsByCategory(): { category: string; instruments: string[] }[] {
    return [
      { category: 'Piano', instruments: ['gm_piano', 'gm_bright_piano', 'gm_electric_grand', 'gm_honky_tonk', 'gm_epiano1', 'gm_epiano2', 'gm_harpsichord', 'gm_clavinet'] },
      { category: 'Chromatic', instruments: ['gm_celesta', 'gm_glockenspiel', 'gm_music_box', 'gm_vibraphone', 'gm_marimba', 'gm_xylophone', 'gm_tubular_bells', 'gm_dulcimer'] },
      { category: 'Organ', instruments: ['gm_drawbar_organ', 'gm_percussive_organ', 'gm_rock_organ', 'gm_church_organ', 'gm_reed_organ', 'gm_accordion', 'gm_harmonica', 'gm_bandoneon'] },
      { category: 'Guitar', instruments: ['gm_acoustic_guitar_nylon', 'gm_acoustic_guitar_steel', 'gm_electric_guitar_jazz', 'gm_electric_guitar_clean', 'gm_electric_guitar_muted', 'gm_overdriven_guitar', 'gm_distortion_guitar', 'gm_guitar_harmonics'] },
      { category: 'Bass', instruments: ['gm_acoustic_bass', 'gm_electric_bass_finger', 'gm_electric_bass_pick', 'gm_fretless_bass', 'gm_slap_bass_1', 'gm_slap_bass_2', 'gm_synth_bass_1', 'gm_synth_bass_2'] },
      { category: 'Strings', instruments: ['gm_violin', 'gm_viola', 'gm_cello', 'gm_contrabass', 'gm_tremolo_strings', 'gm_pizzicato_strings', 'gm_orchestral_harp', 'gm_timpani'] },
      { category: 'Ensemble', instruments: ['gm_string_ensemble_1', 'gm_string_ensemble_2', 'gm_synth_strings_1', 'gm_synth_strings_2', 'gm_choir_aahs', 'gm_voice_oohs', 'gm_synth_choir', 'gm_orchestra_hit'] },
      { category: 'Brass', instruments: ['gm_trumpet', 'gm_trombone', 'gm_tuba', 'gm_muted_trumpet', 'gm_french_horn', 'gm_brass_section', 'gm_synth_brass_1', 'gm_synth_brass_2'] },
      { category: 'Reed', instruments: ['gm_soprano_sax', 'gm_alto_sax', 'gm_tenor_sax', 'gm_baritone_sax', 'gm_oboe', 'gm_english_horn', 'gm_bassoon', 'gm_clarinet'] },
      { category: 'Pipe', instruments: ['gm_piccolo', 'gm_flute', 'gm_recorder', 'gm_pan_flute', 'gm_blown_bottle', 'gm_shakuhachi', 'gm_whistle', 'gm_ocarina'] },
      { category: 'Synth Lead', instruments: ['gm_lead_1_square', 'gm_lead_2_sawtooth', 'gm_lead_3_calliope', 'gm_lead_4_chiff', 'gm_lead_5_charang', 'gm_lead_6_voice', 'gm_lead_7_fifths', 'gm_lead_8_bass_lead'] },
      { category: 'Synth Pad', instruments: ['gm_pad_new_age', 'gm_pad_warm', 'gm_pad_poly', 'gm_pad_choir', 'gm_pad_bowed', 'gm_pad_metallic', 'gm_pad_halo', 'gm_pad_sweep'] },
      { category: 'Synth FX', instruments: ['gm_fx_rain', 'gm_fx_soundtrack', 'gm_fx_crystal', 'gm_fx_atmosphere', 'gm_fx_brightness', 'gm_fx_goblins', 'gm_fx_echoes', 'gm_fx_sci_fi'] },
      { category: 'Ethnic', instruments: ['gm_sitar', 'gm_banjo', 'gm_shamisen', 'gm_koto', 'gm_kalimba', 'gm_bagpipe', 'gm_fiddle', 'gm_shanai'] },
      { category: 'Percussive', instruments: ['gm_tinkle_bell', 'gm_agogo', 'gm_steel_drums', 'gm_woodblock', 'gm_taiko_drum', 'gm_melodic_tom', 'gm_synth_drum', 'gm_reverse_cymbal'] },
      { category: 'Sound FX', instruments: ['gm_guitar_fret_noise', 'gm_breath_noise', 'gm_seashore', 'gm_bird_tweet', 'gm_telephone', 'gm_helicopter', 'gm_applause', 'gm_gunshot'] },
    ]
  }

  /**
   * Check if an instrument is a GM soundfont
   */
  isGMInstrument(name: string): boolean {
    return name in GM_INSTRUMENTS
  }

  /**
   * Load a soundfont instrument
   */
  async loadInstrument(name: string): Promise<SoundfontData | null> {
    if (!this.audioContext) {
      console.warn('[SoundfontLoader] Not initialized')
      return null
    }

    const filePrefix = GM_INSTRUMENTS[name]
    if (!filePrefix) {
      console.warn(`[SoundfontLoader] Unknown instrument: ${name}`)
      return null
    }

    // Return from cache
    if (this.soundfontCache.has(name)) {
      return this.soundfontCache.get(name)!
    }

    // Return existing loading promise
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!
    }

    const loadPromise = this.fetchAndParseSoundfont(name, filePrefix)
    this.loadingPromises.set(name, loadPromise)

    const data = await loadPromise
    this.loadingPromises.delete(name)

    return data
  }

  private async fetchAndParseSoundfont(name: string, filePrefix: string): Promise<SoundfontData | null> {
    const url = `${SOUNDFONT_BASE_URL}${filePrefix}.js`

    try {
      console.log(`[SoundfontLoader] Loading: ${name}`)
      const response = await fetch(url)
      const text = await response.text()

      // Parse the JS file to extract the soundfont data
      // The format is: var _tone_XXXX = { zones: [...] }
      const match = text.match(/var\s+\w+\s*=\s*(\{[\s\S]*\});?\s*$/)
      if (!match) {
        throw new Error('Could not parse soundfont data')
      }

      // Use Function constructor to safely parse the object
      const data = new Function(`return ${match[1]}`)() as SoundfontData

      // Decode audio buffers for each zone
      for (const zone of data.zones) {
        if (zone.file) {
          const buffer = await this.decodeBase64Audio(zone.file, zone.sampleRate)
          zone.buffer = buffer ?? undefined
        }
      }

      this.soundfontCache.set(name, data)
      console.log(`[SoundfontLoader] Loaded ${name} with ${data.zones.length} zones`)

      return data
    } catch (error) {
      console.error(`[SoundfontLoader] Failed to load ${name}:`, error)
      return null
    }
  }

  private async decodeBase64Audio(base64: string, _sampleRate: number): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null

    try {
      // Remove data URL prefix if present
      const base64Data = base64.replace(/^data:audio\/\w+;base64,/, '')

      // Decode base64 to binary
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer)
      return audioBuffer
    } catch (error) {
      console.error('[SoundfontLoader] Failed to decode audio:', error)
      return null
    }
  }

  /**
   * Find the best zone for a given MIDI note
   */
  findZone(soundfont: SoundfontData, midiNote: number): SoundfontZone | null {
    for (const zone of soundfont.zones) {
      if (midiNote >= zone.keyRangeLow && midiNote <= zone.keyRangeHigh) {
        return zone
      }
    }
    return soundfont.zones[0] || null
  }

  /**
   * Play a note using a soundfont
   */
  playNote(
    soundfont: SoundfontData,
    midiNote: number,
    gain: number = 0.5,
    duration: number = 1,
    masterGain: GainNode
  ): void {
    if (!this.audioContext) return

    const zone = this.findZone(soundfont, midiNote)
    if (!zone || !zone.buffer) {
      console.warn(`[SoundfontLoader] No zone found for MIDI note ${midiNote}`)
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = zone.buffer

    // Calculate playback rate based on pitch difference
    const originalMidi = zone.originalPitch / 100
    const pitchDiff = midiNote - originalMidi
    source.playbackRate.value = Math.pow(2, pitchDiff / 12)

    // Setup gain envelope
    const now = this.audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(gain, now + 0.01) // Attack
    gainNode.gain.setValueAtTime(gain, now + duration - 0.1)
    gainNode.gain.linearRampToValueAtTime(0, now + duration) // Release

    // Enable looping if zone has loop points
    if (zone.loopStart && zone.loopEnd && zone.loopEnd > zone.loopStart) {
      source.loop = true
      source.loopStart = zone.loopStart / zone.sampleRate
      source.loopEnd = zone.loopEnd / zone.sampleRate
    }

    source.connect(gainNode)
    gainNode.connect(masterGain)

    source.start()
    source.stop(now + duration)
  }

  getCacheSize(): number {
    return this.soundfontCache.size
  }

  clearCache(): void {
    this.soundfontCache.clear()
  }
}

export const soundfontLoader = new SoundfontLoader()
