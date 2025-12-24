import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { TeamEditDialog } from '@/components/team/TeamEditDialog';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, User as UserIcon, Pencil, Users, TrendingUp, CheckCircle, Download, DollarSign } from 'lucide-react';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function TeamPage() {
  const [members, setMembers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const { currentUser, hasPermission } = useCurrentUser();

  const canCreateUsers = hasPermission('canCreateUsers');
  const canManagePermissions = hasPermission('canManagePermissions');
  const isAdminOrVerticalHead = currentUser?.role === 'admin' || currentUser?.role === 'vertical-head';

  const handleAddClick = () => {
    setEditingMember(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (member: User) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleSaveMember = (member: User) => {
    if (editingMember) {
      setMembers(members.map(m => m.id === member.id ? member : m));
    } else {
      setMembers([...members, member]);
    }
  };

  const handleExportTeam = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Assigned Leads', 'Converted Leads', 'Conversion Rate'].join(','),
      ...members.map(member => {
        const conversionRate = member.assignedLeads > 0 
          ? Math.round((member.convertedLeads / member.assignedLeads) * 100)
          : 0;
        return [
          member.name,
          member.email,
          member.role,
          member.assignedLeads,
          member.convertedLeads,
          `${conversionRate}%`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Team data exported successfully');
  };

  // Mock revenue per converted lead
  const REVENUE_PER_CONVERSION = 2500;

  // Team stats for vertical heads
  const teamStats = {
    totalMembers: members.length,
    totalAssigned: members.reduce((sum, m) => sum + m.assignedLeads, 0),
    totalConverted: members.reduce((sum, m) => sum + m.convertedLeads, 0),
    totalRevenue: members.reduce((sum, m) => sum + (m.convertedLeads * REVENUE_PER_CONVERSION), 0),
    avgConversionRate: members.length > 0 
      ? Math.round(members.reduce((sum, m) => {
          const rate = m.assignedLeads > 0 ? (m.convertedLeads / m.assignedLeads) * 100 : 0;
          return sum + rate;
        }, 0) / members.length)
      : 0,
  };

  return (
    <AppLayout>
      <Header 
        title="Team" 
        subtitle="Manage your team members"
        showAddButton={canCreateUsers}
        addButtonLabel="Add Member"
        onAddClick={handleAddClick}
      />
      
      <div className="p-4 sm:p-6 space-y-6 overflow-x-hidden">
        {/* Team Stats - for admin and vertical heads */}
        {isAdminOrVerticalHead ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">Team Overview</h2>
              <Button variant="outline" size="sm" onClick={handleExportTeam} className="gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" />
                Export Team
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Total Members"
                value={teamStats.totalMembers}
                icon={Users}
              />
              <StatCard
                title="Total Assigned"
                value={teamStats.totalAssigned}
                icon={UserIcon}
                iconColor="text-info"
              />
              <StatCard
                title="Total Converted"
                value={teamStats.totalConverted}
                icon={CheckCircle}
                iconColor="text-success"
              />
              <StatCard
                title="Avg Conversion Rate"
                value={`${teamStats.avgConversionRate}%`}
                icon={TrendingUp}
                iconColor="text-primary"
              />
            </div>
          </div>
        ) : currentUser && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">My Performance</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="My Assigned Leads"
                value={currentUser.assignedLeads}
                icon={UserIcon}
                iconColor="text-info"
              />
              <StatCard
                title="My Converted Leads"
                value={currentUser.convertedLeads}
                icon={CheckCircle}
                iconColor="text-success"
              />
              <StatCard
                title="My Conversion Rate"
                value={`${currentUser.assignedLeads > 0 ? Math.round((currentUser.convertedLeads / currentUser.assignedLeads) * 100) : 0}%`}
                icon={TrendingUp}
                iconColor="text-primary"
              />
              <StatCard
                title="My Revenue"
                value={`₹${(currentUser.convertedLeads * REVENUE_PER_CONVERSION).toLocaleString()}`}
                icon={DollarSign}
                iconColor="text-warning"
              />
            </div>
          </div>
        )}

        {/* Team Members Grid - only for admin and vertical heads */}
        {isAdminOrVerticalHead && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Team Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {members.map((user, index) => {
                const conversionRate = user.assignedLeads > 0 
                  ? Math.round((user.convertedLeads / user.assignedLeads) * 100)
                  : 0;
                const userRevenue = user.convertedLeads * REVENUE_PER_CONVERSION;

                return (
                  <Card 
                    key={user.id} 
                    className="animate-fade-in group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3 px-3 sm:px-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-lg">
                              {user.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-card-foreground text-sm sm:text-base truncate">{user.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          {canManagePermissions && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEditClick(user)}
                            >
                              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className="gap-1 text-xs px-1.5 sm:px-2"
                          >
                            {user.role === 'admin' ? (
                              <Shield className="h-3 w-3" />
                            ) : (
                              <UserIcon className="h-3 w-3" />
                            )}
                            <span className="hidden sm:inline">{user.role}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <div className="rounded-lg bg-muted p-2 sm:p-3 text-center">
                          <p className="text-base sm:text-xl font-bold text-card-foreground">{user.assignedLeads}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Assigned</p>
                        </div>
                        <div className="rounded-lg bg-success/10 p-2 sm:p-3 text-center">
                          <p className="text-base sm:text-xl font-bold text-success">{user.convertedLeads}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Converted</p>
                        </div>
                        <div className="rounded-lg bg-warning/10 p-2 sm:p-3 text-center">
                          <p className="text-base sm:text-xl font-bold text-warning">₹{(userRevenue / 1000).toFixed(0)}K</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Revenue</p>
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
        )}
      </div>

      <TeamEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={editingMember}
        onSave={handleSaveMember}
      />
    </AppLayout>
  );
}
