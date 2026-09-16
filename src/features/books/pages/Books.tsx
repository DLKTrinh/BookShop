import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookCard from "../components/BookCard";
import AddBookCard from "../components/AddBookCard";
import SearchBar from "../components/SearchBar";
import BookFilter, { type BookFilters } from "../components/BookFilter";
import BookSort from "../components/BookSort";
import PageControl from "../components/PageControl";
import placeholder from "../../../assets/placeholder.png";
import { useBooks } from "../hooks/useBooks";
import { getIdFromValue, getValueFromId } from "../utils/sortOptions";
import { useDeleteManyBooks } from "../hooks/useBookMutations";
import { getBooksPerPage } from "@/features/settings/constants/preferences";
import { Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import BackButton from "@/shared/components/BackButton";
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
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Measured (not guessed) so the delete-controls row always sits flush
    // below the sticky bar regardless of how tall that bar's content makes it.
    const stickyBarRef = useRef<HTMLDivElement>(null);
    const [stickyBarHeight, setStickyBarHeight] = useState(0);

    useLayoutEffect(() => {
        if (stickyBarRef.current) {
            setStickyBarHeight(stickyBarRef.current.offsetHeight);
        }
    }, [isAdmin, isDeleteMode]);
    
    const page = Number(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || "";
    const sortOption = getValueFromId(searchParams.get('sort') || "default");
    const selectedSubjects = searchParams.get('subjects')?.split(',').filter(Boolean) || [];
    const selectedPublishers = searchParams.get('publishers')?.split(',').filter(Boolean) || [];
    const selectedAuthors = searchParams.get('authors')?.split(',').filter(Boolean) || [];
    const yearMin = searchParams.get('yearMin') ? Number(searchParams.get('yearMin')) : undefined;
    const yearMax = searchParams.get('yearMax') ? Number(searchParams.get('yearMax')) : undefined;


    
    const booksPerPage = getBooksPerPage();
    
    const { data, isLoading, isFetching, error, refetch } = useBooks({
        page,
        limit: booksPerPage,
        search: searchQuery || undefined,
        sort: sortOption || undefined,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : undefined,
        publishers: selectedPublishers.length > 0 ? selectedPublishers : undefined,
        authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
        yearMin,
        yearMax,
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
    
    const handleFilter = (filters: BookFilters) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('page');
            if (filters.subjects?.length) {
                params.set('subjects', filters.subjects.join(','));
            } else {
                params.delete('subjects');
            }
            if (filters.publishers?.length) {
                params.set('publishers', filters.publishers.join(','));
            } else {
                params.delete('publishers');
            }
            if (filters.authors?.length) {
                params.set('authors', filters.authors.join(','));
            } else {
                params.delete('authors');
            }
            if (filters.yearRange?.min !== undefined) {
                params.set('yearMin', filters.yearRange.min.toString());
            } else {
                params.delete('yearMin');
            }
            if (filters.yearRange?.max !== undefined) {
                params.set('yearMax', filters.yearRange.max.toString());
            } else {
                params.delete('yearMax');
            }
            return params;
        }, { replace: true });
    };
    
    const handleClearFilters = () => {
        handleFilter({});
    };

    const hasActiveFilters =
        selectedSubjects.length > 0 ||
        selectedPublishers.length > 0 ||
        selectedAuthors.length > 0 ||
        yearMin !== undefined ||
        yearMax !== undefined;

    // Broader than hasActiveFilters — also true if search or sort is active.
    // Used for the Back button: clicking it should clear ANY active
    // search/sort/filter state and stay put, only navigating away once
    // there's genuinely nothing left to clear.
    const hasActiveParams = hasActiveFilters || !!searchQuery || !!searchParams.get('sort');

    const handleClearAllParams = () => {
        setSearchParams(new URLSearchParams(), { replace: true });
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
                    <p className="text-4xl text-muted-foreground animate-pulse">Loading books...</p>
                </div>
            </Layout>
        );
    }
    
    if (error) {
        console.error("Error loading books:", error);
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                    <p className="text-4xl text-destructive">Failed to load books.</p>
                    <p className="text-muted-foreground">There was an error connecting to the server.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-foreground rounded-lg transition-colors flex items-center gap-2"
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
            {isDeleteMode && (
                <div 
                    className="fixed inset-x-0 top-16 bottom-0 bg-black/60 z-40"
                    onClick={hasActiveFilters ? handleClearFilters : handleClearSearch}
                />
            )}

            <div className={`relative ${isDeleteMode ? 'z-45' : ''}`}>
                <div ref={stickyBarRef} className="sticky top-16 z-30 -mx-6 px-6 -mt-6 py-3 bg-background">
                    <div className="flex items-center gap-4">
                        <BackButton 
                            fallbackTo="/dashboard"
                            onClick={hasActiveParams ? handleClearAllParams : undefined}
                        />
                        <div className="flex-1 flex justify-center">
                            <SearchBar onSearch={handleSearch} value={searchQuery} />
                        </div>

                        {isAdmin ? (
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={handleAddBook}
                                    disabled={isDeleteMode}
                                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors
                                        outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                        isDeleteMode 
                                            ? 'bg-background text-muted-foreground cursor-not-allowed'
                                            : 'bg-success hover:bg-success/90 text-foreground'
                                        }
                                    `}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                                
                                <button
                                    onClick={handleDeleteModeToggle}
                                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors
                                        outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                        isDeleteMode 
                                            ? 'bg-muted hover:bg-muted text-foreground focus-visible:ring-gray-400' 
                                            : 'bg-destructive hover:bg-destructive/90 text-foreground focus-visible:ring-destructive'
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
                        ) : (
                            <div className="w-[88px] shrink-0" aria-hidden />
                        )}
                    </div>
                </div>

                {isDeleteMode && (
                    <div
                        className="sticky z-30 -mx-6 px-6 py-3 bg-card border-b border-border flex items-center justify-between"
                        style={{ top: `${64 + stickyBarHeight}px` }}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                                {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={handleSelectAll}
                                className="text-primary hover:text-primary/80 text-sm rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                                {selectedBooks.size === books.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedBooks.size === 0}
                            className="px-4 py-2 bg-destructive hover:bg-destructive/90 disabled:bg-muted disabled:cursor-not-allowed text-foreground rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}

                {/* Sort/filter */}
                <div className="flex items-center mb-4 mt-4 gap-4 flex-wrap">
                    <div className="flex space-x-2">
                        <BookSort onSort={handleSort} currentSort={sortOption} />
                        <BookFilter onFilter={handleFilter} currentFilters={{ subjects: selectedSubjects }} />
                    </div>
                </div>

                {/* Search Info */}
                {searchQuery && (
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">
                            Found {totalBooks} book{totalBooks !== 1 ? 's' : ''} matching your search
                        </span>
                        
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                            Search: "{searchQuery}"
                            <button
                                onClick={handleClearSearch}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        </span>
                    </div>
                )}

                {/* Filter Info */}
                {hasActiveFilters && (
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">
                            Filtered
                        </span>

                        {selectedSubjects.length > 0 && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                                Subjects: {selectedSubjects.join(", ")}
                            </span>
                        )}

                        {selectedPublishers.length > 0 && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                                Publisher: {selectedPublishers.join(", ")}
                            </span>
                        )}

                        {selectedAuthors.length > 0 && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                                Author: {selectedAuthors.join(", ")}
                            </span>
                        )}

                        {(yearMin !== undefined || yearMax !== undefined) && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                                Year: {yearMin ?? "…"}–{yearMax ?? "…"}
                            </span>
                        )}

                        <button
                            onClick={handleClearFilters}
                            className="text-muted-foreground hover:text-foreground text-sm underline
                                       outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                            aria-label="Clear all filters"
                        >
                            Clear all
                        </button>
                    </div>
                )}
                
                {books.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-[50vh]">
                        <p className="text-2xl text-muted-foreground mb-2">No books found</p>
                        {searchQuery && (
                            <button 
                                onClick={handleClearSearch}
                                className="text-primary hover:underline mt-2"
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
                                            <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg ring-4 ring-primary/40">
                                                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            {isAdmin && !searchQuery && !isDeleteMode && page === totalPages && <AddBookCard />}
                        </div>
                        
                        <PageControl
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
                
                {isFetching && (
                    <div className="fixed bottom-4 right-4 bg-card px-4 py-2 rounded-lg shadow-lg border border-border">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></span>
                            Updating...
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">
                            Delete {selectedBooks.size} Book{selectedBooks.size !== 1 ? 's' : ''}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            Are you sure you want to delete {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''}? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            className="bg-muted hover:bg-muted text-foreground border-input"
                            disabled={deleteManyBooksMutation.isPending}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-foreground"
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