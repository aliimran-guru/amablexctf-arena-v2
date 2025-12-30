import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useChallenges";
import { useCreateChallenge, useUpdateChallenge } from "@/hooks/useAdminChallenges";
import { useWaves } from "@/hooks/useWaves";
import { DIFFICULTIES } from "@/lib/constants";

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  flag: z.string().min(1, "Flag is required"),
  category_id: z.string().min(1, "Category is required"),
  wave_id: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard", "insane"]),
  scoring_type: z.enum(["static", "dynamic"]),
  static_points: z.coerce.number().min(1).max(10000),
  max_points: z.coerce.number().min(1).max(10000),
  min_points: z.coerce.number().min(0),
  decay_rate: z.coerce.number().min(0),
  is_active: z.boolean(),
  is_hidden: z.boolean(),
  author: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal("")),
  docker_image: z.string().optional(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge?: {
    id: string;
    title: string;
    description: string;
    flag: string;
    category_id: string;
    wave_id?: string | null;
    difficulty: string | null;
    scoring_type?: string;
    static_points?: number | null;
    max_points: number;
    min_points: number;
    decay_rate: number | null;
    is_active: boolean | null;
    is_hidden: boolean | null;
    author: string | null;
    source_url: string | null;
    docker_image: string | null;
  };
}

export function ChallengeFormDialog({
  open,
  onOpenChange,
  challenge,
}: ChallengeFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const { data: waves = [] } = useWaves();
  const createChallenge = useCreateChallenge();
  const updateChallenge = useUpdateChallenge();
  const isEditing = !!challenge;

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title ?? "",
      description: challenge?.description ?? "",
      flag: challenge?.flag ?? "",
      category_id: challenge?.category_id ?? "",
      wave_id: challenge?.wave_id ?? "",
      difficulty: (challenge?.difficulty as "easy" | "medium" | "hard" | "insane") ?? "medium",
      scoring_type: (challenge?.scoring_type as "static" | "dynamic") ?? "dynamic",
      static_points: challenge?.static_points ?? 100,
      max_points: challenge?.max_points ?? 500,
      min_points: challenge?.min_points ?? 50,
      decay_rate: challenge?.decay_rate ?? 25,
      is_active: challenge?.is_active ?? true,
      is_hidden: challenge?.is_hidden ?? false,
      author: challenge?.author ?? "",
      source_url: challenge?.source_url ?? "",
      docker_image: challenge?.docker_image ?? "",
    },
  });

  const scoringType = form.watch("scoring_type");

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      const currentPoints = data.scoring_type === "static" ? data.static_points : data.max_points;
      const waveId = data.wave_id && data.wave_id !== "" ? data.wave_id : null;
      
      if (isEditing) {
        await updateChallenge.mutateAsync({
          id: challenge.id,
          ...data,
          wave_id: waveId,
          current_points: currentPoints,
          source_url: data.source_url || null,
          docker_image: data.docker_image || null,
          author: data.author || null,
        });
      } else {
        await createChallenge.mutateAsync({
          title: data.title,
          description: data.description,
          flag: data.flag,
          category_id: data.category_id,
          wave_id: waveId,
          difficulty: data.difficulty,
          scoring_type: data.scoring_type,
          static_points: data.static_points,
          max_points: data.max_points,
          min_points: data.min_points,
          decay_rate: data.decay_rate,
          is_active: data.is_active,
          is_hidden: data.is_hidden,
          source_url: data.source_url || null,
          docker_image: data.docker_image || null,
          author: data.author || null,
          current_points: currentPoints,
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = createChallenge.isPending || updateChallenge.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "Edit Challenge" : "Create Challenge"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Challenge title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wave_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wave / Babak</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wave (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No Wave</SelectItem>
                        {waves.map((wave) => (
                          <SelectItem key={wave.id} value={wave.id}>
                            Wave {wave.wave_number} - {wave.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                          <SelectItem key={key} value={key}>
                            {diff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Challenge description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Flag</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AmablexCTF{...}"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The correct flag for this challenge
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scoring Type */}
              <FormField
                control={form.control}
                name="scoring_type"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Scoring Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scoring type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dynamic">Dynamic (decreasing points)</SelectItem>
                        <SelectItem value="static">Static (fixed points)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {scoringType === "static" 
                        ? "Fixed points regardless of solve count" 
                        : "Points decrease as more players solve"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Static Points - only shown for static scoring */}
              {scoringType === "static" && (
                <FormField
                  control={form.control}
                  name="static_points"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Fixed points awarded for solving</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Dynamic scoring fields - only shown for dynamic scoring */}
              {scoringType === "dynamic" && (
                <>
                  <FormField
                    control={form.control}
                    name="max_points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Points</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Points</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decay_rate"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Decay Rate</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Points deducted per solve</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Challenge author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="docker_image"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Docker Image</FormLabel>
                    <FormControl>
                      <Input placeholder="image:tag" {...field} />
                    </FormControl>
                    <FormDescription>
                      Docker image for containerized challenges
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Challenge is available to players
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_hidden"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Hidden</FormLabel>
                      <FormDescription>
                        Hide from challenge list
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gradient-primary">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}