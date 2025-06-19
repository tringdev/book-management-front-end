"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthor } from "@/services/author";
import { AuthorCreatePayload } from "@/types/author";
import { authorSchema } from "@/lib/validate/validateForm";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";

export default function CreateAuthorPage() {
  const [newAuthor, setNewAuthor] = useState<AuthorCreatePayload>({
    name: "",
    age: 0,
    userId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = async () => {
    try {
      await authorSchema.validate(newAuthor, { abortEarly: false });
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

  const handleCreateAuthor = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    try {
      await createAuthor(newAuthor);
      showSuccessToast("Author created successfully!");
      router.push("/authors");
    } catch (error: any) {
      console.error("Error creating author:", error);
      showErrorToast("Failed to create author: "+ error.message || "An error occurred");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Author
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateAuthor();
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newAuthor.name}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, name: e.target.value })
              }
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="text"
              value={newAuthor.age}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, age: Number(e.target.value) })
              }
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.age ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.push("/authors")}
            className="bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition ml-2"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
