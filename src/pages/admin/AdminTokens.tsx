import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Check,
  Calendar,
  Users,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";

interface RegistrationToken {
  id: string;
  token: string;
  description: string | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

function generateToken(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AdminTokens() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newToken, setNewToken] = useState({
    token: generateToken(),
    description: "",
    max_uses: 1,
    expires_at: ""
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["registration-tokens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_tokens")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RegistrationToken[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (tokenData: typeof newToken) => {
      const { error } = await supabase
        .from("registration_tokens")
        .insert({
          token: tokenData.token,
          description: tokenData.description || null,
          max_uses: tokenData.max_uses || null,
          expires_at: tokenData.expires_at || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration-tokens"] });
      setIsDialogOpen(false);
      setNewToken({
        token: generateToken(),
        description: "",
        max_uses: 1,
        expires_at: ""
      });
      toast({ title: "Berhasil", description: "Token berhasil dibuat" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("registration_tokens")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration-tokens"] });
      toast({ title: "Berhasil", description: "Token berhasil dihapus" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("registration_tokens")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration-tokens"] });
    }
  });

  const copyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Tersalin!", description: "Token berhasil disalin ke clipboard" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newToken);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Token Registrasi</h1>
            <p className="text-muted-foreground mt-1">
              Kelola token untuk pendaftaran pengguna baru
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary">
                <Plus className="h-4 w-4" />
                Buat Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Buat Token Baru</DialogTitle>
                <DialogDescription>
                  Token ini akan digunakan untuk mendaftar akun baru.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Token</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newToken.token}
                      onChange={(e) => setNewToken({ ...newToken, token: e.target.value.toUpperCase() })}
                      className="font-mono"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewToken({ ...newToken, token: generateToken() })}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi (opsional)</Label>
                  <Input
                    value={newToken.description}
                    onChange={(e) => setNewToken({ ...newToken, description: e.target.value })}
                    placeholder="Token untuk event X"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maks Penggunaan</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newToken.max_uses}
                      onChange={(e) => setNewToken({ ...newToken, max_uses: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kadaluarsa (opsional)</Label>
                    <Input
                      type="datetime-local"
                      value={newToken.expires_at}
                      onChange={(e) => setNewToken({ ...newToken, expires_at: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buat Token"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Daftar Token
            </CardTitle>
            <CardDescription>
              Token yang aktif dapat digunakan untuk mendaftar akun baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tokens && tokens.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Penggunaan</TableHead>
                    <TableHead>Kadaluarsa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-secondary px-2 py-1 rounded">
                            {token.token}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToken(token.token, token.id)}
                          >
                            {copiedId === token.id ? (
                              <Check className="h-3 w-3 text-success" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {token.description || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {token.current_uses}/{token.max_uses || "∞"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {token.expires_at ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(token.expires_at), "dd/MM/yyyy HH:mm")}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={token.is_active ? "default" : "secondary"}
                          className={token.is_active ? "bg-success" : ""}
                          onClick={() => toggleActiveMutation.mutate({ id: token.id, is_active: !token.is_active })}
                          style={{ cursor: "pointer" }}
                        >
                          {token.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(token.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada token registrasi.</p>
                <p className="text-sm">Buat token baru untuk memungkinkan pendaftaran pengguna.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
