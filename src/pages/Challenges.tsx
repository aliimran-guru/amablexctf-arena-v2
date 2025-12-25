import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Flag } from "lucide-react";

export default function Challenges() {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Challenges</h1>
        <EmptyState icon={<Flag className="h-8 w-8 text-muted-foreground" />} title="No challenges yet" description="Check back soon for new challenges!" />
      </div>
    </MainLayout>
  );
}