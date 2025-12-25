import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Copy, LogOut, RefreshCw, Check } from 'lucide-react';
import { TeamWithMembers } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TeamSettingsProps {
  team: TeamWithMembers;
  onUpdate: (updates: Partial<TeamWithMembers>) => Promise<boolean>;
  onLeave: () => Promise<boolean>;
}

export const TeamSettings = ({ team, onUpdate, onLeave }: TeamSettingsProps) => {
  const { user } = useAuth();
  const isCaptain = user?.id === team.captain_id;
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (team.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      setCopied(true);
      toast.success('Invite code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTogglePublic = async () => {
    await onUpdate({ is_public: !team.is_public });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Team Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Code */}
        <div className="space-y-2">
          <Label>Invite Code</Label>
          <div className="flex gap-2">
            <Input
              value={team.invite_code || ''}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyInviteCode}
              disabled={!team.invite_code}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this code with others to invite them to your team.
          </p>
        </div>

        {/* Visibility Toggle */}
        {isCaptain && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Team</Label>
              <p className="text-xs text-muted-foreground">
                Allow anyone to see your team on the teams page.
              </p>
            </div>
            <Switch
              checked={team.is_public || false}
              onCheckedChange={handleTogglePublic}
            />
          </div>
        )}

        {/* Leave Team */}
        <div className="pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                {isCaptain && team.members.length === 1 ? 'Dissolve Team' : 'Leave Team'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isCaptain && team.members.length === 1 ? 'Dissolve Team?' : 'Leave Team?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isCaptain && team.members.length === 1
                    ? 'This will permanently delete the team. This action cannot be undone.'
                    : isCaptain
                    ? 'You cannot leave as captain while there are other members. Remove all members first or transfer captaincy.'
                    : 'Are you sure you want to leave this team?'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {(!isCaptain || team.members.length === 1) && (
                  <AlertDialogAction onClick={onLeave}>
                    {isCaptain ? 'Dissolve Team' : 'Leave Team'}
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
