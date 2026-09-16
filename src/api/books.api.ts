import api from "./axiosInstance";

type GetBooksParams = {
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

export const getBooks = async ({
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

}: GetBooksParams) => {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search) params.set("search", search);
    if (fields?.length) params.set("fields", fields.join(","));
    if (sort) params.set("sort", sort);
    if (subjects?.length) params.set("subjects", subjects.join(","));
    if (publishers?.length) params.set("publishers", publishers.join(","));
    if (authors?.length) params.set("authors", authors.join(","));
    if (yearMin !== undefined) params.set("yearMin", yearMin.toString());
    if (yearMax !== undefined) params.set("yearMax", yearMax.toString());

    const { data } = await api.get(`/api/books?${params.toString()}`);
    return data;
};

export interface YearRange {
    min: number | null;
    max: number | null;
};

export const getBookById = async (id: string) => {
    const { data } = await api.get(`/api/books/${id}`);
    return data;
};

export const addBook = async (bookData: any) => {
    const { data } = await api.post("/api/books", bookData);
    return data;
};

export const updateBook = async (id: string, bookData: any) => {
    const { data } = await api.put(`/api/books/${id}`, bookData);
    return data;
};

export const deleteBook = async (id: string) => {
    await api.delete(`/api/books/${id}`);
};


export const deleteManyBooks = async (ids: string[]) => {
  const { data } = await api.delete("/api/books/many", {
    data: { ids }
  });
  return data;
};

export const getSubjects = async (): Promise<string[]> => {
  const { data } = await api.get("/api/books/subjects");
  return data.subjects;
};

export const getPublishers = async (): Promise<string[]> => {
  const { data } = await api.get("/api/books/publishers");
  return data.publishers;
}

export const getAuthors = async (): Promise<string[]> => {
    const { data } = await api.get("/api/books/authors");
    return data.authors;
}

export const getPublicationYearRange = async (): Promise<YearRange> => {
    const { data } = await api.get("/api/books/publication-year-range");
    return data.yearRange;
}