import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPaginatedBooks } from "@/api/books.api";

export function useBooks(page: number, limit = 20) {
  return useQuery({
    queryKey: ["books", page],
    queryFn: () => getPaginatedBooks(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });
}
