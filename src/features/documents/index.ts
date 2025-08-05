/**
 * Documents Feature - Public API
 * Document upload, processing, and management functionality
 */

// Components
export { DocumentUpload } from './components/DocumentUpload';
export { DocumentList } from './components/DocumentList';
export { DocumentViewer } from './components/DocumentViewer';
export { DocumentProcessor } from './components/DocumentProcessor';
export { DocumentManager } from './components/DocumentManager';

// Hooks
export { useDocuments } from './hooks/useDocuments';
export { useDocumentUpload } from './hooks/useDocumentUpload';
export { useDocumentProcessor } from './hooks/useDocumentProcessor';

// Services
export { DocumentService } from './services/DocumentService';
export { DocumentProcessorService } from './services/DocumentProcessorService';
export { DocumentStorageService } from './services/DocumentStorageService';

// Types
export type {
    Document,
    DocumentType,
    DocumentStatus,
    ProcessingResult,
    UploadProgress,
    DocumentMetadata
} from './types';

// Store
export { useDocumentStore } from './stores/documentStore';

// Constants
export { DOCUMENT_CONSTANTS } from './constants';