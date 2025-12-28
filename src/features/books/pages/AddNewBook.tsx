import Layout from "@/shared/components/Layout";
import AddBookForm from "../components/AddBookForm";
import { useNavigate } from "react-router-dom";

const AddNewBook: React.FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();

  return (
    <Layout username={username}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
          <p className="text-gray-400">Fill in the details to add a new book</p>
        </div>

        <AddBookForm 
          onSuccess={() => navigate('/books')}
          onCancel={() => navigate('/books')}
        />
      </div>
    </Layout>
  );
};

export default AddNewBook;