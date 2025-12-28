import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";
import { useDebounce } from "./useDebounce";

type UseBooksParams = {
  page: number;
  limit: number;
  search?: string;
  fields?: string[];
  sort?: string;
};

export function useBooks({
  page,
  limit,
  search,
  fields,
  sort,
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
    ],
    queryFn: () =>
      getBooks({
        page,
        limit,
        search: debouncedSearch || undefined,
        fields,
        sort,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
  });
}
