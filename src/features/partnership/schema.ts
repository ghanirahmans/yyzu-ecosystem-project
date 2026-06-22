import { z } from "zod";

export const partnershipTypeSchema = z.enum(["KAMPUS", "INDUSTRI", "KOMUNITAS", "MENTOR_INDIVIDUAL"]);
export const partnershipStatusSchema = z.enum(["PROSPECT", "CONTACTED", "NEGOTIATING", "ACTIVE", "INACTIVE"]);

export const partnershipSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(150),
  type: partnershipTypeSchema,
  status: partnershipStatusSchema,
  contactName: z.string().max(100).optional().or(z.literal("")),
  contactInfo: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  picUserId: z.string().uuid("Invalid PIC selection").optional().or(z.literal("")),
});
