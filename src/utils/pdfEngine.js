import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Use local bundled PDF.js worker first (works offline + avoids CDN version mismatches)
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch {
  const pdfjsVersion = pdfjsLib.version || '3.11.174';
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
}

// Helper: Convert any image file to PNG buffer for PDF embedding
const normalizeImageToPngBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        URL.revokeObjectURL(url);
        if (!blob) return reject(new Error(`Failed to encode ${file.name}`));
        resolve(await blob.arrayBuffer());
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image ${file.name}`));
    };
    img.src = url;
  });
};

// Helper: Escape XML special characters
const escapeXml = (unsafe = '') =>
  String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

// ============================================================================
// 1. REAL EDITABLE DOCX BUILDER (With Section Lines, Right-Tab Dates & Bullets)
// ============================================================================
const createEditableDocxBlob = async (structuredPages) => {
  const zip = new JSZip();

  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  zip.folder('_rels').file(
    '.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // Page geometry in Twips (1 pt = 20 twips). A4 width = 11906 twips, margins = 720 twips (0.5 inch) each side
  // Printable content width = 11906 - 1440 = 10466 twips
  const CONTENT_WIDTH_TWIPS = 10466;
  let bodyXml = '';

  structuredPages.forEach((pageBlocks, pageIdx) => {
    pageBlocks.forEach((block) => {
      const alignTag =
        block.align && block.align !== 'left' ? `<w:jc w:val="${block.align}"/>` : '';
      const indentTag =
        block.indentTwips > 80 ? `<w:ind w:left="${Math.round(block.indentTwips)}"/>` : '';

      // Real Word Horizontal Section Divider Line (<w:pBdr><w:bottom .../></w:pBdr>)
      const borderTag = block.hasBottomBorder
        ? `<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="222222"/></w:pBdr>`
        : '';

      // Real Word Tab Stops (Right-aligned for dates, Left-aligned for skill columns)
      let tabsXml = '';
      if (block.tabStops && block.tabStops.length > 0) {
        const tabItems = block.tabStops
          .map((t) => `<w:tab w:val="${t.type}" w:pos="${Math.round(t.posTwips)}"/>`)
          .join('');
        tabsXml = `<w:tabs>${tabItems}</w:tabs>`;
      }

      const spaceBefore = block.spaceBeforeTwips ? Math.round(block.spaceBeforeTwips) : 0;
      const spaceAfter = block.spaceAfterTwips ? Math.round(block.spaceAfterTwips) : 40;

      const runsXml = (block.runs || [])
        .map((run) => {
          if (run.isTab) {
            return `<w:r><w:tab/></w:r>`;
          }
          const halfPts = Math.max(16, Math.min(56, Math.round((run.fontSize || 10.5) * 2)));
          const boldTag = run.bold ? '<w:b/><w:bCs/>' : '';
          const italicTag = run.italic ? '<w:i/><w:iCs/>' : '';
          const colorTag =
            run.color && run.color !== '000000' ? `<w:color w:val="${run.color}"/>` : '';
          const fontName = run.serif ? 'Times New Roman' : 'Calibri';

          return `<w:r>
            <w:rPr>
              <w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}" w:cs="${fontName}"/>
              ${boldTag}${italicTag}${colorTag}
              <w:sz w:val="${halfPts}"/>
              <w:szCs w:val="${halfPts}"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(run.text)}</w:t>
          </w:r>`;
        })
        .join('');

      bodyXml += `<w:p>
        <w:pPr>
          ${alignTag}
          ${tabsXml}
          ${borderTag}
          ${indentTag}
          <w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}" w:line="240" w:lineRule="auto"/>
        </w:pPr>
        ${runsXml}
      </w:p>`;
    });

    if (pageIdx < structuredPages.length - 1) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
  });

  zip.folder('word').file(
    'document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>
    </w:sectPr>
  </w:body>
</w:document>`
  );

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
};

