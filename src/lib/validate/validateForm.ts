import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
});