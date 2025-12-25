import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, UserPlus, Trophy, Users } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { TeamCard } from '@/components/teams/TeamCard';
import { TeamChat } from '@/components/teams/TeamChat';
import { TeamMembersList } from '@/components/teams/TeamMembersList';
import { TeamSettings } from '@/components/teams/TeamSettings';
import { CreateTeamDialog } from '@/components/teams/CreateTeamDialog';
import { JoinTeamDialog } from '@/components/teams/JoinTeamDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Teams() {
  const { user } = useAuth();
  const { teams, userTeam, isLoading, createTeam, joinTeamByCode, leaveTeam, updateTeam, removeMember } = useTeams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground mt-1">
              Create or join a team to compete together
            </p>
          </div>
          {user && !userTeam && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Join Team
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </div>
          )}
        </div>

        {userTeam ? (
          <div className="space-y-8">
            {/* My Team Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Team: {userTeam.name}
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Team Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary">
                        {userTeam.score || 0}
                        <span className="text-lg font-normal text-muted-foreground ml-2">points</span>
                      </div>
                    </CardContent>
                  </Card>
                  <TeamMembersList
                    members={userTeam.members}
                    captainId={userTeam.captain_id}
                    onRemoveMember={removeMember}
                  />
                  <TeamSettings
                    team={userTeam}
                    onUpdate={updateTeam}
                    onLeave={leaveTeam}
                  />
                </div>
                <TeamChat teamId={userTeam.id} />
              </div>
            </div>

            {/* All Teams Leaderboard */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Team Leaderboard
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, index) => (
                  <TeamCard key={team.id} team={team} rank={index + 1} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="leaderboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="public">Public Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="space-y-4">
              {teams.length === 0 ? (
                <EmptyState
                  icon={<Trophy className="h-8 w-8 text-muted-foreground" />}
                  title="No teams yet"
                  description="Be the first to create a team!"
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team, index) => (
                    <TeamCard key={team.id} team={team} rank={index + 1} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="public" className="space-y-4">
              {teams.filter(t => t.is_public).length === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8 text-muted-foreground" />}
                  title="No public teams"
                  description="All teams are currently private."
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.filter(t => t.is_public).map((team, index) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Dialogs */}
        <CreateTeamDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={createTeam}
        />
        <JoinTeamDialog
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          onSubmit={joinTeamByCode}
        />
      </div>
    </MainLayout>
  );
}