// ============================================================================
// 2. SMART PDF PAGE PARSER (Detects Fonts, Bold, Right-Aligned Dates & Lines)
// ============================================================================
const extractEditableLayoutFromPdfPage = async (page) => {
  const viewport = page.getViewport({ scale: 1.0 });
  const textContent = await page.getTextContent();
  const styles = textContent.styles || {};

  // Collect all text items with exact coordinates and font traits
  const items = [];
  for (const item of textContent.items) {
    if (!item.str || !item.transform) continue;
    // Skip standalone invisible spaces that have no width
    if (!item.str.trim() && (!item.width || item.width < 1)) continue;

    const x = item.transform[4];
    const y = item.transform[5];
    const rawHeight = Math.hypot(item.transform[0], item.transform[1]) || Math.abs(item.transform[3]) || 10.5;
    const fontSize = Math.max(8, Math.min(28, Math.round(rawHeight * 2) / 2));

    const styleObj = styles[item.fontName] || {};
    const fontMeta = `${item.fontName || ''} ${styleObj.fontFamily || ''}`.toLowerCase();

    // Detect Bold & Italic from PDF font descriptor or Computer Modern (cmbx / cmti) naming
    const bold =
      fontMeta.includes('bold') ||
      fontMeta.includes('black') ||
      fontMeta.includes('heavy') ||
      fontMeta.includes('medi') ||
      fontMeta.includes('cmbx') ||
      fontMeta.includes('demi');
    const italic =
      fontMeta.includes('italic') ||
      fontMeta.includes('oblique') ||
      fontMeta.includes('cmti') ||
      fontMeta.includes(' cmsl');
    const serif =
      fontMeta.includes('serif') ||
      fontMeta.includes('times') ||
      fontMeta.includes('cmr') ||
      fontMeta.includes('cmbx') ||
      fontMeta.includes('cmti') ||
      fontMeta.includes('garamond') ||
      fontMeta.includes('georgia');

    // Detect blue hyperlink text often used in resumes/documents
    const isLink =
      item.str.includes('@') ||
      item.str.includes('http') ||
      item.str.includes('linkedin.com') ||
      item.str.includes('github.com') ||
      item.str.includes('www.');

    items.push({
      text: item.str,
      x,
      y,
      width: item.width || item.str.length * (fontSize * 0.48),
      fontSize,
      bold,
      italic,
      serif,
      color: isLink ? '1155CC' : '000000',
    });
  }

  if (items.length === 0) return [];

  // Sort top-to-bottom (descending Y), then left-to-right (ascending X)
  items.sort((a, b) => {
    if (Math.abs(b.y - a.y) > 3.2) return b.y - a.y;
    return a.x - b.x;
  });

  // Group items on the same horizontal baseline into lines
  const lines = [];
  for (const item of items) {
    const lastLine = lines[lines.length - 1];
    if (lastLine && Math.abs(lastLine.y - item.y) <= Math.max(3.5, item.fontSize * 0.35)) {
      lastLine.items.push(item);
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }

  // Find left and right page margins from the actual text bounds
  const allLeftX = lines.map((l) => Math.min(...l.items.map((i) => i.x)));
  const allRightX = lines.map((l) => Math.max(...l.items.map((i) => i.x + i.width)));
  const minX = Math.min(...allLeftX);
  const maxX = Math.max(...allRightX, viewport.width - minX);
  const pdfContentWidth = Math.max(200, maxX - minX);
  const CONTENT_WIDTH_TWIPS = 10466; // Matches our DOCX printable page width
  const twipsPerPt = CONTENT_WIDTH_TWIPS / pdfContentWidth;

  const blocks = [];
  let prevY = null;

  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const line = lines[lIdx];
    line.items.sort((a, b) => a.x - b.x);

    // Group items inside the line into "clusters" separated by large horizontal gaps (> 22pt)
    const clusters = [];
    for (const item of line.items) {
      const lastCluster = clusters[clusters.length - 1];
      if (!lastCluster) {
        clusters.push({
          startX: item.x,
          endX: item.x + item.width,
          items: [item],
        });
      } else {
        const gap = item.x - lastCluster.endX;
        if (gap > 22) {
          clusters.push({
            startX: item.x,
            endX: item.x + item.width,
            items: [item],
          });
        } else {
          if (gap > 1.8 && !item.text.startsWith(' ') && !lastCluster.items[lastCluster.items.length - 1].text.endsWith(' ')) {
            item.text = ' ' + item.text;
          }
          lastCluster.items.push(item);
          lastCluster.endX = Math.max(lastCluster.endX, item.x + item.width);
        }
      }
    }

    const firstX = clusters[0].startX;
    const lastEndX = clusters[clusters.length - 1].endX;
    const lineSpan = lastEndX - firstX;
    const avgFontSize = line.items[0]?.fontSize || 10.5;

    // Detect centered header lines (like Name, Phone/Location, Email links at top of resume)
    const pageMid = minX + pdfContentWidth / 2;
    const lineMid = firstX + lineSpan / 2;
    const isCentered =
      clusters.length === 1 &&
      lineSpan < pdfContentWidth * 0.78 &&
      Math.abs(lineMid - pageMid) < 28 &&
      firstX - minX > 25;

    // Detect Section Header that should have a full-width horizontal divider line underneath
    const fullLineText = line.items.map((i) => i.text).join('').trim();
    const isAllCapsSectionHeader =
      clusters.length === 1 &&
      fullLineText.length >= 4 &&
      fullLineText.length <= 38 &&
      fullLineText === fullLineText.toUpperCase() &&
      /[A-Z]/.test(fullLineText) &&
      !isCentered;

    // Build runs and real Word tab stops for multi-column / right-aligned date lines
    const runs = [];
    const tabStops = [];

    const pushClusterRuns = (clusterItems) => {
      for (const item of clusterItems) {
        // Replace bullet symbols with clean bullet + space
        const normalizedText = item.text.replace(/^[•▪▫◦·]\s*/, '• ');
        const prevRun = runs[runs.length - 1];
        if (
          prevRun &&
          !prevRun.isTab &&
          prevRun.bold === item.bold &&
          prevRun.italic === item.italic &&
          prevRun.color === item.color &&
          Math.abs(prevRun.fontSize - item.fontSize) <= 0.6
        ) {
          prevRun.text += normalizedText;
        } else {
          runs.push({
            text: normalizedText,
            fontSize: item.fontSize,
            bold: item.bold || isAllCapsSectionHeader,
            italic: item.italic,
            serif: item.serif,
            color: item.color,
          });
        }
      }
    };

    if (clusters.length === 1) {
      pushClusterRuns(clusters[0].items);
    } else {
      // Multi-cluster line (e.g., "Master of Computer Science..." on left + "Expected 2020" on right,
      // OR "Technical Skills" on left + "A, B, C, D" in second column)
      for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
        const cluster = clusters[cIdx];
        if (cIdx > 0) {
          const isRightAlignedCluster =
            cIdx === clusters.length - 1 && cluster.endX > minX + pdfContentWidth * 0.78;

          if (isRightAlignedCluster) {
            tabStops.push({ type: 'right', posTwips: CONTENT_WIDTH_TWIPS });
          } else {
            const tabPosTwips = Math.max(720, (cluster.startX - minX) * twipsPerPt);
            tabStops.push({ type: 'left', posTwips: tabPosTwips });
          }
          runs.push({ isTab: true });
        }
        pushClusterRuns(cluster.items);
      }
    }

    // Calculate vertical paragraph spacing & left indentation
    const verticalGap = prevY !== null ? Math.max(0, prevY - line.y - avgFontSize) : 0;
    prevY = line.y;

    const indentPts = isCentered ? 0 : Math.max(0, firstX - minX);
    const indentTwips = indentPts > 6 ? indentPts * twipsPerPt : 0;

    blocks.push({
      align: isCentered ? 'center' : 'left',
      indentTwips,
      hasBottomBorder: isAllCapsSectionHeader,
      tabStops,
      spaceBeforeTwips:
        isAllCapsSectionHeader
          ? 140
          : verticalGap > avgFontSize * 0.65
          ? Math.min(200, verticalGap * 12)
          : 0,
      spaceAfterTwips: isAllCapsSectionHeader ? 60 : 30,
      runs,
    });
  }

  return blocks;
};

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

