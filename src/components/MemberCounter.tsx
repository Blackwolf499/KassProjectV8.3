import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberCounterProps {
  count: number;
  maxDisplay?: number;
}

export function MemberCounter({ count, maxDisplay = 20 }: MemberCounterProps) {
  const displayCount = Math.min(count, maxDisplay);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Members Detected</h3>
        <span className="text-lg font-semibold text-blue-600">{count}</span>
      </div>
      
      <div className="relative h-12 overflow-hidden">
        <AnimatePresence>
          {Array.from({ length: displayCount }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                left: `${(index % 10) * 20}px`,
                top: `${Math.floor(index / 10) * 20}px`
              }}
            >
              <UserIcon 
                className="h-4 w-4 text-blue-500" 
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {count > maxDisplay && (
          <div className="absolute right-0 bottom-0 text-sm text-gray-500">
            +{count - maxDisplay} more
          </div>
        )}
      </div>
    </div>
  );
}