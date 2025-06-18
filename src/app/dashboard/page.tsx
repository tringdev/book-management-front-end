import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 sm:p-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the dashboard! This is a simple example of a dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2 text-sm">
              View a summary of your account and recent activity.
            </p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition">
            <h2 className="text-xl font-semibold">Reports</h2>
            <p className="mt-2 text-sm">
              Access detailed reports and analytics.
            </p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow hover:bg-yellow-600 transition">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="mt-2 text-sm">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg shadow hover:bg-red-600 transition">
            <h2 className="text-xl font-semibold">Support</h2>
            <p className="mt-2 text-sm">
              Get help and support for your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}