import React from 'react';
import { Document } from '../lib/documents';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface DocumentListProps {
  documents: Document[];
  onSelect: (document: Document) => void;
}

export function DocumentList({ documents, onSelect }: DocumentListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h2>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(doc)}
          >
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-500" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                <p className="text-xs text-gray-500">
                  {doc.createdAt.toLocaleDateString()} at{' '}
                  {doc.createdAt.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}