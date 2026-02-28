import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  annualIncome: text("annual_income").notNull(),
  course: text("course").notNull(),
  yearOfStudy: text("year_of_study").notNull(),
  category: text("category"),
  gender: text("gender"),
  disabilityStatus: boolean("disability_status").default(false).notNull(),
  ruralUrban: text("rural_urban").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scholarshipMatches = pgTable("scholarship_matches", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  name: text("name").notNull(),
  governmentType: text("government_type").notNull(),
  benefitAmount: text("benefit_amount").notNull(),
  deadline: text("deadline").notNull(),
  matchConfidence: integer("match_confidence").notNull(),
  explainability: text("explainability").notNull(),
  requiredDocuments: jsonb("required_documents").$type<string[]>().notNull(),
  missedOpportunitiesScore: integer("missed_opportunities_score").notNull(),
});

export const insertProfileSchema = createInsertSchema(studentProfiles).omit({ id: true, createdAt: true });

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = z.infer<typeof insertProfileSchema>;
export type ScholarshipMatch = typeof scholarshipMatches.$inferSelect;
