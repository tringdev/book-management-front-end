// src/components/ui/header/header.tsx
"use client";

import { useRouter } from "next/navigation";
import { handleLogout as logout } from "@/services/auth";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      logout(); 
      router.push("/login"); 
    }
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 z-50 h-16">
      <h1 className="text-xl font-bold">Book Management System</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-gray-300"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}