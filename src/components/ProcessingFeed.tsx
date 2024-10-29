import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useUpload } from '../context/UploadContext';
import type { ProcessingStep } from '../context/UploadContext';

function AnimatedEllipsis() {
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        switch (prev) {
          case '...': return '..';
          case '..': return '.';
          case '.': return '...';
          default: return '...';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

export function ProcessingFeed() {
  const { state } = useUpload();
  const { processingSteps, isUploading } = state;

  if (!isUploading && processingSteps.every(step => step.status === 'completed')) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Status</h3>
      <div className="space-y-4">
        <AnimatePresence>
          {processingSteps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-3"
            >
              {step.status === 'completed' && (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              )}
              {step.status === 'error' && (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
              {(step.status === 'processing' || step.status === 'pending') && (
                <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              <span className="text-gray-700">
                {step.message}
                {(step.status === 'processing' || step.status === 'pending') && (
                  <AnimatedEllipsis />
                )}
              </span>
              {step.progress !== undefined && step.status === 'processing' && (
                <div className="flex-1 max-w-xs">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}