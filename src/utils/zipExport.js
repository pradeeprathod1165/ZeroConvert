import JSZip from 'jszip';

export const generateZip = async (completedFiles, onProgress) => {
  try {
    const zip = new JSZip();

    // Iterate through all completed files and add them to the zip instance
    for (let i = 0; i < completedFiles.length; i++) {
      const fileObj = completedFiles[i];
      const fileName = `converted_${fileObj.name.split('.')[0]}.${fileObj.outputExtension}`;
      
      // Fetch the blob data back from the local URL we created earlier
      const response = await fetch(fileObj.outputUrl);
      const blobData = await response.blob();
      
      zip.file(fileName, blobData);
      
      // Update progress for file reading (0-50%)
      const readProgress = Math.round(((i + 1) / completedFiles.length) * 50);
      onProgress(readProgress);
    }

    // Generate the final zip file asynchronously
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    }, (metadata) => {
      // Update progress for zip compression (50-100%)
      onProgress(50 + (metadata.percent / 2));
    });

    return URL.createObjectURL(zipBlob);
  } catch (error) {
    console.error("Error generating ZIP:", error);
    throw new Error("Failed to create ZIP archive. A file may be corrupted.");
  }
};