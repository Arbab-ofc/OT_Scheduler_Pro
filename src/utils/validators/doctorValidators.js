import { z } from "zod";
import { emailSchema } from "./authValidators";

export const doctorSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: emailSchema,
  phoneNumber: z.string().regex(/^[0-9+]{10,15}$/, "Phone number invalid"),
  specialization: z.string().min(2),
  licenseNumber: z.string().min(6).max(20),
  department: z.string().min(2),
  availableDays: z.array(z.string()).min(1),
  workingHours: z.object({
    start: z.string(),
    end: z.string()
  }),
  weeklyHoursLimit: z.number().min(20).max(60).default(40),
  status: z.enum(["active", "inactive", "on-leave"]).default("active")
});
