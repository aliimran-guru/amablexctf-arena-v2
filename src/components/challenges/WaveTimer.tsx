import { useState, useEffect } from "react";
import { useWaveTimer } from "@/hooks/useWaves";
import { Clock, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WaveTimer() {
  const { activeWave, isLoading, getTimeRemaining } = useWaveTimer();
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  } | null>(null);

  useEffect(() => {
    if (!activeWave) return;

    const updateTime = () => {
      setTimeRemaining(getTimeRemaining());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [activeWave, getTimeRemaining]);

  if (isLoading) {
    return null;
  }

  if (!activeWave) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4">
        <Waves className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">No active wave</span>
      </div>
    );
  }

  const isEnded = timeRemaining?.isEnded;
  const isUrgent = timeRemaining && !isEnded && timeRemaining.hours === 0 && timeRemaining.minutes < 30;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-4 transition-colors",
      isEnded 
        ? "border-destructive/50 bg-destructive/10" 
        : isUrgent 
          ? "border-yellow-500/50 bg-yellow-500/10" 
          : "border-primary/50 bg-primary/10"
    )}>
      <div className="flex items-center gap-2">
        <Waves className={cn(
          "h-5 w-5",
          isEnded ? "text-destructive" : isUrgent ? "text-yellow-500" : "text-primary"
        )} />
        <span className="font-semibold">
          Wave {activeWave.wave_number}: {activeWave.name}
        </span>
        <Badge variant={isEnded ? "destructive" : "default"} className="text-xs">
          {isEnded ? "Ended" : "Active"}
        </Badge>
      </div>
      
      {timeRemaining && !isEnded && (
        <div className="flex items-center gap-2 sm:ml-auto">
          <Clock className={cn(
            "h-4 w-4",
            isUrgent ? "text-yellow-500 animate-pulse" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-mono text-lg font-bold",
            isUrgent ? "text-yellow-500" : "text-foreground"
          )}>
            {String(timeRemaining.hours).padStart(2, "0")}:
            {String(timeRemaining.minutes).padStart(2, "0")}:
            {String(timeRemaining.seconds).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground">remaining</span>
        </div>
      )}
      
      {isEnded && (
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-destructive">Wave has ended</span>
        </div>
      )}
    </div>
  );
}
