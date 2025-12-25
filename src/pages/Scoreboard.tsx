import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScoreboard } from '@/hooks/useScoreboard';
import { CompetitionTimer } from '@/components/scoreboard/CompetitionTimer';
import { PlayerLeaderboard } from '@/components/scoreboard/PlayerLeaderboard';
import { TeamLeaderboard } from '@/components/scoreboard/TeamLeaderboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Scoreboard() {
  const { players, teams, settings, isLoading, isFrozen, refetch } = useScoreboard();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  const showTeams = settings?.team_mode !== false;
  const showIndividual = settings?.individual_mode !== false;

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Scoreboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Competition Timer */}
        <CompetitionTimer settings={settings} />

        {/* Leaderboards */}
        {showTeams && showIndividual ? (
          <Tabs defaultValue="individual" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="individual" className="gap-2">
                <User className="h-4 w-4" />
                Individual
              </TabsTrigger>
              <TabsTrigger value="teams" className="gap-2">
                <Users className="h-4 w-4" />
                Teams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Individual Rankings
                    {isFrozen && (
                      <span className="text-sm font-normal text-muted-foreground">(Frozen)</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PlayerLeaderboard players={players} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Rankings
                    {isFrozen && (
                      <span className="text-sm font-normal text-muted-foreground">(Frozen)</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamLeaderboard teams={teams} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : showIndividual ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Individual Rankings
                {isFrozen && (
                  <span className="text-sm font-normal text-muted-foreground">(Frozen)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerLeaderboard players={players} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Rankings
                {isFrozen && (
                  <span className="text-sm font-normal text-muted-foreground">(Frozen)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamLeaderboard teams={teams} />
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{players.length}</div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teams.length}</div>
                <div className="text-sm text-muted-foreground">Active Teams</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {players.reduce((acc, p) => acc + p.solves_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Solves</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {players[0]?.score || 0}
                </div>
                <div className="text-sm text-muted-foreground">Top Score</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
