import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/shared/components/Layout";
import BookDetailCard from "../components/BookDetailCard";
import { useBook } from "../hooks/useBook";

const BookDetail: React.FC<{ username: string }> = ({ username }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: book, isLoading, error } = useBook(id!);
  
  if (isLoading)
    return (
      <Layout username={username}>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-gray-300 animate-pulse">Loading book details...</p>
        </div>
      </Layout>
    );
  
  if (error)
    return (
      <Layout username={username}>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-red-400">Error loading book details</p>
          <p className="text-sm text-gray-400 mt-2">{String(error)}</p>
        </div>
      </Layout>
    );
  
  if (!book)
    return (
      <Layout username={username}>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-gray-400">Book not found</p>
        </div>
      </Layout>
    );
  
  return (
    <Layout username={username}>
      <div className="max-w-6xl mx-auto mt-12">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white 
                     hover:bg-gray-800 rounded-lg transition-all mb-6 group border border-gray-700"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <BookDetailCard book={book} />
      </div>
    </Layout>
  );
};

export default BookDetail;