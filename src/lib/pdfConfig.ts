import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// Configure worker using CDN
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.min.js`;

export const PDF_WORKER_URL = GlobalWorkerOptions.workerSrc;