import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentPreviewProps {
  file: File | null;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

export function DocumentPreview({ file, onLoadSuccess, onLoadError }: DocumentPreviewProps) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [url, setUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [file]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onLoadSuccess?.(numPages);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {file && url ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                disabled={pageNumber >= numPages}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Document
              file={url}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={onLoadError}
              className="mx-auto"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="mx-auto"
                scale={1.2}
              />
            </Document>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No document selected</p>
        </div>
      )}
    </div>
  );
}