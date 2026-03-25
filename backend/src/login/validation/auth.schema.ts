// backend/src/login/validation/auth.schema.ts
import { z } from 'zod'

  // LOGIN
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(128),
})

  // PASSWORD BASE RULE
const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  })

  // SELF REGISTER (PUBLIC)
  // - Δεν επιτρέπεται roles
  // - Default role = USER (handled in DAO)
export const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: passwordSchema,
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
})

  // CREATE USER (ADMIN ACTION)
export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: passwordSchema,
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  roles: z.array(z.enum(['ADMIN', 'STAFF', 'USER'])).optional(),
})

  // UPDATE USER
export const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  password: passwordSchema.optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  roles: z.array(z.enum(['ADMIN', 'STAFF', 'USER'])).optional(),
})