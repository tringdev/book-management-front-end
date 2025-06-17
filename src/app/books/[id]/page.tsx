"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetchBookById, updateBook } from "@/services/book";
import { Book } from "@/types/book";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id || typeof id !== "string") return;
    setLoading(true);
    const loadBook = async () => {
      if (typeof id === "string" && id) {
        try {
          const result = await fetchBookById(id); 
          setBook(result.data);
        } catch (error) {
          console.error("Error loading book:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBook();
  }, [id]);

  const handleUpdate = async () => {
     if (typeof id === 'string' && book) { 
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Book not found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={book.description || ""}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Published Year
          </label>
          <input
            type="number"
            value={book.publishedYear}
            onChange={(e) =>
              setBook({ ...book, publishedYear: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
