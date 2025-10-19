import Layout from "../../../components/Layout";
import { booksData as books } from "../../../data/booksData";
import BookCard from "../components/BookCard";
import AddBookCard from "../components/AddBookCard";
import SearchBar from "../components/SearchBar";
import BookFilter from "../components/BookFilter";
import BookSort from "../components/BookSort";

const Books: React.FC<{ username: string }> = ({ username }) => {
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
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        cover={book.cover}
                    />
                ))}

                <AddBookCard />
            </div>
        </Layout>
    );
};

export default Books;
