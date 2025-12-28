// features/books/pages/EditBook.tsx
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import EditBookForm from "../components/EditBookForm";
import { useBook } from "../hooks/useBook";

const EditBook: React.FC<{ username: string }> = ({ username }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading, error } = useBook(id!);

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

        <EditBookForm 
          book={book}
          onSuccess={() => navigate(-1)}
          onCancel={() => navigate(-1)}
        />
      </div>
    </Layout>
  );
};

export default EditBook;