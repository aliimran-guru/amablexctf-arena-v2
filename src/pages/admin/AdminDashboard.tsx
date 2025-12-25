import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Flag, Users, UserCog, Trophy } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Challenges" value={0} icon={<Flag className="h-5 w-5" />} />
          <StatsCard title="Total Users" value={0} icon={<UserCog className="h-5 w-5" />} />
          <StatsCard title="Total Teams" value={0} icon={<Users className="h-5 w-5" />} />
          <StatsCard title="Total Solves" value={0} icon={<Trophy className="h-5 w-5" />} />
        </div>
      </div>
    </AdminLayout>
  );
}