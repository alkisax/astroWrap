// backend\src\login\validation\auth.schema.sql.ts
import { z } from "zod";

/* =========================
   LOGIN
========================= */
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
});

/* =========================
   PASSWORD RULE
========================= */
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain at least one special character",
  });

/* =========================
   SELF REGISTER
========================= */
export const registerSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: passwordSchema,
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

/* =========================
   CREATE USER (ADMIN)
========================= */
export const createUserSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: passwordSchema,
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  role: z.enum(["ADMIN", "STAFF", "USER"]).optional(),
  natalChart: z.string().optional(),
  natalDelineation: z.string().optional(),
});

/* =========================
   UPDATE USER
========================= */
export const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  password: passwordSchema.optional(),
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  role: z.enum(["ADMIN", "STAFF", "USER"]).optional(),
  natalChart: z.string().optional(),
  natalDelineation: z.string().optional(),
});
