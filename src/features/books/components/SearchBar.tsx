import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value }) => {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value); 
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onSearch(newValue); 
  };

  const handleClear = () => {
    setLocalValue("");
    onSearch("");
  };

  return (
    <div className="relative flex items-center gap-2 select-none">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search books..."
          className="pl-10 pr-10 py-2 bg-card border border-border rounded-lg 
                     text-foreground placeholder-muted-foreground focus:outline-none 
                     focus:border-primary focus:placeholder-transparent transition-colors w-120"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                       hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
    </div>
  );
};

export default SearchBar;