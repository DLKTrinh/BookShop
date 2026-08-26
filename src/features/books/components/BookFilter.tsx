import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";

// Extensible on purpose: each future filter (year range, publisher, etc.)
// becomes one more optional field here, not a redesign of this shape.
export interface BookFilters {
  subjects?: string[];
  // yearRange?: { min?: number; max?: number };  // planned
  // publishers?: string[];                        // planned
}

interface BookFilterProps {
  onFilter: (filters: BookFilters) => void;
  currentFilters: BookFilters;
}

// Counts every active (applied) filter across every category — as more
// categories are added above, add their contribution here too.
const countActiveFilters = (filters: BookFilters): number => {
  return (filters.subjects?.length ?? 0);
};

const BookFilter: React.FC<BookFilterProps> = ({ onFilter, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: allSubjects = [], isLoading } = useSubjects();

  // Draft state — nothing here touches onFilter (and therefore the book
  // list/URL/network request) until "Apply" is clicked. No debounce needed:
  // this only filters an already-fetched local array, not a network call.
  const [pendingSubjects, setPendingSubjects] = useState<string[]>(currentFilters.subjects ?? []);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset the draft to match the currently-applied filters every time the
  // panel opens, so a previous unsaved edit doesn't linger silently.
  useEffect(() => {
    if (isOpen) {
      setPendingSubjects(currentFilters.subjects ?? []);
      setSearchQuery("");
    }
  }, [isOpen]);

  const activeCount = countActiveFilters(currentFilters);

  const query = searchQuery.trim().toLowerCase();
  const visibleSubjects = query
    ? allSubjects.filter((s) => s.toLowerCase().includes(query))
    : allSubjects;

  const handleToggleSubject = (subject: string) => {
    setPendingSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleApply = () => {
    onFilter({
      ...currentFilters,
      subjects: pendingSubjects.length > 0 ? pendingSubjects : undefined,
    });
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setPendingSubjects([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                   text-white hover:bg-gray-700 transition-colors flex items-center gap-2 select-none
                   outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      >
        Filter
        {activeCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 
                         flex items-center justify-center">
            {activeCount}
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
                         rounded-lg shadow-lg z-20 w-72 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Subjects</span>
                {pendingSubjects.length > 0 && (
                  <span className="text-xs text-blue-400">{pendingSubjects.length} selected</span>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-md pl-8 pr-2 py-1.5 text-sm text-white
                             placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {isLoading && (
                <div className="px-2 py-2 text-sm text-gray-500">Loading subjects...</div>
              )}

              {!isLoading && visibleSubjects.length === 0 && (
                <div className="px-2 py-2 text-sm text-gray-500">
                  {query ? "No matching subjects" : "No subjects yet"}
                </div>
              )}

              {visibleSubjects.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 
                           rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pendingSubjects.includes(subject)}
                    onChange={() => handleToggleSubject(subject)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 
                             text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-white">{subject}</span>
                </label>
              ))}
            </div>

            {/* Future filter sections (year range, publisher) go here as
                additional labeled blocks between the list above and the
                footer below. */}

            <div className="flex items-center justify-between gap-2 p-3 border-t border-gray-700">
              <button
                onClick={handleClearAll}
                disabled={pendingSubjects.length === 0}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
                           outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 rounded"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors
                           outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookFilter;