import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { ChallengeFilters } from "@/components/challenges/ChallengeFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useChallenges, useUserSolves } from "@/hooks/useChallenges";
import { Flag } from "lucide-react";
import type { CategorySlug, DifficultyLevel } from "@/lib/constants";

export default function Challenges() {
  const { data: challenges, isLoading } = useChallenges();
  const { data: userSolves = [] } = useUserSolves();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [solvedFilter, setSolvedFilter] = useState<"all" | "solved" | "unsolved">("all");

  const solvedChallengeIds = useMemo(
    () => new Set(userSolves.map((s) => s.challenge_id)),
    [userSolves]
  );

  const firstBloodChallengeIds = useMemo(
    () => new Set(userSolves.filter((s) => s.is_first_blood).map((s) => s.challenge_id)),
    [userSolves]
  );

  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];

    return challenges.filter((challenge) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesTitle = challenge.title.toLowerCase().includes(searchLower);
        const matchesDesc = challenge.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Category filter
      if (category !== "all" && challenge.categories?.slug !== category) {
        return false;
      }

      // Difficulty filter
      if (difficulty !== "all" && challenge.difficulty !== difficulty) {
        return false;
      }

      // Solved filter
      const isSolved = solvedChallengeIds.has(challenge.id);
      if (solvedFilter === "solved" && !isSolved) return false;
      if (solvedFilter === "unsolved" && isSolved) return false;

      return true;
    });
  }, [challenges, search, category, difficulty, solvedFilter, solvedChallengeIds]);

  const groupedChallenges = useMemo(() => {
    const groups: Record<string, typeof filteredChallenges> = {};

    filteredChallenges.forEach((challenge) => {
      const cat = challenge.categories?.slug ?? "misc";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(challenge);
    });

    return groups;
  }, [filteredChallenges]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setDifficulty("all");
    setSolvedFilter("all");
  };

  const solvedCount = userSolves.length;
  const totalCount = challenges?.length ?? 0;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Challenges</h1>
            <p className="text-muted-foreground mt-1">
              {solvedCount} / {totalCount} solved
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ChallengeFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            solvedFilter={solvedFilter}
            setSolvedFilter={setSolvedFilter}
            onReset={resetFilters}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon={<Flag className="h-8 w-8 text-muted-foreground" />}
            title="No challenges found"
            description={
              search || category !== "all" || difficulty !== "all"
                ? "Try adjusting your filters"
                : "Check back soon for new challenges!"
            }
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedChallenges).map(([cat, challenges]) => (
              <div key={cat}>
                <h2 className="text-xl font-semibold mb-4 capitalize">{cat}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      isSolved={solvedChallengeIds.has(challenge.id)}
                      isFirstBlood={firstBloodChallengeIds.has(challenge.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
