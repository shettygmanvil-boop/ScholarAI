import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.profiles.create.path, async (req, res) => {
    try {
      const input = api.profiles.create.input.parse(req.body);
      const profile = await storage.createProfile(input);
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.profiles.get.path, async (req, res) => {
    const profile = await storage.getProfile(Number(req.params.id));
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.get(api.profiles.getMatches.path, async (req, res) => {
    const matches = await storage.getMatches(Number(req.params.id));
    res.json(matches);
  });

  app.post(api.profiles.generateMatches.path, async (req, res) => {
    try {
      const profileId = Number(req.params.id);
      const profile = await storage.getProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Check if we already have matches
      const existing = await storage.getMatches(profileId);
      if (existing.length > 0) {
        return res.json(existing);
      }

      const prompt = `
        You are an AI scholarship matching system.
        Generate 3-5 realistic (but mock) scholarship opportunities for the following student profile:
        State: ${profile.state}
        Income: ${profile.annualIncome}
        Course: ${profile.course}
        Year: ${profile.yearOfStudy}
        Category: ${profile.category || "N/A"}
        Gender: ${profile.gender || "N/A"}
        Disability: ${profile.disabilityStatus ? "Yes" : "No"}
        Location: ${profile.ruralUrban}

        Return a JSON object with a single key "matches" containing an array of objects with exactly these fields:
        - name (string)
        - governmentType (string) - "Government" or "Private"
        - benefitAmount (string) - e.g., "$5,000/year"
        - deadline (string) - e.g., "Oct 15, 2024"
        - matchConfidence (number 0-100)
        - explainability (string) - 2 sentence explanation of why they are a good match based on their profile
        - requiredDocuments (string array)
        - missedOpportunitiesScore (number 0-100) - e.g., 20 if they missed some due to late application
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      
      if (!parsed.matches || !Array.isArray(parsed.matches)) {
        throw new Error("Invalid response format from AI");
      }

      const matchesToInsert = parsed.matches.map((m: any) => ({
        profileId,
        name: m.name || "Unknown Scholarship",
        governmentType: m.governmentType || "Private",
        benefitAmount: m.benefitAmount || "Varies",
        deadline: m.deadline || "TBD",
        matchConfidence: typeof m.matchConfidence === 'number' ? m.matchConfidence : 80,
        explainability: m.explainability || "Good match based on profile.",
        requiredDocuments: Array.isArray(m.requiredDocuments) ? m.requiredDocuments : [],
        missedOpportunitiesScore: typeof m.missedOpportunitiesScore === 'number' ? m.missedOpportunitiesScore : 0,
      }));

      const inserted = await storage.createMatches(matchesToInsert);
      res.json(inserted);

    } catch (err) {
      console.error("Error generating matches:", err);
      res.status(500).json({ message: "Failed to generate matches" });
    }
  });

  return httpServer;
}
