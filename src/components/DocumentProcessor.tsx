import React, { useState } from 'react';
import { extractTextFromPDF } from '../lib/pdf';
import { analyzeDocument, convertToStructuredData } from '../lib/openai';
import { saveProcessedDocument } from '../lib/storage';
import { DocumentUpload } from './DocumentUpload';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function DocumentProcessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Convert to structured data using OpenAI
      const structuredData = await convertToStructuredData(extractedText);
      
      // Get analysis from OpenAI
      const analysis = await analyzeDocument(extractedText);
      
      // Save processed document
      await saveProcessedDocument(file, extractedText, structuredData, analysis);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      console.error('Processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DocumentUpload onFileSelect={handleFileProcess} />
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}