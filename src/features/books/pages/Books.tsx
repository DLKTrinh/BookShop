import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
import { useDeleteManyBooks } from "../hooks/useBookMutations";
import { Plus, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Books: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const deleteManyBooksMutation = useDeleteManyBooks();

    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    const page = Number(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || "";
    const sortOption = getValueFromId(searchParams.get('sort') || "default");
    const filterOptions = searchParams.get('fields')?.split(',').filter(Boolean) || [];
    
    const booksPerPage = 20;
    
    const requiredFields = ['_id', 'title', 'author', 'cover'];
    const fieldsToFetch = filterOptions.length > 0 
        ? [...new Set([...requiredFields, ...filterOptions])]
        : undefined;
    
    const { data, isLoading, isFetching, error, refetch } = useBooks({
      page,
      limit: booksPerPage,
      search: searchQuery || undefined,
      fields: fieldsToFetch,
      sort: sortOption || undefined,
    });
    
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
            params.delete('page');
            if (query.trim()) {
                params.set('search', query.trim());
            } else {
                params.delete('search');
            }
            return params;
        }, { replace: true });
    };

    const handleClearSearch = () => {
        handleSearch("");
    };

    const handleSort = (sort: string) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('page');
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
            params.delete('page');
            if (filters.length > 0) {
                params.set('fields', filters.join(','));
            } else {
                params.delete('fields');
            }
            return params;
        }, { replace: true });
    };
    
    const handleClearFilters = () => {
        handleFilter([]);
    };

    const handleAddBook = () => {
        navigate('/books/new', {
            state: { from: location.pathname + location.search }
        });
    };

    const handleDeleteModeToggle = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedBooks(new Set());
    };

    const handleBookClick = (bookId: string) => {
        if (isDeleteMode) {
            // In delete mode: toggle selection
            setSelectedBooks(prev => {
                const newSet = new Set(prev);
                if (newSet.has(bookId)) {
                    newSet.delete(bookId);
                } else {
                    newSet.add(bookId);
                }
                return newSet;
            });
        } else {
            // Normal mode: navigate to book details
            navigate(`/books/${bookId}`, {
                state: { from: location.pathname + location.search }
            });
        }
    };

    const handleDeleteSelected = () => {
        if (selectedBooks.size > 0) {
            setShowDeleteDialog(true);
        }
    };

    const handleConfirmDelete = async () => {
        const bookIds = Array.from(selectedBooks);
        
        deleteManyBooksMutation.mutate(bookIds, {
            onSuccess: () => {
                setSelectedBooks(new Set());
                setIsDeleteMode(false);
                setShowDeleteDialog(false);
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedBooks.size === books.length) {
            setSelectedBooks(new Set());
        } else {
            setSelectedBooks(new Set(books.map((book: any) => book._id)));
        }
    };
    
    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[70vh]">
                    <p className="text-4xl text-gray-300 animate-pulse">Loading books...</p>
                </div>
            </Layout>
        );
    }
    
    if (error) {
        console.error("Error loading books:", error);
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                    <p className="text-4xl text-red-400">Failed to load books.</p>
                    <p className="text-gray-400">There was an error connecting to the server.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            />
                        </svg>
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }
    
    const books = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;
    const totalBooks = data?.meta?.total || 0;
    
    return (
        <Layout>
            {/* Delete Mode Scrim Overlay */}
            {isDeleteMode && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={handleDeleteModeToggle}
                />
            )}

            <div className={`relative ${isDeleteMode ? 'z-50' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="flex space-x-2">
                            <BookSort onSort={handleSort} currentSort={sortOption} />
                            <BookFilter onFilter={handleFilter} currentFilters={filterOptions} />
                        </div>
                    </div>

                    <div className="flex items-center flex-grow justify-center">
                        <SearchBar onSearch={handleSearch} value={searchQuery} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={handleAddBook}
                            disabled={isDeleteMode}
                            className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                                isDeleteMode 
                                    ? 'bg-gray-900 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }
                            `}
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                        
                        <button
                            onClick={handleDeleteModeToggle}
                            className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                                isDeleteMode 
                                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {isDeleteMode ? (
                                <>
                                    <X className="w-4 h-4" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Delete Mode Controls */}
                {isDeleteMode && (
                    <div className="mb-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300">
                                {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={handleSelectAll}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                {selectedBooks.size === books.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedBooks.size === 0}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}

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
                            {books.map((book: any) => {
                                const isSelected = selectedBooks.has(book._id);
                                return (
                                    <div
                                        key={book._id}
                                        onClick={() => handleBookClick(book._id)}
                                        className={`relative transition-all duration-200 ${
                                            isDeleteMode 
                                                ? isSelected
                                                    ? 'scale-95 cursor-pointer'
                                                    : 'opacity-60 hover:opacity-100 cursor-pointer'
                                                : ''
                                        }`}
                                    >
                                        {isDeleteMode && isSelected && (
                                            <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-400">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        <BookCard
                                            id={book._id}
                                            title={book.title}
                                            author={book.author || "Unknown Author"}
                                            cover={book.cover || placeholder}
                                            isSelectable={isDeleteMode}
                                        />
                                    </div>
                                );
                            })}
                            {!searchQuery && !isDeleteMode && page === totalPages && <AddBookCard />}
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
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Delete {selectedBooks.size} Book{selectedBooks.size !== 1 ? 's' : ''}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''}? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                            disabled={deleteManyBooksMutation.isPending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleConfirmDelete}
                            disabled={deleteManyBooksMutation.isPending}
                        >
                            {deleteManyBooksMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    );
};

export default Books;