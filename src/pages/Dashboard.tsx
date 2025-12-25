import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { useAuth } from "@/hooks/useAuth";
import { Flag, Trophy, Target, Zap } from "lucide-react";

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name || profile?.username}!</h1>
          <p className="text-muted-foreground">Here's your CTF progress overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Score" value={profile?.score || 0} icon={<Trophy className="h-5 w-5" />} />
          <StatsCard title="Challenges Solved" value={0} icon={<Flag className="h-5 w-5" />} />
          <StatsCard title="Global Rank" value="-" icon={<Target className="h-5 w-5" />} />
          <StatsCard title="First Bloods" value={0} icon={<Zap className="h-5 w-5" />} />
        </div>
      </div>
    </MainLayout>
  );
}