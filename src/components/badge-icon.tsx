import {
  Award,
  Crown,
  Flag,
  Flame,
  Footprints,
  Lock,
  Moon,
  Mountain,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Footprints,
  flame: Flame,
  moon: Moon,
  target: Target,
  trophy: Mountain,
  crown: Crown,
  flag: Flag,
  award: Award,
  medal: Trophy,
};

export function BadgeIcon({
  icon,
  earned = true,
  className = "size-3.5",
}: {
  icon: string;
  earned?: boolean;
  className?: string;
}) {
  if (!earned) return <Lock className="size-3" />;
  const Cmp = ICONS[icon] ?? Sparkles;
  return <Cmp className={className} strokeWidth={1.6} />;
}
