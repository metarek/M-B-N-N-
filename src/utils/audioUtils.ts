/**
 * Helper to convert base64 PCM (16-bit, 24kHz mono) to a standard WAV Blob & AudioBuffer
 * with anti-drag trailing audio cleaner and micro-fadeout.
 */

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Trims trailing dead air, eliminates low-frequency decompression drag artifacts,
 * and applies a clean 20ms micro-fadeout at the end of PCM to prevent trailing voice squeeze.
 */
/**
 * Resamples PCM to shift pitch and vocal tract resonance upward (for authentic 4-6 year old child / toddler / Anya anime voice).
 * Uses high-fidelity linear interpolation to preserve speech clarity without robotic artifacts.
 */
export function applyChildVoicePitch(pcmData: Uint8Array, pitchRatio = 1.25): Uint8Array {
  if (pcmData.length < 100 || pitchRatio === 1.0) return pcmData;

  const sampleCount = Math.floor(pcmData.length / 2);
  const in16 = new Int16Array(pcmData.buffer, pcmData.byteOffset, sampleCount);

  const outCount = Math.floor(sampleCount / pitchRatio);
  const out16 = new Int16Array(outCount);

  for (let i = 0; i < outCount; i++) {
    const srcIndex = i * pitchRatio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(sampleCount - 1, i0 + 1);
    const frac = srcIndex - i0;

    // Linear interpolation
    const val = in16[i0] * (1 - frac) + in16[i1] * frac;
    out16[i] = Math.max(-32768, Math.min(32767, Math.round(val)));
  }

  return new Uint8Array(out16.buffer, out16.byteOffset, out16.byteLength);
}

export function cleanAndTrimPcm(pcmData: Uint8Array, sampleRate = 24000): Uint8Array {
  if (pcmData.length < 100) return pcmData;

  // 16-bit PCM = 2 bytes per sample
  const sampleCount = Math.floor(pcmData.length / 2);
  const int16Array = new Int16Array(pcmData.buffer, pcmData.byteOffset, sampleCount);

  // Scan backwards to find the end of active voice (energy threshold)
  const threshold = 180; // Amplitude threshold for silence/low rumble
  let lastActiveSample = sampleCount - 1;

  for (let i = sampleCount - 1; i >= 0; i--) {
    if (Math.abs(int16Array[i]) > threshold) {
      // Add a small 40ms safety buffer (960 samples at 24kHz) after speech ends
      lastActiveSample = Math.min(sampleCount - 1, i + Math.floor(sampleRate * 0.04));
      break;
    }
  }

  // Ensure minimum valid length
  const trimmedSampleCount = Math.max(Math.floor(sampleRate * 0.1), lastActiveSample + 1);
  const cleanedInt16 = new Int16Array(trimmedSampleCount);
  cleanedInt16.set(int16Array.subarray(0, trimmedSampleCount));

  // Apply smooth 20ms micro-fadeout at the end (480 samples at 24kHz) to eliminate sudden cut/drag
  const fadeOutSamples = Math.min(trimmedSampleCount, Math.floor(sampleRate * 0.02));
  const fadeStart = trimmedSampleCount - fadeOutSamples;

  for (let i = 0; i < fadeOutSamples; i++) {
    const gain = Math.cos((i / fadeOutSamples) * (Math.PI / 2)); // Smooth cosine fadeout curve
    cleanedInt16[fadeStart + i] = Math.round(cleanedInt16[fadeStart + i] * gain);
  }

  return new Uint8Array(cleanedInt16.buffer, cleanedInt16.byteOffset, cleanedInt16.byteLength);
}

export function pcmToWavBlob(pcmData: Uint8Array, sampleRate = 24000, numChannels = 1): Blob {
  // Clean PCM by eliminating trailing drag & artifacts
  const cleanPcm = cleanAndTrimPcm(pcmData, sampleRate);

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + cleanPcm.length, true); // Total file length - 8
  view.setUint8(8, 'W'.charCodeAt(0));
  view.setUint8(9, 'A'.charCodeAt(0));
  view.setUint8(10, 'V'.charCodeAt(0));
  view.setUint8(11, 'E'.charCodeAt(0));

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels (1 = Mono, 2 = Stereo)
  view.setUint32(24, sampleRate, true); // SampleRate (24000)
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, cleanPcm.length, true); // Subchunk2Size

  return new Blob([header, cleanPcm], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePcmDuration(byteLength: number, sampleRate = 24000, bitsPerSample = 16, channels = 1): number {
  const bytesPerSample = (bitsPerSample / 8) * channels;
  return byteLength / (sampleRate * bytesPerSample);
}
