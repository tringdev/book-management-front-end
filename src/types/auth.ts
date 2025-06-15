export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}
