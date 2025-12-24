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
import { Send, IndianRupee, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PostLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onPost: (leadId: string, postData: PostLeadData) => void;
}

export interface PostLeadData {
  vendorCategories: string[];
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
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [maxBuyers, setMaxBuyers] = useState<number>(5);
  const [step, setStep] = useState<'categories' | 'details'>('categories');

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

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one vendor category');
      return;
    }
    setStep('details');
  };

  const handleBack = () => {
    setStep('categories');
  };

  const handlePost = () => {
    if (!lead) return;
    
    if (!description.trim()) {
      toast.error('Please add a description for the lead');
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
      description,
      price,
      maxBuyers,
    });

    // Reset form
    setSelectedCategories([]);
    setDescription('');
    setPrice(500);
    setMaxBuyers(5);
    setStep('categories');
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedCategories([]);
    setDescription('');
    setPrice(500);
    setMaxBuyers(5);
    setStep('categories');
    onOpenChange(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Post Lead to Vendors
          </DialogTitle>
          <DialogDescription>
            Convert and post this lead for vendors to purchase
          </DialogDescription>
        </DialogHeader>

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

        {step === 'categories' ? (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Who should be notified?
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select vendor categories to notify about this lead
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
          </div>
        ) : (
          <div className="space-y-5">
            {/* Selected Categories Summary */}
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <Badge key={cat} variant="outline" className="bg-primary/10">
                  {cat}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Lead Requirements / Description
              </Label>
              <Textarea
                placeholder="Describe the client's requirements, event details, preferences, budget expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Price and Max Buyers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Lead Price
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
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Max Buyers
                </Label>
                <Input
                  type="number"
                  value={maxBuyers}
                  onChange={(e) => setMaxBuyers(Number(e.target.value))}
                  min={1}
                  max={20}
                />
                <p className="text-xs text-muted-foreground">
                  How many vendors can buy this lead
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 'details' && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === 'categories' ? (
            <Button onClick={handleNext} disabled={selectedCategories.length === 0}>
              Next
            </Button>
          ) : (
            <Button onClick={handlePost} className="gap-2">
              <Send className="h-4 w-4" />
              Post Lead
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
