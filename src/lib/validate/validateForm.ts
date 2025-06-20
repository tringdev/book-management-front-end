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
      "Password must contain at least one special character.",
    )
    .required("Password is required."),
});

export const registerSchema = loginSchema.shape({
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const authorSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required."),
  age: yup
    .number()
    .min(1, "Age must be greater than or equal to 1.")
    .max(120, "Age must be less than or equal to 120.")
    .typeError("Age must be a number."),
});

export const bookSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Title is required."),
  authorId: yup
    .string()
    .trim()
    .required("Author is required."),
publishedYear: yup
  .number()
  .min(1, "Published year must be greater than or equal to 1.")
  .max(new Date().getFullYear(), "Published year must be less than or equal to the current year.")
  .required("Published year is required.")
  .typeError("Published year must be a number."),
});