import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, User } from 'lucide-react';

export default function TeamPage() {
  return (
    <AppLayout>
      <Header 
        title="Team" 
        subtitle="Manage your team members"
        showAddButton
        addButtonLabel="Add Member"
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map((user, index) => {
            const conversionRate = user.assignedLeads > 0 
              ? Math.round((user.convertedLeads / user.assignedLeads) * 100)
              : 0;

            return (
              <Card 
                key={user.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {user.role === 'admin' ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {user.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-2xl font-bold text-card-foreground">{user.assignedLeads}</p>
                      <p className="text-xs text-muted-foreground">Assigned</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-3">
                      <p className="text-2xl font-bold text-success">{user.convertedLeads}</p>
                      <p className="text-xs text-muted-foreground">Converted</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium text-card-foreground">{conversionRate}%</span>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
