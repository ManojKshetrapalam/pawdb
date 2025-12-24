import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { useMarketplace, PostedLead } from '@/contexts/MarketplaceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  IndianRupee,
  FileText,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function MarketplacePage() {
  const { postedLeads } = useMarketplace();

  const getTotalCategories = (postedLead: PostedLead) => {
    return Object.keys(postedLead.vendorConfigs).length;
  };

  const getTotalMaxBuyers = (postedLead: PostedLead) => {
    return Object.values(postedLead.vendorConfigs).reduce((sum, config) => sum + config.maxBuyers, 0);
  };

  const getTotalValue = (postedLead: PostedLead) => {
    return Object.values(postedLead.vendorConfigs).reduce(
      (sum, config) => sum + config.price * config.maxBuyers, 
      0
    );
  };

  return (
    <AppLayout>
      <Header 
        title="Lead Marketplace" 
        subtitle="Posted leads available for vendors to purchase"
      />
      
      <div className="p-6">
        {postedLeads.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No leads in marketplace</h3>
              <p className="text-muted-foreground text-center max-w-md">
                When you convert a buy-lead and post it to vendors, it will appear here with all the details.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{postedLeads.length}</p>
                      <p className="text-sm text-muted-foreground">Total Posted Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {postedLeads.reduce((sum, pl) => sum + getTotalMaxBuyers(pl), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Available Slots</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-warning/10">
                      <IndianRupee className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        ₹{postedLeads.reduce((sum, pl) => sum + getTotalValue(pl), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Potential Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posted Leads List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Posted Leads</h2>
              
              {postedLeads.map((postedLead) => (
                <Card key={postedLead.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{postedLead.lead.name}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {postedLead.lead.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {postedLead.lead.email}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(postedLead.postedAt), 'MMM d, h:mm a')}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {getTotalCategories(postedLead)} categories
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(postedLead.vendorConfigs).map(([category, config]) => (
                        <div 
                          key={category}
                          className="p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{category}</span>
                            <Badge variant="outline" className="text-xs">
                              {config.maxBuyers} slots
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">₹{config.price}</span>
                            <span className="text-xs text-muted-foreground">per vendor</span>
                          </div>
                          {config.description && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{config.description}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Lead Notes */}
                    {postedLead.lead.notes && postedLead.lead.notes.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Notes</p>
                        <div className="space-y-2">
                          {postedLead.lead.notes.map((note, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground bg-muted/30 rounded p-2">
                              {note.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
