import { AuthorResponse, AuthorDetailResponse, Author } from "@/types/author";
import { apiFetch } from "@/lib/utils/api";

export const fetchAuthors = async (params: any): Promise<AuthorResponse> => {
  return apiFetch<AuthorResponse>("author", {
    method: "GET",
    params,
  });
};

export const fetchAuthorById = async (id: string): Promise<AuthorDetailResponse> => {
  return apiFetch<AuthorDetailResponse>(`author/${id}`, {
    method: "GET",
  });
};

export const updateAuthor = async (id: string, author: Partial<Author>): Promise<void> => {
  return apiFetch<void>(`author/${id}`, {
    method: "PUT",
    data: author,
  });
};

export const createAuthor = async (author: Partial<Author>): Promise<void> => {
  return apiFetch<void>("author", {
    method: "POST",
    data: author,
  });
};

export const deleteAuthor = async (id: string): Promise<void> => {
  return apiFetch<void>(`author/${id}`, {
    method: "DELETE",
  });
};