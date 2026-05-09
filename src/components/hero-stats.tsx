// Server Component
export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroStatsProps {
  stats: HeroStat[];
}

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-6 pt-5 border-t border-gold/20">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5">
          <span className="font-display text-3xl text-gold leading-none">
            {stat.value}
          </span>
          <span className="text-xs uppercase tracking-wider text-mute-soft">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
