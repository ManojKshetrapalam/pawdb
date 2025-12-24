import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { VerticalCard } from '@/components/dashboard/VerticalCard';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { VERTICALS, Lead } from '@/types';
import { mockLeads } from '@/data/mockData';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { Users, TrendingUp, CheckCircle, Clock, Store } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const stats = {
    totalLeads: leads.length,
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
  useFollowUpReminders({
    leads,
    onLeadClick: handleEditLead,
  });

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      setLeads(leads.map(l => 
        l.id === editingLead.id 
          ? { ...l, ...leadData }
          : l
      ));
    } else {
      const newLead: Lead = {
        id: String(Date.now()),
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        vertical: leadData.vertical!,
        status: leadData.status || 'new',
        source: leadData.source || 'meta',
        assignedTo: leadData.assignedTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: leadData.notes || [],
        followUpDate: leadData.followUpDate,
      };
      setLeads([newLead, ...leads]);
    }
  };

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
    </AppLayout>
  );
}
