import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { BookOpen, Calendar, User, Tag, Factory, Layers } from "lucide-react";
import placeholder from "@/assets/placeholder.png";
import { useDeleteBook } from "../hooks/useBookMutations";
import { useAuth } from "@/features/auth/context/AuthContext";
import BackButton from "@/shared/components/BackButton";
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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
      <BackButton fallbackTo="/books" className="mb-6" />
      <Card className="bg-card border border-border rounded-2xl shadow-xl text-foreground">
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
              <h1 className="text-4xl font-bold mb-3 text-foreground">
                {book.title || "Untitled Book"}
              </h1>

              <p className="text-lg text-muted-foreground mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />{" "}
                {book.author || "Unknown Author"}
              </p>

              <ul className="space-y-2 text-muted-foreground">
                {book.subjects && book.subjects.length > 0 && (
                  <li className="flex items-start">
                    <Tag className="w-5 h-5 mr-2 mt-0.5 text-primary shrink-0" /> Subject(s):{" "}
                    <span className="text-foreground ml-1">
                      {book.subjects.join(", ")}
                    </span>
                  </li>
                )}

                {book.publisher && (
                  <li className="flex items-center">
                    <Factory className="w-5 h-5 mr-2 text-primary" /> Publisher:{" "}
                    <span className="text-foreground ml-1">{book.publisher}</span>
                  </li>
                )}

                {book.publication_date && (
                  <li className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" /> Published:{" "}
                    <span className="text-foreground ml-1">
                      {book.publication_date.toString()}
                    </span>
                  </li>
                )}

                <li className="flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-primary" /> Quantity:{" "}
                  <span className="text-foreground ml-1">
                    {book.quantity ?? 0}
                  </span>
                </li>

                <li className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" /> Status:{" "}
                  <span
                    className={`ml-1 font-semibold ${
                      isAvailable ? "text-success" : "text-destructive"
                    }`}
                  >
                    {statusText}
                  </span>
                </li>
              </ul>

              <p className="mt-6 text-muted-foreground leading-relaxed text-[1rem]">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 flex-wrap">
              {isAdmin && (
                <>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
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
                </>
              )}
              <Button
                className={`${
                  isAvailable
                    ? "bg-success hover:bg-success/90"
                    : "bg-muted cursor-not-allowed"
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
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Book
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-muted hover:bg-muted text-foreground border-input"
              disabled={deleteBookMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-foreground"
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