import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Loader2, AlertCircle } from "lucide-react";
import { useSubmitFlag } from "@/hooks/useChallenges";
import { FLAG_REGEX } from "@/lib/constants";

interface FlagSubmissionFormProps {
  challengeId: string;
  isSolved: boolean;
}

const MAX_FLAG_LENGTH = 500;

export function FlagSubmissionForm({ challengeId, isSolved }: FlagSubmissionFormProps) {
  const [flag, setFlag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const submitFlag = useSubmitFlag();

  const validateFlag = (value: string): boolean => {
    if (!value.trim()) {
      setError("Flag tidak boleh kosong");
      return false;
    }
    if (value.length > MAX_FLAG_LENGTH) {
      setError(`Flag terlalu panjang (maks ${MAX_FLAG_LENGTH} karakter)`);
      return false;
    }
    if (!FLAG_REGEX.test(value.trim())) {
      setError("Format flag tidak valid. Gunakan: AmablexCTF{...}");
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sanitize input - remove potentially dangerous characters
    const sanitized = value.replace(/[<>]/g, '');
    setFlag(sanitized);
    if (sanitized) {
      validateFlag(sanitized);
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFlag(flag)) return;
    submitFlag.mutate({ challengeId, flag: flag.trim() });
  };

  const isValidFormat = flag.trim() === "" || FLAG_REGEX.test(flag.trim());

  if (isSolved) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/30 text-success">
        <Flag className="h-5 w-5" />
        <span className="font-medium">Kamu sudah menyelesaikan challenge ini!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flag" className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          Submit Flag
        </Label>
        <div className="flex gap-2">
          <Input
            id="flag"
            placeholder="AmablexCTF{...}"
            value={flag}
            onChange={handleChange}
            maxLength={MAX_FLAG_LENGTH}
            className={`font-mono ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            disabled={submitFlag.isPending}
            autoComplete="off"
            spellCheck={false}
          />
          <Button 
            type="submit" 
            disabled={submitFlag.isPending || !flag.trim() || !!error}
            className="gradient-primary"
          >
            {submitFlag.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
            <span className="ml-2">Submit</span>
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {!error && flag && !isValidFormat && (
          <p className="text-sm text-muted-foreground">
            Format: AmablexCTF{"{...}"}
          </p>
        )}
      </div>
    </form>
  );
}
