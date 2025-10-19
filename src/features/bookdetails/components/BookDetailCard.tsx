import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, Tag, Barcode } from "lucide-react";

interface BookDetailCardProps {
    book: {
        title: string;
        author: string;
        genre: string;
        isbn: string;
        published: string;
        status: string;
        description: string;
        cover: string;
    };
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({ book }) => {
    return (
        <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl text-gray-100">
            <CardContent className="flex flex-col md:flex-row gap-10 p-8">
                {/* Left: Book Cover */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="shadow-lg aspect-[2/3] object-cover"
                    />
                </div>

                {/* Right: Book Info */}
                <div className="flex flex-col justify-between flex-1">
                    <div>
                        <h1 className="text-4xl font-bold mb-3 text-white">{book.title}</h1>
                        <p className="text-lg text-gray-300 mb-6 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-400" /> {book.author}
                        </p>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center">
                                <Tag className="w-5 h-5 mr-2 text-blue-400" /> Genre:{" "}
                                <span className="text-gray-200 ml-1">{book.genre}</span>
                            </li>
                            <li className="flex items-center">
                                <Barcode className="w-5 h-5 mr-2 text-blue-400" /> ISBN:{" "}
                                <span className="text-gray-200 ml-1">{book.isbn}</span>
                            </li>
                            <li className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-blue-400" /> Published:{" "}
                                <span className="text-gray-200 ml-1">{book.published}</span>
                            </li>
                            <li className="flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-400" /> Status:{" "}
                                <span
                                className={`ml-1 font-semibold ${
                                    book.status === "Available"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                                >
                                {book.status}
                                </span>
                            </li>
                        </ul>

                        <p className="mt-6 text-gray-300 leading-relaxed text-[1rem]">
                            {book.description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4 flex-wrap">
                        <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                        <Button variant="destructive">Delete</Button>
                        <Button className="bg-green-600 hover:bg-green-700">Mark as Borrowed</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BookDetailCard;
