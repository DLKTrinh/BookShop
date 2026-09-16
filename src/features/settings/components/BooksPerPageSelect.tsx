import React, { useState } from "react";
import { toast } from "sonner";
import {
  BOOKS_PER_PAGE_KEY,
  BOOKS_PER_PAGE_OPTIONS,
  getBooksPerPage,
} from "../constants/preferences";

export const BooksPerPageSelect: React.FC = () => {
  const [booksPerPage, setBooksPerPage] = useState(getBooksPerPage());
  const [isOpen, setIsOpen] = useState(false);

  const handleBooksPerPageChange = (value: number) => {
    setBooksPerPage(value);
    localStorage.setItem(BOOKS_PER_PAGE_KEY, String(value));
    toast.success(`Books per page set to ${value}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white font-medium">Books per page</p>
        <p className="text-sm text-gray-400">
          Default number of books shown per page on the Books list.
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg
                     text-white hover:bg-gray-700 transition-colors select-none
                     outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
        >
          {booksPerPage}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 min-w-[100px] py-1">
              {BOOKS_PER_PAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    handleBooksPerPageChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    booksPerPage === option
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};