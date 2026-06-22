import { z } from "zod";

export const programStatusSchema = z.enum([
  "DRAFT",
  "PERSIAPAN",
  "PUBLIKASI",
  "EVALUASI",
  "SELESAI",
  "DIBATALKAN",
]);

export const programSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().or(z.literal("")),
  status: programStatusSchema.optional(),
  divisionIds: z.array(z.string().uuid("Invalid division selection")).default([]),
  picUserId: z.string().uuid("Invalid PIC user selection").optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
});
