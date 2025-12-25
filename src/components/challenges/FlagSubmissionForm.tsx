import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Loader2 } from "lucide-react";
import { useSubmitFlag } from "@/hooks/useChallenges";
import { FLAG_REGEX } from "@/lib/constants";

interface FlagSubmissionFormProps {
  challengeId: string;
  isSolved: boolean;
}

export function FlagSubmissionForm({ challengeId, isSolved }: FlagSubmissionFormProps) {
  const [flag, setFlag] = useState("");
  const submitFlag = useSubmitFlag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;
    submitFlag.mutate({ challengeId, flag: flag.trim() });
  };

  const isValidFormat = flag.trim() === "" || FLAG_REGEX.test(flag.trim());

  if (isSolved) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
        <Flag className="h-5 w-5" />
        <span className="font-medium">You have solved this challenge!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flag">Submit Flag</Label>
        <div className="flex gap-2">
          <Input
            id="flag"
            placeholder="AmablexCTF{...}"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className={`font-mono ${!isValidFormat ? "border-destructive" : ""}`}
            disabled={submitFlag.isPending}
          />
          <Button type="submit" disabled={submitFlag.isPending || !flag.trim()}>
            {submitFlag.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
            <span className="ml-2">Submit</span>
          </Button>
        </div>
        {!isValidFormat && (
          <p className="text-sm text-destructive">
            Flag format should be: AmablexCTF{"{...}"}
          </p>
        )}
      </div>
    </form>
  );
}
