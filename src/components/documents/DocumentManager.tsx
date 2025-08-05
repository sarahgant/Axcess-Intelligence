import * as React from "react";
import { cn } from "../../lib/utils";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentContext } from "./DocumentContext";
import { CCHDocumentSearch } from "./CCHDocumentSearch";
import { DocumentService } from "../../services/documents/DocumentService";
import { Document, CCHDocument, DocumentValidationError } from "../../types/documents";
import { sessionManager } from "../../utils/sessionManager";

interface DocumentManagerProps {
  onDocumentContextChange?: (context: string) => void;
  className?: string;
  showUpload?: boolean;
  showContext?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  onDocumentContextChange,
  className,
  showUpload = true,
  showContext = true,
}) => {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [showCCHSearch, setShowCCHSearch] = React.useState(false);
  const [showUploadArea, setShowUploadArea] = React.useState(false);
  const [contextCollapsed, setContextCollapsed] = React.useState(false);
  const [errors, setErrors] = React.useState<DocumentValidationError[]>([]);
  const [sessionWarning, setSessionWarning] = React.useState<string | null>(null);
  
  const documentService = React.useRef(new DocumentService()).current;

  // Initialize documents and session management
  React.useEffect(() => {
    const initialDocs = documentService.getSessionDocuments();
    setDocuments(initialDocs);
    updateDocumentContext(initialDocs);

    // Setup session expiration handling
    const removeExpirationListener = sessionManager.onExpiration(() => {
      setSessionWarning("Your session has expired. Documents have been cleared for security.");
      setDocuments([]);
      documentService.clearAllDocuments();
      updateDocumentContext([]);
    });

    const removeWarningListener = sessionManager.onWarning((minutesRemaining) => {
      if (minutesRemaining <= 5) {
        setSessionWarning(`Session expires in ${minutesRemaining} minutes. Documents will be cleared automatically.`);
      } else {
        setSessionWarning(`Session expires in ${minutesRemaining} minutes.`);
      }
    });

    return () => {
      removeExpirationListener();
      removeWarningListener();
    };
  }, []);

  // Update document context when documents change
  const updateDocumentContext = React.useCallback((docs: Document[]) => {
    if (onDocumentContextChange) {
      const context = docs.length > 0 ? documentService.getDocumentContext() : "";
      onDocumentContextChange(context);
    }
  }, [onDocumentContextChange, documentService]);

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    try {
      const uploadedDocs = await documentService.uploadFiles(files);
      const updatedDocs = documentService.getSessionDocuments();
      setDocuments(updatedDocs);
      updateDocumentContext(updatedDocs);
      
      // Clear any previous errors
      setErrors([]);
      
      // Auto-collapse upload area if documents were added
      if (uploadedDocs.length > 0) {
        setShowUploadArea(false);
      }
    } catch (error) {
      handleError({
        type: 'corrupt',
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  // Handle document removal
  const handleRemoveDocument = (documentId: string) => {
    documentService.removeDocument(documentId);
    const updatedDocs = documentService.getSessionDocuments();
    setDocuments(updatedDocs);
    updateDocumentContext(updatedDocs);
  };

  // Handle CCH document addition
  const handleAddCCHDocuments = async (cchDocuments: CCHDocument[]) => {
    try {
      await documentService.addCCHDocuments(cchDocuments);
      const updatedDocs = documentService.getSessionDocuments();
      setDocuments(updatedDocs);
      updateDocumentContext(updatedDocs);
    } catch (error) {
      handleError({
        type: 'corrupt',
        message: error instanceof Error ? error.message : 'Failed to add CCH documents'
      });
    }
  };

  // Handle errors
  const handleError = (error: DocumentValidationError) => {
    setErrors(prev => [...prev, error]);
    // Clear errors after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e !== error));
    }, 5000);
  };

  // Clear session warning
  const clearSessionWarning = () => {
    setSessionWarning(null);
  };

  // Toggle upload area
  const toggleUploadArea = () => {
    setShowUploadArea(!showUploadArea);
  };

  const hasDocuments = documents.length > 0;
  const sessionInfo = sessionManager.getSessionInfo();

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Session Warning */}
      {sessionWarning && (
        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-orange-600">⚠️</span>
            <span className="text-sm text-orange-700">{sessionWarning}</span>
          </div>
          <button
            onClick={clearSessionWarning}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            ✕
          </button>
        </div>
      )}

      {/* Document Context Panel */}
      {showContext && hasDocuments && (
        <DocumentContext
          documents={documents}
          onRemoveDocument={handleRemoveDocument}
          onUploadMore={toggleUploadArea}
          onSearchCCH={() => setShowCCHSearch(true)}
          collapsed={contextCollapsed}
          onToggleCollapse={() => setContextCollapsed(!contextCollapsed)}
        />
      )}

      {/* Upload Area */}
      {showUpload && (showUploadArea || !hasDocuments) && (
        <div className="space-y-2">
          {hasDocuments && (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#353535]">Upload More Documents</h3>
              <button
                onClick={() => setShowUploadArea(false)}
                className="text-[#757575] hover:text-[#353535] text-sm"
              >
                ✕
              </button>
            </div>
          )}
          <DocumentUpload
            onFileUpload={handleFileUpload}
            onError={handleError}
            existingDocuments={documents}
          />
        </div>
      )}

      {/* Upload Button (when collapsed) */}
      {showUpload && hasDocuments && !showUploadArea && (
        <div className="flex items-center justify-center">
          <button
            onClick={toggleUploadArea}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#005B92] border border-[#005B92] rounded-md hover:bg-blue-50 transition-colors"
          >
            <span>📎</span>
            Add Documents
          </button>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div className="flex-1">
                  <p className="font-medium">
                    {error.type === 'size' && 'File too large'}
                    {error.type === 'type' && 'Unsupported file type'}
                    {error.type === 'limit' && 'Document limit reached'}
                    {error.type === 'corrupt' && 'Upload failed'}
                  </p>
                  <p>{error.message}</p>
                  {error.file && <p className="text-xs mt-1">File: {error.file}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Info */}
      {hasDocuments && sessionInfo.timeRemainingMs > 0 && (
        <div className="text-xs text-[#757575] text-center">
          Session expires in {sessionInfo.timeRemainingFormatted} • 
          Documents will be automatically cleared for security
        </div>
      )}

      {/* CCH Document Search Modal */}
      <CCHDocumentSearch
        open={showCCHSearch}
        onOpenChange={setShowCCHSearch}
        onAddDocuments={handleAddCCHDocuments}
        onSearch={documentService.searchCCHDocuments.bind(documentService)}
      />
    </div>
  );
};