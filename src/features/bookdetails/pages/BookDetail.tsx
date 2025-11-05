import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import BookDetailCard from "../components/BookDetailCard";

const BookDetail: React.FC<{ username: string }> = ({ username }) => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!res.ok) throw new Error("Failed to fetch book details");
        const data = await res.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading)
    return (
      <Layout username={username}>
        <div className="text-center mt-12 text-gray-400">Loading book details...</div>
      </Layout>
    );

  if (error)
    return (
      <Layout username={username}>
        <div className="text-center mt-12 text-red-400">Error: {error}</div>
      </Layout>
    );

  if (!book)
    return (
      <Layout username={username}>
        <div className="text-center mt-12 text-gray-400">Book not found</div>
      </Layout>
    );

  return (
    <Layout username={username}>
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <BookDetailCard book={book} />
      </div>
    </Layout>
  );
};

export default BookDetail;
