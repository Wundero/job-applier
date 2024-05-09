import { relations } from "drizzle-orm";
import { index, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { JobStatus } from "@applier/validators";
import { v7 } from "@applier/id";

import { users } from "./auth";

export const jobSchema = pgSchema("job");

export const jobApplications = jobSchema.table(
  "job_application",
  {
    id: uuid("id").notNull().primaryKey().$default(v7),
    jobId: uuid("job_id").notNull(),
    userId: uuid("user_id").notNull(),
    status: text("status").$type<JobStatus>().notNull(),
    appliedAt: timestamp("applied_at"),
    reviewedAt: timestamp("reviewed_at"),
  },
  (app) => ({
    jobIdIdx: index("job_id_idx").on(app.jobId),
    userIdIdx: index("user_id_idx").on(app.userId),
  }),
);

export type JobApplication = typeof jobApplications.$inferSelect;

export const jobApplicationRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
    user: one(users, {
      fields: [jobApplications.userId],
      references: [users.id],
    }),
  }),
);

export const jobs = jobSchema.table(
  "job",
  {
    id: uuid("id").notNull().primaryKey().$default(v7),
    title: text("title").notNull(),
    description: text("description").notNull(),
    postedAt: timestamp("posted_at"),
    expiresAt: timestamp("expires_at"),
    company: text("company").notNull(),
    url: text("url").notNull(),
  },
  (job) => ({
    urlIdx: index("url_idx").on(job.url),
    companyIdx: index("company_idx").on(job.company),
    titleIdx: index("title_idx").on(job.title),
  }),
);

export type Job = typeof jobs.$inferSelect;

export const jobRelations = relations(jobs, ({ many }) => ({
  applicants: many(jobApplications),
}));
