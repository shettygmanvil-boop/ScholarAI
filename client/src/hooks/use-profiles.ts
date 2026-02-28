import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ProfileInput } from "@shared/routes";

function parseResponse<T>(schema: any, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("[API Response Validation Failed]:", result.error);
    throw new Error("Invalid API response format");
  }
  return result.data;
}

export function useProfile(id: number | null) {
  return useQuery({
    queryKey: [api.profiles.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.profiles.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return parseResponse<any>(api.profiles.get.responses[200], data);
    },
    enabled: !!id,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileInput) => {
      const validated = api.profiles.create.input.parse(data);
      const res = await fetch(api.profiles.create.path, {
        method: api.profiles.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create profile");
      }
      return parseResponse<any>(api.profiles.create.responses[201], json);
    },
  });
}

export function useMatches(profileId: number | null) {
  return useQuery({
    queryKey: [api.profiles.getMatches.path, profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const url = buildUrl(api.profiles.getMatches.path, { id: profileId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      return parseResponse<any[]>(api.profiles.getMatches.responses[200], data);
    },
    enabled: !!profileId,
  });
}

export function useGenerateMatches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: number) => {
      const url = buildUrl(api.profiles.generateMatches.path, { id: profileId });
      const res = await fetch(url, {
        method: api.profiles.generateMatches.method,
        credentials: "include",
      });
      
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to generate matches");
      }
      return parseResponse<any[]>(api.profiles.generateMatches.responses[200], json);
    },
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({
        queryKey: [api.profiles.getMatches.path, profileId],
      });
    },
  });
}
