export const BOOKS_PER_PAGE_KEY = "booksPerPage";
export const DEFAULT_BOOKS_PER_PAGE = 20;
export const BOOKS_PER_PAGE_OPTIONS = [10, 20, 50] as const;

export function getBooksPerPage(): number {
  const stored = Number(localStorage.getItem(BOOKS_PER_PAGE_KEY));
  return BOOKS_PER_PAGE_OPTIONS.includes(stored as any) ? stored : DEFAULT_BOOKS_PER_PAGE;
}