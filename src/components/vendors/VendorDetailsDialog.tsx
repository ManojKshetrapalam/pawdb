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
  Eye,
  ShoppingCart,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock usage stats - in production this would come from the backend
const getMockUsageStats = (vendorId: string) => ({
  appOpens: Math.floor(Math.random() * 200) + 50,
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  leadsViewed: Math.floor(Math.random() * 50) + 10,
  leadsPurchased: Math.floor(Math.random() * 15) + 2,
  totalSpent: Math.floor(Math.random() * 10000) + 1000,
  avgSessionTime: Math.floor(Math.random() * 10) + 2,
});

interface VendorDetailsDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorDetailsDialog({ vendor, open, onOpenChange }: VendorDetailsDialogProps) {
  if (!vendor) return null;

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

          {/* App Usage Stats - Only show if vendor has app */}
          {vendor.hasApp && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold">App Usage Statistics</h4>
                </div>
                
                {(() => {
                  const stats = getMockUsageStats(vendor.id);
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-lg font-bold text-primary">{stats.appOpens}</p>
                              <p className="text-xs text-muted-foreground">App Opens</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-lg font-bold text-success">{stats.leadsViewed}</p>
                              <p className="text-xs text-muted-foreground">Leads Viewed</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-warning/5 border-warning/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-warning" />
                            <div>
                              <p className="text-lg font-bold text-warning">{stats.leadsPurchased}</p>
                              <p className="text-xs text-muted-foreground">Leads Purchased</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-info/5 border-info/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-info" />
                            <div>
                              <p className="text-lg font-bold text-info">₹{stats.totalSpent.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Total Spent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/50 border-border col-span-2">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Last Active</p>
                                <p className="text-sm font-medium">
                                  {format(new Date(stats.lastActive), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Avg Session</p>
                              <p className="text-sm font-medium">{stats.avgSessionTime} min</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

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
