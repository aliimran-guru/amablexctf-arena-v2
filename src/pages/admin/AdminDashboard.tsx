import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStats, useRecentSolves } from "@/hooks/useAdmin";
import { Flag, Users, UserCog, Trophy, Activity, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats } = useAdminStats();
  const { data: recentSolves } = useRecentSolves();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Challenges" 
            value={stats?.challenges || 0} 
            icon={<Flag className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Total Users" 
            value={stats?.users || 0} 
            icon={<UserCog className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Total Teams" 
            value={stats?.teams || 0} 
            icon={<Users className="h-5 w-5" />} 
          />
          <StatsCard 
            title="Total Solves" 
            value={stats?.solves || 0} 
            icon={<Trophy className="h-5 w-5" />} 
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Solves
            </CardTitle>
            <CardDescription>Latest challenge completions</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentSolves?.length ? (
              <p className="text-center text-muted-foreground py-4">No solves yet</p>
            ) : (
              <div className="space-y-3">
                {recentSolves.map((solve: any) => (
                  <div
                    key={solve.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${solve.is_first_blood ? 'bg-warning/10' : 'bg-success/10'}`}>
                        {solve.is_first_blood ? (
                          <Zap className="h-4 w-4 text-warning" />
                        ) : (
                          <Flag className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {solve.profiles?.display_name || solve.profiles?.username}
                          </span>
                          <span className="text-muted-foreground">solved</span>
                          <span className="font-medium">{solve.challenges?.title}</span>
                          {solve.is_first_blood && (
                            <Badge variant="secondary" className="text-xs">First Blood</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(solve.solved_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-primary font-bold">+{solve.points_awarded}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
