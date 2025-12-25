import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lightbulb, Lock, Unlock, Loader2 } from "lucide-react";
import { useUnlockHint, useUnlockedHints } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";

interface Hint {
  id: string;
  cost: number;
  order_index: number | null;
  content?: string;
}

interface HintsListProps {
  hints: Hint[];
  isSolved: boolean;
}

export function HintsList({ hints, isSolved }: HintsListProps) {
  const { profile } = useAuth();
  const { data: unlockedHintIds = [] } = useUnlockedHints();
  const unlockHint = useUnlockHint();
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);
  const [unlockedContent, setUnlockedContent] = useState<Record<string, string>>({});

  const sortedHints = [...hints].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const handleUnlock = async () => {
    if (!selectedHint) return;

    const content = await unlockHint.mutateAsync({
      hintId: selectedHint.id,
      cost: selectedHint.cost,
    });

    setUnlockedContent((prev) => ({ ...prev, [selectedHint.id]: content }));
    setSelectedHint(null);
  };

  if (hints.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5" />
            Hints
          </CardTitle>
          <CardDescription>
            Unlock hints by spending points. Use wisely!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedHints.map((hint, index) => {
            const isUnlocked = unlockedHintIds.includes(hint.id) || isSolved;
            const content = unlockedContent[hint.id] || hint.content;

            return (
              <div
                key={hint.id}
                className={`p-4 rounded-lg border ${
                  isUnlocked
                    ? "bg-muted/50 border-muted"
                    : "bg-background border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Hint #{index + 1}</span>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Unlock className="h-4 w-4" />
                      Unlocked
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHint(hint)}
                      className="gap-1"
                    >
                      <Lock className="h-4 w-4" />
                      Unlock (-{hint.cost} pts)
                    </Button>
                  )}
                </div>
                {isUnlocked && content ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {content}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    This hint is locked. Spend {hint.cost} points to unlock.
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={!!selectedHint} onOpenChange={() => setSelectedHint(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Hint</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock this hint? This will deduct{" "}
              <strong className="text-foreground">{selectedHint?.cost} points</strong> from
              your score.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Your current score:{" "}
              <strong className="text-foreground">{profile?.score ?? 0} pts</strong>
            </p>
            {(profile?.score ?? 0) < (selectedHint?.cost ?? 0) && (
              <p className="text-sm text-destructive mt-2">
                You don't have enough points to unlock this hint.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedHint(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUnlock}
              disabled={
                unlockHint.isPending ||
                (profile?.score ?? 0) < (selectedHint?.cost ?? 0)
              }
            >
              {unlockHint.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Unlock Hint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
