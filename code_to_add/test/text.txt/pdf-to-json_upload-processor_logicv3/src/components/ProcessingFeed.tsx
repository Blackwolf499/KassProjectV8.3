import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, DollarSign } from 'lucide-react';

interface ProcessingFeedProps {
  isProcessing: boolean;
  members: Array<{
    id: string;
    name: string;
    revenue?: number;
  }>;
}

export const ProcessingFeed: React.FC<ProcessingFeedProps> = ({ isProcessing, members }) => {
  const maxRevenue = Math.max(...members.map(m => m.revenue || 0), 1);

  return (
    <div className="space-y-4">
      {members.length === 0 && !isProcessing ? (
        <div className="text-center py-8 text-gray-500">
          <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No members processed yet</p>
        </div>
      ) : (
        <AnimatePresence>
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">ID: {member.id}</p>
                </div>
                {member.revenue !== undefined && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-mono font-medium">
                      {member.revenue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {member.revenue !== undefined && (
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${(member.revenue / maxRevenue) * 100}%`,
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 text-blue-600 py-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm">Processing...</span>
        </div>
      )}
    </div>
  );
};