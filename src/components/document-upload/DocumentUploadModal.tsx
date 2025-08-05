/**
 * Document Upload Modal Component
 * Follows exact specifications from user requirements
 */

import React, { useState, useRef, useCallback } from 'react';
import { Document, DocumentValidationError, validateFile } from '../../types/document-upload';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => Promise<void>;
  existingDocuments: Document[];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  existingDocuments
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file
    const validationError = validateFile(file, existingDocuments);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setIsUploading(true);
    try {
      await onFileUpload(file);
      onClose(); // Close modal on successful upload
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setError((error as DocumentValidationError).message);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, existingDocuments, onClose]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (isUploading) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect, isUploading]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragOver(true);
    }
  }, [isUploading]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // Only set isDragOver to false if we're leaving the drag zone entirely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const openFileDialog = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isUploading) {
      onClose();
    }
  }, [onClose, isUploading]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !isUploading) {
      onClose();
    }
  }, [onClose, isUploading]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 w-[480px] max-h-[600px] transform transition-all duration-200 ease-out"
        style={{
          animation: isOpen ? 'modalEnter 200ms ease-out' : 'modalExit 200ms ease-in'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <img 
            src="/src/styles/WK Icons/attach.png" 
            alt=""
            className="w-5 h-5"
            style={{ filter: 'grayscale(100%) brightness(0) sepia(1) hue-rotate(0deg) saturate(1) opacity(0.7)' }}
          />
          <h2 id="upload-modal-title" className="text-lg font-semibold text-[#353535]">
            Upload Documents
          </h2>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            relative min-h-[200px] p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-150
            ${isDragOver 
              ? 'border-[#3B82F6] bg-blue-50' 
              : 'border-[#D1D5DB] bg-gray-50 hover:border-[#9CA3AF] hover:bg-gray-100'
            }
            ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
          `}
          role="button"
          tabIndex={isUploading ? -1 : 0}
          aria-label="Click to upload or drag and drop files"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
              e.preventDefault();
              openFileDialog();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.txt,.rtf,.jpg,.jpeg,.png,.gif,.bmp"
            onChange={handleFileInput}
            className="sr-only"
            disabled={isUploading}
            aria-label="Upload document file"
          />

          {/* Zone Content */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Upload Cloud Icon */}
            <div className="w-12 h-12 text-[#9CA3AF]">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                <path d="M12,11L16,15H13.5V19H10.5V15H8L12,11Z" />
              </svg>
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <p className="text-base text-[#6B7280]">
                {isUploading ? 'Uploading...' : 'Drag and drop files here'}
              </p>
              {!isUploading && (
                <>
                  <p className="text-sm text-[#9CA3AF]">or</p>
                  <button 
                    type="button"
                    className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#374151] hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                  >
                    Browse Files
                  </button>
                </>
              )}
            </div>

            {/* Help Text */}
            <p className="text-xs text-[#9CA3AF] max-w-sm">
              PDF, DOCX, XLSX, and more • Max 20MB • Up to 10 files
            </p>
          </div>

          {/* Loading Spinner Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
              <div className="flex items-center gap-3 text-[#374151]">
                <div className="w-5 h-5 animate-spin">
                  <img 
                    src="/src/styles/WK Icons/spinner-alt.png" 
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#374141] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Cancel'}
          </button>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(4px);
          }
        }
      `}</style>
    </div>
  );
};