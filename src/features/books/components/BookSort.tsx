import React, { useState } from "react";

interface BookSortProps {
  onSort: (sort: string) => void;
  currentSort: string;
}

const BookSort: React.FC<BookSortProps> = ({ onSort, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "title", label: "Title (A-Z)" },
    { value: "-title", label: "Title (Z-A)" },
    { value: "author", label: "Author (A-Z)" },
    { value: "-author", label: "Author (Z-A)" },
  ];

  const handleSelect = (value: string) => {
    onSort(value);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Sort";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                   text-white hover:bg-gray-700 transition-colors flex items-center gap-2 select-none"
      >
        {currentLabel}
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
                         rounded-lg shadow-lg z-20 min-w-[200px]">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors
                           first:rounded-t-lg last:rounded-b-lg
                           ${currentSort === option.value ? 'bg-gray-700 text-blue-400' : 'text-white'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookSort;