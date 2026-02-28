import { db } from "./db";
import { studentProfiles, scholarshipMatches } from "@shared/schema";
import type { InsertStudentProfile, StudentProfile, ScholarshipMatch } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getProfile(id: number): Promise<StudentProfile | undefined>;
  getMatches(profileId: number): Promise<ScholarshipMatch[]>;
  createMatches(matches: Omit<ScholarshipMatch, "id">[]): Promise<ScholarshipMatch[]>;
}

export class DatabaseStorage implements IStorage {
  async createProfile(insertProfile: InsertStudentProfile): Promise<StudentProfile> {
    const [profile] = await db.insert(studentProfiles).values(insertProfile).returning();
    return profile;
  }

  async getProfile(id: number): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.id, id));
    return profile;
  }

  async getMatches(profileId: number): Promise<ScholarshipMatch[]> {
    return await db.select().from(scholarshipMatches).where(eq(scholarshipMatches.profileId, profileId));
  }

  async createMatches(matches: Omit<ScholarshipMatch, "id">[]): Promise<ScholarshipMatch[]> {
    if (matches.length === 0) return [];
    return await db.insert(scholarshipMatches).values(matches).returning();
  }
}

export const storage = new DatabaseStorage();
