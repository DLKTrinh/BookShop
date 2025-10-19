import Layout from "@/components/Layout";
import BookDetailCard from "../components/BookDetailCard";

const BookDetail: React.FC<{ username: string }> = ({ username }) => {
  const book = {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    genre: "Software Engineering",
    isbn: "978-0201616224",
    published: "1999",
    status: "Available",
    description:
      "A classic book offering practical advice and timeless principles for software developers. It focuses on craftsmanship, adaptability, and continuous improvement.",
    cover:
      "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX258_BO1,204,203,200_.jpg",
  };

  return (
    <Layout username={username}>
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <BookDetailCard book={book} />
      </div>
    </Layout>
  );
};

export default BookDetail;
