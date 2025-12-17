import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddBookCard() {
  return (
    <Link
      to="/books/new"
      className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border-4 border-dashed border-gray-500 text-gray-400 hover:border-gray-300 hover:text-gray-300"
    >
      {/* Match the same aspect ratio as BookCard */}
      <div className="relative aspect-[2/3] w-full flex items-center justify-center">
        <Plus size={64} />
      </div>

      {/* Match the info section height */}
      <div className="py-1 px-3 text-center flex flex-col justify-center h-20">
        <p className="text-lg font-medium">Add new book</p>
      </div>
    </Link>
  );
}
