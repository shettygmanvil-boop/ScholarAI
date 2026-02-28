import { z } from 'zod';
import { insertProfileSchema, studentProfiles, scholarshipMatches } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  profiles: {
    create: {
      method: 'POST' as const,
      path: '/api/profiles' as const,
      input: insertProfileSchema,
      responses: {
        201: z.custom<typeof studentProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/profiles/:id' as const,
      responses: {
        200: z.custom<typeof studentProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getMatches: {
      method: 'GET' as const,
      path: '/api/profiles/:id/matches' as const,
      responses: {
        200: z.array(z.custom<typeof scholarshipMatches.$inferSelect>()),
      },
    },
    generateMatches: {
      method: 'POST' as const,
      path: '/api/profiles/:id/generate-matches' as const,
      responses: {
        200: z.array(z.custom<typeof scholarshipMatches.$inferSelect>()),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProfileInput = z.infer<typeof api.profiles.create.input>;
export type ProfileResponse = z.infer<typeof api.profiles.create.responses[201]>;
export type MatchResponse = z.infer<typeof api.profiles.getMatches.responses[200]>;
