import { Vendor } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Phone, Mail, MapPin, Smartphone, Crown, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails?: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onViewDetails }: VendorCardProps) {
  const handleNotify = () => {
    toast.success(`Notification sent to ${vendor.businessName}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground">{vendor.businessName}</h3>
            <p className="text-sm text-muted-foreground">{vendor.contactName}</p>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="inline-flex items-center rounded-full bg-muted px-3 py-1">
          <span className="text-sm font-medium text-muted-foreground">{vendor.category}</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {vendor.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {vendor.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {vendor.location}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(vendor)}
          >
            View Details
          </Button>
          <Button size="sm" className="flex-1 gap-1" onClick={handleNotify}>
            <Bell className="h-4 w-4" />
            Notify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
