import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockLeads } from '@/data/mockData';
import { VERTICALS } from '@/types';
import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function VerticalPage() {
  const { verticalId } = useParams<{ verticalId: string }>();
  
  const vertical = VERTICALS.find((v) => v.id === verticalId);
  const verticalLeads = mockLeads.filter((l) => l.vertical === verticalId);

  if (!vertical) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Vertical not found</p>
        </div>
      </AppLayout>
    );
  }

  const stats = {
    total: verticalLeads.length,
    new: verticalLeads.filter((l) => l.status === 'new').length,
    converted: verticalLeads.filter((l) => l.status === 'converted').length,
    lost: verticalLeads.filter((l) => l.status === 'lost').length,
  };

  return (
    <AppLayout>
      <Header 
        title={vertical.name} 
        subtitle={vertical.description}
        showAddButton
        addButtonLabel="Add Lead"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={stats.total}
            icon={Users}
          />
          <StatCard
            title="New"
            value={stats.new}
            change="Needs attention"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-info"
          />
          <StatCard
            title="Converted"
            value={stats.converted}
            icon={CheckCircle}
            iconColor="text-success"
          />
          <StatCard
            title="Lost"
            value={stats.lost}
            icon={XCircle}
            iconColor="text-destructive"
          />
        </div>

        {/* Leads Table */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads</h2>
          {verticalLeads.length > 0 ? (
            <LeadsTable leads={verticalLeads} />
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No leads in this vertical yet</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
