import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { CheckCircle2, Droplet, FileDown, Lightbulb, Users } from "lucide-react";
import type { ChallengeWithCategory } from "@/hooks/useChallenges";
import type { CategorySlug, DifficultyLevel } from "@/lib/constants";

interface ChallengeCardProps {
  challenge: ChallengeWithCategory;
  isSolved?: boolean;
  isFirstBlood?: boolean;
}

export function ChallengeCard({ challenge, isSolved, isFirstBlood }: ChallengeCardProps) {
  const categorySlug = challenge.categories?.slug as CategorySlug | undefined;
  const difficulty = challenge.difficulty as DifficultyLevel | undefined;
  const hintsCount = challenge.challenge_hints?.length ?? 0;
  const filesCount = challenge.challenge_files?.length ?? 0;

  return (
    <Link to={`/challenges/${challenge.id}`}>
      <Card className={`group transition-all hover:shadow-lg hover:border-primary/50 ${isSolved ? "border-green-500/50 bg-green-500/5" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {challenge.title}
            </CardTitle>
            {isSolved && (
              <div className="flex items-center gap-1">
                {isFirstBlood && (
                  <Droplet className="h-4 w-4 text-red-500 fill-red-500" />
                )}
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {categorySlug && <CategoryBadge category={categorySlug} />}
            {difficulty && <DifficultyBadge difficulty={difficulty} />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {challenge.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{challenge.solve_count ?? 0} solves</span>
              </div>
              {hintsCount > 0 && (
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  <span>{hintsCount} hints</span>
                </div>
              )}
              {filesCount > 0 && (
                <div className="flex items-center gap-1">
                  <FileDown className="h-3 w-3" />
                  <span>{filesCount} files</span>
                </div>
              )}
            </div>
            <Badge variant="secondary" className="font-mono font-bold">
              {challenge.current_points ?? challenge.max_points} pts
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
