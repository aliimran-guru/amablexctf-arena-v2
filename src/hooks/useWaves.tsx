import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.success("Wave activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
