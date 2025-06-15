"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/validate/validateForm";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toastUtils";
import { useState } from "react";
import { RegisterPayload } from "@/types/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      await registerUser(data);
      showSuccessToast("Registration successful!");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
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
          Create a new account
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
        <div className="relative">
          <input
            className="w-full px-4 py-2 border rounded"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          type="button"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </button>
      </form>
    </>
  );
}