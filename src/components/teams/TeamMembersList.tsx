import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, UserMinus, Trophy } from 'lucide-react';
import { TeamMember } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';

interface TeamMembersListProps {
  members: TeamMember[];
  captainId: string | null;
  onRemoveMember?: (userId: string) => void;
}

export const TeamMembersList = ({ members, captainId, onRemoveMember }: TeamMembersListProps) => {
  const { user } = useAuth();
  const isCaptain = user?.id === captainId;

  const getInitials = (member: TeamMember) => {
    if (member.profile?.display_name) {
      return member.profile.display_name.slice(0, 2).toUpperCase();
    }
    if (member.profile?.username) {
      return member.profile.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Team Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => {
            const isMemberCaptain = member.user_id === captainId;
            const isCurrentUser = member.user_id === user?.id;

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profile?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(member)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {member.profile?.display_name || member.profile?.username || 'Unknown'}
                      </span>
                      {isMemberCaptain && (
                        <Badge variant="default" className="gap-1 text-xs">
                          <Crown className="h-3 w-3" />
                          Captain
                        </Badge>
                      )}
                      {isCurrentUser && !isMemberCaptain && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      <span>{member.profile?.score || 0} pts</span>
                    </div>
                  </div>
                </div>
                {isCaptain && !isMemberCaptain && onRemoveMember && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveMember(member.user_id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
