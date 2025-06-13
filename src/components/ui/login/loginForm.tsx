"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validate/validateForm";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login } from "@/services/auth";
import { LoginResponse } from "@/types/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result: LoginResponse = await login(data);
      Cookies.set("auth_token", result.data.accessToken, { expires: 7, secure: true, sameSite: "strict" }); // Expires in 7 days
      showSuccessToast("Login successful!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000); 
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Login failed. Please try again.";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto mt-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome to the book management system!
        </h2>
        <div>
          <input
            className="w-full px-4 py-2 border rounded"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="relative">
          <input
            className="w-full px-4 py-2 border rounded"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
