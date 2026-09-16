import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/api/stats.api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });
}