import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, Tag, Factory, Layers } from "lucide-react";
import placeholder from "@/assets/placeholder.png";

interface BookDetailCardProps {
  book: {
    _id?: string;
    title?: string;
    author?: string;
    subjects?: string[];
    ["publication date"]?: number;
    quantity?: number;
    publisher?: string;
    description?: string;
    cover?: string;
  };
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({ book }) => {
  const isAvailable = (book.quantity ?? 0) > 0;
  const statusText = isAvailable ? "Available" : "Unavailable";

  return (
    <Card className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl text-gray-100">
      <CardContent className="flex flex-col md:flex-row gap-10 p-8">
        {/* Left: Book Cover */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={book.cover || placeholder}
            alt={book.title || "No title"}
            className="w-64 aspect-[2/3] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Book Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-4xl font-bold mb-3 text-white">
              {book.title || "Untitled Book"}
            </h1>

            <p className="text-lg text-gray-300 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-400" />{" "}
              {book.author || "Unknown Author"}
            </p>

            <ul className="space-y-2 text-gray-400">
              {book.subjects && book.subjects.length > 0 && (
                <li className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-400" /> Subjects:{" "}
                  <span className="text-gray-200 ml-1">
                    {book.subjects.join(", ")}
                  </span>
                </li>
              )}

              {book.publisher && (
                <li className="flex items-center">
                  <Factory className="w-5 h-5 mr-2 text-blue-400" /> Publisher:{" "}
                  <span className="text-gray-200 ml-1">{book.publisher}</span>
                </li>
              )}

              {book["publication date"] && (
                <li className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" /> Published:{" "}
                  <span className="text-gray-200 ml-1">
                    {book["publication date"].toString()}
                  </span>
                </li>
              )}

              <li className="flex items-center">
                <Layers className="w-5 h-5 mr-2 text-blue-400" /> Quantity:{" "}
                <span className="text-gray-200 ml-1">
                  {book.quantity ?? 0}
                </span>
              </li>

              <li className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" /> Status:{" "}
                <span
                  className={`ml-1 font-semibold ${
                    isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {statusText}
                </span>
              </li>
            </ul>

            <p className="mt-6 text-gray-300 leading-relaxed text-[1rem]">
              {book.description || "No description available for this book."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
            <Button variant="destructive">Delete</Button>
            <Button
              className={`${
                isAvailable
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!isAvailable}
            >
              Mark as Borrowed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookDetailCard;