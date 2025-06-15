import { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";
import { apiFetch } from "@/lib/utils/api";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  return apiFetch<void>("auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};