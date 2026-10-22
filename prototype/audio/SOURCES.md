# Contact sound

`contact.wav` is an edited excerpt of **golf_hitting_ball.wav** by **inbeeld**:
https://freesound.org/people/inbeeld/sounds/21877/

Source license: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
Downloaded the publicly available high-quality MP3 preview. Converted to mono PCM,
trimmed around contact, removed sub-rumble/high-frequency hiss, tapered the tail,
added boundary fades, and normalized the sample peak to -3.1 dBFS. Duration 280ms,
48kHz / 16-bit; 26,924 bytes. Playback gain 0.8 leaves additional headroom.

Editing reference: https://www.gameaudiolearning.com/knowledgebase/how-to-process-and-edit-audio-for-games
Playback reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode

No additional runtime sound library. Tone and device latency require human audition,
including Android speakers; file size and waveform checks do not establish sound quality.

## Active six-sound reward comparison

The golf sample above is historical and no longer referenced by playback. All six active files derive from Kenney Interface Sounds, CC0: https://kenney.nl/assets/interface-sounds . Original license retained in KENNEY-LICENSE.txt.

- Bright unlock: confirmation_002.
- Coin cascade: glass_003 at ascending playback rates, offset 0/75/150/230ms.
- Level up: confirmation_004 at two ascending pitches.
- Warm glow: pluck_001 layered at chord ratios and a quiet upper echo.
- Arcade win: maximize_003 and confirmation_003, with an upper echo.
- Grand reveal: confirmation_001 and confirmation_002 over impactBell_heavy_001 from Kenney Impact Sounds (https://kenney.nl/assets/impact-sounds), also CC0.

All mixes are rendered offline to mono 32kHz PCM WAV, boundary fades, peak capped at 0.70 (-3.1dBFS), RMS target 0.13 where headroom allows. Browser decoding is cached per file; one source plays at the reveal. The six mixes total approximately 179KB. They are audition candidates, not a claim of subjective quality.

## Active restrained confirmation study

The six *-confirm / quiet-tick files are original offline-rendered Chef Pack audition candidates. Sine-based damped resonances with a rounded1.6ms attack, fast-decaying upper partials, at most two overlapping tones, and160–290ms total duration. Target RMS0.085 with peak capped0.48; mono32kHz PCM. No sampled Apple sound or SND asset was copied. Prior game mixes and golf are historical files and no longer referenced.

Research: Apple Explore immersive sound design (https://developer.apple.com/videos/play/wwdc2023/10271/) recommends subtle cues fitting visuals and transition timing; SND01 designer explains sine-based, small-speaker-focused cues at https://snd.dev/. Exact frequencies/durations are audition hypotheses rather than a universal prescription.
