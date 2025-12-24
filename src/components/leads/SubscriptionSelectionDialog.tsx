import { useState } from 'react';
import { Lead } from '@/types';
import { usePricing } from '@/contexts/PricingContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, IndianRupee, RefreshCw } from 'lucide-react';

interface SubscriptionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onConfirm: (subscriptionType: 'quarterly' | 'halfYearly' | 'annual', isRenewal: boolean, price: number) => void;
}

export function SubscriptionSelectionDialog({
  open,
  onOpenChange,
  lead,
  onConfirm,
}: SubscriptionSelectionDialogProps) {
  const { b2bPricing, b2cPricing } = usePricing();
  const [subscriptionType, setSubscriptionType] = useState<'quarterly' | 'halfYearly' | 'annual'>('quarterly');
  const [isRenewal, setIsRenewal] = useState(false);

  if (!lead) return null;

  const pricing = lead.vertical === 'app-b2b' ? b2bPricing : b2cPricing;
  const currentPricing = isRenewal ? pricing.renewal : pricing.subscription;

  const subscriptionOptions = [
    { key: 'quarterly' as const, label: 'Quarterly', months: 3 },
    { key: 'halfYearly' as const, label: 'Half Yearly', months: 6 },
    { key: 'annual' as const, label: 'Annual', months: 12 },
  ].filter((opt) => currentPricing[opt.key].enabled);

  const selectedPrice = currentPricing[subscriptionType]?.price || 0;
  const selectedDuration = isRenewal 
    ? pricing.renewal[subscriptionType]?.duration || 0 
    : subscriptionOptions.find(o => o.key === subscriptionType)?.months || 0;

  const handleConfirm = () => {
    onConfirm(subscriptionType, isRenewal, selectedPrice);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Subscription</DialogTitle>
          <DialogDescription>
            Choose subscription plan for {lead.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lead Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <Badge variant="outline">
                  {lead.vertical === 'app-b2b' ? 'B2B App' : 'B2C App'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Renewal Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="renewal" className="font-medium">This is a renewal</Label>
            </div>
            <Switch
              id="renewal"
              checked={isRenewal}
              onCheckedChange={setIsRenewal}
            />
          </div>

          {/* Subscription Options */}
          <div className="space-y-3">
            <Label className="text-base">Select Plan</Label>
            <RadioGroup
              value={subscriptionType}
              onValueChange={(value) => setSubscriptionType(value as typeof subscriptionType)}
              className="space-y-3"
            >
              {subscriptionOptions.map((option) => {
                const optionPrice = currentPricing[option.key].price;
                const optionDuration = isRenewal 
                  ? pricing.renewal[option.key].duration 
                  : option.months;
                
                return (
                  <div
                    key={option.key}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                      subscriptionType === option.key
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSubscriptionType(option.key)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.key} id={option.key} />
                      <div>
                        <Label htmlFor={option.key} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {optionDuration} months
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                      <IndianRupee className="h-4 w-4" />
                      {optionPrice.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isRenewal ? 'Renewal' : 'New Subscription'} - {subscriptionOptions.find(o => o.key === subscriptionType)?.label}
              </span>
              <div className="flex items-center gap-1 text-xl font-bold text-primary">
                <IndianRupee className="h-5 w-5" />
                {selectedPrice.toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Duration: {selectedDuration} months
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm & Convert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
