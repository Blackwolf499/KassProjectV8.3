import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { ValidationResult } from '../types';

interface ValidationStatusProps {
  validation: ValidationResult;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ validation }) => {
  const { isValid, errors, warnings, verifiedFields } = validation;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center space-x-2">
        {isValid ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className={`font-medium ${isValid ? 'text-green-700' : 'text-red-700'}`}>
          Data Validation Status
        </span>
      </div>

      <div className="space-y-2">
        {errors.length > 0 && (
          <div className="bg-red-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-1">Validation Errors</h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Warnings</h4>
            <ul className="text-sm text-yellow-700 list-disc list-inside">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Verified Fields</h4>
          <div className="grid grid-cols-2 gap-2">
            {verifiedFields.map((field, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{field.name}</span>
                <span className="text-gray-500">
                  (Page {field.location.page})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};