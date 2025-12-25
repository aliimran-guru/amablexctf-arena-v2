import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FlagSubmissionForm } from "@/components/challenges/FlagSubmissionForm";
import { HintsList } from "@/components/challenges/HintsList";
import { ChallengeFilesList } from "@/components/challenges/ChallengeFilesList";
import { useChallenge, useUserSolves } from "@/hooks/useChallenges";
import { ArrowLeft, Users, Droplet, ExternalLink, User } from "lucide-react";
import type { CategorySlug, DifficultyLevel } from "@/lib/constants";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: challenge, isLoading, error } = useChallenge(id ?? "");
  const { data: userSolves = [] } = useUserSolves();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !challenge) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The challenge you're looking for doesn't exist or you don't have access.
            </p>
            <Button asChild>
              <Link to="/challenges">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Challenges
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const categorySlug = challenge.categories?.slug as CategorySlug | undefined;
  const difficulty = challenge.difficulty as DifficultyLevel | undefined;
  const userSolve = userSolves.find((s) => s.challenge_id === challenge.id);
  const isSolved = !!userSolve;

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/challenges">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-3">{challenge.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {categorySlug && <CategoryBadge category={categorySlug} />}
                {difficulty && <DifficultyBadge difficulty={difficulty} />}
                {userSolve?.is_first_blood && (
                  <Badge variant="destructive" className="gap-1">
                    <Droplet className="h-3 w-3 fill-current" />
                    First Blood
                  </Badge>
                )}
              </div>
            </div>

            <Card className="shrink-0">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="text-3xl font-bold font-mono">
                    {challenge.current_points ?? challenge.max_points}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                    <Users className="h-3 w-3" />
                    {challenge.solve_count ?? 0} solves
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{challenge.description}</p>
                </div>

                {(challenge.author || challenge.source_url) && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {challenge.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Author: {challenge.author}</span>
                        </div>
                      )}
                      {challenge.source_url && (
                        <a
                          href={challenge.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Flag Submission */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Flag</CardTitle>
              </CardHeader>
              <CardContent>
                <FlagSubmissionForm challengeId={challenge.id} isSolved={isSolved} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Files */}
            <ChallengeFilesList files={challenge.challenge_files ?? []} />

            {/* Hints */}
            <HintsList
              hints={challenge.challenge_hints ?? []}
              isSolved={isSolved}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
