"use client";

import { useEffect, useState } from "react";
import { fetchBooks } from "@/services/book";
import { Book } from "@/types/book";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const loadBooks = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchBooks({
        page,
        limit: booksPerPage,
      });
      setBooks(result.data);
      setTotalPages(Math.ceil((result.total ?? 0) / booksPerPage));
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(currentPage);
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadBooks(nextPage); 
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      loadBooks(prevPage); 
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Books List</h1>
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
            {books.map((book) => (
              <tr key={book.title} className="hover:bg-gray-100 border-b">
                <td className="p-4 text-gray-800">{book.title}</td>
                <td className="p-4 text-gray-800">{book.authorId.name}</td>
                <td className="p-4 text-gray-800">{book.description || "N/A"}</td>
                <td className="p-4 text-gray-800">{book.publishedYear}</td>
                <td className="p-4 text-gray-800">{new Date(book.updatedAt).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2, cursor-pointer"
                    onClick={() => router.push(`/books/${book._id}`)}
                  >
                    <FaEdit />
                 </button>
                 <span className="mx-1"></span>
                  <button className="text-red-500 hover:text-red-700, cursor-pointer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
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
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}