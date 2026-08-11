import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookForm from "../components/BookForm";
import { useAddBook } from "../hooks/useBookMutations";

const AddNewBook: React.FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const addBookMutation = useAddBook();

  const handleSubmit = (data: any) => {
    addBookMutation.mutate(data, {
      onSuccess: () => {
        navigate(location.state?.from ?? "/books");
      },
    });
  };

  const handleCancel = () => {
    navigate(location.state?.from ?? "/books");
  };

  return (
    <Layout username={username}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
          <p className="text-gray-400">Fill in the details to add a new book</p>
        </div>
        
        <BookForm
          mode="add"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={addBookMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default AddNewBook;