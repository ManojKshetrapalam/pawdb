import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { VendorCard } from '@/components/vendors/VendorCard';
import { VendorDetailsDialog } from '@/components/vendors/VendorDetailsDialog';
import { mockVendors } from '@/data/mockData';
import { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Crown, Smartphone } from 'lucide-react';

export default function VendorsPage() {
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const filteredVendors = mockVendors.filter((vendor) => {
    const subscriptionMatch =
      subscriptionFilter === 'all' ||
      (subscriptionFilter === 'subscribed' && vendor.isSubscribed) ||
      (subscriptionFilter === 'not-subscribed' && !vendor.isSubscribed);
    const appMatch =
      appFilter === 'all' ||
      (appFilter === 'has-app' && vendor.hasApp) ||
      (appFilter === 'no-app' && !vendor.hasApp);
    return subscriptionMatch && appMatch;
  });

  const subscribedCount = mockVendors.filter((v) => v.isSubscribed).length;
  const withAppCount = mockVendors.filter((v) => v.hasApp).length;

  return (
    <AppLayout>
      <Header 
        title="Vendors" 
        subtitle={`${mockVendors.length} registered vendors`}
        showAddButton
        addButtonLabel="Add Vendor"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2">
            <Crown className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-warning">{subscribedCount} Premium</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{withAppCount} with App</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          </div>
          
          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="subscribed">Premium Only</SelectItem>
              <SelectItem value="not-subscribed">Free Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={appFilter} onValueChange={setAppFilter}>
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
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVendors.map((vendor, index) => (
            <div key={vendor.id} style={{ animationDelay: `${index * 50}ms` }}>
              <VendorCard vendor={vendor} onViewDetails={handleViewDetails} />
            </div>
          ))}
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
