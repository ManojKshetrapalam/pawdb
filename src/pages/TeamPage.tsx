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
import { Shield, User as UserIcon, Pencil, Users, TrendingUp, CheckCircle, Download } from 'lucide-react';
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

  // Team stats for vertical heads
  const teamStats = {
    totalMembers: members.length,
    totalAssigned: members.reduce((sum, m) => sum + m.assignedLeads, 0),
    totalConverted: members.reduce((sum, m) => sum + m.convertedLeads, 0),
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
      
      <div className="p-6 space-y-6">
        {/* Team Stats - for admin and vertical heads */}
        {isAdminOrVerticalHead && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Team Overview</h2>
              <Button variant="outline" size="sm" onClick={handleExportTeam} className="gap-2">
                <Download className="h-4 w-4" />
                Export Team
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        )}

        {/* Team Members Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((user, index) => {
              const conversionRate = user.assignedLeads > 0 
                ? Math.round((user.convertedLeads / user.assignedLeads) * 100)
                : 0;

              return (
                <Card 
                  key={user.id} 
                  className="animate-fade-in group"
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
                      <div className="flex items-center gap-2">
                        {canManagePermissions && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {user.role === 'admin' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <UserIcon className="h-3 w-3" />
                          )}
                          {user.role}
                        </Badge>
                      </div>
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
