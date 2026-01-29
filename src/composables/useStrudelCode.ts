import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Track } from '@/types'

export function useStrudelCode() {
  const store = useProjectStore()

  function generateDrumPattern(track: Track): string {
    const pattern = track.pattern
      .map(step => step ? 'x' : '~')
      .join(' ')

    let code = `s("${track.soundId}")`

    if (track.drumBank) {
      code += `.bank("${track.drumBank}")`
    }

    code += `.struct("${pattern}")`

    return applyParams(code, track)
  }

  function generateMelodyPattern(track: Track): string {
    const notes = track.notes
      .map(n => n === '~' ? '~' : n)
      .join(' ')

    let code = `note("${notes}").sound("${track.soundId}")`

    return applyParams(code, track)
  }

  function applyParams(code: string, track: Track): string {
    const { params } = track

    // Základní
    if (params.gain !== 0.8) {
      code += `.gain(${params.gain.toFixed(2)})`
    }

    if (params.pan !== 0.5) {
      code += `.pan(${params.pan.toFixed(2)})`
    }

    if (params.speed !== 1) {
      code += `.speed(${params.speed.toFixed(2)})`
    }

    // Filtry
    if (params.lpf < 20000) {
      code += `.lpf(${Math.round(params.lpf)})`
      if (params.lpq > 0) {
        code += `.lpq(${params.lpq.toFixed(1)})`
      }
    }

    if (params.hpf > 20) {
      code += `.hpf(${Math.round(params.hpf)})`
      if (params.hpq > 0) {
        code += `.hpq(${params.hpq.toFixed(1)})`
      }
    }

    // Delay
    if (params.delay > 0) {
      code += `.delay(${params.delay.toFixed(2)})`
      code += `.delaytime(${params.delayTime.toFixed(2)})`
      if (params.delayFeedback !== 0.5) {
        code += `.delayfeedback(${params.delayFeedback.toFixed(2)})`
      }
    }

    // Reverb
    if (params.reverb > 0) {
      code += `.room(${params.reverb.toFixed(2)})`
      if (params.reverbSize !== 0.5) {
        code += `.roomsize(${params.reverbSize.toFixed(2)})`
      }
    }

    // Distortion
    if (params.distort > 0) {
      code += `.distort(${params.distort.toFixed(2)})`
    }

    if (params.crush < 16) {
      code += `.crush(${params.crush})`
    }

    // Modulation
    if (params.phaser > 0) {
      code += `.phaser(${params.phaser.toFixed(2)})`
      if (params.phaserDepth !== 0.5) {
        code += `.phaserdepth(${params.phaserDepth.toFixed(2)})`
      }
    }

    if (params.vowel) {
      code += `.vowel("${params.vowel}")`
    }

    // Envelope (pro synth/bass)
    if (track.type !== 'drum') {
      const hasCustomEnvelope =
        params.attack !== 0.001 ||
        params.decay !== 0.1 ||
        params.sustain !== 0.5 ||
        params.release !== 0.1

      if (hasCustomEnvelope) {
        code += `.attack(${params.attack.toFixed(3)})`
        code += `.decay(${params.decay.toFixed(2)})`
        code += `.sustain(${params.sustain.toFixed(2)})`
        code += `.release(${params.release.toFixed(2)})`
      }
    }

    return code
  }

  const strudelCode = computed(() => {
    const activeTracks = store.activeTracks
    if (activeTracks.length === 0) {
      return '// Přetáhni zvuky do pracovní plochy'
    }

    const trackCodes = activeTracks.map(track => {
      if (track.type === 'drum') {
        return generateDrumPattern(track)
      }
      return generateMelodyPattern(track)
    })

    const cps = store.bpm / 60 / 4
    let code = `setcps(${cps.toFixed(3)})\n\n`

    if (trackCodes.length === 1) {
      code += trackCodes[0]
    } else {
      code += `stack(\n  ${trackCodes.join(',\n  ')}\n)`
    }

    if (store.masterVolume !== 1) {
      code += `.gain(${store.masterVolume.toFixed(2)})`
    }

    return code
  })

  function getStrudelUrl(): string {
    const code = strudelCode.value
    const encoded = btoa(unescape(encodeURIComponent(code)))
    return `https://strudel.cc/#${encoded}`
  }

  function copyCode(): Promise<void> {
    return navigator.clipboard.writeText(strudelCode.value)
  }

  function openInStrudel(): void {
    window.open(getStrudelUrl(), '_blank')
  }

  return {
    strudelCode,
    getStrudelUrl,
    copyCode,
    openInStrudel
  }
}
