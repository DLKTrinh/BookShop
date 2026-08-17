import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";

interface SubjectsComboboxProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
}

export default function SubjectsCombobox({ selectedSubjects, onChange }: SubjectsComboboxProps) {
  const { data: allSubjects = [], isLoading } = useSubjects();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close the dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = inputValue.trim().toLowerCase();

  const filteredSubjects = allSubjects.filter(
    (subject) =>
      !selectedSubjects.some((s) => s.toLowerCase() === subject.toLowerCase()) &&
      (query === "" || subject.toLowerCase().includes(query))
  );

  const hasExactMatch = allSubjects.some((s) => s.toLowerCase() === query);
  const canAddNew = query !== "" && !hasExactMatch && !selectedSubjects.some((s) => s.toLowerCase() === query);

  // Combined list for keyboard navigation: existing matches, then "add new" as the last option
  const optionCount = filteredSubjects.length + (canAddNew ? 1 : 0);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [inputValue, isOpen]);

  const selectSubject = (subject: string) => {
    onChange([...selectedSubjects, subject]);
    setInputValue("");
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeSubject = (subject: string) => {
    onChange(selectedSubjects.filter((s) => s !== subject));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((i) => Math.min(i + 1, optionCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex < filteredSubjects.length) {
        const match = filteredSubjects[highlightedIndex];
        if (match) selectSubject(match);
      } else if (canAddNew) {
        selectSubject(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search or add a subject..."
        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
 
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-2.5 text-sm text-gray-400">Loading subjects...</div>
          )}
 
          {!isLoading && filteredSubjects.length === 0 && !canAddNew && (
            <div className="px-4 py-2.5 text-sm text-gray-500">
              {query ? "No matching subjects" : "No subjects available yet"}
            </div>
          )}
 
          {filteredSubjects.map((subject, index) => (
            <button
              key={subject}
              type="button"
              onClick={() => selectSubject(subject)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                index === highlightedIndex
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {subject}
            </button>
          ))}
 
          {canAddNew && (
            <button
              type="button"
              onClick={() => selectSubject(inputValue.trim())}
              onMouseEnter={() => setHighlightedIndex(filteredSubjects.length)}
              className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm border-t border-gray-700 transition-colors ${
                highlightedIndex === filteredSubjects.length
                  ? "bg-gray-700 text-blue-300"
                  : "text-blue-400 hover:bg-gray-700"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add "{inputValue.trim()}" as new subject
            </button>
          )}
        </div>
      )}
 
      {selectedSubjects.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="flex items-center gap-1 bg-blue-600 text-white text-sm font-medium rounded-full pl-3 pr-1.5 py-1"
            >
              {subject}
              <button
                type="button"
                onClick={() => removeSubject(subject)}
                className="hover:bg-blue-700 rounded-full p-0.5"
                aria-label={`Remove ${subject}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}