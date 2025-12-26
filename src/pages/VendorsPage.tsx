import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { VendorCard } from '@/components/vendors/VendorCard';
import { VendorDetailsDialog } from '@/components/vendors/VendorDetailsDialog';
import { useVendors, useVendorStats } from '@/hooks/useVendors';
import { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Crown, Smartphone, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VendorsPage() {
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 50;
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data, isLoading } = useVendors({ 
    page, 
    pageSize, 
    subscriptionFilter, 
    appFilter 
  });
  
  const vendors = data?.vendors || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  
  const { data: vendorStats } = useVendorStats();

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const subscribedCount = vendorStats?.subscribed || 0;
  const withAppCount = vendorStats?.withApp || 0;
  const totalVendors = vendorStats?.total || 0;

  // Reset to page 1 when filters change
  const handleSubscriptionChange = (value: string) => {
    setSubscriptionFilter(value);
    setPage(1);
  };

  const handleAppChange = (value: string) => {
    setAppFilter(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Vendors" subtitle="Loading..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header 
        title="Vendors" 
        subtitle={`${totalVendors.toLocaleString()} registered vendors`}
        showAddButton
        addButtonLabel="Add Vendor"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2">
            <Crown className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-warning">{subscribedCount.toLocaleString()} Premium</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{withAppCount.toLocaleString()} with App</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          </div>
          
          <Select value={subscriptionFilter} onValueChange={handleSubscriptionChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="subscribed">Premium Only</SelectItem>
              <SelectItem value="not-subscribed">Free Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={appFilter} onValueChange={handleAppChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="App Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="has-app">Has App</SelectItem>
              <SelectItem value="no-app">No App</SelectItem>
            </SelectContent>
          </Select>

          {(subscriptionFilter !== 'all' || appFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSubscriptionFilter('all');
                setAppFilter('all');
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vendors.map((vendor, index) => (
            <div key={vendor.id} style={{ animationDelay: `${index * 50}ms` }}>
              <VendorCard vendor={vendor} onViewDetails={handleViewDetails} />
            </div>
          ))}
        </div>

        {vendors.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No vendors found matching your filters.
          </div>
        )}

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

      {/* Vendor Details Dialog */}
      <VendorDetailsDialog
        vendor={selectedVendor}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </AppLayout>
  );
}
