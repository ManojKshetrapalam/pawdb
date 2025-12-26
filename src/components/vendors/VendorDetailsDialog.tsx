import { Vendor } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Smartphone, 
  Crown, 
  Bell, 
  Calendar,
  Building2,
  User,
  ExternalLink,
  ShoppingCart,
  TrendingUp,
  Activity,
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { usePlannerSpending, usePlannerSubscriptions } from '@/hooks/useRevenue';

interface VendorDetailsDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorDetailsDialog({ vendor, open, onOpenChange }: VendorDetailsDialogProps) {
  // Get planner spending data - need legacy_id from vendor
  const { data: spendingData, isLoading: spendingLoading } = usePlannerSpending(
    vendor?.legacyId || null
  );

  // Get planner subscription data
  const { data: subscriptionData, isLoading: subscriptionLoading } = usePlannerSubscriptions(
    vendor?.legacyId || null
  );

  if (!vendor) return null;

  const isActiveSubscriber = subscriptionData?.subscriptions?.some(sub => {
    if (!sub.actual_subscription_end_date) return false;
    return new Date(sub.actual_subscription_end_date) >= new Date();
  });

  const totalSpentOnSubscriptions = subscriptionData?.totalSpent || 0;
  const totalSpentOnLeads = spendingData?.totalSpent || 0;
  const grandTotal = totalSpentOnSubscriptions + totalSpentOnLeads;

  const handleNotify = () => {
    toast.success(`Notification sent to ${vendor.businessName}`);
  };

  const handleCall = () => {
    window.open(`tel:${vendor.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${vendor.email}`, '_self');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-xl">{vendor.businessName}</DialogTitle>
              <DialogDescription className="flex items-center gap-1 mt-1">
                <User className="h-3 w-3" />
                {vendor.contactName}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {vendor.isSubscribed && (
                <Badge variant="default" className="bg-warning/10 text-warning border-warning/20 gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
              {vendor.hasApp && (
                <Badge variant="secondary" className="gap-1">
                  <Smartphone className="h-3 w-3" />
                  App
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{vendor.category}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h4>
            <div className="space-y-3">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{vendor.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleEmail}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{vendor.phone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCall}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{vendor.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium">
                  {format(new Date(vendor.joinedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${vendor.isSubscribed ? 'bg-warning/10' : 'bg-muted'}`}>
                <Crown className={`h-4 w-4 ${vendor.isSubscribed ? 'text-warning' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subscription</p>
                <p className="text-sm font-medium">
                  {vendor.isSubscribed ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${vendor.hasApp ? 'bg-primary/10' : 'bg-muted'}`}>
                <Smartphone className={`h-4 w-4 ${vendor.hasApp ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">App Status</p>
                <p className="text-sm font-medium">
                  {vendor.hasApp ? 'Installed' : 'Not Installed'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Revenue from this Vendor */}
          <Separator />
          <div className="bg-gradient-to-r from-primary/10 to-warning/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue from Vendor</p>
                  <p className="text-2xl font-bold text-primary">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>
              {isActiveSubscriber && (
                <Badge className="bg-success/10 text-success border-success/20 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Spending History Tabs */}
          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscriptions" className="gap-1">
                <Crown className="h-3 w-3" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-1">
                <ShoppingCart className="h-3 w-3" />
                Lead Purchases
              </TabsTrigger>
            </TabsList>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions" className="space-y-3">
              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : subscriptionData && subscriptionData.subscriptions.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-warning/5 border-warning/20">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-warning" />
                          <div>
                            <p className="text-lg font-bold text-warning">{subscriptionData.subscriptions.length}</p>
                            <p className="text-xs text-muted-foreground">Total Subscriptions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-success/5 border-success/20">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <div>
                            <p className="text-lg font-bold text-success">₹{totalSpentOnSubscriptions.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Subscription Revenue</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <ScrollArea className="h-[120px]">
                    <div className="space-y-2">
                      {subscriptionData.subscriptions.map((sub) => {
                        const isActive = sub.actual_subscription_end_date && 
                          new Date(sub.actual_subscription_end_date) >= new Date();
                        return (
                          <div key={sub.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                            <div className="flex items-center gap-2">
                              {isActive ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium">{sub.subscription_type || sub.subscription_tenure || 'Subscription'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.actual_subscription_date 
                                    ? format(new Date(sub.actual_subscription_date), 'MMM d, yyyy')
                                    : 'N/A'
                                  }
                                  {sub.actual_subscription_end_date && (
                                    <> - {format(new Date(sub.actual_subscription_end_date), 'MMM d, yyyy')}</>
                                  )}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-success">₹{sub.subscription_amount.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No subscription history</p>
              )}
            </TabsContent>

            {/* Lead Purchases Tab */}
            <TabsContent value="leads" className="space-y-3">
              {spendingLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : spendingData && spendingData.leadsPurchased > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-warning/5 border-warning/20">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-warning" />
                          <div>
                            <p className="text-lg font-bold text-warning">{spendingData.leadsPurchased}</p>
                            <p className="text-xs text-muted-foreground">Leads Purchased</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-success/5 border-success/20">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <div>
                            <p className="text-lg font-bold text-success">₹{totalSpentOnLeads.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <ScrollArea className="h-[120px]">
                    <div className="space-y-2">
                      {spendingData.purchases.slice(0, 5).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                          <div>
                            <p className="font-medium">{purchase.lead_name || `Lead #${purchase.lead_id}`}</p>
                            <p className="text-xs text-muted-foreground">{purchase.lead_city || 'Unknown'}</p>
                          </div>
                          <p className="font-semibold text-success">₹{purchase.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No purchases yet</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1 gap-2" onClick={handleNotify}>
              <Bell className="h-4 w-4" />
              Send Notification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
