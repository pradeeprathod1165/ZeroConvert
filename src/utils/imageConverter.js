import heic2any from 'heic2any';

// Map dropdown format selections to proper MIME types
const getMimeType = (format) => {
  const map = {
    'JPG': 'image/jpeg',
    'PNG': 'image/png',
    'WEBP': 'image/webp'
  };
  return map[format] || 'image/jpeg';
};

// Canvas-based conversion for standard web formats
const convertWithCanvas = (file, targetMime) => {
  return new Promise((resolve, reject) => {
    // 50MB arbitrary limit for standard canvas processing to prevent immediate crashes
    if (file.size > 50 * 1024 * 1024) {
      reject(new Error("File too large for local canvas processing."));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        // Fill white background for transparent PNGs converting to JPG
        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url); // Clean up memory immediately
          if (!blob) {
            reject(new Error("Canvas export failed. Image may be too large."));
          } else {
            resolve(blob);
          }
        }, targetMime, 0.92); // 0.92 quality for lossy formats
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(new Error("Memory exceeded during canvas rendering."));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image into memory."));
    };

    img.src = url;
  });
};

export const processImage = async (file, targetFormat, onProgress) => {
  try {
    const targetMime = getMimeType(targetFormat);
    let outputBlob;

    // Simulate initial progress to show the UI is responsive
    onProgress(15); 

    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';

    if (isHeic) {
      onProgress(40); // HEIC processing takes longer, update progress
      const result = await heic2any({
        blob: file,
        toType: targetMime,
        quality: 0.92,
      });
      // heic2any can return an array of blobs for image sequences; we take the first
      outputBlob = Array.isArray(result) ? result[0] : result;
      onProgress(90);
    } else {
      onProgress(50);
      outputBlob = await convertWithCanvas(file, targetMime);
      onProgress(90);
    }

    // Finalize URL creation
    const outputUrl = URL.createObjectURL(outputBlob);
    onProgress(100);
    
    return {
      blob: outputBlob,
      url: outputUrl,
      extension: targetFormat.toLowerCase()
    };
  } catch (error) {
    console.error(`Conversion failed for ${file.name}:`, error);
    throw error;
  }
};