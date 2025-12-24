import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockLeads } from '@/data/mockData';
import { VERTICALS, Lead, Vertical } from '@/types';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function VerticalPage() {
  const { verticalId } = useParams<{ verticalId: string }>();
  
  const vertical = VERTICALS.find((v) => v.id === verticalId);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const verticalLeads = leads.filter((l) => l.vertical === verticalId);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  // Set up follow-up reminders
  useFollowUpReminders({
    leads: verticalLeads,
    onLeadClick: handleEditLead,
  });

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

  const handleAddClick = () => {
    setEditingLead(null);
    setIsFormOpen(true);
  };

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
        vertical: leadData.vertical || (verticalId as Vertical),
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
        title={vertical.name} 
        subtitle={vertical.description}
        showAddButton
        addButtonLabel="Add Lead"
        onAddClick={handleAddClick}
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

        {/* Leads Table - hide vertical column since we're already in a vertical */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads</h2>
          <LeadsTable 
            leads={verticalLeads} 
            onEdit={handleEditLead}
            showVertical={false}
          />
        </div>
      </div>

      {/* Lead Form Dialog */}
      <LeadFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        lead={editingLead}
        onSave={handleSaveLead}
        defaultVertical={verticalId as Vertical}
      />
    </AppLayout>
  );
}
