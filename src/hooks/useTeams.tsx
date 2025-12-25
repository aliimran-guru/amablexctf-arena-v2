import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  captain_id: string | null;
  invite_code: string | null;
  is_public: boolean | null;
  max_members: number | null;
  score: number | null;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
  profile?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    score: number | null;
  };
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

export const useTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<TeamWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;

      // Get member counts
      const { data: memberCounts, error: countError } = await supabase
        .from('team_members')
        .select('team_id');

      if (countError) throw countError;

      const countMap = memberCounts?.reduce((acc, m) => {
        acc[m.team_id] = (acc[m.team_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const teamsWithCount = teamsData?.map(t => ({
        ...t,
        member_count: countMap[t.id] || 0
      })) || [];

      setTeams(teamsWithCount);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUserTeam = async () => {
    if (!user) {
      setUserTeam(null);
      return;
    }

    try {
      // Check if user is in a team
      const { data: membership, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (!membership) {
        setUserTeam(null);
        return;
      }

      // Fetch team with members
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', membership.team_id)
        .single();

      if (teamError) throw teamError;

      // Fetch team members with profiles
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          team_id,
          user_id,
          joined_at
        `)
        .eq('team_id', membership.team_id);

      if (membersError) throw membersError;

      // Fetch profiles separately
      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, score')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profileMap = profiles?.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, any>) || {};

      const membersWithProfiles = members?.map(m => ({
        ...m,
        profile: profileMap[m.user_id]
      })) || [];

      setUserTeam({
        ...team,
        members: membersWithProfiles
      });
    } catch (error) {
      console.error('Error fetching user team:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTeams(), fetchUserTeam()]);
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const createTeam = async (name: string, description?: string) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return null;
    }

    try {
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name,
          description: description || null,
          captain_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      await Promise.all([fetchTeams(), fetchUserTeam()]);
      return team;
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
      return null;
    }
  };

  const joinTeamByCode = async (inviteCode: string) => {
    if (!user) {
      toast.error('You must be logged in to join a team');
      return false;
    }

    try {
      // Find team by invite code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

      if (teamError || !team) {
        toast.error('Invalid invite code');
        return false;
      }

      // Check if team is full
      const { data: members, error: countError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', team.id);

      if (countError) throw countError;

      if (members && members.length >= (team.max_members || 5)) {
        toast.error('Team is full');
        return false;
      }

      // Check if already a member
      const existingMember = members?.find(m => m.id === user.id);
      if (existingMember) {
        toast.error('You are already a member of this team');
        return false;
      }

      // Join team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id
        });

      if (joinError) throw joinError;

      toast.success(`Joined team "${team.name}"!`);
      await Promise.all([fetchTeams(), fetchUserTeam()]);
      return true;
    } catch (error: any) {
      console.error('Error joining team:', error);
      toast.error(error.message || 'Failed to join team');
      return false;
    }
  };

  const leaveTeam = async () => {
    if (!user || !userTeam) return false;

    try {
      // If captain, can't leave unless team is dissolved
      if (userTeam.captain_id === user.id && userTeam.members.length > 1) {
        toast.error('Captain cannot leave the team. Transfer captaincy or dissolve the team.');
        return false;
      }

      // Delete membership
      const { error: leaveError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', userTeam.id)
        .eq('user_id', user.id);

      if (leaveError) throw leaveError;

      // If last member, delete team
      if (userTeam.members.length === 1) {
        const { error: deleteError } = await supabase
          .from('teams')
          .delete()
          .eq('id', userTeam.id);

        if (deleteError) throw deleteError;
      }

      toast.success('Left the team');
      await Promise.all([fetchTeams(), fetchUserTeam()]);
      return true;
    } catch (error: any) {
      console.error('Error leaving team:', error);
      toast.error(error.message || 'Failed to leave team');
      return false;
    }
  };

  const updateTeam = async (updates: Partial<Team>) => {
    if (!user || !userTeam || userTeam.captain_id !== user.id) {
      toast.error('Only the captain can update team settings');
      return false;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', userTeam.id);

      if (error) throw error;

      toast.success('Team updated');
      await fetchUserTeam();
      return true;
    } catch (error: any) {
      console.error('Error updating team:', error);
      toast.error(error.message || 'Failed to update team');
      return false;
    }
  };

  const removeMember = async (userId: string) => {
    if (!user || !userTeam || userTeam.captain_id !== user.id) {
      toast.error('Only the captain can remove members');
      return false;
    }

    if (userId === user.id) {
      toast.error('Cannot remove yourself. Use leave team instead.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', userTeam.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Member removed');
      await fetchUserTeam();
      return true;
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.message || 'Failed to remove member');
      return false;
    }
  };

  return {
    teams,
    userTeam,
    isLoading,
    createTeam,
    joinTeamByCode,
    leaveTeam,
    updateTeam,
    removeMember,
    refetch: () => Promise.all([fetchTeams(), fetchUserTeam()])
  };
};
