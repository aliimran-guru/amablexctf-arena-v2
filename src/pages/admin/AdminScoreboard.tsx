import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Trophy, 
  Trash2, 
  Search,
  Loader2,
  AlertTriangle,
  User,
  Flag,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";

interface SolveWithDetails {
  id: string;
  user_id: string;
  challenge_id: string;
  points_awarded: number;
  is_first_blood: boolean | null;
  solved_at: string;
  profiles: {
    username: string;
    display_name: string | null;
  } | null;
  challenges: {
    title: string;
  } | null;
}

export default function AdminScoreboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: solves, isLoading, refetch } = useQuery({
    queryKey: ["admin-solves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solves")
        .select(`
          id,
          user_id,
          challenge_id,
          points_awarded,
          is_first_blood,
          solved_at,
          profiles:user_id (username, display_name),
          challenges:challenge_id (title)
        `)
        .order("solved_at", { ascending: false });

      if (error) throw error;
      return data as unknown as SolveWithDetails[];
    }
  });

  const deleteSolveMutation = useMutation({
    mutationFn: async (solveId: string) => {
      // Get solve details first
      const { data: solve, error: fetchError } = await supabase
        .from("solves")
        .select("user_id, challenge_id, points_awarded, team_id")
        .eq("id", solveId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the solve
      const { error: deleteError } = await supabase
        .from("solves")
        .delete()
        .eq("id", solveId);

      if (deleteError) throw deleteError;

      // Update user score
      const { data: profile } = await supabase
        .from("profiles")
        .select("score")
        .eq("id", solve.user_id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ score: Math.max(0, (profile.score || 0) - solve.points_awarded) })
          .eq("id", solve.user_id);
      }

      // Deduct from team if applicable
      if (solve.team_id) {
        const { data: team } = await supabase
          .from("teams")
          .select("score")
          .eq("id", solve.team_id)
          .single();

        if (team) {
          await supabase
            .from("teams")
            .update({ score: Math.max(0, (team.score || 0) - solve.points_awarded) })
            .eq("id", solve.team_id);
        }
      }

      // Decrement solve count on challenge
      const { data: challenge } = await supabase
        .from("challenges")
        .select("solve_count")
        .eq("id", solve.challenge_id)
        .single();

      if (challenge) {
        await supabase
          .from("challenges")
          .update({ solve_count: Math.max(0, (challenge.solve_count || 1) - 1) })
          .eq("id", solve.challenge_id);
      }

      return solve;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solves"] });
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
      toast({ title: "Berhasil", description: "Solve berhasil dihapus dan skor dikurangi" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const resetAllScoresMutation = useMutation({
    mutationFn: async () => {
      // Delete all solves
      const { error: solvesError } = await supabase
        .from("solves")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (solvesError) throw solvesError;

      // Reset all user scores
      const { error: profilesError } = await supabase
        .from("profiles")
        .update({ score: 0 })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (profilesError) throw profilesError;

      // Reset all team scores
      const { error: teamsError } = await supabase
        .from("teams")
        .update({ score: 0 })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (teamsError) throw teamsError;

      // Reset challenge solve counts
      const { error: challengesError } = await supabase
        .from("challenges")
        .update({ solve_count: 0 })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (challengesError) throw challengesError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solves"] });
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
      toast({ title: "Berhasil", description: "Semua skor berhasil direset" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const filteredSolves = solves?.filter(solve => {
    const username = solve.profiles?.username?.toLowerCase() || "";
    const displayName = solve.profiles?.display_name?.toLowerCase() || "";
    const challengeTitle = solve.challenges?.title?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return username.includes(search) || displayName.includes(search) || challengeTitle.includes(search);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Kelola Scoreboard</h1>
            <p className="text-muted-foreground mt-1">
              Kelola data solves dan skor pemain
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Reset Semua Skor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Semua Skor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus SEMUA data solves dan mereset skor semua pemain dan tim ke 0. 
                    Tindakan ini TIDAK DAPAT dibatalkan!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => resetAllScoresMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {resetAllScoresMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Ya, Reset Semua"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card className="card-cyber">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Data Solves
                </CardTitle>
                <CardDescription>
                  {solves?.length || 0} total solves
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari user atau challenge..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSolves && filteredSolves.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Solved At</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSolves.map((solve) => (
                    <TableRow key={solve.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {solve.profiles?.display_name || solve.profiles?.username || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              @{solve.profiles?.username || "unknown"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <span>{solve.challenges?.title || "Unknown Challenge"}</span>
                          {solve.is_first_blood && (
                            <Badge variant="outline" className="border-warning/50 text-warning text-xs">
                              🩸 First Blood
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          +{solve.points_awarded}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(solve.solved_at), "dd/MM/yyyy HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Solve?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ini akan menghapus solve dan mengurangi {solve.points_awarded} poin dari user. 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSolveMutation.mutate(solve.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data solves.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}