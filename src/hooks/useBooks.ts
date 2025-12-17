import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";

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
  return useQuery({
    queryKey: [
      "books",
      page,
      limit,
      search ?? "",
      fields?.join(",") ?? "",
      sort ?? "",
    ],
    queryFn: () =>
      getBooks({
        page,
        limit,
        search,
        fields,
        sort,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
  });
}
