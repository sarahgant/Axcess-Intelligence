/**
 * Document Upload System Components
 * Export all components for easy importing
 */

export { DocumentUploadModal } from './DocumentUploadModal';
export { CCHSearchModal } from './CCHSearchModal';
export { DocumentContextBar } from './DocumentContextBar';
export { PlusButtonDropdown } from './PlusButtonDropdown';

// Re-export types and hooks for convenience
export type { Document, CCHDocument, DocumentType, DocumentStatus, DocumentValidationError } from '../../types/document-upload';
export { useDocuments } from '../../hooks/useDocuments';