import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { VerticalCard } from '@/components/dashboard/VerticalCard';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { FollowUpReminderDialog } from '@/components/leads/FollowUpReminderDialog';
import { VERTICALS, Lead } from '@/types';
import { useRecentLeads, useLeadStats } from '@/hooks/useLeads';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { useRevenueStats } from '@/hooks/useRevenue';
import { Users, TrendingUp, CheckCircle, Clock, Store, Loader2, DollarSign, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  const { data: recentLeads = [], isLoading } = useRecentLeads(10);
  const { data: leadStats } = useLeadStats();
  const { data: revenueStats } = useRevenueStats();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const stats = {
    totalLeads: leadStats?.total || 0,
    appB2B: leadStats?.appB2B || 0,
    appB2C: leadStats?.appB2C || 0,
    buyLeads: leadStats?.buyLeads || 0,
  };

  const getLeadCountByVertical = (verticalId: string) => {
    const verticalDbMap: Record<string, string> = {
      'app-b2b': 'App B2B',
      'app-b2c': 'App B2C',
      'buy-leads': 'Buy Leads',
    };
    return leadStats?.byEnquiry?.[verticalDbMap[verticalId]] || 0;
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  // Set up follow-up reminders
  const {
    reminderLead,
    minutesUntil,
    isReminderOpen,
    dismissReminder,
    handleViewLead,
    handleSnooze,
  } = useFollowUpReminders({
    leads: recentLeads,
    onLeadClick: handleEditLead,
  });

  const handleSaveLead = (leadData: Partial<Lead>) => {
    // TODO: Implement save to Supabase
    console.log('Save lead:', leadData);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Dashboard" subtitle="Overview of your lead operations" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

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
            value={stats.totalLeads.toLocaleString()}
            change="All enquiries"
            changeType="neutral"
            icon={Users}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(revenueStats?.totalRevenue || 0).toLocaleString()}`}
            change={`${revenueStats?.totalLeadsSold || 0} leads sold`}
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatCard
            title="Leads Sold"
            value={(revenueStats?.totalLeadsSold || 0).toLocaleString()}
            change={`${revenueStats?.uniqueBuyers || 0} unique buyers`}
            changeType="neutral"
            icon={ShoppingCart}
            iconColor="text-info"
          />
          <StatCard
            title="Avg Lead Price"
            value={`₹${Math.round(revenueStats?.avgLeadPrice || 0).toLocaleString()}`}
            change="Per lead"
            changeType="neutral"
            icon={TrendingUp}
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
            {VERTICALS.slice(0, 3).map((vertical, index) => (
              <div key={vertical.id} style={{ animationDelay: `${index * 100}ms` }}>
                <VerticalCard
                  vertical={vertical}
                  leadCount={getLeadCountByVertical(vertical.id)}
                  newLeads={0}
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
          <LeadsTable leads={recentLeads.slice(0, 5)} onEdit={handleEditLead} />
        </div>
      </div>

      {/* Lead Form Dialog */}
      <LeadFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        lead={editingLead}
        onSave={handleSaveLead}
      />

      {/* Follow-up Reminder Dialog */}
      <FollowUpReminderDialog
        lead={reminderLead}
        open={isReminderOpen}
        onOpenChange={dismissReminder}
        onViewLead={handleViewLead}
        onSnooze={handleSnooze}
        minutesUntil={minutesUntil}
      />
    </AppLayout>
  );
}
