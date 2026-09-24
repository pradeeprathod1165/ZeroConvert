import * as XLSX from 'xlsx';

export const processDataFile = async (file, targetFormat, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      onProgress(20);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          onProgress(50);
          const data = e.target.result;
          
          // Parse the input file into a SheetJS workbook
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          let outputBlob;
          let mimeType = 'text/plain';

          onProgress(80);

          // Generate the output based on target format
          if (targetFormat === 'JSON') {
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const jsonString = JSON.stringify(jsonData, null, 2);
            outputBlob = new Blob([jsonString], { type: 'application/json' });
            mimeType = 'application/json';
          } 
          else if (targetFormat === 'CSV') {
            const csvString = XLSX.utils.sheet_to_csv(worksheet);
            outputBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            mimeType = 'text/csv';
          } 
          else if (targetFormat === 'XLSX') {
            const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            outputBlob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          } else {
            throw new Error("Unsupported data format.");
          }

          onProgress(100);
          resolve({
            blob: outputBlob,
            url: URL.createObjectURL(outputBlob),
            extension: targetFormat.toLowerCase()
          });

        } catch (err) {
          reject(new Error("Failed to parse or write spreadsheet data."));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read the file."));
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
};