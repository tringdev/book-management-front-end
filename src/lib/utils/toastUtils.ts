import { toast } from "react-toastify";

export const showSuccessToast = (message: string, options = {}) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    ...options,
  });
};

export const showErrorToast = (message: string, options = {}) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    ...options,
  });
};