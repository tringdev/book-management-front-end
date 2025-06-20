"use client";

import { useEffect, useState } from "react";
import { fetchAuthors, deleteAuthor } from "@/services/author";
import { Author } from "@/types/author";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";

/**
 * The AuthorsPage component displays a list of authors.
 */
export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchName, setSearchName] = useState("");
  const router = useRouter();

  /**
   * Loads authors from the API based on the given page and name filter.
   * @param page The page number to fetch.
   * @param nameFilter The name to filter authors by.
   */
  const loadAuthors = async (page: number, nameFilter?: string) => {
    setLoading(true);
    try {
      const result = await fetchAuthors({
        page,
        limit: authorsPerPage,
        title: nameFilter || "",
      });
      setAuthors(result.data || []);
      setTotalPages(Math.ceil((result.total ?? 0) / authorsPerPage));
    } catch (error) {
      console.error("Error loading authors: ", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes an author from the API.
   * @param id The ID of the author to delete.
   */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor(id);
      showSuccessToast("Author deleted successfully!");
      loadAuthors(currentPage);
    } catch (error: any) {
      console.error("Error deleting author:", error);
      showErrorToast("Failed to delete author: " + (error.message || "Unknown error"));
    }
  };

  useEffect(() => {
    loadAuthors(currentPage, searchName);
  }, [currentPage, searchName]);

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
    loadAuthors(1, searchName);
  };

  /**
   * Renders the authors list page.
   * @returns The JSX elements for the authors list page.
   */
  if (authors.length === 0 && !filterVisible) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="text-gray-700 text-lg font-medium mb-6">
          No authors found.
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/authors/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create New Author
          </button>
        </div>
      </div>
    );
  }

  /**
   * Renders the authors list page with filtering enabled.
   * @returns The JSX elements for the authors list page with filtering enabled.
   */
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Authors List</h1>
          <div className="flex items-center space-x-2">
            {filterVisible && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search by name"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              onClick={() => router.push("/authors/new")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Create New Author
            </button>
          </div>
        </div>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Age</th>
              <th className="p-4 text-left font-semibold">Created At</th>
              <th className="p-4 text-center font-semibold w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {filterVisible && authors.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center">
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-700 text-xl font-bold">No authors found</p>
                </div>
              </td>
            </tr>
            ) : (
              authors.map((author) => (
                <tr key={author._id} className="hover:bg-gray-100 border-b">
                  <td className="p-4 text-gray-800">{author.name}</td>
                  <td className="p-4 text-gray-800">{author.age}</td>
                  <td className="p-4 text-gray-800">
                    {new Date(author.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2, cursor-pointer"
                      onClick={() => router.push(`/authors/${author._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <span className="mx-1"></span>
                    <button className="text-red-500 hover:text-red-700, cursor-pointer"
                      onClick={() => handleDelete(author._id)}
                    > <FaTrash />
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

