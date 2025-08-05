/**
 * Documents Feature Types
 */

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    size: number;
    status: DocumentStatus;
    content?: string;
    metadata: DocumentMetadata;
    processingResult?: ProcessingResult;
    uploadedAt: number;
    processedAt?: number;
}

export type DocumentType =
    | 'pdf'
    | 'docx'
    | 'txt'
    | 'xlsx'
    | 'csv'
    | 'image'
    | 'unknown';

export type DocumentStatus =
    | 'uploading'
    | 'uploaded'
    | 'processing'
    | 'processed'
    | 'error'
    | 'expired';

export interface DocumentMetadata {
    originalName: string;
    mimeType: string;
    encoding?: string;
    pages?: number;
    author?: string;
    createdDate?: number;
    modifiedDate?: number;
    extractedText?: string;
    language?: string;
}

export interface ProcessingResult {
    success: boolean;
    extractedText?: string;
    summary?: string;
    keyTopics?: string[];
    entities?: DocumentEntity[];
    error?: string;
    processingTime: number;
}

export interface DocumentEntity {
    type: 'person' | 'organization' | 'location' | 'date' | 'amount' | 'tax_code';
    value: string;
    confidence: number;
    position: {
        start: number;
        end: number;
    };
}

export interface UploadProgress {
    documentId: string;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
}

export interface DocumentSearchParams {
    query?: string;
    type?: DocumentType;
    status?: DocumentStatus;
    dateRange?: {
        start: number;
        end: number;
    };
    tags?: string[];
}

export interface DocumentUploadOptions {
    maxSize?: number;
    allowedTypes?: DocumentType[];
    autoProcess?: boolean;
    extractText?: boolean;
    generateSummary?: boolean;
}