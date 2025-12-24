import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { VerticalCard } from '@/components/dashboard/VerticalCard';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { VERTICALS } from '@/types';
import { mockLeads } from '@/data/mockData';
import { Users, TrendingUp, CheckCircle, Clock, Store } from 'lucide-react';

export default function Dashboard() {
  const stats = {
    totalLeads: mockLeads.length,
    newLeads: mockLeads.filter((l) => l.status === 'new').length,
    converted: mockLeads.filter((l) => l.status === 'converted').length,
    pending: mockLeads.filter((l) => l.status === 'contacted').length,
  };

  const getLeadCountByVertical = (verticalId: string) => {
    return mockLeads.filter((l) => l.vertical === verticalId).length;
  };

  const getNewLeadsByVertical = (verticalId: string) => {
    return mockLeads.filter((l) => l.vertical === verticalId && l.status === 'new').length;
  };

  const recentLeads = mockLeads.slice(0, 5);

  return (
    <AppLayout>
      <Header 
        title="Dashboard" 
        subtitle="Overview of your lead operations"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            change="+12% from last week"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            change="Requires attention"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-info"
          />
          <StatCard
            title="Converted"
            value={stats.converted}
            change="+8% conversion rate"
            changeType="positive"
            icon={CheckCircle}
            iconColor="text-success"
          />
          <StatCard
            title="In Progress"
            value={stats.pending}
            change="Being processed"
            changeType="neutral"
            icon={Clock}
            iconColor="text-warning"
          />
        </div>

        {/* Verticals Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Verticals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {VERTICALS.map((vertical, index) => (
              <div key={vertical.id} style={{ animationDelay: `${index * 100}ms` }}>
                <VerticalCard
                  vertical={vertical}
                  leadCount={getLeadCountByVertical(vertical.id)}
                  newLeads={getNewLeadsByVertical(vertical.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Recent Leads</h2>
            </div>
            <a href="/leads" className="text-sm text-primary hover:underline">
              View all →
            </a>
          </div>
          <LeadsTable leads={recentLeads} />
        </div>
      </div>
    </AppLayout>
  );
}
