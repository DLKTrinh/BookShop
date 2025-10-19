import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddBookCard() {
  return (
    <Link
      to="/books/new"
      className="flex flex-col items-center justify-center border-4 border-dashed border-gray-500 text-gray-500 rounded-2xl cursor-pointer transition-all duration-200 hover:border-gray-300 hover:text-gray-300 h-auto"
    >
      <Plus size={48} />
      <p className="mt-2 text-lg font-medium">Add new book</p>
    </Link>
  );
}
