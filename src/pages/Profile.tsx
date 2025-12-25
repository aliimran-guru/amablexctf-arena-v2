import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <Card>
          <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><span className="text-muted-foreground">Username:</span> <span className="font-medium">{profile?.username}</span></div>
            <div><span className="text-muted-foreground">Score:</span> <span className="font-medium">{profile?.score || 0}</span></div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}