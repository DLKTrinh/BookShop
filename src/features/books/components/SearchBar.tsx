import React, { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value }) => {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value); // Sync when URL changes (back/forward)
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onSearch(newValue); // Call immediately, parent will debounce
  };

  const handleClear = () => {
    setLocalValue("");
    onSearch("");
  };

  return (
    <div className="relative flex items-center gap-2 select-none">
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search books..."
          className="px-4 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none 
                     focus:border-blue-500 transition-colors w-64"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-white transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;