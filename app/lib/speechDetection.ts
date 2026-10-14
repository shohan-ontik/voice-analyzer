// Gemini will "transcribe" a pitch out of the reference facts when handed a
// silent recording (e.g. a muted mic) and score it as if it had been spoken,
// so /api/analyze measures how much audible speech a recording actually
// contains before sending it for scoring. Expects the 16 kHz mono 16-bit PCM
// WAV produced by the analyze route's ffmpeg transcode.

const FRAME_MS = 30;
// Frames louder than this count as speech. Normal speech into a laptop/phone
// mic sits around -30 to -15 dBFS; a quiet room or a muted mic stays well
// below -45 dBFS.
const SPEECH_FRAME_DBFS = -38;
export const MIN_SPEECH_SECONDS = 2;

export type SpeechStats = {
  durationSeconds: number;
  speechSeconds: number;
};

function findDataChunk(wav: Buffer) {
  let offset = 12; // "RIFF" <size> "WAVE"
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "data") {
      // ffmpeg writes 0xFFFFFFFF as the size when streaming to a pipe.
      const end = size === 0xffffffff ? wav.length : Math.min(wav.length, offset + 8 + size);
      return { start: offset + 8, end };
    }
    offset += 8 + size + (size % 2);
  }
  return null;
}

export function measureSpeech(wav: Buffer, sampleRate = 16000): SpeechStats {
  const chunk = findDataChunk(wav);
  if (!chunk) return { durationSeconds: 0, speechSeconds: 0 };

  const sampleCount = Math.floor((chunk.end - chunk.start) / 2);
  const frameSize = Math.round((sampleRate * FRAME_MS) / 1000);
  const threshold = 10 ** (SPEECH_FRAME_DBFS / 20);
  let speechFrames = 0;

  for (let frame = 0; frame + frameSize <= sampleCount; frame += frameSize) {
    let sumSquares = 0;
    for (let i = frame; i < frame + frameSize; i++) {
      const s = wav.readInt16LE(chunk.start + i * 2) / 32768;
      sumSquares += s * s;
    }
    if (Math.sqrt(sumSquares / frameSize) >= threshold) speechFrames++;
  }

  return {
    durationSeconds: sampleCount / sampleRate,
    speechSeconds: (speechFrames * FRAME_MS) / 1000,
  };
}
