import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { ResultDisplay } from './components/ResultDisplay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TrendOverview } from './components/TrendOverview';
import { PDFSidebar } from './components/PDFSidebar';
import { extractTextFromPDF, processWithAI } from './utils/pdfProcessor';
import type { ExtractedData, ProcessingStatus as StatusType, PDFSegment, FileHistory, PDFFileInfo } from './types';
import { FileText, TrendingUp, PanelLeftClose, PanelLeft, Clock, XCircle } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<StatusType>({
    isLoading: false,
    error: null,
    progress: 0,
  });
  const [fileHistory, setFileHistory] = useState<FileHistory[]>([]);
  const [pdfFiles, setPdfFiles] = useState<PDFFileInfo[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [segments, setSegments] = useState<PDFSegment[]>([]);
  const [processingAborted, setProcessingAborted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status.isLoading) {
      if (!startTime) {
        setStartTime(Date.now());
      }
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setStartTime(0);
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status.isLoading, startTime]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setProcessingAborted(true);
      setStatus({
        isLoading: false,
        error: 'Processing cancelled by user',
        progress: 0
      });
    }
  };

  const handleFileSelect = async (file: File) => {
    setStatus({ isLoading: true, error: null, progress: 0 });
    setProcessingAborted(false);
    setStartTime(Date.now());
    abortControllerRef.current = new AbortController();

    try {
      const fileId = crypto.randomUUID();
      const newPdfInfo: PDFFileInfo = {
        id: fileId,
        name: file.name,
        size: file.size,
        pageCount: 0,
        uploadedAt: new Date(),
        processingTime: 0
      };

      setPdfFiles(prev => [...prev, newPdfInfo]);
      setSelectedFileId(fileId);

      const extractedSegments = await extractTextFromPDF(
        file, 
        (progress) => {
          if (processingAborted) return;
          setStatus(prev => ({ ...prev, progress }));
        },
        abortControllerRef.current.signal
      );

      if (processingAborted) return;

      setSegments(extractedSegments);
      
      // Update page count immediately after extraction
      setPdfFiles(prev => prev.map(pdfFile => 
        pdfFile.id === fileId 
          ? { 
              ...pdfFile, 
              pageCount: extractedSegments[extractedSegments.length - 1].pageRange.end
            }
          : pdfFile
      ));

      const data = await processWithAI(
        extractedSegments, 
        (progress, partialData) => {
          if (processingAborted) return;
          setStatus(prev => ({ ...prev, progress: 50 + progress / 2 }));
        },
        abortControllerRef.current.signal
      );

      setExtractedData(data);
      
      const processingEndTime = new Date();
      const processingTime = processingEndTime.getTime() - newPdfInfo.uploadedAt.getTime();

      // Update file info with processing completion
      setPdfFiles(prev => prev.map(pdfFile => 
        pdfFile.id === fileId 
          ? { 
              ...pdfFile, 
              pageCount: extractedSegments[extractedSegments.length - 1].pageRange.end,
              processingTime,
              processedAt: processingEndTime,
              extractedData: data
            }
          : pdfFile
      ));

      const newHistoryEntry: FileHistory = {
        id: fileId,
        fileName: file.name,
        timestamp: new Date(),
        extractedData: data,
        processingTime
      };
      
      setFileHistory(prev => [...prev, newHistoryEntry]);
      setStatus({ isLoading: false, error: null, progress: 100 });
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus({
          isLoading: false,
          error: 'Processing cancelled by user',
          progress: 0
        });
      } else {
        setStatus({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to process PDF',
          progress: 0
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-0 z-10 p-2 bg-white border border-gray-200 rounded-r-lg shadow-sm hover:bg-gray-50 transition-all ${
          isSidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="h-5 w-5 text-gray-600" />
        ) : (
          <PanelLeft className="h-5 w-5 text-gray-600" />
        )}
      </button>

      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
      }`}>
        <PDFSidebar 
          files={pdfFiles}
          selectedFileId={selectedFileId}
          onSelectFile={(id) => setSelectedFileId(id)}
        />
      </div>

      <main className={`flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isSidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              PDF Data Extractor
            </h1>
            <p className="mt-2 text-gray-600">
              Upload PDF documents to extract and analyze data trends
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <FileUpload 
              onFileSelect={handleFileSelect}
              isProcessing={status.isLoading}
            />
            <ProcessingStatus 
              status={status} 
              onCancel={handleCancel}
              elapsedTime={elapsedTime}
            />
            <ErrorBoundary>
              <ResultDisplay data={extractedData} segments={segments} />
            </ErrorBoundary>
          </div>

          {fileHistory.length > 0 && (
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Historical Trends</h2>
              </div>
              <TrendOverview history={fileHistory} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;