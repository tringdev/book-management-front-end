export interface Book {
  _id: string;
  title: string;
  authorId: {
    id: string;
    name: string;
  };
  description?: string;
  publishedYear: number;
  userId: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface BookResponse {
  success: boolean;
  data: Book[];
  message?: string;
  error?: string;
  page?: number;
  total?: number;
}
export interface BookDetailResponse {
  success: boolean;
  data: Book;
  message?: string;
  error?: string;
}
export interface BookCreatePayload {
  title: string;
  authorId: string;
  description?: string;
  publishedYear: number;
  userId: string;
}
export interface BookUpdatePayload {
  _id: string;
  title: string;
  authorId: string;
  description?: string;
  publishedYear: number;
  userId: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
