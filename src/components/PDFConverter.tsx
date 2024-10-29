import React, { useState } from 'react';
import { DocumentArrowUpIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { convertPDFToJSON, ProcessedPDFDocument } from '../lib/pdfConverter';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface PDFConverterProps {
  onConversionComplete?: (result: ProcessedPDFDocument) => void;
}

export function PDFConverter({ onConversionComplete }: PDFConverterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedPDFDocument | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const converted = await convertPDFToJSON(file);
      setResult(converted);
      onConversionComplete?.(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert PDF');
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
          <label htmlFor="pdf-upload" className="mt-4 cursor-pointer">
            <span className="mt-2 text-base font-medium text-gray-900">
              Upload a PDF file
            </span>
            <input
              id="pdf-upload"
              type="file"
              className="sr-only"
              accept="application/pdf"
              onChange={handleFileUpload}
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">PDF files up to 10MB</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Results Preview */}
      {result && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Conversion Result</h3>
            
            {/* Metadata Section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500">Metadata</h4>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {value instanceof Date ? value.toLocaleString() : value || 'N/A'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Content Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Content Preview</h4>
              <div className="mt-2 max-h-96 overflow-y-auto">
                {result.content.pages.map((page) => (
                  <div key={page.pageNumber} className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700">
                      Page {page.pageNumber}
                    </h5>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                      {page.content.substring(0, 200)}...
                    </p>
                    
                    {page.tables && page.tables.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <TableCellsIcon className="h-4 w-4 mr-1" />
                          {page.tables.length} table(s) detected
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Data Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Structured Data</h4>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {JSON.stringify(result.structuredData, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}