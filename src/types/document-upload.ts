/**
 * Document Upload System Types
 * Following exact specifications for the Home.tsx chat interface
 */

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  uploadProgress?: number; // 0-100, only during upload
  status: DocumentStatus;
  errorMessage?: string; // if status is error
  timestamp: number;
}

export type DocumentType = 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text' | 'photo';

export type DocumentStatus = 'uploading' | 'ready' | 'error';

export interface CCHDocument {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  client?: string;
  lastModified: string;
  selected?: boolean;
}

export interface DocumentValidationError {
  type: 'size' | 'type' | 'limit' | 'corrupt';
  message: string;
  file?: string;
}

// File type configurations
export const FILE_TYPE_CONFIG = {
  pdf: {
    extensions: ['.pdf'],
    icon: 'pdf',
    color: '#DC2626', // red
    maxSize: 20 * 1024 * 1024 // 20MB
  },
  excel: {
    extensions: ['.xlsx', '.xls', '.csv'],
    icon: 'excel',
    color: '#059669', // green
    maxSize: 20 * 1024 * 1024
  },
  word: {
    extensions: ['.docx', '.doc'],
    icon: 'word',
    color: '#2563EB', // blue
    maxSize: 20 * 1024 * 1024
  },
  powerpoint: {
    extensions: ['.pptx', '.ppt'],
    icon: 'powerpoint',
    color: '#EA580C', // orange
    maxSize: 20 * 1024 * 1024
  },
  text: {
    extensions: ['.txt', '.rtf'],
    icon: 'text',
    color: '#6B7280', // gray
    maxSize: 20 * 1024 * 1024
  },
  photo: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    icon: 'photo',
    color: '#7C3AED', // purple
    maxSize: 20 * 1024 * 1024
  }
} as const;

export const MAX_DOCUMENTS = 10;
export const SESSION_TIMEOUT_HOURS = 3;

// Helper functions
export const getFileType = (filename: string): DocumentType => {
  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIG)) {
    if (config.extensions.includes(extension)) {
      return type as DocumentType;
    }
  }
  
  return 'text'; // default fallback
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const validateFile = (file: File, existingDocs: Document[]): DocumentValidationError | null => {
  // Check file size
  const fileType = getFileType(file.name);
  const config = FILE_TYPE_CONFIG[fileType];
  
  if (file.size > config.maxSize) {
    return {
      type: 'size',
      message: `File size must be less than ${formatFileSize(config.maxSize)}`,
      file: file.name
    };
  }
  
  // Check document limit
  if (existingDocs.length >= MAX_DOCUMENTS) {
    return {
      type: 'limit',
      message: `Maximum ${MAX_DOCUMENTS} documents allowed`,
      file: file.name
    };
  }
  
  return null;
};