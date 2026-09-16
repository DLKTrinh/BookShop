import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";
import { useDebounce } from "@/shared/hooks/useDebounce";

type UseBooksParams = {
  page: number;
  limit: number;
  search?: string;
  fields?: string[];
  sort?: string;
  subjects?: string[];
  publishers?: string[];
  authors?: string[];
  yearMin?: number;
  yearMax?: number;
};

export function useBooks({
  page,
  limit,
  search,
  fields,
  sort,
  subjects,
  publishers,
  authors,
  yearMin,
  yearMax,
}: UseBooksParams) {
  const debouncedSearch = useDebounce(search?.trim() ?? "", 500);

  return useQuery({
    queryKey: [
      "books",
      page,
      limit,
      debouncedSearch,
      fields?.join(",") ?? "",
      sort ?? "",
      subjects?.slice().sort().join(",") ?? "",
      publishers?.slice().sort().join(",") ?? "",
      authors?.slice().sort().join(",") ?? "",
      yearMin ?? null,
      yearMax ?? null,
    ],
    queryFn: () =>
      getBooks({
        page,
        limit,
        search: debouncedSearch || undefined,
        fields,
        sort,
        subjects,
        publishers,
        authors,
        yearMin,
        yearMax,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
  });
}