// 1. Merge Multiple Images into a Single PDF
export const imagesToPdf = async (imageFiles, onProgress) => {
  try {
    if (onProgress) onProgress(10);
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

      if (onProgress) {
        onProgress(10 + Math.round(((i + 1) / imageFiles.length) * 75));
      }
    }

    if (onProgress) onProgress(90);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    if (onProgress) onProgress(100);
    return {
      blob,
      url: URL.createObjectURL(blob),
      extension: 'pdf',
    };
  } catch (error) {
    console.error('PDF Creation Error:', error);
    throw new Error('Failed to compile images into a PDF document.');
  }
};

// 2. Convert PDF -> 100% Editable DOCX, TXT, PNG, JPG, or WEBP
export const processPdfFile = async (pdfFile, targetFormatOrProgress = 'PNG', maybeOnProgress) => {
  const isSecondArgFunc = typeof targetFormatOrProgress === 'function';
  const targetFormat = isSecondArgFunc ? 'PNG' : String(targetFormatOrProgress || 'PNG').toUpperCase();
  const onProgress = isSecondArgFunc ? targetFormatOrProgress : maybeOnProgress;

  try {
    if (onProgress) onProgress(10);
    const fileBuffer = await pdfFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdfDocument = await loadingTask.promise;
    const totalPages = pdfDocument.numPages;

    // Option A: PDF -> 100% Editable DOCX (with section lines & right-aligned tab stops) or TXT
    if (targetFormat === 'DOCX' || targetFormat === 'TXT') {
      const structuredPages = [];
      const plainTextPages = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const pageBlocks = await extractEditableLayoutFromPdfPage(page);

        if (pageBlocks.length > 0) {
          structuredPages.push(pageBlocks);
          const pageLines = pageBlocks
            .map((b) => b.runs.map((r) => (r.isTab ? '\t' : r.text)).join(''))
            .join('\n');
          plainTextPages.push(pageLines);
        }
        if (onProgress) {
          onProgress(10 + Math.round((pageNum / totalPages) * 75));
        }
      }

      if (structuredPages.length === 0) {
        structuredPages.push([
          {
            align: 'left',
            indentTwips: 0,
            runs: [{ text: '[Scanned PDF: No selectable text layer found.]', fontSize: 11, bold: false, italic: true }],
          },
        ]);
        plainTextPages.push('[Scanned PDF: No selectable text layer found.]');
      }

      if (targetFormat === 'TXT') {
        const txtBlob = new Blob([plainTextPages.join('\n\n--- Page Break ---\n\n')], {
          type: 'text/plain;charset=utf-8',
        });
        if (onProgress) onProgress(100);
        return {
          blob: txtBlob,
          url: URL.createObjectURL(txtBlob),
          extension: 'txt',
        };
      }

      const docxBlob = await createEditableDocxBlob(structuredPages);
      if (onProgress) onProgress(100);
      return {
        blob: docxBlob,
        url: URL.createObjectURL(docxBlob),
        extension: 'docx',
      };
    }

    // Option B: PDF -> PNG, JPG, or WEBP
    const mimeMap = { PNG: 'image/png', JPG: 'image/jpeg', WEBP: 'image/webp' };
    const extMap = { PNG: 'png', JPG: 'jpg', WEBP: 'webp' };
    const mimeType = mimeMap[targetFormat] || 'image/png';
    const imgExt = extMap[targetFormat] || 'png';

    const renderPageToBlob = async (pageNum) => {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      return await new Promise((resolve) => canvas.toBlob(resolve, mimeType, 0.95));
    };

    if (totalPages === 1 && !isSecondArgFunc) {
      const singleBlob = await renderPageToBlob(1);
      if (onProgress) onProgress(100);
      return {
        blob: singleBlob,
        url: URL.createObjectURL(singleBlob),
        extension: imgExt,
      };
    }

    const zip = new JSZip();
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const blob = await renderPageToBlob(pageNum);
      zip.file(`page_${pageNum}.${imgExt}`, blob);

      if (onProgress) {
        onProgress(10 + Math.round((pageNum / totalPages) * 75));
      }
    }

    if (onProgress) onProgress(90);
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });

    if (onProgress) onProgress(100);
    return {
      blob: zipBlob,
      url: URL.createObjectURL(zipBlob),
      extension: 'zip',
    };
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to process PDF document.');
  }
};

