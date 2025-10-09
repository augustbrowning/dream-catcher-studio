import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  mood: string;
  themes: string[];
  lucidity: string;
}

export const useDreams = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dreams = [], isLoading } = useQuery({
    queryKey: ["dreams", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Dream[];
    },
    enabled: !!userId,
  });

  const createDream = useMutation({
    mutationFn: async (dreamData: Omit<Dream, "id">) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("dreams")
        .insert([{ ...dreamData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dreams", userId] });
      toast({
        title: "Dream saved!",
        description: "Your dream has been added to your journal.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save dream",
        variant: "destructive",
      });
    },
  });

  return {
    dreams,
    isLoading,
    createDream: createDream.mutate,
  };
};
