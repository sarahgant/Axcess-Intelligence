/**
 * CCH Document Search Modal Component
 * Follows exact specifications from user requirements
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CCHDocument } from '../../types/document-upload';

interface CCHSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocuments: (documents: CCHDocument[]) => void;
}

// Mock CCH documents for demonstration
const MOCK_CCH_DOCUMENTS: CCHDocument[] = [
  {
    id: 'cch_1',
    name: 'IRS Publication 463 - Travel Entertainment',
    type: 'pdf',
    size: '2.1 MB',
    client: 'Internal Revenue Service',
    lastModified: '2024-01-15'
  },
  {
    id: 'cch_2', 
    name: 'Form 1040 Instructions 2024',
    type: 'pdf',
    size: '15.3 MB',
    client: 'IRS Forms',
    lastModified: '2024-01-10'
  },
  {
    id: 'cch_3',
    name: 'Business Expense Guidelines',
    type: 'word',
    size: '890 KB',
    client: 'CCH Tax Research',
    lastModified: '2024-01-20'
  },
  {
    id: 'cch_4',
    name: 'Depreciation Tables 2024',
    type: 'excel',
    size: '1.2 MB',
    client: 'Tax Reference',
    lastModified: '2024-01-12'
  },
  {
    id: 'cch_5',
    name: 'Section 199A Deduction Guide',
    type: 'pdf',
    size: '3.4 MB',
    client: 'CCH AnswerConnect',
    lastModified: '2024-01-18'
  }
];

export const CCHSearchModal: React.FC<CCHSearchModalProps> = ({
  isOpen,
  onClose,
  onAddDocuments
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [filteredDocuments, setFilteredDocuments] = useState<CCHDocument[]>(MOCK_CCH_DOCUMENTS);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter documents based on search query with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredDocuments(MOCK_CCH_DOCUMENTS);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = MOCK_CCH_DOCUMENTS.filter(doc =>
          doc.name.toLowerCase().includes(query) ||
          doc.client?.toLowerCase().includes(query) ||
          doc.type.toLowerCase().includes(query)
        );
        setFilteredDocuments(filtered);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleDocumentToggle = useCallback((documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  }, []);

  const handleAddSelected = useCallback(() => {
    const documentsToAdd = filteredDocuments.filter(doc => 
      selectedDocuments.has(doc.id)
    );
    
    if (documentsToAdd.length > 0) {
      onAddDocuments(documentsToAdd);
      setSelectedDocuments(new Set());
      setSearchQuery('');
      onClose();
    }
  }, [filteredDocuments, selectedDocuments, onAddDocuments, onClose]);

  const handleCancel = useCallback(() => {
    setSelectedDocuments(new Set());
    setSearchQuery('');
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }, [handleCancel]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel();
    }
  }, [handleCancel]);

  const getFileIcon = (type: string) => {
    const iconMap = {
      pdf: 'pdf.png',
      word: 'word.png', 
      excel: 'excel.png',
      powerpoint: 'powerpoint.png',
      text: 'text.png',
      photo: 'photo.png'
    };
    return iconMap[type as keyof typeof iconMap] || 'text.png';
  };

  const getFileIconColor = (type: string) => {
    const colorMap = {
      pdf: 'brightness(0) saturate(100%) invert(13%) sepia(93%) saturate(6188%) hue-rotate(357deg) brightness(97%) contrast(118%)', // #DC2626 red
      excel: 'brightness(0) saturate(100%) invert(35%) sepia(79%) saturate(2476%) hue-rotate(90deg) brightness(96%) contrast(106%)', // #16A34A green
      word: 'brightness(0) saturate(100%) invert(26%) sepia(84%) saturate(2827%) hue-rotate(206deg) brightness(97%) contrast(98%)', // #2563EB blue
      powerpoint: 'brightness(0) saturate(100%) invert(55%) sepia(61%) saturate(5837%) hue-rotate(14deg) brightness(103%) contrast(104%)', // #EA580C orange
      text: 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)', // #6B7280 gray
      photo: 'brightness(0) saturate(100%) invert(55%) sepia(93%) saturate(4746%) hue-rotate(35deg) brightness(93%) contrast(107%)' // #EAB308 yellow
    };
    return colorMap[type as keyof typeof colorMap] || 'brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(478%) hue-rotate(199deg) brightness(98%) contrast(86%)';
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cch-search-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 w-[600px] max-h-[600px] transform transition-all duration-200 ease-out animate-in zoom-in-95 slide-in-from-bottom-1"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <img 
            src="/src/styles/WK Icons/search.png" 
            alt=""
            className="w-5 h-5"
            style={{ filter: 'grayscale(100%) brightness(0) sepia(1) hue-rotate(0deg) saturate(1) opacity(0.7)' }}
          />
          <h2 id="cch-search-modal-title" className="text-lg font-semibold text-[#353535]">
            Search CCH Documents
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, client, or document type..."
            className="w-full px-4 py-3 pr-12 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            aria-label="Search CCH documents"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <img 
              src="/src/styles/WK Icons/search.png" 
              alt=""
              className="w-4 h-4 opacity-40"
            />
          </div>
        </div>

        {/* Document Sections */}
        <div className="space-y-4">
          {/* Recent Documents Header */}
          <h3 className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium">
            RECENT DOCUMENTS
          </h3>

          {/* Document List */}
          <div className="border border-[#E5E7EB] rounded-lg max-h-[180px] overflow-y-auto">
            {filteredDocuments.length === 0 ? (
              <div className="p-4 text-center text-[#6B7280] text-sm">
                No documents found matching "{searchQuery}"
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                    flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors
                    ${selectedDocuments.has(doc.id) ? 'bg-blue-50 border-l-2 border-l-[#3B82F6]' : ''}
                    ${filteredDocuments.indexOf(doc) !== filteredDocuments.length - 1 ? 'border-b border-[#E5E7EB]' : ''}
                  `}
                  onClick={() => handleDocumentToggle(doc.id)}
                  role="checkbox"
                  aria-checked={selectedDocuments.has(doc.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDocumentToggle(doc.id);
                    }
                  }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(doc.id)}
                    onChange={() => handleDocumentToggle(doc.id)}
                    className="w-4 h-4 text-[#3B82F6] border-[#D1D5DB] rounded focus:ring-[#3B82F6]"
                    aria-label={`Select ${doc.name}`}
                  />

                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    <img 
                      src={`/src/styles/WK Icons/${getFileIcon(doc.type)}`}
                      alt=""
                      className="w-4 h-4"
                      style={{ filter: getFileIconColor(doc.type) }}
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#374151] truncate">{doc.name}</p>
                    <p className="text-xs text-[#6B7280]">
                      {doc.client} • {doc.lastModified}
                    </p>
                  </div>

                  {/* File Size */}
                  <div className="text-xs text-[#9CA3AF] flex-shrink-0">
                    {doc.size}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB]">
          {/* Selected Count */}
          <p className="text-sm text-[#6B7280]">
            <span className="font-medium">{selectedDocuments.size}</span> document{selectedDocuments.size !== 1 ? 's' : ''} selected
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#374141] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedDocuments.size === 0}
              className="px-4 py-2 text-sm bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed transition-colors"
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>

      {/* Modal animation handled by Tailwind classes */}
    </div>
  );
};