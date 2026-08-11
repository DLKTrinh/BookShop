import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookForm from "../components/BookForm";
import { useBook } from "../hooks/useBook";
import { useUpdateBook } from "../hooks/useBookMutations";

const EditBook: React.FC<{ username: string }> = ({ username }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: book, isLoading, error } = useBook(id!);
  const updateBookMutation = useUpdateBook();

  const handleSubmit = (data: any) => {
    updateBookMutation.mutate(
      { id: id!, data },
      {
        onSuccess: () => {
          navigate(location.state?.from ?? `/books/${id}`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(location.state?.from ?? `/books/${id}`);
  };

  if (isLoading) {
    return (
      <Layout username={username}>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-gray-300 animate-pulse">Loading book...</p>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout username={username}>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-red-400">Book not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout username={username}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Book</h1>
          <p className="text-gray-400">Update book information</p>
        </div>

        {updateBookMutation.isError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-400">
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