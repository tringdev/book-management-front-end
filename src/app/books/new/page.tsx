"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/services/book";
import { fetchAuthors } from "@/services/author";
import { BookCreatePayload } from "@/types/book";
import { Author } from "@/types/author";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";
import { bookSchema } from "@/lib/validate/validateForm";

export default function CreateBookPage() {
  // State to store form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // State to store the new book details
  const [newBook, setNewBook] = useState<BookCreatePayload>({
    title: "",
    authorId: "",
    description: "",
    publishedYear: new Date().getFullYear(),
    userId: "",
  });

  // State to store the list of authors
  const [authors, setAuthors] = useState<Author[]>([]);

  // State to store the search query for authors
  const [searchAuthor, setSearchAuthor] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Fetch and check authors based on the search query
    const fetchAndCheckAuthors = async () => {
      const result = await fetchAuthors({});
      if (result.data.length === 0) {
        if (
          confirm(
            "No authors found. You must create an author first. Do you want to go to the Authors page?",
          )
        ) {
          router.push("/authors");
        }
      }
    };
    fetchAndCheckAuthors();
  }, []);

  useEffect(() => {
    // Load authors based on the search query
    const loadAuthors = async () => {
      try {
        if (searchAuthor.trim() === "") {
          setAuthors([]);
          return;
        }
        const result = await fetchAuthors({ title: searchAuthor });
        setAuthors(result.data || []);
      } catch (error) {
        console.error("Error loading authors:", error);
        showErrorToast("Failed to load authors.");
      }
    };

    loadAuthors();
  }, [searchAuthor]);

  const loadAuthors = async () => {
    try {
      const result = await fetchAuthors({ name: searchAuthor });
      setAuthors(result.data || []);
      setDropdownVisible(result.data.length > 0);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };
  const handleAuthorSelect = (author: any) => {
    setNewBook({ ...newBook, authorId: author._id || "" });
    setSearchAuthor(author.name);
    setAuthors([]);
    setDropdownVisible(false);
  };

  /**
   * Validates the book form data.
   * @returns {Promise<boolean>} True if the form is valid, otherwise false.
   */
  const validateForm = async () => {
    try {
      await bookSchema.validate(newBook, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const validationErrors: Record<string, string> = {};
      validationError.inner.forEach((err: any) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }
  };

  /**
   * Handles the creation of a new book.
   */
  const handleCreateBook = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      await createBook(newBook);
      showSuccessToast("Book created successfully!");
      router.push("/books");
    } catch (error: any) {
      console.error("Error creating book:", error);
      showErrorToast(
        "Failed to create book: " + (error.message || "Unknown error"),
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Book
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateBook();
          }}
          className="space-y-6"
        >
          {/* Book Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              placeholder="Enter book title"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          {/* Book Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newBook.description || ""}
              rows={4}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
              placeholder="Enter book description"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          {/* Author Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchAuthor}
                onChange={(e) => {
                  setSearchAuthor(e.target.value);
                  if (e.target.value.trim() !== "") {
                    loadAuthors();
                  } else {
                    setAuthors([]);
                    setDropdownVisible(false);
                  }
                }}
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                placeholder="Search author by name"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.authorId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {isDropdownVisible && authors.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto">
                  {authors.map((author) => (
                    <li
                      key={author._id}
                      onClick={() => handleAuthorSelect(author)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {author.name}
                    </li>
                  ))}
                </ul>
              )}
              {errors.authorId && (
                <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>
              )}
            </div>
          </div>
          {/* Published Year Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="number"
              value={newBook.publishedYear}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  publishedYear: Number(e.target.value),
                })
              }
              placeholder="Enter published year"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.publishedYear
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.publishedYear && (
              <p className="text-red-500 text-sm mt-1">
                {errors.publishedYear}
              </p>
            )}
          </div>
          {/* Form Buttons */}
          <div className="flex justify-start space-x-4">
            <button
              type="button"
              onClick={() => router.push("/books")}
              className="bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
