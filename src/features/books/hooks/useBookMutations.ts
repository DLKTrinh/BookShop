import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBook, updateBook, deleteBook } from '@/api/books.api';
import { toast } from 'sonner';

export function useAddBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add book');
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
      toast.success('Book updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update book');
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete book');
    },
  });
}