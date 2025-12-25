import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateNotification } from "@/hooks/useNotifications";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Bell, Send, Users } from "lucide-react";

export default function AdminNotifications() {
  const createNotification = useCreateNotification();
  const { data: users } = useAdminUsers();
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) return;

    createNotification.mutate({
      title,
      message,
      type,
      is_global: isGlobal,
      user_id: isGlobal ? undefined : selectedUserId || undefined,
    });

    // Reset form
    setTitle("");
    setMessage("");
    setType("info");
    setIsGlobal(true);
    setSelectedUserId("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Send real-time notifications to participants</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>
                Create a new notification for participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Notification message..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="cursor-pointer">Send to All Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Broadcast to all participants
                    </p>
                  </div>
                  <Switch
                    checked={isGlobal}
                    onCheckedChange={setIsGlobal}
                  />
                </div>

                {!isGlobal && (
                  <div className="space-y-2">
                    <Label htmlFor="user">Select User</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            @{user.username} - {user.display_name || user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={createNotification.isPending}
                >
                  <Send className="h-4 w-4" />
                  Send Notification
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
              <CardDescription>
                Best practices for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="text-blue-500 text-sm font-bold">i</span>
                </div>
                <div>
                  <p className="font-medium">Info</p>
                  <p className="text-sm text-muted-foreground">
                    Use for general announcements, updates, or reminders.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <span className="text-green-500 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium">Success</p>
                  <p className="text-sm text-muted-foreground">
                    Use when something positive happens, like a new challenge release.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium">Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Use for important notices that need attention.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <span className="text-red-500 text-sm font-bold">✕</span>
                </div>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm text-muted-foreground">
                    Use for critical issues or service disruptions.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Real-time Delivery</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notifications are delivered instantly to all online users via WebSocket.
                  Users will see a toast notification and the bell icon will update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
