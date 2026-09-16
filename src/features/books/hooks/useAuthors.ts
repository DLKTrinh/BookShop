import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "@/api/books.api";

export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}