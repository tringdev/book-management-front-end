"use client";

import { useEffect, useState } from "react";
import { fetchBooks } from "@/services/book";
import { Book, BookResponse } from "@/types/book";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const result = await fetchBooks({}); // Sử dụng hàm gọi API từ services
        setBooks(result.data); // Kiểm tra nếu result.data tồn tại
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books List</h1>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Published Year</th>
            <th className="p-2 text-left">Updated At</th>
            <th className="p-2 text-left w-20">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title} className="hover:bg-gray-100">
              <td className="p-2 text-left">{book.title}</td>
              <td className="p-2 text-left">{book.authorId.name}</td>
              <td className="p-2 text-left">{book.description || "N/A"}</td>
              <td className="p-2 text-left">{book.publishedYear}</td>
              <td className="p-2 text-left">{new Date(book.updatedAt).toLocaleDateString()}</td>
              <td className="p-2 text-center w-20">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                  onClick={() => router.push(`/books/${book._id}`)}
                >
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700 cursor-pointer">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}