"use client";
import { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";
import { apiFetch } from "@/lib/utils/api";
import Cookies from "js-cookie";
import router from "next/router";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>("auth/login", {
    method: "POST",
    data: JSON.stringify(payload),
  });
};

export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  return apiFetch<void>("auth/register", {
    method: "POST",
    data: JSON.stringify(payload),
  });
};
export const handleLogout = () => {
  Cookies.remove("auth_token");
};
