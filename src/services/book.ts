import { Book, BookResponse, BookDetailResponse, BookUpdatePayload } from "@/types/book";
import { apiFetch } from "@/lib/utils/api";

export const fetchBooks = async (params: any): Promise<BookResponse> => {
  return apiFetch<BookResponse>("book", {
    method: "GET",
    params
  });
};

export const fetchBookById = async (id: string): Promise<BookDetailResponse> => {
 return apiFetch<BookDetailResponse>(`book/${id}`, {
    method: "GET",
  });
};

export const updateBook = async (id: string, book: Partial<BookUpdatePayload>): Promise<void> => {
return apiFetch<void>(`book/${id}`, {
    method: "PUT",
    data: JSON.stringify(book),
    headers: {
      "Content-Type": "application/json",
    },
  });
};