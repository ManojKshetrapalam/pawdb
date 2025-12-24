import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { FollowUpReminderDialog } from '@/components/leads/FollowUpReminderDialog';
import { SubscriptionSelectionDialog } from '@/components/leads/SubscriptionSelectionDialog';
import { VerticalStats } from '@/components/dashboard/VerticalStats';
import { mockLeads } from '@/data/mockData';
import { VERTICALS, Lead, Vertical } from '@/types';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { usePricing } from '@/contexts/PricingContext';

export default function VerticalPage() {
  const { verticalId } = useParams<{ verticalId: string }>();
  
  const vertical = VERTICALS.find((v) => v.id === verticalId);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [subscriptionLead, setSubscriptionLead] = useState<Lead | null>(null);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const { postLead } = useMarketplace();
  const { addConvertedSubscription } = usePricing();

  const verticalLeads = leads.filter((l) => l.vertical === verticalId);

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

  const handleConvert = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // For B2B and B2C apps, show subscription selection dialog
    if (lead.vertical === 'app-b2b' || lead.vertical === 'app-b2c') {
      setSubscriptionLead(lead);
      setIsSubscriptionDialogOpen(true);
    } else {
      // For other verticals, just mark as converted
      setLeads(leads.map(l => 
        l.id === leadId 
          ? { ...l, status: 'converted' as const, updatedAt: new Date().toISOString() }
          : l
      ));
    }
  };

  const handleSubscriptionConfirm = (
    subscriptionType: 'quarterly' | 'halfYearly' | 'annual', 
    isRenewal: boolean, 
    price: number
  ) => {
    if (!subscriptionLead) return;

    // Mark lead as converted
    setLeads(leads.map(l => 
      l.id === subscriptionLead.id 
        ? { ...l, status: 'converted' as const, updatedAt: new Date().toISOString() }
        : l
    ));

    // Add to converted subscriptions
    addConvertedSubscription({
      leadId: subscriptionLead.id,
      leadName: subscriptionLead.name,
      appType: subscriptionLead.vertical as 'app-b2b' | 'app-b2c',
      subscriptionType,
      isRenewal,
      price,
      duration: subscriptionType === 'quarterly' ? 3 : subscriptionType === 'halfYearly' ? 6 : 12,
    });

    setSubscriptionLead(null);
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
        <VerticalStats verticalId={verticalId!} leads={verticalLeads} />

        {/* Leads Table - hide vertical column since we're already in a vertical */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Leads</h2>
          <LeadsTable 
            leads={verticalLeads} 
            onEdit={handleEditLead}
            onConvert={handleConvert}
            onConvertWithSubscription={(lead) => {
              setSubscriptionLead(lead);
              setIsSubscriptionDialogOpen(true);
            }}
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
        onPostLead={(leadId, postData) => {
          const leadToPost = leads.find(l => l.id === leadId);
          if (leadToPost) {
            postLead({ ...leadToPost, status: 'converted' }, postData.vendorConfigs);
          }
        }}
        defaultVertical={verticalId as Vertical}
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

      {/* Subscription Selection Dialog for B2B/B2C */}
      <SubscriptionSelectionDialog
        open={isSubscriptionDialogOpen}
        onOpenChange={setIsSubscriptionDialogOpen}
        lead={subscriptionLead}
        onConfirm={handleSubscriptionConfirm}
      />
    </AppLayout>
  );
}
