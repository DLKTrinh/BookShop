import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookById } from "@/api/books.api";

interface Book {
    _id?: string;
    title?: string;
    author?: string;
    subjects?: string[];
    ["publication date"]?: number;
    quantity?: number;
    publisher?: string;
    description?: string;
    cover?: string;
}


interface BooksPage {
  books: Book[];
  total?: number;
}

export function useBookDetail(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const pages = queryClient.getQueriesData<BooksPage>({ queryKey: ["books"] });

      for (const [, pageData] of pages) {
        const book = pageData?.books?.find((b) => b._id === id);
        if (book) return book;
      }

      return getBookById(id);
    },
    staleTime: 1000 * 60 * 5,
  });
}
