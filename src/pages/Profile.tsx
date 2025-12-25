import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserSolves } from "@/hooks/useChallenges";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Trophy, Flag, Calendar, Upload, Save, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { data: solves } = useUserSolves();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    country: profile?.country || "",
  });

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: form.display_name || null,
          bio: form.bio || null,
          country: form.country || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast({ title: "Profile updated successfully" });
    } catch (error: any) {
      toast({ title: "Failed to update profile", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 2MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast({ title: "Avatar updated successfully" });
    } catch (error: any) {
      toast({ title: "Failed to upload avatar", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const totalPoints = profile?.score || 0;
  const totalSolves = solves?.length || 0;
  const firstBloods = solves?.filter((s) => s.is_first_blood).length || 0;

  const categoryStats = solves?.reduce((acc, solve: any) => {
    const category = solve.challenges?.categories?.name || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="solves" className="gap-2">
              <Flag className="h-4 w-4" />
              Solves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl">
                        {profile?.username?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile?.display_name || profile?.username}</h3>
                    <p className="text-muted-foreground">@{profile?.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Joined {profile?.created_at && formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing ? (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={form.display_name}
                        onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="Your country"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    {profile?.bio && <p className="text-sm mb-4">{profile.bio}</p>}
                    {profile?.country && (
                      <p className="text-sm text-muted-foreground mb-4">📍 {profile.country}</p>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setForm({
                          display_name: profile?.display_name || "",
                          bio: profile?.bio || "",
                          country: profile?.country || "",
                        });
                        setIsEditing(true);
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalPoints}</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-success/10">
                      <Flag className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalSolves}</p>
                      <p className="text-sm text-muted-foreground">Challenges Solved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <Zap className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{firstBloods}</p>
                      <p className="text-sm text-muted-foreground">First Bloods</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Progress */}
            {Object.keys(categoryStats).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Category Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="text-muted-foreground">{count} solved</span>
                      </div>
                      <Progress value={Math.min(100, count * 20)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="solves" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Solve History</CardTitle>
                <CardDescription>All challenges you've conquered</CardDescription>
              </CardHeader>
              <CardContent>
                {!solves?.length ? (
                  <p className="text-center text-muted-foreground py-8">
                    No solves yet. Start hacking!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {solves.map((solve: any) => (
                      <div
                        key={solve.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-success/10">
                            <Flag className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {solve.challenges?.title || "Unknown Challenge"}
                              </span>
                              {solve.is_first_blood && (
                                <Badge variant="secondary" className="first-blood">
                                  🩸 First Blood
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(solve.solved_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-primary">
                            +{solve.points_awarded}
                          </span>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
