import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { BookOpen, Calendar, User, Tag, Factory, Layers } from "lucide-react";
import placeholder from "@/assets/placeholder.png";
import { useDeleteBook } from "../hooks/useBookMutations";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookDetailCardProps {
  book: {
    _id?: string;
    title?: string;
    author?: string;
    subjects?: string[];
    publication_date?: number;
    quantity?: number;
    publisher?: string;
    description?: string;
    cover?: string;
  };
}

const BookDetailCard: React.FC<BookDetailCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const deleteBookMutation = useDeleteBook();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAvailable = (book.quantity ?? 0) > 0;
  const statusText = isAvailable ? "Available" : "Unavailable";

  const handleBack = () => {
      navigate(location.state?.from ?? "/books");
  };

  const handleEdit = () => {
    navigate(`/books/${book._id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (book._id) {
      deleteBookMutation.mutate(book._id, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          handleBack();
        },
      });
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white 
                  hover:bg-gray-800 rounded-lg transition-all mb-6 group 
                  border border-gray-700"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Back
      </button>
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

                {book.publication_date && (
                  <li className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" /> Published:{" "}
                    <span className="text-gray-200 ml-1">
                      {book.publication_date.toString()}
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
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={deleteBookMutation.isPending}
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Book
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              disabled={deleteBookMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookDetailCard;