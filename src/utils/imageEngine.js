// Map dropdown format selections to proper MIME types
const getMimeType = (format) => {
  const map = {
    'JPG': 'image/jpeg',
    'PNG': 'image/png',
    'WEBP': 'image/webp',
    'AVIF': 'image/avif'
  };
  return map[format] || 'image/jpeg';
};

export const processImage = (file, targetFormat, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      // 100MB arbitrary limit for standard canvas processing
      if (file.size > 100 * 1024 * 1024) {
        reject(new Error("File too large for local memory processing."));
        return;
      }

      onProgress(20);
      const targetMime = getMimeType(targetFormat);
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        try {
          onProgress(50);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          
          // Fill white background if converting a transparent SVG/PNG to JPG
          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);

          onProgress(80);
          
          // Note: AVIF support in toBlob depends on browser compatibility (Chrome 89+). 
          // If unsupported, it silently falls back to PNG.
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error("Canvas export failed. Image dimensions may exceed browser limits."));
            } else {
              onProgress(100);
              resolve({
                blob: blob,
                url: URL.createObjectURL(blob),
                extension: targetFormat.toLowerCase()
              });
            }
          }, targetMime, 0.92); 
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(new Error("Memory exceeded during canvas rendering."));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image. If this is an SVG, ensure it contains valid XML."));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};