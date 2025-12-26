import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, User, Calendar, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'lead' | 'followup' | 'conversion' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'lead', title: 'New Lead Assigned', message: 'Amit Kumar has been assigned to you', time: '5 mins ago', read: false },
  { id: '2', type: 'followup', title: 'Follow-up Reminder', message: 'Sneha Reddy follow-up is due today', time: '1 hour ago', read: false },
  { id: '3', type: 'conversion', title: 'Lead Converted', message: 'Rajesh Mehta successfully converted', time: '2 hours ago', read: true },
  { id: '4', type: 'system', title: 'System Update', message: 'New features are now available', time: '1 day ago', read: true },
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'lead': return User;
    case 'followup': return Calendar;
    case 'conversion': return ShoppingCart;
    default: return Bell;
  }
};

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <Header 
        title="Notifications" 
        subtitle={`${unreadCount} unread notifications`}
      />
      
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{unreadCount} New</Badge>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-3">
          {mockNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card 
                key={notification.id} 
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  !notification.read && "border-l-4 border-l-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      !notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "font-medium truncate",
                          !notification.read && "text-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mockNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
