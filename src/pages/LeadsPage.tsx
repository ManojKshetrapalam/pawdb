import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { FollowUpReminderDialog } from '@/components/leads/FollowUpReminderDialog';
import { SubscriptionSelectionDialog } from '@/components/leads/SubscriptionSelectionDialog';
import { BulkUploadDialog } from '@/components/leads/BulkUploadDialog';
import { useLeads } from '@/hooks/useLeads';
import { VERTICALS, Lead } from '@/types';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { usePricing } from '@/contexts/PricingContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verticalFilter, setVerticalFilter] = useState<string>('all');
  const { data: leads = [], isLoading } = useLeads();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [subscriptionLead, setSubscriptionLead] = useState<Lead | null>(null);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const { addConvertedSubscription } = usePricing();

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    const verticalMatch = verticalFilter === 'all' || lead.vertical === verticalFilter;
    return statusMatch && verticalMatch;
  });

  const handleAddClick = () => {
    setEditingLead(null);
    setIsFormOpen(true);
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
    leads,
    onLeadClick: handleEditLead,
  });

  const handleSaveLead = (leadData: Partial<Lead>) => {
    // TODO: Implement save to Supabase
    console.log('Save lead:', leadData);
  };

  const handleBulkUpload = (uploadedLeads: Partial<Lead>[]) => {
    // TODO: Implement bulk upload to Supabase
    console.log('Bulk upload:', uploadedLeads);
  };

  const handleConvert = (leadId: string) => {
    // TODO: Implement convert in Supabase
    console.log('Convert lead:', leadId);
  };

  const handleConvertWithSubscription = (lead: Lead) => {
    setSubscriptionLead(lead);
    setIsSubscriptionDialogOpen(true);
  };

  const handleSubscriptionConfirm = (
    subscriptionType: 'quarterly' | 'halfYearly' | 'annual', 
    isRenewal: boolean, 
    price: number
  ) => {
    if (!subscriptionLead) return;

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

    toast.success('Lead converted with subscription!');
    setSubscriptionLead(null);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="All Leads" subtitle="Loading..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header 
        title="All Leads" 
        subtitle={`${filteredLeads.length} leads found`}
        showAddButton
        addButtonLabel="Add Lead"
        onAddClick={handleAddClick}
      />
      
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verticalFilter} onValueChange={setVerticalFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vertical" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verticals</SelectItem>
              {VERTICALS.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(statusFilter !== 'all' || verticalFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setVerticalFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Leads Table */}
        <LeadsTable 
          leads={filteredLeads} 
          onEdit={handleEditLead}
          onConvert={handleConvert}
          onConvertWithSubscription={handleConvertWithSubscription}
        />
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

      {/* Subscription Selection Dialog for B2B/B2C */}
      <SubscriptionSelectionDialog
        open={isSubscriptionDialogOpen}
        onOpenChange={setIsSubscriptionDialogOpen}
        lead={subscriptionLead}
        onConfirm={handleSubscriptionConfirm}
      />

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onUpload={handleBulkUpload}
      />
    </AppLayout>
  );
}
