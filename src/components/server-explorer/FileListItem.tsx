import React from 'react';
import { DocumentIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TempFileStore } from '../../lib/storage';
import type { StoredFile } from '../../lib/storage';

interface FileListItemProps {
  file: StoredFile;
}

export function FileListItem({ file }: FileListItemProps) {
  const timeLeft = getTimeLeft(file.expiresAt);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="p-3 hover:bg-gray-50 group">
      <div className="flex items-start space-x-3">
        <DocumentIcon className="h-5 w-5 text-gray-400 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.originalName}
          </p>
          <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
            <span>{formatSize(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>
          <div className="mt-1 flex items-center text-xs">
            <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
            <span className={`${
              timeLeft.hours < 1 ? 'text-red-500' : 
              timeLeft.hours < 4 ? 'text-yellow-500' : 
              'text-gray-500'
            }`}>
              Expires in {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
          onClick={() => {
            const fileStore = TempFileStore.getInstance();
            fileStore.deleteFile(file.id);
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface TimeLeft {
  hours: number;
  minutes: number;
}

function getTimeLeft(expiresAt: Date): TimeLeft {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

function formatTimeLeft(timeLeft: TimeLeft): string {
  if (timeLeft.hours < 1) {
    return `${timeLeft.minutes}m`;
  }
  if (timeLeft.hours < 24) {
    return `${timeLeft.hours}h ${timeLeft.minutes}m`;
  }
  return `${Math.floor(timeLeft.hours / 24)}d ${timeLeft.hours % 24}h`;
}