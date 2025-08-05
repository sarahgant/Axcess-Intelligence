/**
 * Research Feature - Public API
 * Tax research and legal document analysis functionality
 */

// Components
export { ResearchInterface } from './components/ResearchInterface';
export { ResearchResults } from './components/ResearchResults';
export { ResearchQuery } from './components/ResearchQuery';
export { TaxCodeLookup } from './components/TaxCodeLookup';

// Hooks
export { useResearch } from './hooks/useResearch';
export { useTaxCodes } from './hooks/useTaxCodes';
export { useResearchHistory } from './hooks/useResearchHistory';

// Services
export { ResearchService } from './services/ResearchService';
export { TaxCodeService } from './services/TaxCodeService';
export { LegalDocumentService } from './services/LegalDocumentService';

// Types
export type {
    ResearchQuery as ResearchQueryType,
    ResearchResult,
    TaxCode,
    LegalDocument,
    ResearchSession,
    ResearchSettings
} from './types';

// Store
export { useResearchStore } from './stores/researchStore';

// Constants
export { RESEARCH_CONSTANTS } from './constants';