import { z } from "zod";
import {
  addDivisionMemberSchema,
  removeDivisionMemberSchema,
  changeDivisionRoleSchema,
} from "./schema";

export type AddDivisionMemberInput = z.infer<typeof addDivisionMemberSchema>;
export type RemoveDivisionMemberInput = z.infer<typeof removeDivisionMemberSchema>;
export type ChangeDivisionRoleInput = z.infer<typeof changeDivisionRoleSchema>;
