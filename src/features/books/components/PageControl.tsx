import React from "react";

interface PageControlProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageControl: React.FC<PageControlProps> = ({ page, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; 
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10 py-4 px-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium border border-gray-600 rounded-lg 
                   disabled:opacity-30 disabled:cursor-not-allowed 
                   hover:bg-gray-700 hover:text-white transition-all 
                   duration-200 cursor-pointer select-none"
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum as number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 select-none
                ${page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-600 hover:bg-gray-700 hover:text-white'
                }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={page === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium border border-gray-600 rounded-lg 
                   disabled:opacity-30 disabled:cursor-not-allowed 
                   hover:bg-gray-700 hover:text-white transition-all 
                   duration-200 cursor-pointer select-none"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default PageControl;