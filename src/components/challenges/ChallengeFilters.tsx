import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, X, CheckCircle2, Circle, Globe, Lock, Terminal, Search as SearchIcon, Eye, Puzzle } from "lucide-react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";

interface ChallengeFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  solvedFilter: "all" | "solved" | "unsolved";
  setSolvedFilter: (value: "all" | "solved" | "unsolved") => void;
  onReset: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  web: <Globe className="h-4 w-4" />,
  crypto: <Lock className="h-4 w-4" />,
  pwn: <Terminal className="h-4 w-4" />,
  forensic: <SearchIcon className="h-4 w-4" />,
  osint: <Eye className="h-4 w-4" />,
  misc: <Puzzle className="h-4 w-4" />,
};

export function ChallengeFilters({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  solvedFilter,
  setSolvedFilter,
  onReset,
}: ChallengeFiltersProps) {
  const hasFilters = search || category !== "all" || difficulty !== "all" || solvedFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={category === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategory("all")}
        >
          All
        </Button>
        {Object.entries(CATEGORIES).map(([slug, cat]) => (
          <Button
            key={slug}
            variant={category === slug ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(slug)}
            className="gap-1"
          >
            {categoryIcons[slug]}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Difficulty & Solved Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {Object.entries(DIFFICULTIES).map(([level, diff]) => (
              <SelectItem key={level} value={level}>
                {diff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={solvedFilter}
          onValueChange={(val) => val && setSolvedFilter(val as "all" | "solved" | "unsolved")}
        >
          <ToggleGroupItem value="all" aria-label="All challenges">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="solved" aria-label="Solved challenges" className="gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Solved
          </ToggleGroupItem>
          <ToggleGroupItem value="unsolved" aria-label="Unsolved challenges" className="gap-1">
            <Circle className="h-4 w-4" />
            Unsolved
          </ToggleGroupItem>
        </ToggleGroup>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
