export interface Author {
  _id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

export interface AuthorResponse {
  success: boolean;
  data: Author[];
  message?: string;
  error?: string;
  page?: number;
  total?: number;
}

export interface AuthorDetailResponse {
  success: boolean;
  data: Author;
  message?: string;
  error?: string;
}
export interface AuthorCreatePayload {
  name: string;
  age: number;
  userId: string;
}