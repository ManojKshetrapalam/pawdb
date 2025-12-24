import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VerticalConfig } from '@/types';
import {
  Building2,
  Users,
  ShoppingCart,
  GraduationCap,
  Heart,
  Plane,
  Hotel,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Users,
  ShoppingCart,
  GraduationCap,
  Heart,
  Plane,
  Hotel,
};

interface VerticalCardProps {
  vertical: VerticalConfig;
  leadCount: number;
  newLeads: number;
}

export function VerticalCard({ vertical, leadCount, newLeads }: VerticalCardProps) {
  const Icon = iconMap[vertical.icon] || Building2;

  return (
    <Link
      to={`/verticals/${vertical.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{vertical.name}</h3>
            <p className="text-sm text-muted-foreground">{vertical.description}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-2xl font-bold text-card-foreground">{leadCount}</p>
          <p className="text-xs text-muted-foreground">Total Leads</p>
        </div>
        {newLeads > 0 && (
          <div className="rounded-full bg-info/10 px-3 py-1">
            <span className="text-sm font-medium text-info">{newLeads} new</span>
          </div>
        )}
      </div>
    </Link>
  );
}
