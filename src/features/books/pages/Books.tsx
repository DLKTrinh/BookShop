import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import BookCard from "../components/BookCard";
import AddBookCard from "../components/AddBookCard";
import SearchBar from "../components/SearchBar";
import BookFilter from "../components/BookFilter";
import BookSort from "../components/BookSort";
import placeholder from "../../../assets/placeholder.png";

const Books: React.FC<{ username: string }> = ({ username }) => {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/books");
                const data = await res.json();
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        };
        fetchBooks();
    }, []);
    return (
        <Layout username={username}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                    <BookSort />
                    <BookFilter />
                </div>
                    <SearchBar />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {books.map((book) => (
                <BookCard
                    key={book._id}
                    id={book._id}
                    title={book.title}
                    author={book.author || "Unknown Author"}
                    cover={book.cover || placeholder}
                />
                ))}

                <AddBookCard />
            </div>
        </Layout>
    );
};  

export default Books;
