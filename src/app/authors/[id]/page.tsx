"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetchAuthorById, updateAuthor } from "@/services/author";
import { Author } from "@/types/author";
import { useLoading } from "@/components/loading";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";

export default function AuthorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    const loadAuthor = async () => {
      try {
        const result = await fetchAuthorById(id);
        setAuthor(result.data);
      } catch (error) {
        console.error("Error loading author: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthor();
  }, [id]);

  const handleUpdate = async () => {
    if (typeof id === "string" && author) {
      try {
        await updateAuthor(id, author);
        showSuccessToast("Author updated successfully!");
        router.push("/authors");
      } catch (error :any) {
        console.log("Error updating author:", error);
        showErrorToast("Error updating author: " + error.message || "Failed to update author.");
      }
    }
  };

  if (!author) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Author not found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.push("/authors")}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Back
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Author</h1>
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
              Name
            </label>
            <input
              type="text"
              value={author.name}
              onChange={(e) => setAuthor({ ...author, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={author.age}
              onChange={(e) =>
                setAuthor({ ...author, age: Number(e.target.value) })
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