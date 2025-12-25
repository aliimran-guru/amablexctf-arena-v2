import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Target } from 'lucide-react';
import { PlayerRanking } from '@/hooks/useScoreboard';
import { formatDistanceToNow } from 'date-fns';

interface PlayerLeaderboardProps {
  players: PlayerRanking[];
}

export const PlayerLeaderboard = ({ players }: PlayerLeaderboardProps) => {
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

  const getInitials = (player: PlayerRanking) => {
    if (player.display_name) {
      return player.display_name.slice(0, 2).toUpperCase();
    }
    return player.username.slice(0, 2).toUpperCase();
  };

  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No scores yet. Be the first to solve a challenge!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Solves</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => {
          const rank = index + 1;
          return (
            <TableRow key={player.id} className={getRankStyle(rank)}>
              <TableCell className="text-center">
                <div className="flex items-center justify-center w-8 h-8 mx-auto">
                  {getRankIcon(rank)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{getInitials(player)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{player.display_name || player.username}</div>
                    {player.last_solve_at && (
                      <div className="text-xs text-muted-foreground hidden md:block">
                        Last solve {formatDistanceToNow(new Date(player.last_solve_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Badge variant="secondary">{player.solves_count}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-lg text-primary">{player.score}</span>
                <span className="text-muted-foreground text-sm ml-1">pts</span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
