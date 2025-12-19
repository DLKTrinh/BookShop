import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookCard from "../components/BookCard";
import AddBookCard from "../components/AddBookCard";
import SearchBar from "../components/SearchBar";
import BookFilter from "../components/BookFilter";
import BookSort from "../components/BookSort";
import PageControl from "../components/PageControl";
import placeholder from "../../../assets/placeholder.png";
import { useBooks } from "@/shared/hooks/useBooks";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Books: React.FC<{ username: string }> = ({ username }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize state from URL parameters
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [sortOption, setSortOption] = useState(searchParams.get('sort') || "");
    const [filterOptions, setFilterOptions] = useState<string[]>(
        searchParams.get('fields')?.split(',').filter(Boolean) || []
    );
    const booksPerPage = 20;
    
    const debouncedSearch = useDebounce(searchQuery, 500);
    
    // Always include essential fields for display, plus user-selected fields
    const essentialFields = ['_id', 'title', 'author', 'cover'];
    const fieldsToFetch = filterOptions.length > 0 
        ? [...new Set([...essentialFields, ...filterOptions])]
        : undefined;
    
    const { data, isLoading, isFetching, error } = useBooks({
      page,
      limit: booksPerPage,
      search: debouncedSearch || undefined,
      fields: fieldsToFetch,
      sort: sortOption || undefined,
    });
    
    // Update URL when state changes
    useEffect(() => {
      const params: Record<string, string> = {};
      
      if (page > 1) params.page = page.toString();
      if (debouncedSearch) params.search = debouncedSearch;
      if (sortOption) params.sort = sortOption;
      if (filterOptions.length > 0) params.fields = filterOptions.join(',');
      
      setSearchParams(params, { replace: true });
    }, [page, debouncedSearch, sortOption, filterOptions, setSearchParams]);
    
    // Reset to page 1 when search, sort, or filter changes
    useEffect(() => {
      setPage(1);
    }, [debouncedSearch, sortOption, filterOptions]);
    
    if (isLoading)
        return (
            <Layout username={username}>
                <div className="flex justify-center items-center h-[70vh]">
                    <p className="text-2xl text-gray-300 animate-pulse">Loading books...</p>
                </div>
            </Layout>
        );
    
    if (error) {
        console.error("Error loading books:", error);
        return (
            <Layout username={username}>
                <div className="flex justify-center items-center h-[70vh]">
                    <p className="text-2xl text-red-400">Failed to load books.</p>
                </div>
            </Layout>
        );
    }
    
    const books = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;
    const totalBooks = data?.meta?.total || 0;
    const hasNext = data?.meta?.hasNext || false;
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = (sort: string) => {
        setSortOption(sort);
    };

    const handleFilter = (filters: string[]) => {
        setFilterOptions(filters);
    };
    
    return (
        <Layout username={username}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                    <BookSort onSort={handleSort} currentSort={sortOption} />
                    <BookFilter onFilter={handleFilter} currentFilters={filterOptions} />
                </div>
                <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
            </div>

            {/* Search Info - separate */}
            {debouncedSearch && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-300">
                        Found {totalBooks} book{totalBooks !== 1 ? 's' : ''} matching your search
                    </span>
                    
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm">
                        Search: "{debouncedSearch}"
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-gray-400 hover:text-white"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    </span>
                </div>
            )}

            {/* Filter Info - separate */}
            {filterOptions.length > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-300">
                        Displaying selected fields
                    </span>
                    
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm">
                        Fields: {filterOptions.join(", ")}
                        <button
                            onClick={() => setFilterOptions([])}
                            className="text-gray-400 hover:text-white"
                            aria-label="Clear filters"
                        >
                            ✕
                        </button>
                    </span>
                </div>
            )}
            
            {books.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[50vh]">
                    <p className="text-2xl text-gray-400 mb-2">No books found</p>
                    {debouncedSearch && (
                        <p className="text-gray-500">Try a different search term</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {books.map((book: any) => (
                            <BookCard
                                key={book._id}
                                id={book._id}
                                title={book.title}
                                author={book.author || "Unknown Author"}
                                cover={book.cover || placeholder}
                            />
                        ))}
                        {!debouncedSearch && page === totalPages && <AddBookCard />}
                    </div>
                    
                    <PageControl
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            
            {isFetching && (
                <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-700">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
                        Updating...
                    </p>
                </div>
            )}
        </Layout>
    );
};

export default Books;