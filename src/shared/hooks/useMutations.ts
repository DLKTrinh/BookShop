import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook, updateBook, deleteBook } from "@/api/books.api";

export function useBookMutations() {
  const queryClient = useQueryClient();

  // Add book mutation
  const add = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  // Update book mutation
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBook(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate both the individual book and the books list
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  // Delete book mutation
  const remove = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return { add, update, remove };
}
