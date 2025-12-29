import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-primary' }: StatCardProps) {
  // Determine font size based on value length
  const valueString = String(value);
  const getValueClass = () => {
    if (valueString.length > 12) return 'text-sm sm:text-base lg:text-lg';
    if (valueString.length > 8) return 'text-base sm:text-lg lg:text-xl';
    if (valueString.length > 5) return 'text-lg sm:text-xl lg:text-2xl';
    return 'text-xl sm:text-2xl lg:text-3xl';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:shadow-md animate-fade-in overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className={cn('mt-1 sm:mt-2 font-bold text-card-foreground break-all', getValueClass())}>{value}</p>
          {change && (
            <p
              className={cn(
                'mt-1 text-xs sm:text-sm font-medium truncate',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg bg-muted p-2 sm:p-3 shrink-0', iconColor)}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}
