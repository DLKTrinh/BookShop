import { useQuery } from "@tanstack/react-query";
import { getPublicationYearRange } from "@/api/books.api";

export function usePublicationYearRange() {
  return useQuery({
    queryKey: ["publicationYearRange"],
    queryFn: getPublicationYearRange,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}