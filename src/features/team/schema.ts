import { z } from "zod";

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export const teamSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(60, "Team name cannot exceed 60 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type TeamSchemaInput = z.infer<typeof teamSchema>;

// ---------------------------------------------------------------------------
// Useful link
// ---------------------------------------------------------------------------

export const linkCategorySchema = z.enum([
  "GITHUB",
  "JIRA",
  "NOTION",
  "FIGMA",
  "DISCORD",
  "GOOGLE_DRIVE",
  "DOCUMENTATION",
  "OTHER",
]);

export const usefulLinkSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  url: z.string().url("Must be a valid URL"),
  category: linkCategorySchema,
  notes: z
    .string()
    .max(200, "Notes cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
});

export type UsefulLinkSchemaInput = z.infer<typeof usefulLinkSchema>;

// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------

export const submissionSchema = z.object({
  submissionLink: z.string().url("Must be a valid URL"),
});

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;

// ---------------------------------------------------------------------------
// Review submission
// ---------------------------------------------------------------------------

export const reviewSubmissionSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
  status: z.enum(["APPROVED", "REVISION"]),
  feedback: z.string().max(1000).optional(),
});

export type ReviewSubmissionSchemaInput = z.infer<typeof reviewSubmissionSchema>;
