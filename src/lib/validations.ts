import { z } from "zod";

// --- Auth ---
export const loginSchema = z.object({
  username: z.string().min(3, "Username or email must be at least 3 characters").max(100),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- Profile ---
export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

// --- Team ---
export const teamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(100),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().or(z.literal("")),
});

export const usefulLinkLabelCategorySchema = z.enum([
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
  category: usefulLinkLabelCategorySchema,
  notes: z.string().max(200, "Notes cannot exceed 200 characters").optional().or(z.literal("")),
});

export const submissionSchema = z.object({
  submissionLink: z.string().url("Must be a valid URL"),
});

// --- Program ---
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
  status: programStatusSchema,
  divisionIds: z.array(z.string().uuid("Invalid division selection")).default([]),
  picUserId: z.string().uuid("Invalid PIC user selection").optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
});

// --- Partnership ---
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
