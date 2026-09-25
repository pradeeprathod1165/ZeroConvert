import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

// Multi-Threaded WASM CDNs (Uses multiple CPU cores via SharedArrayBuffer)
const MT_CDN_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm',
  'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm',
];

// Single-Threaded Fallback CDNs (Used only if browser blocks SharedArrayBuffer)
const ST_CDN_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm',
  'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
];

export const initFFmpeg = async () => {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  ffmpeg = new FFmpeg();
  let lastError = null;

  // 1. Try Multi-Threaded Engine first (4x-6x faster) when Cross-Origin Isolated
  if (window.crossOriginIsolated) {
    for (const baseURL of MT_CDN_SOURCES) {
      try {
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
        const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');

        await ffmpeg.load({ coreURL, wasmURL, workerURL });
        if (ffmpeg.loaded) {
          console.info('⚡ FFmpeg Multi-Threaded Engine initialized.');
          return ffmpeg;
        }
      } catch (err) {
        console.warn(`Multi-threaded FFmpeg failed from ${baseURL}, trying next...`, err);
        lastError = err;
      }
    }
  }

  // 2. Fallback to Single-Threaded Engine if Multi-Threaded fails
  for (const baseURL of ST_CDN_SOURCES) {
    try {
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');

      await ffmpeg.load({ coreURL, wasmURL });
      if (ffmpeg.loaded) {
        console.info('FFmpeg Single-Threaded fallback initialized.');
        return ffmpeg;
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.error('All FFmpeg WASM sources failed:', lastError);
  throw new Error('Could not initialize the video/audio engine. Please check your connection and refresh.');
};

export const processAudioVideo = async (file, targetFormat, onProgress) => {
  const ffmpegInstance = await initFFmpeg();

  const progressHandler = ({ progress }) => {
    const pct = Math.max(1, Math.min(99, Math.round((progress || 0) * 100)));
    if (onProgress) onProgress(pct);
  };

  ffmpegInstance.on('progress', progressHandler);

  const rawExt = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'mp4';
  const uniqueId = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const inputName = `input_${uniqueId}.${rawExt}`;

  let outputExt = targetFormat.toLowerCase();
  if (targetFormat === 'MP4 (Compress)') outputExt = 'mp4';

  const outputName = `output_${uniqueId}.${outputExt}`;

  try {
    await ffmpegInstance.writeFile(inputName, await fetchFile(file));

    let exitCode = -1;

    switch (targetFormat) {
      case 'MP3':
        // Fast Audio Extraction: skips video decoding (-vn) + fastest LAME algorithm (-compression_level 0)
        exitCode = await ffmpegInstance.exec([
          '-i', inputName,
          '-vn', '-sn', '-dn',
          '-acodec', 'libmp3lame',
          '-b:a', '128k',
          '-compression_level', '0',
          outputName
        ]);
        break;

      case 'MP4':
        // Step A: Try Instant Stream Copy first (<1 second for MOV/MKV/MP4 with H.264 video)
        if (['mov', 'mkv', 'm4v', 'mp4'].includes(rawExt)) {
          exitCode = await ffmpegInstance.exec([
            '-i', inputName,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            outputName
          ]);
        }
        // Step B: If stream copy wasn't compatible (e.g. WebM/AVI input), use multi-threaded ultrafast encode
        if (exitCode !== 0) {
          exitCode = await ffmpegInstance.exec([
            '-i', inputName,
            '-threads', '4',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-tune', 'fastdecode',
            '-crf', '24',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            outputName
          ]);
        }
        break;

      case 'MP4 (Compress)':
        // Multi-threaded ultrafast compression + caps max width at 1280px (720p) for 5x faster encoding
        exitCode = await ffmpegInstance.exec([
          '-i', inputName,
          '-threads', '4',
          '-vf', "scale='min(1280,iw)':-2",
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-tune', 'fastdecode',
          '-crf', '28',
          '-c:a', 'aac',
          '-b:a', '96k',
          '-movflags', '+faststart',
          outputName
        ]);
        break;

      case 'WEBM':
        // -deadline realtime and -cpu-used 8 make VP8 WebM encoding ~8x faster in WASM
        exitCode = await ffmpegInstance.exec([
          '-i', inputName,
          '-threads', '4',
          '-c:v', 'libvpx',
          '-deadline', 'realtime',
          '-cpu-used', '8',
          '-b:v', '1M',
          '-c:a', 'libvorbis',
          outputName
        ]);
        break;

      case 'AVI':
        exitCode = await ffmpegInstance.exec([
          '-i', inputName,
          '-threads', '4',
          '-c:v', 'mpeg4',
          '-q:v', '6',
          '-c:a', 'libmp3lame',
          '-compression_level', '0',
          outputName
        ]);
        break;

      case 'GIF':
        // Fast bilinear scaling instead of heavy lanczos filter
        exitCode = await ffmpegInstance.exec([
          '-i', inputName,
          '-vf', 'fps=8,scale=360:-1:flags=fast_bilinear',
          '-loop', '0',
          outputName
        ]);
        break;

      default:
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    if (exitCode !== 0) {
      throw new Error(`FFmpeg encoding exited with code ${exitCode}`);
    }

    const data = await ffmpegInstance.readFile(outputName);

    const mimeTypes = {
      mp3: 'audio/mpeg',
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      gif: 'image/gif',
    };

    const blob = new Blob([data.buffer], {
      type: mimeTypes[outputExt] || 'application/octet-stream',
    });
    const url = URL.createObjectURL(blob);

    if (onProgress) onProgress(100);

    return {
      url,
      extension: outputExt,
    };
  } finally {
    ffmpegInstance.off('progress', progressHandler);
    try {
      await ffmpegInstance.deleteFile(inputName);
    } catch {}
    try {
      await ffmpegInstance.deleteFile(outputName);
    } catch {}
  }
};