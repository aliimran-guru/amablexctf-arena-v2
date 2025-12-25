import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Flag, AlertTriangle } from 'lucide-react';
import { CompetitionSettings } from '@/hooks/useScoreboard';

interface CompetitionTimerProps {
  settings: CompetitionSettings | null;
}

type CompetitionStatus = 'not_started' | 'running' | 'paused' | 'ended' | 'frozen';

export const CompetitionTimer = ({ settings }: CompetitionTimerProps) => {
  const [timeDisplay, setTimeDisplay] = useState('');
  const [status, setStatus] = useState<CompetitionStatus>('not_started');

  useEffect(() => {
    const updateTimer = () => {
      if (!settings) {
        setTimeDisplay('--:--:--');
        setStatus('not_started');
        return;
      }

      const now = new Date();
      const startTime = settings.start_time ? new Date(settings.start_time) : null;
      const endTime = settings.end_time ? new Date(settings.end_time) : null;
      const freezeTime = settings.freeze_time ? new Date(settings.freeze_time) : null;

      // Determine status
      if (!startTime) {
        setTimeDisplay('Not scheduled');
        setStatus('not_started');
        return;
      }

      if (now < startTime) {
        // Competition hasn't started
        const diff = startTime.getTime() - now.getTime();
        setTimeDisplay(formatTime(diff));
        setStatus('not_started');
        return;
      }

      if (endTime && now >= endTime) {
        // Competition has ended
        setTimeDisplay('00:00:00');
        setStatus('ended');
        return;
      }

      if (freezeTime && now >= freezeTime && settings.freeze_scoreboard) {
        // Scoreboard is frozen but competition running
        if (endTime) {
          const diff = endTime.getTime() - now.getTime();
          setTimeDisplay(formatTime(diff));
        } else {
          const diff = now.getTime() - startTime.getTime();
          setTimeDisplay(formatTime(diff));
        }
        setStatus('frozen');
        return;
      }

      // Competition is running
      if (endTime) {
        const diff = endTime.getTime() - now.getTime();
        setTimeDisplay(formatTime(diff));
      } else {
        const diff = now.getTime() - startTime.getTime();
        setTimeDisplay(formatTime(diff));
      }
      setStatus('running');
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'not_started':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Starts In
          </Badge>
        );
      case 'running':
        return (
          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
            <Play className="h-3 w-3" />
            Live
          </Badge>
        );
      case 'frozen':
        return (
          <Badge variant="default" className="gap-1 bg-blue-600 hover:bg-blue-600">
            <Pause className="h-3 w-3" />
            Frozen
          </Badge>
        );
      case 'ended':
        return (
          <Badge variant="destructive" className="gap-1">
            <Flag className="h-3 w-3" />
            Ended
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'not_started':
        return 'Competition starts in';
      case 'running':
        return 'Time remaining';
      case 'frozen':
        return 'Scoreboard frozen • Time remaining';
      case 'ended':
        return 'Competition has ended';
      default:
        return '';
    }
  };

  return (
    <Card className={`border-2 ${
      status === 'running' ? 'border-green-500/50 bg-green-500/5' :
      status === 'frozen' ? 'border-blue-500/50 bg-blue-500/5' :
      status === 'ended' ? 'border-destructive/50 bg-destructive/5' :
      'border-muted'
    }`}>
      <CardContent className="py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <h2 className="text-lg font-semibold">{settings?.name || 'CTF Competition'}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider">
            {timeDisplay}
          </div>
          {status === 'frozen' && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Scoreboard updates are paused</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
