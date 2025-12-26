import { useState } from 'react';
import { format } from 'date-fns';
import { StatCard } from './StatCard';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Users, 
  TrendingUp, 
  Download, 
  CreditCard, 
  Target, 
  Send, 
  ShoppingCart,
  DollarSign,
  CalendarIcon,
  Percent,
  Gift,
  Loader2
} from 'lucide-react';
import { Lead } from '@/types';
import { DateRange } from 'react-day-picker';
import { useBuyLeadsStats } from '@/hooks/useRevenue';

interface VerticalStatsProps {
  verticalId: string;
  leads: Lead[];
}

// Mock data for app stats (would need separate implementation)
const getMockAppStats = (verticalId: string) => ({
  totalLeads: 156,
  appDownloads: 2340,
  subscribers: 89,
  totalRevenue: 267500,
});

export function VerticalStats({ verticalId, leads }: VerticalStatsProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const { data: buyLeadsStats, isLoading: buyLeadsLoading } = useBuyLeadsStats();

  // Filter leads by date range
  const filteredLeads = leads.filter((lead) => {
    const leadDate = new Date(lead.createdAt);
    if (dateRange?.from && dateRange?.to) {
      return leadDate >= dateRange.from && leadDate <= dateRange.to;
    }
    if (dateRange?.from) {
      return leadDate >= dateRange.from;
    }
    return true;
  });

  const stats = {
    total: filteredLeads.length,
    converted: filteredLeads.filter((l) => l.status === 'converted').length,
    revenue: filteredLeads.filter((l) => l.status === 'converted').length * 2500,
  };

  const appStats = getMockAppStats(verticalId);

  const isAppVertical = verticalId === 'app-b2b' || verticalId === 'app-b2c';
  const isBuyLeads = verticalId === 'buy-leads';

  return (
    <div className="space-y-4">
      {/* Date Range Picker */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal w-full sm:w-auto sm:min-w-[280px]',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  'Pick a date range'
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              className="pointer-events-auto sm:hidden"
            />
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="pointer-events-auto hidden sm:block"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Grid */}
      {isAppVertical ? (
        // B2B/B2C App Stats
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={appStats.totalLeads}
            icon={Users}
          />
          <StatCard
            title="App Downloads"
            value={appStats.appDownloads.toLocaleString()}
            change="+12% this month"
            changeType="positive"
            icon={Download}
            iconColor="text-info"
          />
          <StatCard
            title="Total Subscribers"
            value={appStats.subscribers}
            change="+8 this week"
            changeType="positive"
            icon={CreditCard}
            iconColor="text-success"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${appStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-warning"
          />
        </div>
      ) : isBuyLeads ? (
        // Buy Leads Stats - Real Data
        buyLeadsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Leads Generated"
              value={(buyLeadsStats?.leadsGenerated || 0).toLocaleString()}
              icon={Target}
            />
            <StatCard
              title="Leads Posted"
              value={(buyLeadsStats?.leadsPosted || 0).toLocaleString()}
              change={buyLeadsStats?.leadsGenerated ? `${Math.round((buyLeadsStats.leadsPosted / buyLeadsStats.leadsGenerated) * 100)}% posted` : '0%'}
              changeType="neutral"
              icon={Send}
              iconColor="text-info"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${(buyLeadsStats?.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
              iconColor="text-warning"
            />
          </div>

          {/* Leads Sold Card with breakdown */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Sold</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-card-foreground">{buyLeadsStats?.leadsSold || 0}</p>
              </div>
              <div className="rounded-lg bg-muted p-2 sm:p-3 text-success">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            
            {/* Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-success/10">
                  <DollarSign className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 flex sm:block items-center justify-between">
                  <p className="text-xs text-muted-foreground">Full Price</p>
                  <p className="text-lg font-semibold text-card-foreground">{buyLeadsStats?.fullPriceSold || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-warning/10">
                  <Percent className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 flex sm:block items-center justify-between">
                  <p className="text-xs text-muted-foreground">Discount</p>
                  <p className="text-lg font-semibold text-card-foreground">{buyLeadsStats?.discountSold || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-info/10">
                  <Gift className="h-4 w-4 text-info" />
                </div>
                <div className="flex-1 flex sm:block items-center justify-between">
                  <p className="text-xs text-muted-foreground">Free</p>
                  <p className="text-lg font-semibold text-card-foreground">{buyLeadsStats?.freeSold || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      ) : (
        // Default Analytics Stats for other verticals
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Leads"
            value={stats.total}
            icon={Users}
          />
          <StatCard
            title="Total Converted"
            value={stats.converted}
            change={stats.total > 0 ? `${Math.round((stats.converted / stats.total) * 100)}% rate` : '0%'}
            changeType={stats.converted > 0 ? 'positive' : 'neutral'}
            icon={TrendingUp}
            iconColor="text-success"
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-warning"
          />
        </div>
      )}
    </div>
  );
}
