"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetchBookById, updateBook } from "@/services/book";
import { Book, BookUpdatePayload } from "@/types/book";
import { Author } from "@/types/author"; 
import { fetchAuthors } from "@/services/author";
import { useLoading } from "@/components/loading";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [bookUpdate, setBookUpdate] = useState<BookUpdatePayload | null>(null);
  const { setLoading } = useLoading();
  const [authors, setAuthors] = useState<Author[]>([]);
  
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    const loadBook = async () => {
      try {
        const result = await fetchBookById(id);
        setBook(result.data);
        setBookUpdate({
          ...result.data,
          authorId: result.data.authorId.id,
        });
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const loadAuthors = async () => {
    try {
      const result = await fetchAuthors({});
      setAuthors(result.data || []);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };

  useEffect(() => {
loadAuthors();
  }, []);

  const handleUpdate = async () => {
    console.log("Updating book with:", bookUpdate);
    if (typeof id === "string" && bookUpdate) {
      try {
        await updateBook(id, bookUpdate);
        showSuccessToast("Book updated successfully!");
        router.push("/books");
      } catch (error: any) {
        console.error("Error updating book:", error);
        showErrorToast("Failed to update book. ", error.message);
      }
    }
  };

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
              value={bookUpdate?.title || ""}
              onChange={(e) =>
                setBookUpdate((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              placeholder="Enter book title"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={bookUpdate?.description || ""}
              onChange={(e) =>
                setBookUpdate((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <Select
              value={book.authorId?.id || ""}
              onValueChange={(value) => {
                setBookUpdate((prev) =>
                  prev
                    ? {
                        ...prev,
                        authorId: value,
                      }
                    : null
                );
                setBook((prev) =>
                  prev ? { ...prev, authorId: { id: value, name: "" } } : null
                );
              }}
            >
              <SelectTrigger className="w-full h-12 min-h-[48px] [&>span]:py-3">
                <SelectValue
                  className="text-black"
                  placeholder={book.authorId.name}
                />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author._id} value={author._id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="number"
              value={book.publishedYear}
              onChange={(e) =>
                setBookUpdate((prev) =>
                  prev ? { ...prev, publishedYear: Number(e.target.value) } : null
                )
              }
              placeholder="Enter published year"
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

