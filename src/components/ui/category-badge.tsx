import { Globe, Lock, Terminal, Search, Eye, Puzzle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategorySlug, CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Lock,
  Terminal,
  Search,
  Eye,
  Puzzle,
};

interface CategoryBadgeProps {
  category: CategorySlug;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function CategoryBadge({
  category,
  size = "md",
  showIcon = true,
  className,
}: CategoryBadgeProps) {
  const config = CATEGORIES[category];
  const Icon = iconMap[config.icon];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses[size],
        `bg-${config.color}/10 text-${config.color}`,
        className
      )}
      style={{
        backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
        color: `hsl(var(--${config.color}))`,
      }}
    >
      {showIcon && Icon && <Icon className={iconSizes[size]} />}
      {config.name}
    </span>
  );
}