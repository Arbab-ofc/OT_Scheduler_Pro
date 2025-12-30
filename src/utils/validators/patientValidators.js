import { z } from "zod";

export const patientSchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  phoneNumber: z.string().regex(/^[0-9+]{10,15}$/),
  email: z.string().email().optional(),
  emergencyContact: z.object({
    name: z.string().min(1),
    relationship: z.string().min(1),
    phoneNumber: z.string().regex(/^[0-9+]{10,15}$/)
  }),
  status: z.enum(["admitted", "discharged", "scheduled"]).default("scheduled")
});
