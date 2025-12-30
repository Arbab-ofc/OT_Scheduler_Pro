import { z } from "zod";

export const scheduleSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  anesthesiologistId: z.string().min(1),
  otRoomNumber: z.string().min(1),
  surgeryType: z.string().min(1),
  surgeryDate: z.date(),
  scheduledStartTime: z.date(),
  scheduledEndTime: z.date().optional(),
  status: z.enum(["scheduled", "confirmed", "in-progress", "completed", "cancelled", "postponed", "emergency"]).default("scheduled"),
  priority: z.enum(["routine", "urgent", "emergency"]).default("routine")
});
