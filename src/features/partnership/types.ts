import { z } from "zod";
import { partnershipSchema } from "./schema";

export type PartnershipInput = z.infer<typeof partnershipSchema>;
