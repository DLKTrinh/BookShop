import { useParams } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import BookDetailCard from "../components/BookDetailCard";
import { useBook } from "../hooks/useBook";

const BookDetail: React.FC<{ username: string }> = ({ username }) => {
  const { id } = useParams<{ id: string }>();

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
        <BookDetailCard book={book} />
      </div>
    </Layout>
  );
};

export default BookDetail;