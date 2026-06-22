import { z } from "zod";
import { DivisionRole } from "@prisma/client";

export const addDivisionMemberSchema = z.object({
  divisionId: z.string().uuid(),
  username: z.string().min(3),
  role: z.nativeEnum(DivisionRole),
});

export const removeDivisionMemberSchema = z.object({
  divisionId: z.string().uuid(),
  membershipId: z.string().uuid(),
});

export const changeDivisionRoleSchema = z.object({
  divisionId: z.string().uuid(),
  membershipId: z.string().uuid(),
  role: z.nativeEnum(DivisionRole),
});
