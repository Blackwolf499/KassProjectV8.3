import React from 'react';
import { motion } from 'framer-motion';
import { FileListItem } from './FileListItem';
import type { StoredFile } from '../../lib/storage';

interface FileListProps {
  files: StoredFile[];
}

export function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
        <p>No files stored on server</p>
        <p className="text-sm mt-2">Upload files to see them here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {files.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <FileListItem file={file} />
        </motion.div>
      ))}
    </div>
  );
}