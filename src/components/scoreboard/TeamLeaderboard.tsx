import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Users, Target } from 'lucide-react';
import { TeamRanking } from '@/hooks/useScoreboard';

interface TeamLeaderboardProps {
  teams: TeamRanking[];
}

export const TeamLeaderboard = ({ teams }: TeamLeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-muted-foreground font-medium">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 hover:bg-yellow-500/20';
      case 2:
        return 'bg-gray-500/10 hover:bg-gray-500/20';
      case 3:
        return 'bg-orange-500/10 hover:bg-orange-500/20';
      default:
        return '';
    }
  };

  const getInitials = (team: TeamRanking) => {
    return team.name.slice(0, 2).toUpperCase();
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No team scores yet. Teams need to solve challenges!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">Rank</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Members</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team, index) => {
          const rank = index + 1;
          return (
            <TableRow key={team.id} className={getRankStyle(rank)}>
              <TableCell className="text-center">
                <div className="flex items-center justify-center w-8 h-8 mx-auto">
                  {getRankIcon(rank)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={team.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{getInitials(team)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {team.member_count}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-lg text-primary">{team.score}</span>
                <span className="text-muted-foreground text-sm ml-1">pts</span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
