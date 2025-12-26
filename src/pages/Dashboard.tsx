import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { VerticalCard } from '@/components/dashboard/VerticalCard';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { FollowUpReminderDialog } from '@/components/leads/FollowUpReminderDialog';
import { VERTICALS, Lead } from '@/types';
import { useLeads, useLeadStats } from '@/hooks/useLeads';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { Users, TrendingUp, CheckCircle, Clock, Store, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: leadStats } = useLeadStats();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const stats = {
    totalLeads: leadStats?.total || leads.length,
    newLeads: leads.filter((l) => l.status === 'new').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    pending: leads.filter((l) => l.status === 'contacted' || l.status === 'follow-up').length,
  };

  const getLeadCountByVertical = (verticalId: string) => {
    return leads.filter((l) => l.vertical === verticalId).length;
  };

  const getNewLeadsByVertical = (verticalId: string) => {
    return leads.filter((l) => l.vertical === verticalId && l.status === 'new').length;
  };

  const recentLeads = leads.slice(0, 5);

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
    leads,
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
            value={stats.totalLeads}
            change="+12% from last week"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="App B2B"
            value={leadStats?.appB2B || 0}
            change="Business leads"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="text-info"
          />
          <StatCard
            title="App B2C"
            value={leadStats?.appB2C || 0}
            change="Consumer leads"
            changeType="neutral"
            icon={CheckCircle}
            iconColor="text-success"
          />
          <StatCard
            title="Buy Leads"
            value={leadStats?.buyLeads || 0}
            change="Purchase leads"
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
          <LeadsTable leads={recentLeads} onEdit={handleEditLead} />
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
