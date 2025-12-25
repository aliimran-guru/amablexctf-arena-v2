import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminUsers, useUpdateUserRole, useUpdateUserProfile, useDeleteUser, useResetUserPassword } from "@/hooks/useAdmin";
import { Search, MoreHorizontal, Shield, UserCog, User, Pencil, Trash2, KeyRound } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const updateProfile = useUpdateUserProfile();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetUserPassword();

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [editForm, setEditForm] = useState({
    display_name: "",
    bio: "",
    score: 0,
  });

  const filteredUsers = users?.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, role: "admin" | "moderator", action: "add" | "remove") => {
    updateRole.mutate({ userId, role, action });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({
      display_name: user.display_name || "",
      bio: user.bio || "",
      score: user.score || 0,
    });
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      updateProfile.mutate({
        userId: editingUser.id,
        updates: {
          display_name: editForm.display_name,
          bio: editForm.bio,
          score: editForm.score,
        },
      });
      setEditingUser(null);
    }
  };

  const handleDelete = () => {
    if (deletingUser) {
      deleteUser.mutate(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const handleResetPassword = () => {
    if (resetPasswordUser && newPassword.length >= 6) {
      resetPassword.mutate({
        userId: resetPasswordUser.id,
        newPassword,
      });
      setResetPasswordUser(null);
      setNewPassword("");
    }
  };

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes("admin")) {
      return <Badge variant="destructive" className="gap-1"><Shield className="h-3 w-3" />Admin</Badge>;
    }
    if (roles.includes("moderator")) {
      return <Badge variant="secondary" className="gap-1"><UserCog className="h-3 w-3" />Mod</Badge>;
    }
    return <Badge variant="outline" className="gap-1"><User className="h-3 w-3" />User</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and profiles</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : !filteredUsers?.length ? (
          <EmptyState
            icon={<UserCog className="h-8 w-8 text-muted-foreground" />}
            title="No users found"
            description="Users will appear here once they register"
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.display_name || user.username}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.roles)}</TableCell>
                    <TableCell className="text-right font-mono">{user.score || 0}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Manage Role</DropdownMenuLabel>
                          {user.roles.includes("admin") ? (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin", "remove")}>
                              <Shield className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin", "add")}>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          {user.roles.includes("moderator") ? (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "moderator", "remove")}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Remove Moderator
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "moderator", "add")}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Make Moderator
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeletingUser(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update profile for @{editingUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={editForm.display_name}
                onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Score</Label>
              <Input
                type="number"
                value={editForm.score}
                onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateProfile.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={() => { setResetPasswordUser(null); setNewPassword(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for @{resetPasswordUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
              />
              {newPassword.length > 0 && newPassword.length < 6 && (
                <p className="text-sm text-destructive">Password minimal 6 karakter</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetPasswordUser(null); setNewPassword(""); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword} 
              disabled={resetPassword.isPending || newPassword.length < 6}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{deletingUser?.username}" and all their data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
