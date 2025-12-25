import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Lock, Globe } from 'lucide-react';
import { Team } from '@/hooks/useTeams';

interface TeamCardProps {
  team: Team;
  rank?: number;
}

export const TeamCard = ({ team, rank }: TeamCardProps) => {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {rank && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                'bg-muted text-muted-foreground'
              }`}>
                {rank}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {team.name}
              </h3>
              {team.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {team.description}
                </p>
              )}
            </div>
          </div>
          <Badge variant={team.is_public ? 'secondary' : 'outline'} className="gap-1">
            {team.is_public ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{team.member_count || 0}/{team.max_members || 5}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <Trophy className="h-4 w-4" />
            <span>{team.score || 0} pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
