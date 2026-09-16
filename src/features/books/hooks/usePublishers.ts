import { useQuery } from "@tanstack/react-query";
import { getPublishers } from "@/api/books.api";

export function usePublishers() {
  return useQuery({
    queryKey: ["publishers"],
    queryFn: getPublishers,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}