import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Return Home
      </Link>
    </div>
  );
}