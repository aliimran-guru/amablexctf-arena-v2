import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ChallengeFormDialog } from "@/components/admin/ChallengeFormDialog";
import { useAdminChallenges, useDeleteChallenge } from "@/hooks/useAdminChallenges";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Flag } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import type { DifficultyLevel } from "@/lib/constants";

export default function AdminChallenges() {
  const { data: challenges, isLoading } = useAdminChallenges();
  const deleteChallenge = useDeleteChallenge();
  
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<typeof challenges[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredChallenges = challenges?.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

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
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Challenge
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Solves</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell className="font-medium">
                      {challenge.title}
                    </TableCell>
                    <TableCell>{challenge.categories?.name}</TableCell>
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
                      <div className="flex items-center gap-2">
                        {challenge.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {challenge.is_hidden && (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
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
