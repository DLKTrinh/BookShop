// features/books/components/EditBookForm.tsx
import { useState, useEffect } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import GenreSelector from "./GenreSelector";
import UploadImage from "./UploadImage";
import { useUpdateBook } from "../hooks/useBookMutations";

interface EditBookFormProps {
  book: {
    _id: string;
    title: string;
    author: string;
    subjects?: string[];
    publication_date?: number;
    publisher?: string;
    quantity?: number;
    cover?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditBookForm({ book, onSuccess, onCancel }: EditBookFormProps) {
  const updateBookMutation = useUpdateBook();
  
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [genres, setGenres] = useState<string[]>(book.subjects || []);
  const [year, setYear] = useState(book.publication_date?.toString() || "");
  const [coverUrl, setCoverUrl] = useState(book.cover || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(book.cover || "");
  const [quantity, setQuantity] = useState<number | "">(book.quantity ?? "");
  const [publisher, setPublisher] = useState(book.publisher || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (file: File | null, preview: string) => {
    setCoverFile(file);
    setImagePreview(preview);
    if (errors.coverFile) {
      setErrors(prev => ({ ...prev, coverFile: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (genres.length === 0) newErrors.genres = "Select at least one genre";
    if (!year) newErrors.year = "Year is required";
    if (!publisher.trim()) newErrors.publisher = "Publisher is required";
    if (quantity === "" || quantity < 0) newErrors.quantity = "Valid quantity is required";
    if (!coverUrl.trim()) newErrors.coverUrl = "Cover URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    updateBookMutation.mutate(
      {
        id: book._id,
        data: {
          title,
          author,
          subjects: genres,
          publication_date: Number(year),
          publisher,
          quantity: Number(quantity),
          cover: coverUrl,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div>
      {updateBookMutation.isError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400">
            {updateBookMutation.error instanceof Error 
              ? updateBookMutation.error.message 
              : 'Failed to update book. Please try again.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
            <Field>
                <FieldLabel>Title *</FieldLabel>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                    }}
                    placeholder="Enter book title"
                    className={`w-full p-2 rounded-md bg-gray-800 border ${
                        errors.title ? 'border-red-500' : 'border-gray-600'
                    } text-gray-100 focus:border-blue-500 focus:outline-none`}
                />
                {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Author *</FieldLabel>
                    <input
                    type="text"
                    value={author}
                    onChange={(e) => {
                        setAuthor(e.target.value);
                        if (errors.author) setErrors(prev => ({ ...prev, author: "" }));
                    }}
                    placeholder="Enter author's name"
                    className={`w-full p-2 rounded-md bg-gray-800 border ${
                        errors.author ? 'border-red-500' : 'border-gray-600'
                    } text-gray-100 focus:border-blue-500 focus:outline-none`}
                    />
                {errors.author && (
                    <p className="text-red-400 text-sm mt-1">{errors.author}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Genre *</FieldLabel>
                <GenreSelector 
                    selectedGenres={genres} 
                    onChange={(newGenres) => {
                        setGenres(newGenres);
                        if (errors.genres) setErrors(prev => ({ ...prev, genres: "" }));
                    }}
                />
                {errors.genres && (
                    <p className="text-red-400 text-sm mt-1">{errors.genres}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Publisher *</FieldLabel>
                <input
                    type="text"
                    value={publisher}
                    onChange={(e) => {
                        setPublisher(e.target.value);
                        if (errors.publisher) setErrors(prev => ({ ...prev, publisher: "" }));
                    }}
                    placeholder="Enter publisher name"
                    className={`w-full p-2 rounded-md bg-gray-800 border ${
                        errors.publisher ? 'border-red-500' : 'border-gray-600'
                    } text-gray-100 focus:border-blue-500 focus:outline-none`}
                />
                {errors.publisher && (
                    <p className="text-red-400 text-sm mt-1">{errors.publisher}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Year of Publication *</FieldLabel>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        if (errors.year) setErrors(prev => ({ ...prev, year: "" }));
                    }}
                    placeholder="e.g., 2024"
                    min="1000"
                    max={new Date().getFullYear()}
                    className={`w-full p-2 rounded-md bg-gray-800 border ${
                        errors.year ? 'border-red-500' : 'border-gray-600'
                    } text-gray-100 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {errors.year && (
                    <p className="text-red-400 text-sm mt-1">{errors.year}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Quantity *</FieldLabel>
                <input
                type="number"
                value={quantity}
                onChange={(e) => {
                    setQuantity(e.target.value === "" ? "" : Number(e.target.value));
                    if (errors.quantity) setErrors(prev => ({ ...prev, quantity: "" }));
                }}
                min={0}
                placeholder="Enter quantity"
                className={`w-full p-2 rounded-md bg-gray-800 border ${
                    errors.quantity ? 'border-red-500' : 'border-gray-600'
                } text-gray-100 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {errors.quantity && (
                <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
                )}
            </Field>

            <Field>
                <FieldLabel>Cover Image URL *</FieldLabel>
                <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => {
                        setCoverUrl(e.target.value);
                        if (errors.coverUrl) setErrors(prev => ({ ...prev, coverUrl: "" }));
                    }}
                    placeholder="https://example.com/book-cover.jpg"
                    className={`w-full p-2 rounded-md bg-gray-800 border ${
                        errors.coverUrl ? 'border-red-500' : 'border-gray-600'
                    } text-gray-100 focus:border-blue-500 focus:outline-none`}
                />
                {errors.coverUrl && (
                    <p className="text-red-400 text-sm mt-1">{errors.coverUrl}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">
                    Provide a direct link to the book cover image
                </p>
            </Field>

            <Field>
                <FieldLabel>Upload Cover (Optional)</FieldLabel>
                <UploadImage
                    onImageChange={handleImageChange}
                    imagePreview={imagePreview}
                />
                <p className="text-gray-400 text-sm mt-1">
                    Upload an image file for future use (not currently sent to server)
                </p>
            </Field>
        </FieldGroup>
        

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={updateBookMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateBookMutation.isPending ? 'Updating...' : 'Update Book'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={updateBookMutation.isPending}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}