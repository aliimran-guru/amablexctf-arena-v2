import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";

export interface Wave {
  id: string;
  name: string;
  description: string | null;
  wave_number: number;
  start_time: string | null;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useWaves() {
  return useQuery({
    queryKey: ["waves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waves")
        .select("*")
        .order("wave_number", { ascending: true });

      if (error) throw error;
      return data as Wave[];
    },
  });
}

export function useActiveWave() {
  return useQuery({
    queryKey: ["active-wave"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waves")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as Wave | null;
    },
  });
}

export function useWaveTimer() {
  const { data: activeWave, isLoading } = useActiveWave();

  const getWaveEndTime = useCallback(() => {
    if (!activeWave || !activeWave.start_time) return null;
    const startTime = new Date(activeWave.start_time);
    const endTime = new Date(startTime.getTime() + activeWave.duration_hours * 60 * 60 * 1000);
    return endTime;
  }, [activeWave]);

  const getTimeRemaining = useCallback(() => {
    const endTime = getWaveEndTime();
    if (!endTime) return null;
    
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, isEnded: false };
  }, [getWaveEndTime]);

  return {
    activeWave,
    isLoading,
    getWaveEndTime,
    getTimeRemaining,
  };
}

// Hook to auto-activate waves based on start_time
export function useAutoActivateWaves() {
  const queryClient = useQueryClient();
  const { data: waves } = useWaves();

  useEffect(() => {
    if (!waves || waves.length === 0) return;

    const checkAndActivateWaves = async () => {
      const now = new Date();
      
      for (const wave of waves) {
        if (!wave.start_time) continue;
        
        const startTime = new Date(wave.start_time);
        const endTime = new Date(startTime.getTime() + wave.duration_hours * 60 * 60 * 1000);
        
        // If current time is within wave period and wave is not active
        if (now >= startTime && now < endTime && !wave.is_active) {
          // Deactivate all waves first
          await supabase.from("waves").update({ is_active: false }).neq("id", "");
          
          // Activate this wave
          const { error } = await supabase
            .from("waves")
            .update({ is_active: true })
            .eq("id", wave.id);
          
          if (!error) {
            // Send global notification
            await supabase.from("notifications").insert({
              title: `Wave ${wave.wave_number} Started!`,
              message: `${wave.name} is now active. Duration: ${wave.duration_hours} hours.`,
              type: "info",
              is_global: true,
            });
            
            queryClient.invalidateQueries({ queryKey: ["waves"] });
            queryClient.invalidateQueries({ queryKey: ["active-wave"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.info(`Wave ${wave.wave_number} is now active!`);
          }
          break;
        }
        
        // If wave has ended and is still active, deactivate it
        if (now >= endTime && wave.is_active) {
          const { error } = await supabase
            .from("waves")
            .update({ is_active: false })
            .eq("id", wave.id);
          
          if (!error) {
            // Send global notification
            await supabase.from("notifications").insert({
              title: `Wave ${wave.wave_number} Ended`,
              message: `${wave.name} has ended.`,
              type: "info",
              is_global: true,
            });
            
            queryClient.invalidateQueries({ queryKey: ["waves"] });
            queryClient.invalidateQueries({ queryKey: ["active-wave"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.info(`Wave ${wave.wave_number} has ended!`);
          }
        }
      }
    };

    // Check immediately
    checkAndActivateWaves();

    // Check every minute
    const interval = setInterval(checkAndActivateWaves, 60000);

    return () => clearInterval(interval);
  }, [waves, queryClient]);
}

export function useCreateWave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wave: {
      name: string;
      description?: string;
      wave_number: number;
      start_time?: string;
      duration_hours: number;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("waves")
        .insert(wave)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
      queryClient.invalidateQueries({ queryKey: ["active-wave"] });
      toast.success("Wave created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateWave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Wave> & { id: string }) => {
      const { data, error } = await supabase
        .from("waves")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
      queryClient.invalidateQueries({ queryKey: ["active-wave"] });
      toast.success("Wave updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteWave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("waves").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
      queryClient.invalidateQueries({ queryKey: ["active-wave"] });
      toast.success("Wave deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useActivateWave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Deactivate all waves first
      await supabase.from("waves").update({ is_active: false }).neq("id", "");

      // Activate the selected wave
      const { error } = await supabase
        .from("waves")
        .update({ is_active: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
      queryClient.invalidateQueries({ queryKey: ["active-wave"] });
      toast.success("Wave activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
