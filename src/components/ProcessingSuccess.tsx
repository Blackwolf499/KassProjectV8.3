import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ProcessingSuccessProps {
  fileName: string;
  stats?: {
    totalMembers?: number;
    totalRevenue?: number;
    processingTime?: number;
  };
  onDismiss?: () => void;
  autoDismissTime?: number;
}

export function ProcessingSuccess({ 
  fileName, 
  stats, 
  onDismiss,
  autoDismissTime = 5000 
}: ProcessingSuccessProps) {
  useEffect(() => {
    if (onDismiss && autoDismissTime > 0) {
      const timer = setTimeout(onDismiss, autoDismissTime);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, autoDismissTime]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-green-100 z-50"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-green-800">
                Successfully processed {fileName}
              </p>
              
              {stats && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {stats.totalMembers !== undefined && (
                    <div className="flex items-center text-sm text-green-700">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      <span>{stats.totalMembers} members</span>
                    </div>
                  )}
                  {stats.totalRevenue !== undefined && (
                    <div className="flex items-center text-sm text-green-700">
                      <ChartBarIcon className="h-4 w-4 mr-1" />
                      <span>${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  )}
                  {stats.processingTime !== undefined && (
                    <div className="col-span-2 text-xs text-green-600">
                      Processed in {(stats.processingTime / 1000).toFixed(1)}s
                    </div>
                  )}
                </div>
              )}
            </div>
            {onDismiss && (
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  onClick={onDismiss}
                >
                  <span className="sr-only">Close</span>
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {autoDismissTime > 0 && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: autoDismissTime / 1000 }}
            className="h-1 bg-green-500 rounded-b-lg"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}