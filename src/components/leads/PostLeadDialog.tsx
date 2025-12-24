import { useState } from 'react';
import { Lead } from '@/types';
import { mockVendors } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, IndianRupee, Users, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PostLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onPost: (leadId: string, postData: PostLeadData) => void;
}

export interface PostLeadData {
  vendorCategories: string[];
  subscription: string;
  description: string;
  price: number;
  maxBuyers: number;
}

const VENDOR_CATEGORIES = [
  'Wedding Planner',
  'Decoration',
  'Catering',
  'Photography',
  'Entertainment',
  'Bridal Wear',
  'Venue',
  'Bakery',
];

export function PostLeadDialog({ open, onOpenChange, lead, onPost }: PostLeadDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [subscription, setSubscription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [maxBuyers, setMaxBuyers] = useState<number>(5);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getVendorsInCategory = (category: string) => {
    return mockVendors.filter((v) => v.category === category && v.isSubscribed).length;
  };

  const handlePost = () => {
    if (!lead) return;
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one vendor category');
      return;
    }
    if (!subscription.trim()) {
      toast.error('Please enter subscription details');
      return;
    }
    if (price <= 0) {
      toast.error('Please set a valid price');
      return;
    }
    if (maxBuyers <= 0) {
      toast.error('Please set valid number of buyers');
      return;
    }

    onPost(lead.id, {
      vendorCategories: selectedCategories,
      subscription,
      description,
      price,
      maxBuyers,
    });

    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedCategories([]);
    setSubscription('');
    setDescription('');
    setPrice(500);
    setMaxBuyers(5);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Post Lead to Vendors
          </DialogTitle>
          <DialogDescription>
            Share this lead with selected vendors for purchase
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 py-2">
          {/* Lead Info Summary */}
          <Card className="bg-muted/50 border-border">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-card-foreground">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.phone}</p>
                </div>
                <Badge variant="secondary">{lead.email}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Selection */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Select Vendor Categories *
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which types of vendors should see this lead
            </p>
            <div className="grid grid-cols-2 gap-3">
              {VENDOR_CATEGORIES.map((category) => {
                const vendorCount = getVendorsInCategory(category);
                const isSelected = selectedCategories.includes(category);
                return (
                  <div
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className="pointer-events-none"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{category}</p>
                      <p className="text-xs text-muted-foreground">
                        {vendorCount} active vendor{vendorCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscription */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription Details *
            </Label>
            <Input
              placeholder="e.g., Premium Package, Gold Membership..."
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Specify the subscription type for vendors
            </p>
          </div>

          {/* Price and Max Buyers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Lead Price *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="pl-8"
                  min={1}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Price per vendor
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Buyers *
              </Label>
              <Input
                type="number"
                value={maxBuyers}
                onChange={(e) => setMaxBuyers(Number(e.target.value))}
                min={1}
                max={20}
              />
              <p className="text-xs text-muted-foreground">
                How many vendors can buy
              </p>
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Requirements (Optional)
            </Label>
            <Textarea
              placeholder="Add any extra details about the client's requirements, event specifics, preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handlePost} className="gap-2">
            <Send className="h-4 w-4" />
            Post Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
