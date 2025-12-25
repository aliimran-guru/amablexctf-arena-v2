import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type ChallengeHint = Database["public"]["Tables"]["challenge_hints"]["Row"];
type ChallengeFile = Database["public"]["Tables"]["challenge_files"]["Row"];
type Solve = Database["public"]["Tables"]["solves"]["Row"];

export interface ChallengeWithCategory extends Challenge {
  categories: Category | null;
  challenge_hints: ChallengeHint[];
  challenge_files: ChallengeFile[];
}

export function useChallenges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          *,
          categories (*),
          challenge_hints (id, cost, order_index),
          challenge_files (id, file_name, file_url, file_size)
        `)
        .eq("is_active", true)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ChallengeWithCategory[];
    },
    enabled: !!user,
  });
}

export function useChallenge(challengeId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          *,
          categories (*),
          challenge_hints (id, cost, order_index, content),
          challenge_files (id, file_name, file_url, file_size)
        `)
        .eq("id", challengeId)
        .maybeSingle();

      if (error) throw error;
      return data as ChallengeWithCategory | null;
    },
    enabled: !!user && !!challengeId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useUserSolves() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-solves", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("solves")
        .select("challenge_id, points_awarded, is_first_blood, solved_at")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUnlockedHints() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unlocked-hints", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("unlocked_hints")
        .select("hint_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((h) => h.hint_id);
    },
    enabled: !!user,
  });
}

export function useSubmitFlag() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
      flag,
    }: {
      challengeId: string;
      flag: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Check if already solved
      const { data: existingSolve } = await supabase
        .from("solves")
        .select("id")
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId)
        .maybeSingle();

      if (existingSolve) {
        throw new Error("You have already solved this challenge");
      }

      // Get challenge data to verify flag
      const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .select("flag, current_points, solve_count")
        .eq("id", challengeId)
        .single();

      if (challengeError) throw challengeError;

      // Record the submission
      const isCorrect = flag.trim() === challenge.flag;
      await supabase.from("submissions").insert({
        user_id: user.id,
        challenge_id: challengeId,
        submitted_flag: flag,
        is_correct: isCorrect,
      });

      if (!isCorrect) {
        throw new Error("Incorrect flag");
      }

      // Check if first blood
      const isFirstBlood = (challenge.solve_count ?? 0) === 0;

      // Get user's team if any
      const { data: teamMember } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Create solve record
      const { error: solveError } = await supabase.from("solves").insert({
        user_id: user.id,
        challenge_id: challengeId,
        points_awarded: challenge.current_points ?? 0,
        is_first_blood: isFirstBlood,
        team_id: teamMember?.team_id ?? null,
      });

      if (solveError) throw solveError;

      return {
        points: challenge.current_points ?? 0,
        isFirstBlood,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["user-solves"] });
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });

      if (data.isFirstBlood) {
        toast.success(`🩸 First Blood! +${data.points} points!`);
      } else {
        toast.success(`Correct! +${data.points} points`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUnlockHint() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ hintId, cost }: { hintId: string; cost: number }) => {
      if (!user) throw new Error("Not authenticated");

      // Deduct points from user's score
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("score")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if ((profile.score ?? 0) < cost) {
        throw new Error("Not enough points to unlock this hint");
      }

      // Update user's score
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ score: (profile.score ?? 0) - cost })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Record the unlocked hint
      const { error: unlockError } = await supabase
        .from("unlocked_hints")
        .insert({
          user_id: user.id,
          hint_id: hintId,
        });

      if (unlockError) throw unlockError;

      // Get the hint content
      const { data: hint, error: hintError } = await supabase
        .from("challenge_hints")
        .select("content")
        .eq("id", hintId)
        .single();

      if (hintError) throw hintError;

      return hint.content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unlocked-hints"] });
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
      toast.success("Hint unlocked!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
