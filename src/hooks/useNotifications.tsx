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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];
      
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/notifications?or=(user_id.eq.${user.id},is_global.eq.true)&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
      return [];
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
      const session = await supabase.auth.getSession();
      await fetch(
        `${SUPABASE_URL}/rest/v1/notifications?id=eq.${notificationId}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ is_read: true }),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const session = await supabase.auth.getSession();
      await fetch(
        `${SUPABASE_URL}/rest/v1/notifications?user_id=eq.${user.id}&is_read=eq.false`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ is_read: true }),
        }
      );
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
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/notifications`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            title: notification.title,
            message: notification.message,
            type: notification.type || "info",
            user_id: notification.user_id || null,
            is_global: notification.is_global ?? true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }
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
