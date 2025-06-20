"use client";

import { useEffect, useState } from "react";
import { fetchBooks, deleteBook } from "@/services/book";
import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";
import { useLoading } from "@/components/loading";
import { fetchAuthors } from "@/services/author";
import { Author } from "@/types/author";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchAuthorName, setSearchAuthorName] = useState<string>("");
  const router = useRouter();

  /**
   * Fetches books from the API based on the given parameters.
   * @param page The page number to fetch.
   * @param titleFilter The title to filter the books by.
   * @param searchAuthor The author ID to filter the books by.
   */
  const loadBooks = async (
    page: number,
    titleFilter?: string,
    searchAuthor?: string,
  ): Promise<void> => {
    try {
      // Fetch books from the API
      const result = await fetchBooks({
        page,
        limit: booksPerPage,
        title: titleFilter || "",
        authorId: searchAuthor || "",
      });
      // Update the state with the fetched books
      setBooks(result.data || []);
      // Update the total pages
      setTotalPages(Math.ceil((result.total ?? 0) / booksPerPage));
    } catch (error) {
      // Log any errors to the console
      console.error("Error loading books:", error);
    }
  };

  const loadAuthors = async () => {
    try {
      const result = await fetchAuthors({ name: searchAuthor });
      setAuthors(result.data || []);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };

  /**
   * Deletes a book from the API.
   * @param id The ID of the book to delete.
   */
  const handleDelete = async (id: string): Promise<void> => {
    // Prompt the user to confirm the deletion
    if (!confirm("Are you sure you want to delete this book?")) return;

    // Set the loading state to true
    setLoading(true);

    try {
      // Delete the book from the API
      await deleteBook(id);

      // Show a success toast
      showSuccessToast("Book deleted successfully!");

      // Reload the books
      loadBooks(currentPage);
    } catch (error: any) {
      // Log any errors to the console
      console.error("Error deleting book:", error);

      // Show an error toast
      showErrorToast(
        "Failed to delete book: " + (error.message || "Unknown error"),
      );
    } finally {
      // Set the loading state back to false
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBooks(currentPage, searchTitle, searchAuthor);
    setLoading(false);
  }, [currentPage, searchTitle, searchAuthor]);

  useEffect(() => {
    if (searchAuthorName.trim() !== "") {
      loadAuthors();
    } else {
      setAuthors([]);
      loadAuthors();
    }
  }, [searchAuthorName]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleSearch = () => {
    setCurrentPage(1);
    loadBooks(1, searchTitle, searchAuthor);
  };

  if (books.length === 0 && !filterVisible) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="text-gray-700 text-lg font-medium mb-6">
          No books found.
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/books/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create New Book
          </button>
        </div>
      </div>
    );
  }

  /**
 * BooksPage component displays a list of books with search and filter options.
 * It also provides pagination and actions to edit or delete books.
 */
return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Books List</h1>
        {/* Search and Filter Controls */}
        <div className="flex items-center space-x-2">
          {filterVisible && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Search by title"
                className="w-80 h-12 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type="text"
                  value={searchAuthorName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchAuthorName(value);
                    // Reset author filter if input is empty
                    if (value.trim() === "") {
                      setSearchAuthor("");
                      loadBooks(1, searchTitle, "");
                    }
                  }}
                  onFocus={() => setDropdownVisible(true)}
                  onBlur={() =>
                    setTimeout(() => setDropdownVisible(false), 200)
                  }
                  placeholder="Search author by name"
                  className="w-80 h-12 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Dropdown for author suggestions */}
                {isDropdownVisible && authors.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto">
                    {authors
                      .filter((author) =>
                        author.name
                          .toLowerCase()
                          .includes(searchAuthorName.toLowerCase())
                      )
                      .map((author) => (
                        <li
                          key={author._id}
                          onClick={() => {
                            setSearchAuthor(author._id);
                            setSearchAuthorName(author.name);
                            setDropdownVisible(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {author.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Search
              </button>
            </div>
          )}
          <button
            hidden={filterVisible}
            onClick={() => setFilterVisible((prev) => !prev)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Filter
          </button>
          <button
            onClick={() => router.push("/books/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create New Book
          </button>
        </div>
      </div>
      {/* Books Table */}
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-4 text-left font-semibold">Title</th>
            <th className="p-4 text-left font-semibold">Author</th>
            <th className="p-4 text-left font-semibold">Description</th>
            <th className="p-4 text-left font-semibold">Published Year</th>
            <th className="p-4 text-left font-semibold">Updated At</th>
            <th className="p-4 text-center font-semibold w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {filterVisible && books.length === 0 ? (
            /* No books found message when filter is applied */
            <tr>
              <td colSpan={6} className="p-6 text-center">
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-700 text-xl font-bold">
                    No books found
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.title} className="hover:bg-gray-100 border-b">
                <td className="p-4 text-gray-800">{book.title}</td>
                <td className="p-4 text-gray-800">{book.authorId.name}</td>
                <td className="p-4 text-gray-800">
                  {book.description || "N/A"}
                </td>
                <td className="p-4 text-gray-800">{book.publishedYear}</td>
                <td className="p-4 text-gray-800">
                  {new Date(book.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                    onClick={() => router.push(`/books/${book._id}`)}
                  >
                    <FaEdit />
                  </button>
                  <span className="mx-1"></span>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(book._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
}
