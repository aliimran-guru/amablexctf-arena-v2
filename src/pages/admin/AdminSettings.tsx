import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCompetitionSettings, useUpdateCompetitionSettings } from "@/hooks/useAdmin";
import { Save, Calendar, Users, Trophy, Shield } from "lucide-react";

export default function AdminSettings() {
  const { data: settings, isLoading } = useCompetitionSettings();
  const updateSettings = useUpdateCompetitionSettings();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
    max_team_size: 5,
    first_blood_bonus: 50,
    freeze_scoreboard: false,
    freeze_time: "",
    team_mode: true,
    individual_mode: true,
    registration_open: true,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || "",
        description: settings.description || "",
        start_time: settings.start_time ? new Date(settings.start_time).toISOString().slice(0, 16) : "",
        end_time: settings.end_time ? new Date(settings.end_time).toISOString().slice(0, 16) : "",
        max_team_size: settings.max_team_size || 5,
        first_blood_bonus: settings.first_blood_bonus || 50,
        freeze_scoreboard: settings.freeze_scoreboard || false,
        freeze_time: settings.freeze_time ? new Date(settings.freeze_time).toISOString().slice(0, 16) : "",
        team_mode: settings.team_mode ?? true,
        individual_mode: settings.individual_mode ?? true,
        registration_open: settings.registration_open ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      name: form.name,
      description: form.description || null,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
      max_team_size: form.max_team_size,
      first_blood_bonus: form.first_blood_bonus,
      freeze_scoreboard: form.freeze_scoreboard,
      freeze_time: form.freeze_time ? new Date(form.freeze_time).toISOString() : null,
      team_mode: form.team_mode,
      individual_mode: form.individual_mode,
      registration_open: form.registration_open,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Competition Settings</h1>
          <p className="text-muted-foreground">Configure your CTF competition</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic competition information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Competition Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="AmablexCTF"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A brief description of your competition..."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Registration Open</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch
                  checked={form.registration_open}
                  onCheckedChange={(checked) => setForm({ ...form, registration_open: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Time Settings
              </CardTitle>
              <CardDescription>Competition schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Freeze Scoreboard</Label>
                  <p className="text-sm text-muted-foreground">Hide scores near the end</p>
                </div>
                <Switch
                  checked={form.freeze_scoreboard}
                  onCheckedChange={(checked) => setForm({ ...form, freeze_scoreboard: checked })}
                />
              </div>
              {form.freeze_scoreboard && (
                <div className="space-y-2">
                  <Label htmlFor="freeze_time">Freeze Time</Label>
                  <Input
                    id="freeze_time"
                    type="datetime-local"
                    value={form.freeze_time}
                    onChange={(e) => setForm({ ...form, freeze_time: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Settings
              </CardTitle>
              <CardDescription>Configure team play options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow team-based play</p>
                </div>
                <Switch
                  checked={form.team_mode}
                  onCheckedChange={(checked) => setForm({ ...form, team_mode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Individual Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow solo players</p>
                </div>
                <Switch
                  checked={form.individual_mode}
                  onCheckedChange={(checked) => setForm({ ...form, individual_mode: checked })}
                />
              </div>
              {form.team_mode && (
                <div className="space-y-2">
                  <Label htmlFor="max_team_size">Max Team Size</Label>
                  <Input
                    id="max_team_size"
                    type="number"
                    min={1}
                    max={20}
                    value={form.max_team_size}
                    onChange={(e) => setForm({ ...form, max_team_size: parseInt(e.target.value) || 5 })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scoring Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Scoring Settings
              </CardTitle>
              <CardDescription>Configure scoring rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first_blood_bonus">First Blood Bonus</Label>
                <Input
                  id="first_blood_bonus"
                  type="number"
                  min={0}
                  value={form.first_blood_bonus}
                  onChange={(e) => setForm({ ...form, first_blood_bonus: parseInt(e.target.value) || 0 })}
                />
                <p className="text-sm text-muted-foreground">Extra points for first solver</p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="gap-2" disabled={updateSettings.isPending}>
            <Save className="h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
