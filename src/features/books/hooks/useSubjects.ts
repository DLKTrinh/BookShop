import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "@/api/books.api";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}