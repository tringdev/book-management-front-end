import { LoginPayload, LoginResponse } from "@/types/auth";
import { apiFetch } from "@/lib/utils/api";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};