import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookForm from "../components/BookForm";
import { useBook } from "../hooks/useBook";
import { useUpdateBook } from "../hooks/useBookMutations";

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: book, isLoading, error } = useBook(id!);
  const updateBookMutation = useUpdateBook();

  const handleSubmit = async (data: any) => {
    // mutateAsync, not mutate — same reasoning as AddNewBook.tsx: BookForm
    // awaits this function and invalidates the 'subjects' query right after,
    // so this needs to genuinely wait for the server to confirm the update
    // before that invalidation fires.
    await updateBookMutation.mutateAsync({ id: id!, data });
    navigate(location.state?.from ?? `/books/${id}`);
  };

  const handleCancel = () => {
    navigate(location.state?.from ?? `/books/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-muted-foreground animate-pulse">Loading book...</p>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-destructive">Book not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Book</h1>
          <p className="text-muted-foreground">Update book information</p>
        </div>

        {updateBookMutation.isError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
            <p className="text-destructive">
              {updateBookMutation.error instanceof Error 
                ? updateBookMutation.error.message 
                : 'Failed to update book. Please try again.'}
            </p>
          </div>
        )}
        
        <BookForm
          mode="edit"
          initialData={book}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateBookMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default EditBook;