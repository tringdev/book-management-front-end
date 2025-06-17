import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_URL)
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");

export async function apiFetch<T>(endpoint: string, options?: any): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const axiosInstance = axios.create({
    baseURL: API_URL.replace(/\/$/, ""), // Đặt base URL
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("auth_token") || ""}`, // Thêm token từ cookie
    },
  });
  try {
    const response = await axiosInstance({
      url: url,
      ...options,
    });
    return response.data as T; // Trả về dữ liệu từ response
  } catch (error: any) {
    if (error.response) {
      // Xử lý lỗi từ server
      throw new Error(error.response.data || error.response.statusText);
    }
    throw new Error(error.message || "An unknown error occurred");
  }
}
