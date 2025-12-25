import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export default function Teams() {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Teams</h1>
        <EmptyState icon={<Users className="h-8 w-8 text-muted-foreground" />} title="No teams yet" description="Create or join a team to compete together!" />
      </div>
    </MainLayout>
  );
}