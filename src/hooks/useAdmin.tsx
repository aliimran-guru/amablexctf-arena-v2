import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Competition Settings
export const useCompetitionSettings = () => {
  return useQuery({
    queryKey: ["admin", "competition-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competition_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateCompetitionSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: {
      name?: string;
      description?: string;
      start_time?: string | null;
      end_time?: string | null;
      max_team_size?: number;
      first_blood_bonus?: number;
      freeze_scoreboard?: boolean;
      freeze_time?: string | null;
      team_mode?: boolean;
      individual_mode?: boolean;
      registration_open?: boolean;
    }) => {
      const { data: existing } = await supabase
        .from("competition_settings")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("competition_settings")
          .update(settings)
          .eq("id", existing.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competition-settings"] });
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
      toast({ title: "Settings updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update settings", description: error.message, variant: "destructive" });
    },
  });
};

// Announcements
export const useAnnouncements = () => {
  return useQuery({
    queryKey: ["admin", "announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: { title: string; content: string; is_pinned?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("announcements").insert({
        ...announcement,
        author_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement created" });
    },
    onError: (error) => {
      toast({ title: "Failed to create announcement", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete announcement", description: error.message, variant: "destructive" });
    },
  });
};

// Users Management
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      return profiles.map((profile) => ({
        ...profile,
        roles: roles.filter((r) => r.user_id === profile.id).map((r) => r.role),
      }));
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: "admin" | "moderator" | "user"; action: "add" | "remove" }) => {
      if (action === "add") {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({ title: "User role updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    },
  });
};

// Admin Stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [
        { count: challengesCount },
        { count: usersCount },
        { count: teamsCount },
        { count: solvesCount },
      ] = await Promise.all([
        supabase.from("challenges").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("teams").select("*", { count: "exact", head: true }),
        supabase.from("solves").select("*", { count: "exact", head: true }),
      ]);

      return {
        challenges: challengesCount || 0,
        users: usersCount || 0,
        teams: teamsCount || 0,
        solves: solvesCount || 0,
      };
    },
  });
};

// Recent Activity for Admin Dashboard
export const useRecentSolves = () => {
  return useQuery({
    queryKey: ["admin", "recent-solves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solves")
        .select(`
          *,
          challenges:challenge_id(title),
          profiles:user_id(username, display_name)
        `)
        .order("solved_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
