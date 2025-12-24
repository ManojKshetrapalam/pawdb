import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { usePricing, AppPricing } from '@/contexts/PricingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee, 
  TrendingUp, 
  Building2, 
  Users, 
  ShoppingCart,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AccountsPage() {
  const { 
    b2bPricing, 
    b2cPricing, 
    updateB2BPricing, 
    updateB2CPricing, 
    convertedSubscriptions,
    getRevenueByType 
  } = usePricing();

  const [editB2B, setEditB2B] = useState<AppPricing>(b2bPricing);
  const [editB2C, setEditB2C] = useState<AppPricing>(b2cPricing);

  const revenue = getRevenueByType();
  const totalRevenue = revenue.buyLeads + revenue.b2b + revenue.b2c;

  const handleSaveB2B = () => {
    updateB2BPricing(editB2B);
    toast.success('B2B pricing updated successfully');
  };

  const handleSaveB2C = () => {
    updateB2CPricing(editB2C);
    toast.success('B2C pricing updated successfully');
  };

  const PricingEditor = ({ 
    pricing, 
    setPricing, 
    onSave, 
    title 
  }: { 
    pricing: AppPricing; 
    setPricing: (p: AppPricing) => void; 
    onSave: () => void;
    title: string;
  }) => (
    <div className="space-y-6">
      {/* New Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Subscription Pricing</CardTitle>
          <CardDescription>Set pricing for new {title} subscriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['quarterly', 'halfYearly', 'annual'] as const).map((type) => (
            <div key={type} className="flex items-center gap-4 p-3 rounded-lg border border-border">
              <Switch
                checked={pricing.subscription[type].enabled}
                onCheckedChange={(checked) => 
                  setPricing({
                    ...pricing,
                    subscription: {
                      ...pricing.subscription,
                      [type]: { ...pricing.subscription[type], enabled: checked }
                    }
                  })
                }
              />
              <div className="flex-1">
                <Label className="capitalize font-medium">
                  {type === 'halfYearly' ? 'Half Yearly' : type}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {type === 'quarterly' ? '3 months' : type === 'halfYearly' ? '6 months' : '12 months'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={pricing.subscription[type].price}
                  onChange={(e) => 
                    setPricing({
                      ...pricing,
                      subscription: {
                        ...pricing.subscription,
                        [type]: { ...pricing.subscription[type], price: Number(e.target.value) }
                      }
                    })
                  }
                  className="w-28"
                  disabled={!pricing.subscription[type].enabled}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Renewal Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Renewal Pricing</CardTitle>
          </div>
          <CardDescription>Set pricing and duration for {title} renewals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['quarterly', 'halfYearly', 'annual'] as const).map((type) => (
            <div key={type} className="flex items-center gap-4 p-3 rounded-lg border border-border">
              <Switch
                checked={pricing.renewal[type].enabled}
                onCheckedChange={(checked) => 
                  setPricing({
                    ...pricing,
                    renewal: {
                      ...pricing.renewal,
                      [type]: { ...pricing.renewal[type], enabled: checked }
                    }
                  })
                }
              />
              <div className="flex-1">
                <Label className="capitalize font-medium">
                  {type === 'halfYearly' ? 'Half Yearly' : type}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Duration</Label>
                <Input
                  type="number"
                  value={pricing.renewal[type].duration}
                  onChange={(e) => 
                    setPricing({
                      ...pricing,
                      renewal: {
                        ...pricing.renewal,
                        [type]: { ...pricing.renewal[type], duration: Number(e.target.value) }
                      }
                    })
                  }
                  className="w-20"
                  disabled={!pricing.renewal[type].enabled}
                />
                <span className="text-sm text-muted-foreground">months</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={pricing.renewal[type].price}
                  onChange={(e) => 
                    setPricing({
                      ...pricing,
                      renewal: {
                        ...pricing.renewal,
                        [type]: { ...pricing.renewal[type], price: Number(e.target.value) }
                      }
                    })
                  }
                  className="w-28"
                  disabled={!pricing.renewal[type].enabled}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={onSave} className="w-full gap-2">
        <Save className="h-4 w-4" />
        Save {title} Pricing
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <Header 
        title="Accounts" 
        subtitle="Revenue overview and pricing settings"
      />
      
      <div className="p-6 space-y-6">
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5 text-foreground" />
                    <p className="text-2xl font-bold text-foreground">{totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <ShoppingCart className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Buy Leads</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-foreground" />
                    <p className="text-xl font-bold text-foreground">{revenue.buyLeads.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/20">
                  <Building2 className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">B2B Subscriptions</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-foreground" />
                    <p className="text-xl font-bold text-foreground">{revenue.b2b.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">B2C Subscriptions</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-foreground" />
                    <p className="text-xl font-bold text-foreground">{revenue.b2c.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Settings & Recent Subscriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Settings</CardTitle>
              <CardDescription>Configure subscription pricing for B2B and B2C apps</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="b2b">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="b2b" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    B2B App
                  </TabsTrigger>
                  <TabsTrigger value="b2c" className="gap-2">
                    <Users className="h-4 w-4" />
                    B2C App
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="b2b" className="mt-4">
                  <PricingEditor 
                    pricing={editB2B} 
                    setPricing={setEditB2B} 
                    onSave={handleSaveB2B}
                    title="B2B"
                  />
                </TabsContent>
                <TabsContent value="b2c" className="mt-4">
                  <PricingEditor 
                    pricing={editB2C} 
                    setPricing={setEditB2C} 
                    onSave={handleSaveB2C}
                    title="B2C"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Subscriptions</CardTitle>
              <CardDescription>Latest converted subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {convertedSubscriptions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{sub.leadName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={sub.appType === 'app-b2b' ? 'default' : 'secondary'}>
                          {sub.appType === 'app-b2b' ? 'B2B' : 'B2C'}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {sub.subscriptionType === 'halfYearly' ? 'Half Yearly' : sub.subscriptionType}
                        </Badge>
                        {sub.isRenewal && (
                          <Badge variant="outline" className="gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Renewal
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(sub.convertedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                        <IndianRupee className="h-4 w-4" />
                        {sub.price.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">{sub.duration} months</p>
                    </div>
                  </div>
                ))}
                {convertedSubscriptions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No subscriptions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
