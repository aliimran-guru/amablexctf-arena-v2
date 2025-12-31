import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ChallengeFormDialog } from "@/components/admin/ChallengeFormDialog";
import { ChallengeImportExport } from "@/components/admin/ChallengeImportExport";
import { useAdminChallenges, useDeleteChallenge, useBulkUpdateChallenges, useUpdateChallenge } from "@/hooks/useAdminChallenges";
import { useCategories } from "@/hooks/useChallenges";
import { useWaves } from "@/hooks/useWaves";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Flag, Filter } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import type { DifficultyLevel } from "@/lib/constants";

export default function AdminChallenges() {
  const { data: challenges, isLoading } = useAdminChallenges();
  const { data: categories = [] } = useCategories();
  const { data: waves = [] } = useWaves();
  const deleteChallenge = useDeleteChallenge();
  const updateChallenge = useUpdateChallenge();
  const bulkUpdate = useBulkUpdateChallenges();
  
  const [search, setSearch] = useState("");
  const [waveFilter, setWaveFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<typeof challenges[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];
    
    return challenges.filter((c) => {
      // Search filter
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Wave filter
      if (waveFilter !== "all") {
        if (waveFilter === "none" && c.wave_id !== null) return false;
        if (waveFilter !== "none" && c.wave_id !== waveFilter) return false;
      }
      
      return true;
    });
  }, [challenges, search, waveFilter]);

  const handleEdit = (challenge: typeof challenges[0]) => {
    setEditingChallenge(challenge);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteChallenge.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingChallenge(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredChallenges) {
      setSelectedIds(filteredChallenges.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleBulkShow = () => {
    if (selectedIds.length > 0) {
      bulkUpdate.mutate({ ids: selectedIds, updates: { is_hidden: false } });
      setSelectedIds([]);
    }
  };

  const handleBulkHide = () => {
    if (selectedIds.length > 0) {
      bulkUpdate.mutate({ ids: selectedIds, updates: { is_hidden: true } });
      setSelectedIds([]);
    }
  };

  const handleToggleVisibility = (id: string, currentHidden: boolean) => {
    updateChallenge.mutate({ id, is_hidden: !currentHidden });
  };

  const getWaveName = (waveId: string | null) => {
    if (!waveId) return null;
    const wave = waves.find(w => w.id === waveId);
    return wave ? `Wave ${wave.wave_number}` : null;
  };

  const isAllSelected = filteredChallenges && filteredChallenges.length > 0 && 
    selectedIds.length === filteredChallenges.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">
              Manage CTF challenges
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ChallengeImportExport categories={categories} />
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Challenge
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={waveFilter} onValueChange={setWaveFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by wave" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Waves</SelectItem>
                <SelectItem value="none">No Wave</SelectItem>
                {waves.map((wave) => (
                  <SelectItem key={wave.id} value={wave.id}>
                    Wave {wave.wave_number} - {wave.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkShow}
                disabled={bulkUpdate.isPending}
                className="gap-1"
              >
                <Eye className="h-4 w-4" />
                Show
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkHide}
                disabled={bulkUpdate.isPending}
                className="gap-1"
              >
                <EyeOff className="h-4 w-4" />
                Hide
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : !filteredChallenges?.length ? (
          <EmptyState
            icon={<Flag className="h-8 w-8 text-muted-foreground" />}
            title="No challenges"
            description="Create your first challenge to get started"
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Wave</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Solves</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(challenge.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(challenge.id, checked as boolean)
                        }
                        aria-label={`Select ${challenge.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {challenge.title}
                    </TableCell>
                    <TableCell>{challenge.categories?.name}</TableCell>
                    <TableCell>
                      {getWaveName(challenge.wave_id) ? (
                        <Badge variant="outline">{getWaveName(challenge.wave_id)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {challenge.difficulty && (
                        <DifficultyBadge
                          difficulty={challenge.difficulty as DifficultyLevel}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {challenge.current_points ?? challenge.max_points}
                    </TableCell>
                    <TableCell className="text-right">
                      {challenge.solve_count ?? 0}
                    </TableCell>
                    <TableCell>
                      {challenge.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(challenge.id, !!challenge.is_hidden)}
                        disabled={updateChallenge.isPending}
                        className="gap-1"
                      >
                        {challenge.is_hidden ? (
                          <>
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Hidden</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 text-green-500" />
                            <span className="text-xs">Visible</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(challenge)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleVisibility(challenge.id, !!challenge.is_hidden)}
                          >
                            {challenge.is_hidden ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show
                              </>
                            ) : (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(challenge.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ChallengeFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        challenge={editingChallenge ?? undefined}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this challenge? This action cannot
              be undone and will remove all associated solves and submissions.
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