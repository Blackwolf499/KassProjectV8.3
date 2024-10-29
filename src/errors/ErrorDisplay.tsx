import React from 'react';
import { XCircle, AlertTriangle, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { ErrorSeverity } from './types';

interface ErrorDisplayProps {
  message: string;
  severity?: ErrorSeverity;
  details?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message,
  severity = 'error',
  details,
  onDismiss,
  onRetry
}: ErrorDisplayProps) {
  const colors = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-700',
      icon: 'text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      text: 'text-yellow-700',
      icon: 'text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      icon: 'text-blue-400'
    }
  };

  const color = colors[severity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed bottom-4 right-4 w-96 rounded-lg shadow-lg border ${color.bg} ${color.border} z-50`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {severity === 'error' ? (
                <XCircle className={`h-5 w-5 ${color.icon}`} />
              ) : (
                <AlertTriangle className={`h-5 w-5 ${color.icon}`} />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${color.text}`}>{message}</p>
              
              {details && (
                <div className="mt-2">
                  <pre className={`text-xs ${color.bg} p-2 rounded overflow-x-auto`}>
                    {details}
                  </pre>
                </div>
              )}

              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`mt-2 text-sm ${color.text} hover:underline`}
                >
                  Try Again
                </button>
              )}
            </div>
            {onDismiss && (
              <button
                className={`ml-4 flex-shrink-0 ${color.text} hover:opacity-75`}
                onClick={onDismiss}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}