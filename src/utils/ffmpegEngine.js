import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Singleton instance to prevent multiple WebAssembly core downloads
let ffmpegInstance = null;
let isLoaded = false;

export const initFFmpeg = async (onInitProgress) => {
  if (isLoaded && ffmpegInstance) return ffmpegInstance;

  try {
    ffmpegInstance = new FFmpeg();
    
    // Optional: hook into load progress if needed in the future
    ffmpegInstance.on('progress', ({ progress, time }) => {
      // Progress during processing (not loading)
      console.log(`FFmpeg Progress: ${progress * 100}%`);
    });

    // Load the core WebAssembly files dynamically from standard CDNs
    await ffmpegInstance.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    });

    isLoaded = true;
    return ffmpegInstance;
  } catch (error) {
    console.error("Failed to load FFmpeg core:", error);
    throw new Error("Could not initialize the video processing engine. Please ensure your browser supports WebAssembly and SharedArrayBuffer.");
  }
};

export const processVideoToAudio = async (file, onProgress) => {
  try {
    // Ensure FFmpeg is ready
    const ffmpeg = await initFFmpeg();

    // Sanitize filename to prevent Virtual File System (VFS) parsing errors
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const inputName = `input_${Date.now()}_${safeName}`;
    const outputName = `output_${Date.now()}.mp3`;

    // 1. Write the user's video file into the in-memory WebAssembly filesystem
    onProgress(10);
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);
    
    // 2. Attach a temporary progress listener for this specific file
    const progressCallback = ({ progress }) => {
      // ffmpeg progress goes from 0 to 1 based on duration
      const percentage = Math.round(progress * 100);
      // Map 0-100% of ffmpeg progress to 15-95% of our UI progress
      onProgress(15 + (percentage * 0.8)); 
    };
    ffmpeg.on('progress', progressCallback);

    // 3. Execute the FFmpeg command
    // -i = input file
    // -q:a 0 = highest quality variable bitrate for audio
    // -map a = extract only the audio stream
    await ffmpeg.exec([
      '-i', inputName,
      '-q:a', '0',
      '-map', 'a',
      outputName
    ]);

    // Cleanup the listener to prevent memory leaks across batch processing
    ffmpeg.off('progress', progressCallback);

    onProgress(95);

    // 4. Read the resulting MP3 file from memory
    const outputData = await ffmpeg.readFile(outputName);
    const audioBlob = new Blob([outputData.buffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // 5. Cleanup the Virtual File System immediately
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    onProgress(100);

    return {
      blob: audioBlob,
      url: audioUrl,
      extension: 'mp3'
    };
  } catch (error) {
    console.error(`Video extraction failed for ${file.name}:`, error);
    throw new Error("Memory limit exceeded or unsupported video format.");
  }
};