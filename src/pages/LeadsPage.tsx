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
import { Filter, Upload, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verticalFilter, setVerticalFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 50;
  
  const { data, isLoading } = useLeads({ 
    page, 
    pageSize, 
    status: statusFilter, 
    vertical: verticalFilter 
  });
  
  const leads = data?.leads || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [subscriptionLead, setSubscriptionLead] = useState<Lead | null>(null);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const { addConvertedSubscription } = usePricing();

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

  // Reset to page 1 when filters change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleVerticalChange = (value: string) => {
    setVerticalFilter(value);
    setPage(1);
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
        subtitle={`${total.toLocaleString()} leads found`}
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
          
          <Select value={statusFilter} onValueChange={handleStatusChange}>
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

          <Select value={verticalFilter} onValueChange={handleVerticalChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vertical" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verticals</SelectItem>
              {VERTICALS.slice(0, 3).map((v) => (
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
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Leads Table */}
        <LeadsTable 
          leads={leads} 
          onEdit={handleEditLead}
          onConvert={handleConvert}
          onConvertWithSubscription={handleConvertWithSubscription}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total.toLocaleString()} total)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
