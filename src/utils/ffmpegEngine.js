import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpegInstance = null;
let isLoaded = false;

export const initFFmpeg = async () => {
  if (isLoaded && ffmpegInstance) return ffmpegInstance;
  try {
    ffmpegInstance = new FFmpeg();
    await ffmpegInstance.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    });
    isLoaded = true;
    return ffmpegInstance;
  } catch (error) {
    throw new Error("Could not initialize the video/audio engine.");
  }
};

export const processAudioVideo = async (file, targetFormat, onProgress) => {
  try {
    const ffmpeg = await initFFmpeg();

    const ext = file.name.split('.').pop().toLowerCase();
    const safeName = `input_${Date.now()}.${ext}`;
    
    // Handle the special compression format string
    const isCompression = targetFormat === 'MP4 (Compress)';
    const outputExt = isCompression ? 'mp4' : targetFormat.toLowerCase();
    const outputName = `output_${Date.now()}.${outputExt}`;

    onProgress(10);
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(safeName, fileData);
    
    const progressCallback = ({ progress }) => {
      const percentage = Math.round(progress * 100);
      onProgress(15 + (percentage * 0.8)); 
    };
    ffmpeg.on('progress', progressCallback);

    let command = [];
    
    if (outputExt === 'mp3') {
      command = ['-i', safeName, '-q:a', '0', '-map', 'a', outputName];
    } else if (outputExt === 'gif') {
      command = ['-i', safeName, '-vf', 'fps=12,scale=640:-1:flags=lanczos', '-loop', '0', outputName];
    } else if (isCompression) {
      // Compress MP4: Scale down to max 720p width, apply preset fast, and lower constant rate factor (CRF 28)
      command = ['-i', safeName, '-vcodec', 'libx264', '-crf', '28', '-preset', 'fast', '-vf', 'scale=\'min(720,iw)\':-2', outputName];
    } else if (outputExt === 'mp4' || outputExt === 'webm' || outputExt === 'avi') {
      // Standard conversion between video containers
      command = ['-i', safeName, '-c:v', 'copy', '-c:a', 'copy', outputName];
    } else {
      throw new Error("Unsupported media format combination.");
    }

    onProgress(15);
    await ffmpeg.exec(command);
    ffmpeg.off('progress', progressCallback);
    onProgress(95);

    const outputData = await ffmpeg.readFile(outputName);
    
    let mimeType = 'application/octet-stream';
    if (outputExt === 'mp3') mimeType = 'audio/mpeg';
    if (outputExt === 'gif') mimeType = 'image/gif';
    if (outputExt === 'mp4') mimeType = 'video/mp4';
    if (outputExt === 'webm') mimeType = 'video/webm';
    if (outputExt === 'avi') mimeType = 'video/x-msvideo';

    const outputBlob = new Blob([outputData.buffer], { type: mimeType });
    const outputUrl = URL.createObjectURL(outputBlob);

    await ffmpeg.deleteFile(safeName);
    await ffmpeg.deleteFile(outputName);

    onProgress(100);
    return {
      blob: outputBlob,
      url: outputUrl,
      extension: outputExt
    };
  } catch (error) {
    console.error(`Media conversion failed:`, error);
    throw new Error("Processing failed. Memory limit exceeded or unsupported codec.");
  }
};