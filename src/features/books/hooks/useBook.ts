import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookById } from "@/api/books.api";

export function useBook(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    initialData: () => {
      const cachedQueries = queryClient.getQueriesData({ queryKey: ["books"] });
      
      for (const [, data] of cachedQueries) {
        if (data && typeof data === 'object' && 'data' in data) {
          const books = (data as any).data;
          const book = books?.find((b: any) => b._id === id);
          if (book) {
            return book;
          }
        }
      }
      return undefined;
    },
  });
}