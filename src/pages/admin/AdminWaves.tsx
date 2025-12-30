import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useWaves, useCreateWave, useUpdateWave, useDeleteWave, useActivateWave, Wave } from "@/hooks/useWaves";
import { Plus, Pencil, Trash2, Zap, Clock, Layers } from "lucide-react";
import { format } from "date-fns";

export default function AdminWaves() {
  const { data: waves, isLoading } = useWaves();
  const createWave = useCreateWave();
  const updateWave = useUpdateWave();
  const deleteWave = useDeleteWave();
  const activateWave = useActivateWave();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWave, setEditingWave] = useState<Wave | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    wave_number: 1,
    start_time: "",
    duration_hours: 8,
    is_active: false,
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      wave_number: (waves?.length ?? 0) + 1,
      start_time: "",
      duration_hours: 8,
      is_active: false,
    });
    setEditingWave(null);
  };

  const handleOpenDialog = (wave?: Wave) => {
    if (wave) {
      setEditingWave(wave);
      setForm({
        name: wave.name,
        description: wave.description || "",
        wave_number: wave.wave_number,
        start_time: wave.start_time
          ? new Date(wave.start_time).toISOString().slice(0, 16)
          : "",
        duration_hours: wave.duration_hours,
        is_active: wave.is_active,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      wave_number: form.wave_number,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      duration_hours: form.duration_hours,
      is_active: form.is_active,
    };

    if (editingWave) {
      await updateWave.mutateAsync({ id: editingWave.id, ...payload });
    } else {
      await createWave.mutateAsync(payload);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteWave.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleActivate = (id: string) => {
    activateWave.mutate(id);
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Waves / Babak</h1>
            <p className="text-muted-foreground">
              Manage competition rounds/waves
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Wave
          </Button>
        </div>

        {!waves?.length ? (
          <EmptyState
            icon={<Layers className="h-8 w-8 text-muted-foreground" />}
            title="No waves"
            description="Create your first wave to organize challenges into rounds"
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Wave #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waves.map((wave) => (
                  <TableRow key={wave.id}>
                    <TableCell className="font-mono font-medium">
                      {wave.wave_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{wave.name}</div>
                        {wave.description && (
                          <div className="text-sm text-muted-foreground">
                            {wave.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {wave.start_time
                        ? format(new Date(wave.start_time), "PPp")
                        : "-"}
                    </TableCell>
                    <TableCell>{wave.duration_hours} hours</TableCell>
                    <TableCell>
                      {wave.is_active ? (
                        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                          <Zap className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {!wave.is_active && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleActivate(wave.id)}
                            disabled={activateWave.isPending}
                            title="Activate wave"
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(wave)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(wave.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Wave Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWave ? "Edit Wave" : "Create Wave"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wave_number">Wave Number</Label>
                <Input
                  id="wave_number"
                  type="number"
                  min={1}
                  value={form.wave_number}
                  onChange={(e) =>
                    setForm({ ...form, wave_number: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Babak 1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..."
                rows={2}
              />
            </div>

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
                <Label htmlFor="duration_hours">Duration (hours)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  min={1}
                  value={form.duration_hours}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration_hours: parseInt(e.target.value) || 8,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">
                  Make this wave the current active round
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm({ ...form, is_active: checked })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWave.isPending || updateWave.isPending}
              >
                {editingWave ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wave</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wave? Challenges assigned to
              this wave will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
