import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configure the PDF.js worker securely via CDN to avoid Vite build complexities
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Helper: Convert any image file to a PNG array buffer (PDF-lib only supports JPG/PNG embedding)
const normalizeImageToPngBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        URL.revokeObjectURL(url);
        resolve(await blob.arrayBuffer());
      }, 'image/png');
    };
    img.onerror = () => reject(new Error(`Failed to process ${file.name}`));
    img.src = url;
  });
};

export const imagesToPdf = async (imageFiles, onProgress) => {
  try {
    onProgress(10);
    const pdfDoc = await PDFDocument.create();
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const pngBuffer = await normalizeImageToPngBuffer(file);
      const pdfImage = await pdfDoc.embedPng(pngBuffer);
      
      const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height,
      });
      
      onProgress(10 + Math.round(((i + 1) / imageFiles.length) * 40));
    }

    onProgress(80);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress(100);
    return {
      blob: blob,
      url: URL.createObjectURL(blob),
      extension: 'pdf'
    };
  } catch (error) {
    console.error("PDF Creation Error:", error);
    throw new Error("Failed to compile images into a PDF document.");
  }
};

export const pdfToImages = async (pdfFile, onProgress) => {
  try {
    onProgress(10);
    const fileBuffer = await pdfFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdfDocument = await loadingTask.promise;
    const totalPages = pdfDocument.numPages;
    
    const zip = new JSZip();

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      // Scale 2.0 for higher quality output
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      zip.file(`page_${pageNum}.png`, blob);
      
      onProgress(10 + Math.round((pageNum / totalPages) * 70));
    }

    onProgress(90);
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
    
    onProgress(100);
    return {
      blob: zipBlob,
      url: URL.createObjectURL(zipBlob),
      extension: 'zip' // Returns a ZIP of PNGs for multi-page PDFs
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to render PDF pages. Memory limit may have been exceeded.");
  }
};