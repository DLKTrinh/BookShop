import React, { useState } from "react";

interface BookFilterProps {
  onFilter: (filters: string[]) => void;
  currentFilters: string[];
}

const BookFilter: React.FC<BookFilterProps> = ({ onFilter, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Customize these filter options based on your needs
  const filterOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "genre", label: "Genre" },
    { value: "publisher", label: "Publisher" },
    { value: "year", label: "Year" },
    { value: "isbn", label: "ISBN" },
  ];

  const handleToggle = (value: string) => {
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    onFilter(newFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                   text-white hover:bg-gray-700 transition-colors flex items-center gap-2 select-none"
      >
        Filter
        {currentFilters.length > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 
                         flex items-center justify-center">
            {currentFilters.length}
          </span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-600 
                         rounded-lg shadow-lg z-20 min-w-[200px] p-2">
            <div className="text-xs text-gray-400 px-2 py-1 mb-1">
              Select fields to display
            </div>
            {filterOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 
                         rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={currentFilters.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 
                           text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-white">{option.label}</span>
              </label>
            ))}
            
            {currentFilters.length > 0 && (
              <button
                onClick={() => {
                  onFilter([]);
                  setIsOpen(false);
                }}
                className="w-full mt-2 px-2 py-1 text-sm text-blue-400 
                         hover:text-blue-300 border-t border-gray-700 pt-2"
              >
                Clear all
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookFilter;