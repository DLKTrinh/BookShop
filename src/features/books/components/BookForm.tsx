import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import UploadImage from "./UploadImage";
import SubjectsCombobox from "./SubjectsCombobox";

interface BookFormData {
  title: string;
  author: string;
  subjects: string[];
  publication_date: number;
  publisher: string;
  quantity: number;
  cover: string;
}

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  mode?: 'add' | 'edit';
}

export default function BookForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  submitButtonText,
  mode = 'add'
}: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [subjects, setsubjects] = useState<string[]>(initialData?.subjects || []);
  const [year, setYear] = useState<number | null>(initialData?.publication_date ?? null);
  const [coverUrl, setCoverUrl] = useState(initialData?.cover || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.cover || "");
  const [quantity, setQuantity] = useState<number | "">(initialData?.quantity ?? "");
  const [publisher, setPublisher] = useState(initialData?.publisher || "");
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
    if (subjects.length === 0) newErrors.subjects = "Select at least one subject";
    if (quantity === "" || quantity < 0) newErrors.quantity = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFormData = (formState: {
    title: string;
    author: string;
    subjects: string[];
    year: string;
    publisher: string;
    quantity: number | "";
    coverUrl: string;
  }) => {
    const data: any = {
      title: formState.title,
      author: formState.author,
      subjects: formState.subjects,
      quantity: Number(formState.quantity),
    };

    // Only add optional fields if they're not empty
    if (formState.publisher.trim()) {
      data.publisher = formState.publisher.trim();
    }

    if (formState.year.trim()) {
      data.publication_date = Number(formState.year);
    }

    if (formState.coverUrl.trim()) {
      data.cover = formState.coverUrl.trim();
    }

    return data;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const data = buildFormData({
      title,
      author,
      subjects,
      year: year !== null ? year.toString() : "",
      publisher,
      quantity,
      coverUrl,
    });

    onSubmit(data);
  };

  const buttonText = submitButtonText || (mode === 'add' ? 'Add Book' : 'Update Book');
  const loadingText = mode === 'add' ? 'Adding Book...' : 'Updating...';

  return (
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
          <FieldLabel>subject(s) *</FieldLabel>
          <SubjectsCombobox
            selectedSubjects={subjects}
            onChange={(newsubjects) => {
              setsubjects(newsubjects);
              if (errors.subjects) setErrors(prev => ({ ...prev, subjects: "" }));
            }}
          />
          {errors.subjects && (
            <p className="text-red-400 text-sm mt-1">{errors.subjects}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Publisher </FieldLabel>
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
          <FieldLabel>Year of Publication </FieldLabel>
          <input
            type="number"
            value={year ?? ""}
            onChange={(e) => {
              setYear(e.target.value === "" ? null : Number(e.target.value));
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
          <FieldLabel>Cover Image URL</FieldLabel>
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
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? loadingText : buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}