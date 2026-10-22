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
