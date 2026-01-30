# Strudel Studio

Vizuální hudební studio pro tvorbu algoritmické hudby s [Strudel.cc](https://strudel.cc).

## Funkce

- **Drag & drop** zvuků z palety do pracovní plochy
- **16-krokový step sequencer** pro bicí nástroje
- **Editor not** s výběrem stupnic pro melodické stopy
- **60+ drum machines** - reálné samply z tidal-drum-machines (Roland, Korg, Yamaha, Akai...)
- **128 GM nástrojů** - soundfonty pro piano, smyčce, dechové, kytary a další
- **Sound Browser** - procházení a náhled bicích zvuků s variancemi
- **Instrument Browser** - výběr GM nástrojů s klavírním náhledem
- **Rozšířené efekty** - filtr, delay, reverb, distortion, phaser, ADSR obálka
- **WebAudio přehrávání** přímo v prohlížeči
- **Generování Strudel kódu** v reálném čase
- **Export do Strudel.cc** jedním kliknutím

## Technologie

- Vue 3 + TypeScript
- Vite
- Tailwind CSS 4
- Pinia
- WebAudio API

## Instalace

```bash
pnpm install
```

## Spuštění

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Zvukové banky

### Bicí (60+ drum machines)

**Roland:** TR-808, TR-909, TR-707, TR-606, TR-505, CR-78, CR-8000
**Korg:** KR-55, KPR-77, Minipops, Rhythm 55
**Yamaha:** RX5, RY30, MR10
**Akai:** Linn, XR10
**Elektron:** Machinedrum, Analog Rytm
**A další:** DMX, SP1200, Vermona DRM, Casio, Boss DR-110...

### GM Soundfonty (128 nástrojů)

**Piano:** Acoustic Grand, Bright, Electric Grand, Honky-tonk, Rhodes, DX Piano
**Chromatic:** Celesta, Glockenspiel, Music Box, Vibraphone, Marimba, Xylophone
**Organ:** Hammond, Percussive, Rock, Church, Reed, Accordion
**Guitar:** Acoustic Nylon/Steel, Jazz, Clean/Overdriven/Distorted Electric
**Bass:** Acoustic, Fingered, Picked, Fretless, Slap, Synth Bass
**Strings:** Violin, Viola, Cello, Contrabass, Tremolo/Pizzicato Strings
**Ensemble:** String Ensemble, Synth Strings, Choir Aahs/Oohs, Orchestra Hit
**Brass:** Trumpet, Trombone, Tuba, French Horn, Brass Section, Synth Brass
**Reed:** Soprano/Alto/Tenor/Baritone Sax, Oboe, English Horn, Bassoon, Clarinet
**Pipe:** Piccolo, Flute, Recorder, Pan Flute, Ocarina
**Synth Lead:** Square, Sawtooth, Calliope, Chiff, Charang, Voice, Fifths
**Synth Pad:** New Age, Warm, Polysynth, Choir, Bowed, Metallic, Halo, Sweep
**Synth FX:** Rain, Soundtrack, Crystal, Atmosphere, Brightness, Goblins, Echoes, Sci-Fi
**Ethnic:** Sitar, Banjo, Shamisen, Koto, Kalimba, Bagpipe, Fiddle, Shanai
**Percussive:** Tinkle Bell, Agogo, Steel Drums, Woodblock, Taiko, Melodic Tom
**Sound FX:** Guitar Fret Noise, Breath, Seashore, Bird Tweet, Telephone, Helicopter, Applause, Gunshot

### Syntetizéry

- Sine, Saw, Square, Triangle
- Supersaw, Supersquare
- FM Synthesis
- Noise (White, Pink, Brown, Crackle)

## Efekty na stopu

| Kategorie | Parametry |
|-----------|-----------|
| Základní | Hlasitost, Pan, Rychlost |
| Filtr | Low-pass, High-pass, Resonance |
| Delay/Reverb | Delay mix/time/feedback, Reverb mix/size |
| Distortion | Distortion, Bitcrush |
| Modulace | Phaser, Phaser depth, Vowel formant |
| Obálka | Attack, Decay, Sustain, Release |

## Zdroje zvuků

- **Drum samples:** [tidal-drum-machines](https://github.com/ritchse/tidal-drum-machines)
- **GM Soundfonty:** [webaudiofontdata](https://github.com/surikov/webaudiofontdata)

## Licence

MIT
