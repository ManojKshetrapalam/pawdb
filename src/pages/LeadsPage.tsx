import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { mockLeads } from '@/data/mockData';
import { VERTICALS, LeadStatus } from '@/types';
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

  const filteredLeads = mockLeads.filter((lead) => {
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    const verticalMatch = verticalFilter === 'all' || lead.vertical === verticalFilter;
    return statusMatch && verticalMatch;
  });

  return (
    <AppLayout>
      <Header 
        title="All Leads" 
        subtitle={`${filteredLeads.length} leads found`}
        showAddButton
        addButtonLabel="Add Lead"
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
        <LeadsTable leads={filteredLeads} />
      </div>
    </AppLayout>
  );
}
