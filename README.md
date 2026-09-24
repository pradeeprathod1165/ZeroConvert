# ZeroConvert

A 100% private, client-side batch file conversion tool. All processing happens entirely within the browser's memory using WebAssembly and standard web APIs. No files are ever uploaded to an external server.

## Capabilities
* **Zero-Server Architecture:** Complete privacy guaranteed as files never leave the local device.
* **Image Processing:** Instant conversion between JPG, PNG, and WEBP formats using the native HTML5 Canvas API.
* **Video Extraction:** Local MP4 to MP3 audio extraction powered by an embedded FFmpeg WebAssembly core.
* **Batch Operations:** Multi-file queue processing with single-click bulk `.zip` exporting.

## Tech Stack
* React + Vite
* Tailwind CSS v4
* `@ffmpeg/ffmpeg` (WASM)
* `jszip`