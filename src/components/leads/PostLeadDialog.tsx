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
import { Send, IndianRupee, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PostLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onPost: (leadId: string, postData: PostLeadData) => void;
}

export interface VendorConfig {
  price: number;
  maxBuyers: number;
  description: string;
}

export interface PostLeadData {
  vendorConfigs: Record<string, VendorConfig>;
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

const defaultVendorConfig: VendorConfig = {
  price: 500,
  maxBuyers: 5,
  description: '',
};

export function PostLeadDialog({ open, onOpenChange, lead, onPost }: PostLeadDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [vendorConfigs, setVendorConfigs] = useState<Record<string, VendorConfig>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        const newConfigs = { ...vendorConfigs };
        delete newConfigs[category];
        setVendorConfigs(newConfigs);
        if (expandedCategory === category) {
          setExpandedCategory(null);
        }
        return prev.filter((c) => c !== category);
      } else {
        setVendorConfigs((configs) => ({
          ...configs,
          [category]: { ...defaultVendorConfig },
        }));
        setExpandedCategory(category);
        return [...prev, category];
      }
    });
  };

  const updateVendorConfig = (category: string, field: keyof VendorConfig, value: string | number) => {
    setVendorConfigs((configs) => ({
      ...configs,
      [category]: {
        ...configs[category],
        [field]: value,
      },
    }));
  };

  const getVendorsInCategory = (category: string) => {
    return mockVendors.filter((v) => v.category === category && v.isSubscribed).length;
  };

  const validateConfigs = (): boolean => {
    for (const category of selectedCategories) {
      const config = vendorConfigs[category];
      if (!config?.price || config.price <= 0) {
        toast.error(`Please set a valid price for ${category}`);
        setExpandedCategory(category);
        return false;
      }
      if (!config?.maxBuyers || config.maxBuyers <= 0) {
        toast.error(`Please set valid max buyers for ${category}`);
        setExpandedCategory(category);
        return false;
      }
    }
    return true;
  };

  const handlePost = () => {
    if (!lead) return;
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one vendor category');
      return;
    }

    if (!validateConfigs()) {
      return;
    }

    onPost(lead.id, {
      vendorConfigs,
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedCategories([]);
    setVendorConfigs({});
    setExpandedCategory(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Post Lead to Marketplace
          </DialogTitle>
          <DialogDescription>
            Configure pricing and details for each vendor category
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
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

          {/* Vendor Selection with Individual Configs */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Select Vendors & Configure
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select vendors and set individual pricing for each
            </p>
            
            <div className="space-y-2">
              {VENDOR_CATEGORIES.map((category) => {
                const vendorCount = getVendorsInCategory(category);
                const isSelected = selectedCategories.includes(category);
                const isExpanded = expandedCategory === category;
                const config = vendorConfigs[category] || defaultVendorConfig;

                return (
                  <Collapsible
                    key={category}
                    open={isSelected && isExpanded}
                    onOpenChange={() => isSelected && setExpandedCategory(isExpanded ? null : category)}
                  >
                    <div
                      className={`
                        rounded-lg border transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                          : 'border-border bg-card hover:border-primary/50'
                        }
                      `}
                    >
                      {/* Category Header */}
                      <div 
                        className="flex items-center gap-3 p-3 cursor-pointer"
                        onClick={() => !isSelected && handleCategoryToggle(category)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleCategoryToggle(category)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{category}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendorCount} active vendor{vendorCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {isSelected && (
                          <>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                ₹{config.price}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {config.maxBuyers} buyers
                              </Badge>
                            </div>
                            <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </>
                        )}
                      </div>

                      {/* Expanded Config */}
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2 space-y-4 border-t border-border/50">
                          {/* Price and Max Buyers */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs flex items-center gap-1">
                                <IndianRupee className="h-3 w-3" />
                                Price *
                              </Label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                <Input
                                  type="number"
                                  value={config.price}
                                  onChange={(e) => updateVendorConfig(category, 'price', Number(e.target.value))}
                                  className="pl-6 h-9"
                                  min={1}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Max Buyers *
                              </Label>
                              <Input
                                type="number"
                                value={config.maxBuyers}
                                onChange={(e) => updateVendorConfig(category, 'maxBuyers', Number(e.target.value))}
                                className="h-9"
                                min={1}
                                max={20}
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label className="text-xs flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Requirements (Optional)
                            </Label>
                            <Textarea
                              placeholder="Specific requirements for this vendor type..."
                              value={config.description}
                              onChange={(e) => updateVendorConfig(category, 'description', e.target.value)}
                              className="min-h-[60px] resize-none text-sm"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedCategories.length > 0 && (
            <Card className="bg-muted/30 border-border">
              <CardContent className="py-3 px-4">
                <p className="text-sm font-medium mb-2">Summary</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}: ₹{vendorConfigs[cat]?.price || 0} × {vendorConfigs[cat]?.maxBuyers || 0}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handlePost} className="gap-2" disabled={selectedCategories.length === 0}>
            <Send className="h-4 w-4" />
            Post to {selectedCategories.length} Vendor{selectedCategories.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
