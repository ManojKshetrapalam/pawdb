import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormDialog } from '@/components/leads/LeadFormDialog';
import { mockLeads } from '@/data/mockData';
import { VERTICALS, Lead } from '@/types';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verticalFilter, setVerticalFilter] = useState<string>('all');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

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
  useFollowUpReminders({
    leads,
    onLeadClick: handleEditLead,
  });

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      // Update existing lead
      setLeads(leads.map(l => 
        l.id === editingLead.id 
          ? { ...l, ...leadData }
          : l
      ));
    } else {
      // Create new lead
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
        />
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
