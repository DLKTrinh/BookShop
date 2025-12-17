import api from "./axiosInstance";

type GetBooksParams = {
    page: number;
    limit: number;
    search?: string;
    fields?: string[];
    sort?: string;
};

export const getBooks = async ({
    page,
    limit,
    search,
    fields,
    sort,
}: GetBooksParams) => {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search) params.set("search", search);
    if (fields?.length) params.set("fields", fields.join(","));
    if (sort) params.set("sort", sort);

    const { data } = await api.get(`/api/books?${params.toString()}`);
    return data;
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
