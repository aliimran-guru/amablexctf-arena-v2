import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  is_global: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${user.id},is_global.eq.true`)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
      
      return (data || []) as Notification[];
    },
    enabled: !!user,
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Check if notification is for this user or global
          if (newNotification.user_id === user.id || newNotification.is_global) {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Calculate unread count
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Semua notifikasi ditandai sudah dibaca" });
    },
  });

  return {
    notifications: notifications || [],
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

// Admin hook to create notifications
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: {
      title: string;
      message: string;
      type?: string;
      user_id?: string;
      is_global?: boolean;
    }) => {
      const { error } = await supabase
        .from("notifications")
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type || "info",
          user_id: notification.user_id || null,
          is_global: notification.is_global ?? true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Notifikasi berhasil dikirim" });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal mengirim notifikasi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
