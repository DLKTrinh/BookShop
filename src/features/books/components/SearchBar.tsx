import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, defaultValue = "" }) => {
  const [searchValue, setSearchValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // Optional: Real-time search (remove if you want search on submit only)
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 select-none">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search books..."
          className="px-4 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none 
                     focus:border-blue-500 transition-colors w-64"
        />
        {searchValue && (
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
    </form>
  );
};

export default SearchBar;