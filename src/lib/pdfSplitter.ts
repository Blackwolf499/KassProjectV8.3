import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

export async function splitPDFIntoPages(file: File): Promise<{ pages: Blob[]; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;
  const pages: Blob[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    const [page] = await newPdf.copyPages(sourcePdf, [i - 1]);
    newPdf.addPage(page);
    
    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    pages.push(blob);
  }

  return { pages, pageCount };
}