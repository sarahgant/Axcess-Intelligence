/**
 * Document Context Bar Component
 * Displays document pills with remove functionality
 * Follows exact specifications from user requirements
 */

import React, { useCallback } from 'react';
import { Document, FILE_TYPE_CONFIG, MAX_DOCUMENTS } from '../../types/document-upload';

interface DocumentContextBarProps {
  documents: Document[];
  onRemoveDocument: (documentId: string) => void;
  className?: string;
}

export const DocumentContextBar: React.FC<DocumentContextBarProps> = ({
  documents,
  onRemoveDocument,
  className = ''
}) => {
  const getFileIcon = useCallback((type: string) => {
    const iconMap = {
      pdf: 'pdf.png',
      excel: 'excel.png',
      word: 'word.png',
      powerpoint: 'powerpoint.png',
      text: 'text.png',
      photo: 'photo.png'
    };
    return iconMap[type as keyof typeof iconMap] || 'text.png';
  }, []);

  const getFileIconColor = useCallback((type: string) => {
    const colorMap = {
      pdf: 'brightness(0) saturate(100%) invert(13%) sepia(93%) saturate(6188%) hue-rotate(357deg) brightness(97%) contrast(118%)', // #DC2626 red
      excel: 'brightness(0) saturate(100%) invert(35%) sepia(79%) saturate(2476%) hue-rotate(90deg) brightness(96%) contrast(106%)', // #16A34A green
      word: 'brightness(0) saturate(100%) invert(26%) sepia(84%) saturate(2827%) hue-rotate(206deg) brightness(97%) contrast(98%)', // #2563EB blue
      powerpoint: 'brightness(0) saturate(100%) invert(55%) sepia(61%) saturate(5837%) hue-rotate(14deg) brightness(103%) contrast(104%)', // #EA580C orange
      text: 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)', // #6B7280 gray
      photo: 'brightness(0) saturate(100%) invert(55%) sepia(93%) saturate(4746%) hue-rotate(35deg) brightness(93%) contrast(107%)' // #EAB308 yellow
    };
    return colorMap[type as keyof typeof colorMap] || 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)';
  }, []);

  const handleRemoveDocument = useCallback((documentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onRemoveDocument(documentId);
  }, [onRemoveDocument]);

  const handleKeyDown = useCallback((documentId: string, event: React.KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onRemoveDocument(documentId);
    }
  }, [onRemoveDocument]);

  // Don't render if no documents
  if (documents.length === 0) {
    return null;
  }

  const readyDocuments = documents.filter(doc => doc.status === 'ready');
  const uploadingDocuments = documents.filter(doc => doc.status === 'uploading');
  const errorDocuments = documents.filter(doc => doc.status === 'error');

  return (
    <div 
      className={`
        bg-gray-50 border border-[#E5E7EB] rounded-lg p-3 mb-3 max-h-[88px] overflow-y-auto
        transition-all duration-200 ease-out
        ${className}
      `}
      style={{
        animation: 'slideDown 200ms ease-out'
      }}
      role="region"
      aria-label="Document context"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-medium text-[#6B7280]">
          Document Context
        </h3>
        <span className="text-xs text-[#9CA3AF]">
          {documents.length}/{MAX_DOCUMENTS} documents
        </span>
      </div>

      {/* Document Pills */}
      <div className="flex flex-wrap gap-2">
        {/* Ready Documents */}
        {readyDocuments.map((doc) => (
          <div
            key={doc.id}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full h-8 px-2 pr-3 group hover:shadow-sm transition-all duration-150"
            role="button"
            tabIndex={0}
            aria-label={`Document: ${doc.name}. Press Delete to remove.`}
            onKeyDown={(e) => handleKeyDown(doc.id, e)}
          >
            {/* File Icon */}
            <div className="flex-shrink-0">
              <img 
                src={`/src/styles/WK Icons/${getFileIcon(doc.type)}`}
                alt=""
                className="w-4 h-4"
                style={{ filter: getFileIconColor(doc.type) }}
              />
            </div>

            {/* Filename */}
            <span className="text-[13px] text-[#374151] max-w-[150px] truncate">
              {doc.name}
            </span>

            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveDocument(doc.id, e)}
              className="ml-2 text-[#D1D5DB] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-150 text-sm leading-none"
              aria-label={`Remove ${doc.name}`}
              title="Remove document"
            >
              ×
            </button>
          </div>
        ))}

        {/* Uploading Documents */}
        {uploadingDocuments.map((doc) => (
          <div
            key={doc.id}
            className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full h-8 px-2 pr-3"
            aria-label={`Uploading: ${doc.name}`}
          >
            {/* Spinner Icon */}
            <div className="flex-shrink-0 animate-spin">
              <img 
                src="/src/styles/WK Icons/spinner-alt.png"
                alt=""
                className="w-4 h-4"
              />
            </div>

            {/* Uploading Text */}
            <span className="text-[13px] text-blue-700">
              Uploading {doc.name.length > 15 ? `${doc.name.substring(0, 15)}...` : doc.name}
            </span>

            {/* Progress Bar */}
            {doc.uploadProgress !== undefined && (
              <div className="w-full bg-blue-200 rounded-full h-0.5 mt-1">
                <div
                  className="bg-blue-500 h-0.5 rounded-full transition-all duration-300"
                  style={{ width: `${doc.uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Error Documents */}
        {errorDocuments.map((doc) => (
          <div
            key={doc.id}
            className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full h-8 px-2 pr-3 group"
            role="button"
            tabIndex={0}
            aria-label={`Error: ${doc.name}. ${doc.errorMessage}. Press Delete to remove.`}
            onKeyDown={(e) => handleKeyDown(doc.id, e)}
          >
            {/* Error Icon */}
            <div className="flex-shrink-0 text-red-500 text-sm">
              ⚠
            </div>

            {/* Error Text */}
            <span className="text-[13px] text-red-700 max-w-[120px] truncate">
              Failed: {doc.name.length > 10 ? `${doc.name.substring(0, 10)}...` : doc.name}
            </span>

            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveDocument(doc.id, e)}
              className="ml-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-150 text-sm leading-none"
              aria-label={`Remove ${doc.name}`}
              title="Remove failed document"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            max-height: 88px;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};