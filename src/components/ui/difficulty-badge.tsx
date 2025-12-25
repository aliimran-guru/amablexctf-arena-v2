import { cn } from "@/lib/utils";
import { DifficultyLevel, DIFFICULTIES } from "@/lib/constants";

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function DifficultyBadge({
  difficulty,
  size = "md",
  className,
}: DifficultyBadgeProps) {
  const config = DIFFICULTIES[difficulty];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
        color: `hsl(var(--${config.color}))`,
      }}
    >
      {config.name}
    </span>
  );
}