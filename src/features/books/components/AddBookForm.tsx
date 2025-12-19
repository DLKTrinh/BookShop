import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import GenreSelector from "./GenreSelector";
import UploadImage from "./UploadImage";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (file: File | null, preview: string) => {
    setImage(file);
    setImagePreview(preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, author, genres, year, image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:border-blue-500 focus:outline-none"
          />
        </Field>
        <Field>
          <FieldLabel>Author</FieldLabel>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author's name"
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:border-blue-500 focus:outline-none"
          />
        </Field>
        <Field>
          <FieldLabel>Genre</FieldLabel>
          <GenreSelector selectedGenres={genres} onChange={setGenres} />
        </Field>
        <Field>
        <FieldLabel>Year of Publication</FieldLabel>
        <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 2024"
            min="1000"
            max={new Date().getFullYear()}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        </Field>
        <UploadImage
          onImageChange={handleImageChange}
          imagePreview={imagePreview}
        />
      </FieldGroup>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
      >
        Add Book
      </button>
    </form>
  );
}