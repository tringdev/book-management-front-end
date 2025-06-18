"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetchBookById, updateBook } from "@/services/book";
import { Book } from "@/types/book";
import Loading from "@/components/loading";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    const loadBook = async () => {
      try {
        const result = await fetchBookById(id);
        setBook(result.data);
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleUpdate = async () => {
    if (typeof id === "string" && book) {
      try {
        await updateBook(id, book);
        alert("Book updated successfully!");
        router.push("/books");
      } catch (error) {
        console.error("Error updating book:", error);
        alert("Failed to update book.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Book not found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.push("/books")}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Back
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Book</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={book.description || ""}
              onChange={(e) =>
                setBook({ ...book, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="number"
              value={book.publishedYear}
              onChange={(e) =>
                setBook({ ...book, publishedYear: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
