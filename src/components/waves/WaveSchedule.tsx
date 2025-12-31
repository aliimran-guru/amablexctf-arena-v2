import { useWaves } from "@/hooks/useWaves";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, Clock, Calendar, CheckCircle2, PlayCircle, Timer } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function WaveSchedule() {
  const { data: waves = [], isLoading } = useWaves();

  if (isLoading) {
    return null;
  }

  if (waves.length === 0) {
    return null;
  }

  const getWaveStatus = (wave: typeof waves[0]) => {
    if (!wave.start_time) return "scheduled";
    
    const now = new Date();
    const startTime = new Date(wave.start_time);
    const endTime = new Date(startTime.getTime() + wave.duration_hours * 60 * 60 * 1000);
    
    if (now < startTime) return "upcoming";
    if (now >= startTime && now < endTime) return "active";
    return "ended";
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (isActive && status === "active") {
      return (
        <Badge className="bg-success/20 text-success border-success/30 gap-1">
          <PlayCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary gap-1">
            <Timer className="h-3 w-3" />
            Upcoming
          </Badge>
        );
      case "ended":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Ended
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Scheduled
          </Badge>
        );
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: id });
    } catch {
      return "-";
    }
  };

  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Waves className="h-5 w-5 text-primary" />
          Wave Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {waves.map((wave) => {
            const status = getWaveStatus(wave);
            
            return (
              <div 
                key={wave.id}
                className={`p-4 transition-colors ${
                  wave.is_active ? "bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold">
                        Wave {wave.wave_number}
                      </span>
                      {getStatusBadge(status, wave.is_active)}
                    </div>
                    <div className="text-lg font-medium text-foreground mb-2">
                      {wave.name}
                    </div>
                    {wave.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {wave.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {wave.start_time && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(wave.start_time)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {wave.duration_hours} jam
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
