import React from 'react';
import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function ProcessingError({ message, onDismiss }: ProcessingErrorProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
            {onDismiss && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="inline-flex items-center px-3 py-2 border border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}