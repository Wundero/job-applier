import { z } from "zod";

export const UserPreferencesSchema = z.object({
  custom: z.record(z.string()).optional(),

  // Personal information
  pii: z.object({
    // Primary fields for most apps
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    resume: z
      .discriminatedUnion("type", [
        z.object({
          type: z.literal("url"),
          url: z.string().url(),
        }),
        z.object({
          type: z.literal("file"),
          file: z.string(),
        }),
        z.object({
          type: z.literal("text"),
          text: z.string().max(4095),
        }),
      ])
      .optional(),

    // Secondary fields for some apps
    pronouns: z.string().optional(),

    // Country statuses
    denizenships: z
      .array(
        z.object({
          country: z.string(),
          status: z.enum(["citizen", "resident", "visa", "other"]),
          requireSponsorship: z.boolean(),
        }),
      )
      .optional(),

    // USA EEOC fields
    eeoc: z.object({
      gender: z.enum(["male", "female", "decline"]).optional(),
      hispanic: z.discriminatedUnion("selection", [
        z.object({
          selection: z.literal("yes"),
        }),
        z.object({
          selection: z.literal("decline"),
        }),
        z.object({
          selection: z.literal("no"),
          race: z.enum([
            "native",
            "asian",
            "black",
            "white",
            "islander",
            "two+",
            "decline",
          ]),
        }),
      ]),
      veteran: z.enum(["yes", "no", "decline"]).optional(),
      disability: z.enum(["yes", "no", "decline"]).optional(),
    }),
  }),

  // Working preferences for searching
  filters: z.object({
    targetLocations: z
      .array(
        z.object({
          country: z.string(),
          city: z.string(),
        }),
      )
      .optional(),
    office: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("remote"),
          }),
          z.object({
            type: z.literal("hybrid"),
            daysInOffice: z.object({
              min: z.number().int().min(0).max(5),
              max: z.number().int().min(0).max(5),
            }),
          }),
          z.object({
            type: z.literal("in office"),
          }),
        ]),
      )
      .optional(),
  }),

  // Links
  links: z.object({
    linkedIn: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    portfolio: z
      .object({
        url: z.string().url(),
        password: z.string().optional(),
      })
      .optional(),
    custom: z.record(z.string().url()).optional(),
  }),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const JobStatusSchema = z.enum([
  "filling out",
  "applied",
  "in progress",
  "accepted",
  "rejected",
]);

export type JobStatus = z.infer<typeof JobStatusSchema>;
