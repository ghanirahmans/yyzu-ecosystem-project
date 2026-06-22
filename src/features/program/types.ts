import { z } from "zod";
import { programSchema } from "./schema";

export type ProgramInput = z.infer<typeof programSchema>;
