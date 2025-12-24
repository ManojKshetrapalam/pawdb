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
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

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
