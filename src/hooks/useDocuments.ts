/**
 * Custom hook for document management with session persistence
 * Following exact specifications for the Home.tsx chat interface
 */

import { useState, useEffect, useCallback } from 'react';
import { Document, DocumentType, DocumentValidationError, validateFile, formatFileSize, getFileType, MAX_DOCUMENTS, SESSION_TIMEOUT_HOURS } from '../types/document-upload';

const STORAGE_KEY = 'cch-documents';
const SESSION_KEY = 'cch-documents-session';

interface DocumentSession {
  documents: Document[];
  timestamp: number;
  expiresAt: number;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load documents from session storage on mount
  useEffect(() => {
    loadDocumentsFromSession();
  }, []);

  // Auto-save documents to session storage when they change
  useEffect(() => {
    if (documents.length > 0) {
      saveDocumentsToSession();
    }
  }, [documents]);

  // Session cleanup timer
  useEffect(() => {
    const checkSessionExpiry = () => {
      const sessionData = getSessionData();
      if (sessionData && Date.now() > sessionData.expiresAt) {
        clearDocuments();
      }
    };

    const interval = setInterval(checkSessionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getSessionData = (): DocumentSession | null => {
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const loadDocumentsFromSession = () => {
    const sessionData = getSessionData();
    
    if (sessionData && Date.now() < sessionData.expiresAt) {
      setDocuments(sessionData.documents);
    } else {
      // Session expired, clear storage
      sessionStorage.removeItem(SESSION_KEY);
      setDocuments([]);
    }
  };

  const saveDocumentsToSession = () => {
    const sessionData: DocumentSession = {
      documents,
      timestamp: Date.now(),
      expiresAt: Date.now() + (SESSION_TIMEOUT_HOURS * 60 * 60 * 1000)
    };
    
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save documents to session storage:', error);
    }
  };

  const addDocument = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Validate file
      const validationError = validateFile(file, documents);
      if (validationError) {
        reject(validationError);
        return;
      }

      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileType = getFileType(file.name);

      // Create document with uploading status
      const newDocument: Document = {
        id: documentId,
        name: file.name,
        type: fileType,
        size: formatFileSize(file.size),
        uploadProgress: 0,
        status: 'uploading',
        timestamp: Date.now()
      };

      setDocuments(prev => [...prev, newDocument]);

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress between 5-20%
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Complete upload
          setDocuments(prev => prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, uploadProgress: undefined, status: 'ready' as const }
              : doc
          ));
          
          resolve();
        } else {
          setDocuments(prev => prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, uploadProgress: Math.min(progress, 99) }
              : doc
          ));
        }
      }, 100 + Math.random() * 200); // Random interval 100-300ms

      // Cleanup interval if component unmounts
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 10000); // Max 10 seconds
    });
  }, [documents]);

  const removeDocument = useCallback((documentId: string) => {
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.id !== documentId);
      
      // If no documents left, clear session storage
      if (filtered.length === 0) {
        sessionStorage.removeItem(SESSION_KEY);
      }
      
      return filtered;
    });
  }, []);

  const markDocumentError = useCallback((documentId: string, errorMessage: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'error' as const, errorMessage, uploadProgress: undefined }
        : doc
    ));
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const getDocumentContext = useCallback((): string => {
    if (documents.length === 0) return '';
    
    const readyDocs = documents.filter(doc => doc.status === 'ready');
    if (readyDocs.length === 0) return '';
    
    return `Based on the following ${readyDocs.length} document(s): ${readyDocs.map(doc => doc.name).join(', ')}`;
  }, [documents]);

  // Session info
  const getSessionInfo = () => {
    const sessionData = getSessionData();
    if (!sessionData) {
      return { timeRemainingMs: 0, timeRemainingFormatted: '0 minutes' };
    }
    
    const timeRemainingMs = Math.max(0, sessionData.expiresAt - Date.now());
    const minutes = Math.ceil(timeRemainingMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let timeRemainingFormatted = '';
    if (hours > 0) {
      timeRemainingFormatted = `${hours}h ${remainingMinutes}m`;
    } else {
      timeRemainingFormatted = `${minutes}m`;
    }
    
    return { timeRemainingMs, timeRemainingFormatted };
  };

  return {
    documents,
    isLoading,
    addDocument,
    removeDocument,
    markDocumentError,
    clearDocuments,
    getDocumentContext,
    getSessionInfo,
    hasDocuments: documents.length > 0,
    readyDocuments: documents.filter(doc => doc.status === 'ready'),
    documentCount: documents.length
  };
};