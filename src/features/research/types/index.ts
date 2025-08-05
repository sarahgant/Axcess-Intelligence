/**
 * Research Feature Types
 */

export interface ResearchQuery {
  id: string;
  query: string;
  type: ResearchType;
  filters: ResearchFilters;
  timestamp: number;
}

export type ResearchType = 
  | 'tax_code'
  | 'legal_document'
  | 'regulation'
  | 'case_law'
  | 'general';

export interface ResearchFilters {
  jurisdiction?: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  documentTypes?: string[];
  relevanceThreshold?: number;
}

export interface ResearchResult {
  id: string;
  title: string;
  content: string;
  type: 'tax_code' | 'regulation' | 'case_law' | 'guidance';
  source: string;
  url?: string;
  relevanceScore: number;
  summary: string;
  keyPoints: string[];
  citations: Citation[];
  lastUpdated: number;
}

export interface Citation {
  id: string;
  title: string;
  source: string;
  url?: string;
  type: 'primary' | 'secondary' | 'supporting';
}

export interface TaxCode {
  code: string;
  title: string;
  description: string;
  section: string;
  subsection?: string;
  jurisdiction: string;
  effectiveDate: number;
  lastModified: number;
  relatedCodes: string[];
  annotations: TaxCodeAnnotation[];
}

export interface TaxCodeAnnotation {
  type: 'explanation' | 'example' | 'exception' | 'cross_reference';
  content: string;
  author?: string;
  date: number;
}

export interface LegalDocument {
  id: string;
  title: string;
  type: 'statute' | 'regulation' | 'ruling' | 'guidance' | 'case';
  content: string;
  summary: string;
  jurisdiction: string;
  court?: string;
  date: number;
  citations: Citation[];
  keywords: string[];
  status: 'active' | 'superseded' | 'pending';
}

export interface ResearchSession {
  id: string;
  title: string;
  queries: ResearchQuery[];
  results: ResearchResult[];
  notes: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface ResearchSettings {
  defaultJurisdiction: string[];
  maxResults: number;
  enableAISummary: boolean;
  relevanceThreshold: number;
  preferredSources: string[];
}