export const pdfToImages = (pdfFile, targetFormatOrProgress, maybeOnProgress) =>
  processPdfFile(pdfFile, targetFormatOrProgress, maybeOnProgress);

// 3. Convert DOCX / TXT -> PDF or TXT
export const processDocumentFile = async (file, targetFormat = 'PDF', onProgress) => {
  try {
    if (onProgress) onProgress(15);
    const ext = file.name.split('.').pop().toLowerCase();
    let paragraphs = [];

    if (ext === 'docx') {
      const zip = await JSZip.loadAsync(file);
      const docXml = zip.file('word/document.xml');
      if (!docXml) throw new Error('Invalid DOCX file.');
      const xmlText = await docXml.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const pNodes = xmlDoc.getElementsByTagName('w:p');
      for (let i = 0; i < pNodes.length; i++) {
        const tNodes = pNodes[i].getElementsByTagName('w:t');
        let line = '';
        for (let j = 0; j < tNodes.length; j++) {
          line += tNodes[j].textContent || '';
        }
        paragraphs.push(line);
      }
    } else {
      const text = await file.text();
      paragraphs = text.split(/\r?\n/);
    }

    if (onProgress) onProgress(50);

    if (targetFormat === 'TXT') {
      const txtBlob = new Blob([paragraphs.join('\n')], { type: 'text/plain;charset=utf-8' });
      if (onProgress) onProgress(100);
      return { blob: txtBlob, url: URL.createObjectURL(txtBlob), extension: 'txt' };
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const lineHeight = 16;
    const margin = 50;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const para of paragraphs) {
      const cleanPara = (para || '').replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
      const words = cleanPara.split(/\s+/);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth && currentLine) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      }
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    if (onProgress) onProgress(100);

    return {
      blob: pdfBlob,
      url: URL.createObjectURL(pdfBlob),
      extension: 'pdf',
    };
  } catch (error) {
    console.error('Document Conversion Error:', error);
    throw new Error('Failed to convert document.');
  }
};