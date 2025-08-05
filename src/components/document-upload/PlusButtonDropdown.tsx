/**
 * Plus Button Dropdown Component
 * Dropdown menu for document upload and search options
 * Follows exact specifications from user requirements
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PlusButtonDropdownProps {
  onUploadClick: () => void;
  onSearchCCHClick: () => void;
  className?: string;
}

export const PlusButtonDropdown: React.FC<PlusButtonDropdownProps> = ({
  onUploadClick,
  onSearchCCHClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleUploadClick = useCallback(() => {
    onUploadClick();
    closeDropdown();
  }, [onUploadClick, closeDropdown]);

  const handleSearchClick = useCallback(() => {
    onSearchCCHClick();
    closeDropdown();
  }, [onSearchCCHClick, closeDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeDropdown]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeDropdown]);

  return (
    <div className={`relative ${className}`}>
      {/* Plus Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`
          inline-flex items-center justify-center w-10 h-10 p-3 rounded transition-all duration-150
          ${isOpen 
            ? 'bg-gray-100 text-[#353535]' 
            : 'text-[#353535] hover:bg-gray-50'
          }
          focus:outline-none focus:ring-2 focus:ring-[#005B92] focus:ring-offset-1
        `}
        aria-label="Document options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <img 
          src="/src/styles/WK Icons/plus-circle.png"
          alt=""
          className="w-4 h-4"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 mb-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 min-w-[220px] animate-in slide-in-from-bottom-1 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Upload from Computer */}
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-[#374151] hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 rounded-t-lg"
            role="menuitem"
            tabIndex={0}
          >
            <img 
              src="/src/styles/WK Icons/attach.png"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span>Upload from Computer</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-[#E5E7EB] mx-2" />

          {/* Search CCH Documents */}
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-[#374151] hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 rounded-b-lg"
            role="menuitem"
            tabIndex={0}
          >
            <img 
              src="/src/styles/WK Icons/search.png"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span>Search CCH Documents</span>
          </button>
        </div>
      )}

      {/* Dropdown animation handled by Tailwind classes */}
    </div>
  );
};