import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminTeams = () => {
  return useQuery({
    queryKey: ["admin", "teams"],
    queryFn: async () => {
      const { data: teams, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .order("score", { ascending: false });

      if (teamsError) throw teamsError;

      // Get member counts
      const { data: memberCounts, error: membersError } = await supabase
        .from("team_members")
        .select("team_id");

      if (membersError) throw membersError;

      const countMap = memberCounts.reduce((acc: Record<string, number>, m) => {
        acc[m.team_id] = (acc[m.team_id] || 0) + 1;
        return acc;
      }, {});

      return teams.map((team) => ({
        ...team,
        member_count: countMap[team.id] || 0,
      }));
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      updates,
    }: {
      teamId: string;
      updates: { name?: string; description?: string; score?: number };
    }) => {
      const { error } = await supabase
        .from("teams")
        .update(updates)
        .eq("id", teamId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({ title: "Team updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update team",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      // First delete all team members
      const { error: membersError } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      // Then delete the team
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({ title: "Team deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete team",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
