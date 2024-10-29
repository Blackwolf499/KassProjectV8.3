import React, { useState } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { GPTResponse } from './components/GPTResponse';
import { DocumentList } from './components/DocumentList';
import { DashboardView } from './components/DashboardView';
import { HistoricalAnalysis } from './components/HistoricalAnalysis';
import { ClerkPerformanceHistory } from './components/ClerkPerformanceHistory';
import { ChartBarIcon, DocumentTextIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { BatchProcessingQueue } from './components/BatchProcessingQueue';
import { UploadProvider } from './context/UploadContext';
import { UploadStatus } from './components/UploadStatus';
import { ProcessingSuccess } from './components/ProcessingSuccess';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ServerFileExplorer } from './components/server-explorer/ServerFileExplorer';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'documents' | 'historical' | 'performance'>('dashboard');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processedFileStats, setProcessedFileStats] = useState<{
    fileName: string;
    stats: {
      totalMembers: number;
      totalRevenue: number;
      processingTime: number;
    };
  } | null>(null);

  const handleFileUpload = (file: File) => {
    setFiles(prev => [...prev, file]);
    setProcessedFileStats({
      fileName: file.name,
      stats: {
        totalMembers: 10,
        totalRevenue: 50000,
        processingTime: 3500
      }
    });
    setShowSuccess(true);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentProcessed = (text: string, file: File) => {
    console.log('Document processed:', file.name);
  };

  return (
    <ErrorBoundary>
      <UploadProvider>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">Business Operations</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setView('dashboard')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setView('performance')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'performance'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Clerk Performance
                  </button>
                  <button
                    onClick={() => setView('historical')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'historical'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Historical
                  </button>
                  <button
                    onClick={() => setView('documents')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      view === 'documents'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Document Analysis
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex">
            <main className="flex-1 py-6 sm:px-6 lg:px-8">
              {view === 'dashboard' && (
                <div className="space-y-6">
                  <DashboardView />
                </div>
              )}
              {view === 'performance' && <ClerkPerformanceHistory data={[]} />}
              {view === 'historical' && <HistoricalAnalysis />}
              {view === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Document Analysis</h2>
                    <DocumentUpload 
                      onTextExtracted={handleDocumentProcessed}
                      onError={setError}
                    />
                    {files.length > 0 && (
                      <BatchProcessingQueue
                        files={files}
                        onRemoveFile={handleRemoveFile}
                      />
                    )}
                    <GPTResponse 
                      response=""
                      error={error}
                      loading={loading}
                    />
                  </div>
                  <DocumentList 
                    documents={[]}
                    onSelect={() => {}}
                  />
                </div>
              )}
            </main>

            <ServerFileExplorer />
          </div>

          <UploadStatus />

          {showSuccess && processedFileStats && (
            <ProcessingSuccess
              fileName={processedFileStats.fileName}
              stats={processedFileStats.stats}
              onDismiss={() => setShowSuccess(false)}
            />
          )}
        </div>
      </UploadProvider>
    </ErrorBoundary>
  );
}