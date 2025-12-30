import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format").max(100, "Email too long");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password too long")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

export const displayNameSchema = z
  .string()
  .min(2, "Name too short")
  .max(50, "Name too long")
  .regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
  role: z.enum(["admin", "user"]),
  phoneNumber: z.string().regex(/^[0-9+]{10,15}$/, "Phone number invalid"),
  dateOfBirth: z.date({ required_error: "Date of birth required" }),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required")
});
