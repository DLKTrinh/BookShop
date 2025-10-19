import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";

interface UploadImageProps {
  onImageChange: (file: File | null, preview: string) => void;
  imagePreview?: string;
}

export default function UploadImage({
  onImageChange,
  imagePreview = "",
}: UploadImageProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Field>
      <FieldLabel>Book Cover Image</FieldLabel>
      {!imagePreview ? (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full p-8 rounded-md border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
                ? "border-blue-400 bg-blue-900 bg-opacity-20"
                : "border-gray-600 bg-gray-800"
            }`}
        >
            <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageInput"
            />
            <label
            htmlFor="imageInput"
            className="flex flex-col items-center justify-center cursor-pointer"
            >
            <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
                />
            </svg>
            <p className="text-gray-300 font-medium">
                Click or drag to upload
            </p>
            <p className="text-gray-500 text-sm">
                Supported formats: JPG, PNG, WebP
            </p>
            </label>
        </div>
        ) : (
        <div className="mt-4 relative w-fit">
            <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 rounded-md object-cover"
            />
            <button
            type="button"
            onClick={() => onImageChange(null, "")}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition"
            aria-label="Remove image"
            >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            </button>
        </div>
        )}

    </Field>
  );
}