import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlayerRanking {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  score: number;
  solves_count: number;
  last_solve_at: string | null;
}

export interface TeamRanking {
  id: string;
  name: string;
  avatar_url: string | null;
  score: number;
  member_count: number;
}

export interface CompetitionSettings {
  id: string;
  name: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  freeze_scoreboard: boolean;
  freeze_time: string | null;
  team_mode: boolean;
  individual_mode: boolean;
}

export const useScoreboard = () => {
  const [players, setPlayers] = useState<PlayerRanking[]>([]);
  const [teams, setTeams] = useState<TeamRanking[]>([]);
  const [settings, setSettings] = useState<CompetitionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('competition_settings')
      .select('*')
      .limit(1)
      .single();

    if (!error && data) {
      setSettings(data);
      
      // Check if scoreboard is frozen
      if (data.freeze_scoreboard && data.freeze_time) {
        const freezeTime = new Date(data.freeze_time);
        setIsFrozen(new Date() >= freezeTime);
      }
    }
  };

  const fetchPlayers = async () => {
    // Get profiles with scores
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, score')
      .order('score', { ascending: false })
      .limit(100);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    // Get solve counts and last solve time
    const { data: solves, error: solvesError } = await supabase
      .from('solves')
      .select('user_id, solved_at');

    if (solvesError) {
      console.error('Error fetching solves:', solvesError);
      return;
    }

    // Aggregate solve data per user
    const solveStats = solves?.reduce((acc, solve) => {
      if (!acc[solve.user_id]) {
        acc[solve.user_id] = { count: 0, lastSolve: solve.solved_at };
      }
      acc[solve.user_id].count++;
      if (solve.solved_at > acc[solve.user_id].lastSolve) {
        acc[solve.user_id].lastSolve = solve.solved_at;
      }
      return acc;
    }, {} as Record<string, { count: number; lastSolve: string }>) || {};

    const rankings: PlayerRanking[] = profiles?.map(p => ({
      id: p.id,
      username: p.username,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      score: p.score || 0,
      solves_count: solveStats[p.id]?.count || 0,
      last_solve_at: solveStats[p.id]?.lastSolve || null
    })).filter(p => p.score > 0) || [];

    // Sort by score (desc), then by last solve time (asc for tie-breaker)
    rankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (!a.last_solve_at) return 1;
      if (!b.last_solve_at) return -1;
      return new Date(a.last_solve_at).getTime() - new Date(b.last_solve_at).getTime();
    });

    setPlayers(rankings);
  };

  const fetchTeams = async () => {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, avatar_url, score')
      .order('score', { ascending: false })
      .limit(100);

    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      return;
    }

    // Get member counts
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('team_id');

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return;
    }

    const memberCounts = members?.reduce((acc, m) => {
      acc[m.team_id] = (acc[m.team_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const rankings: TeamRanking[] = teamsData?.map(t => ({
      id: t.id,
      name: t.name,
      avatar_url: t.avatar_url,
      score: t.score || 0,
      member_count: memberCounts[t.id] || 0
    })).filter(t => t.score > 0) || [];

    setTeams(rankings);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSettings(), fetchPlayers(), fetchTeams()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('scoreboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solves'
        },
        () => {
          // Refetch on any solve change
          fetchPlayers();
          fetchTeams();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchPlayers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'teams'
        },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    players,
    teams,
    settings,
    isLoading,
    isFrozen,
    refetch: () => Promise.all([fetchPlayers(), fetchTeams()])
  };
};
