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
import { getIdFromValue, getValueFromId } from "../utils/sortOptions";

const Books: React.FC<{ username: string }> = ({ username }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = Number(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || "";
    const sortOption = getValueFromId(searchParams.get('sort') || "default");
    const filterOptions = searchParams.get('fields')?.split(',').filter(Boolean) || [];
    
    const booksPerPage = 20;
    
    // Required fields
    const requiredFields = ['_id', 'title', 'author', 'cover'];
    const fieldsToFetch = filterOptions.length > 0 
        ? [...new Set([...requiredFields, ...filterOptions])]
        : undefined;
    
    // useBooks hook
    const { data, isLoading, isFetching, error } = useBooks({
      page,
      limit: booksPerPage,
      search: searchQuery || undefined,
      fields: fieldsToFetch,
      sort: sortOption || undefined,
    });
    
    // URL update handlers
    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if (newPage > 1) {
                params.set('page', newPage.toString());
            } else {
                params.delete('page');
            }
            return params;
        }, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSearch = (query: string) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('page'); // Reset to page 1
            if (query.trim()) {
                params.set('search', query.trim());
            } else {
                params.delete('search');
            }
            return params;
        }, { replace: true });
    };
    
    const handleSort = (sort: string) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('page'); // Reset to page 1
            const sortId = getIdFromValue(sort);
            if (sortId !== "default") {
                params.set('sort', sortId);
            } else {
                params.delete('sort');
            }
            return params;
        }, { replace: true });
    };
    
    const handleFilter = (filters: string[]) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('page'); // Reset to page 1
            if (filters.length > 0) {
                params.set('fields', filters.join(','));
            } else {
                params.delete('fields');
            }
            return params;
        }, { replace: true });
    };
    
    const handleClearSearch = () => {
        handleSearch("");
    };
    
    const handleClearFilters = () => {
        handleFilter([]);
    };
    
    if (isLoading) {
        return (
            <Layout username={username}>
                <div className="flex justify-center items-center h-[70vh]">
                    <p className="text-2xl text-gray-300 animate-pulse">Loading books...</p>
                </div>
            </Layout>
        );
    }
    
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
    
    return (
        <Layout username={username}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                    <BookSort onSort={handleSort} currentSort={sortOption} />
                    <BookFilter onFilter={handleFilter} currentFilters={filterOptions} />
                </div>
                <SearchBar onSearch={handleSearch} value={searchQuery} />
            </div>

            {/* Search Info */}
            {searchQuery && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-300">
                        Found {totalBooks} book{totalBooks !== 1 ? 's' : ''} matching your search
                    </span>
                    
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm">
                        Search: "{searchQuery}"
                        <button
                            onClick={handleClearSearch}
                            className="text-gray-400 hover:text-white"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    </span>
                </div>
            )}

            {/* Filter Info */}
            {filterOptions.length > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-300">
                        Displaying selected fields
                    </span>
                    
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm">
                        Fields: {filterOptions.join(", ")}
                        <button
                            onClick={handleClearFilters}
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
                    {searchQuery && (
                        <button 
                            onClick={handleClearSearch}
                            className="text-blue-400 hover:underline mt-2"
                        >
                            Clear search
                        </button>
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
                        {!searchQuery && page === totalPages && <AddBookCard />}
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