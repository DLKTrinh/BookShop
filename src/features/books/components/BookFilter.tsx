import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";
import { usePublishers } from "../hooks/usePublishers";
import { useAuthors } from "../hooks/useAuthors";
import { usePublicationYearRange } from "../hooks/usePublicationYearRange";
import DualRangeSlider from "./DualRangeSlider";

// Extensible on purpose: each category is one optional field here, so
// adding another filter later doesn't require redesigning this shape.
export interface BookFilters {
  subjects?: string[];
  publishers?: string[];
  authors?: string[];
  yearRange?: { min?: number; max?: number };
}

interface BookFilterProps {
  onFilter: (filters: BookFilters) => void;
  currentFilters: BookFilters;
}

// Counts every active (applied) filter across every category — as more
// categories are added above, add their contribution here too.
const countActiveFilters = (filters: BookFilters, dataYearRange?: { min: number; max: number }): number => {
  let count = (filters.subjects?.length ?? 0) + (filters.publishers?.length ?? 0) + (filters.authors?.length ?? 0);

  if (filters.yearRange && dataYearRange) {
    const isNarrowed =
      (filters.yearRange.min !== undefined && filters.yearRange.min > dataYearRange.min) ||
      (filters.yearRange.max !== undefined && filters.yearRange.max < dataYearRange.max);
    if (isNarrowed) count += 1;
  }

  return count;
};

// Small reusable block: a search box + wrapped selectable pills, used
// identically for Subjects, Publishers, and Authors below.
function PillFilterSection({
  label,
  options,
  isLoading,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  isLoading: boolean;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = query ? options.filter((o) => o.toLowerCase().includes(query)) : options;

  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        {selected.length > 0 && (
          <span className="text-xs text-primary">{selected.length} selected</span>
        )}
      </div>
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}...`}
          className="w-full bg-background border border-input rounded-md pl-8 pr-2 py-1.5 text-sm text-foreground
                     placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="max-h-32 overflow-y-auto">
        {isLoading && <div className="px-1 py-1 text-sm text-muted-foreground">Loading...</div>}

        {!isLoading && visible.length === 0 && (
          <div className="px-1 py-1 text-sm text-muted-foreground">
            {query ? "No matches" : "None yet"}
          </div>
        )}

        {!isLoading && visible.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visible.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                             outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                    isSelected
                      ? "bg-primary text-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const BookFilter: React.FC<BookFilterProps> = ({ onFilter, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: allSubjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: allPublishers = [], isLoading: publishersLoading } = usePublishers();
  const { data: allAuthors = [], isLoading: authorsLoading } = useAuthors();
  const { data: dataYearRange, isLoading: yearRangeLoading } = usePublicationYearRange();

  const hasYearData = dataYearRange?.min != null && dataYearRange?.max != null;

  // Draft state — nothing here touches onFilter (and therefore the book
  // list/URL/network request) until "Apply" is clicked.
  const [pendingSubjects, setPendingSubjects] = useState<string[]>(currentFilters.subjects ?? []);
  const [pendingPublishers, setPendingPublishers] = useState<string[]>(currentFilters.publishers ?? []);
  const [pendingAuthors, setPendingAuthors] = useState<string[]>(currentFilters.authors ?? []);
  const [pendingFromYear, setPendingFromYear] = useState<number | undefined>(currentFilters.yearRange?.min);
  const [pendingToYear, setPendingToYear] = useState<number | undefined>(currentFilters.yearRange?.max);

  // Reset every draft to match the currently-applied filters (falling back
  // to the full data range for the slider) every time the panel opens.
  useEffect(() => {
    if (isOpen) {
      setPendingSubjects(currentFilters.subjects ?? []);
      setPendingPublishers(currentFilters.publishers ?? []);
      setPendingAuthors(currentFilters.authors ?? []);
      setPendingFromYear(currentFilters.yearRange?.min ?? dataYearRange?.min ?? undefined);
      setPendingToYear(currentFilters.yearRange?.max ?? dataYearRange?.max ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dataYearRange?.min, dataYearRange?.max]);

  const activeCount = countActiveFilters(
    currentFilters,
    hasYearData ? { min: dataYearRange!.min as number, max: dataYearRange!.max as number } : undefined
  );

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleApply = () => {
    const isFullRange =
      hasYearData && pendingFromYear === dataYearRange!.min && pendingToYear === dataYearRange!.max;

    onFilter({
      subjects: pendingSubjects.length > 0 ? pendingSubjects : undefined,
      publishers: pendingPublishers.length > 0 ? pendingPublishers : undefined,
      authors: pendingAuthors.length > 0 ? pendingAuthors : undefined,
      yearRange:
        hasYearData && !isFullRange
          ? { min: pendingFromYear, max: pendingToYear }
          : undefined,
    });
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setPendingSubjects([]);
    setPendingPublishers([]);
    setPendingAuthors([]);
    setPendingFromYear(dataYearRange?.min ?? undefined);
    setPendingToYear(dataYearRange?.max ?? undefined);
  };

  const hasPendingSelections =
    pendingSubjects.length > 0 ||
    pendingPublishers.length > 0 ||
    pendingAuthors.length > 0 ||
    (hasYearData && (pendingFromYear !== dataYearRange!.min || pendingToYear !== dataYearRange!.max));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-card border border-input rounded-lg 
                   text-secondary-foreground hover:bg-secondary transition-colors flex items-center gap-2 select-none
                   outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Filter
        {activeCount > 0 && (
          <span className="bg-primary text-foreground text-xs rounded-full w-5 h-5 
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
          <div className="absolute top-full mt-2 left-0 bg-card border border-input 
                         rounded-lg shadow-lg z-20 w-[420px] max-h-[80vh] overflow-y-auto flex flex-col">
            <PillFilterSection
              label="Subjects"
              options={allSubjects}
              isLoading={subjectsLoading}
              selected={pendingSubjects}
              onToggle={(v) => setPendingSubjects((prev) => toggleIn(prev, v))}
            />

            <PillFilterSection
              label="Publisher"
              options={allPublishers}
              isLoading={publishersLoading}
              selected={pendingPublishers}
              onToggle={(v) => setPendingPublishers((prev) => toggleIn(prev, v))}
            />

            <PillFilterSection
              label="Author"
              options={allAuthors}
              isLoading={authorsLoading}
              selected={pendingAuthors}
              onToggle={(v) => setPendingAuthors((prev) => toggleIn(prev, v))}
            />

            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Year of Publication</span>
              </div>

              {yearRangeLoading && (
                <div className="text-sm text-muted-foreground">Loading range...</div>
              )}

              {!yearRangeLoading && !hasYearData && (
                <div className="text-sm text-muted-foreground">No publication years on file yet</div>
              )}

              {!yearRangeLoading && hasYearData && pendingFromYear !== undefined && pendingToYear !== undefined && (
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>{pendingFromYear}</span>
                    <span>{pendingToYear}</span>
                  </div>

                  <DualRangeSlider
                    min={dataYearRange!.min as number}
                    max={dataYearRange!.max as number}
                    fromValue={pendingFromYear}
                    toValue={pendingToYear}
                    onChange={(from, to) => {
                      setPendingFromYear(from);
                      setPendingToYear(to);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 p-3">
              <button
                onClick={handleClearAll}
                disabled={!hasPendingSelections}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed
                           outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-foreground text-sm font-medium rounded-lg transition-colors
                           outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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