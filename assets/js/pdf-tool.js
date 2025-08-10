// pdf-tool.js
// Provides functions to merge multiple PDF files and split PDFs into specified page ranges

const mergeButton = document.getElementById('merge-button');
const mergeFilesInput = document.getElementById('merge-files');
const mergeResult = document.getElementById('merge-result');

mergeButton.addEventListener('click', async () => {
  const files = mergeFilesInput.files;
  if (!files.length) {
    alert('Select two or more PDF files to merge.');
    return;
  }
  try {
    const mergedPdf = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }
    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    mergeResult.innerHTML = '';
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged.pdf';
    link.textContent = 'Download merged PDF';
    link.className = 'text-blue-600 hover:underline';
    mergeResult.appendChild(link);
  } catch (err) {
    console.error(err);
    mergeResult.textContent = 'Error merging PDFs: ' + err.message;
  }
});

// Split functionality
const splitButton = document.getElementById('split-button');
const splitFileInput = document.getElementById('split-file');
const splitRangesInput = document.getElementById('split-ranges');
const splitResult = document.getElementById('split-result');

splitButton.addEventListener('click', async () => {
  const file = splitFileInput.files[0];
  const rangesStr = splitRangesInput.value.trim();
  if (!file) {
    alert('Select a PDF file to split.');
    return;
  }
  if (!rangesStr) {
    alert('Specify page ranges, e.g., 1-3,5');
    return;
  }
  try {
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(bytes);
    const ranges = rangesStr.split(',').map(r => r.trim()).filter(r => r.length);
    splitResult.innerHTML = '';
    let partIndex = 1;
    for (const range of ranges) {
      const [startStr, endStr] = range.split('-');
      const start = parseInt(startStr, 10) - 1; // convert to zero-based index
      const end = endStr ? parseInt(endStr, 10) - 1 : start;
      if (isNaN(start) || isNaN(end) || start < 0 || end >= pdfDoc.getPageCount() || end < start) {
        const errorP = document.createElement('p');
        errorP.textContent = 'Invalid range: ' + range;
        errorP.className = 'text-red-600';
        splitResult.appendChild(errorP);
        continue;
      }
      const newPdf = await PDFLib.PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, i) => start + i));
      pages.forEach(page => newPdf.addPage(page));
      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `split-${partIndex}.pdf`;
      link.textContent = `Download part ${partIndex}`;
      link.className = 'text-blue-600 hover:underline block mt-2';
      splitResult.appendChild(link);
      partIndex++;
    }
  } catch (err) {
    console.error(err);
    splitResult.textContent = 'Error splitting PDF: ' + err.message;
  }
});
