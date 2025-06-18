"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menuItems from "@/constants/routes";

export default function Sidebar() {

  const pathname = usePathname(); 

  return (
    <div
      className="w-64 bg-gray-800 text-white fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col"
    >
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <li
                className={`p-2 rounded ${
                  pathname === item.path ? "bg-gray-700 text-white" : "hover:text-gray-300"
                }`}
              >
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}