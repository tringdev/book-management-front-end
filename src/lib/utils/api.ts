import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_URL)
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");

export async function apiFetch<T>(endpoint: string, options?: any): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const axiosInstance = axios.create({
    baseURL: API_URL.replace(/\/$/, ""),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("auth_token") || ""}`,
    },
  });
  try {
    const response = await axiosInstance({
      url: url,
      ...options,
    });
    return response.data as T;
  } catch (error: any) {
   throw {
      message: error.response?.data?.message || error.message || "An unknown error occurred",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
  }
}
