import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminUsers, useUpdateUserRole } from "@/hooks/useAdmin";
import { Search, MoreHorizontal, Shield, UserCog, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();

  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, role: "admin" | "moderator", action: "add" | "remove") => {
    updateRole.mutate({ userId, role, action });
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
          <p className="text-muted-foreground">Manage user accounts and roles</p>
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
                          <DropdownMenuLabel>Manage Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
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
    </AdminLayout>
  );
}
