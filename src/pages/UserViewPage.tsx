import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { mockUsers } from '@/data/mockData';
import { User, VERTICALS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Shield, 
  User as UserIcon, 
  Users, 
  Crown, 
  Star, 
  Check, 
  X 
} from 'lucide-react';

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return <Shield className="h-4 w-4" />;
    case 'vertical-head':
      return <Crown className="h-4 w-4" />;
    case 'manager':
      return <Star className="h-4 w-4" />;
    case 'team-lead':
      return <Users className="h-4 w-4" />;
    default:
      return <UserIcon className="h-4 w-4" />;
  }
};

const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (role) {
    case 'admin':
      return 'default';
    case 'vertical-head':
      return 'destructive';
    case 'manager':
      return 'secondary';
    default:
      return 'outline';
  }
};

const formatRoleName = (role: string) => {
  return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function UserViewPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>(mockUsers[0]?.id || '');
  
  const selectedUser = mockUsers.find(u => u.id === selectedUserId);

  const PermissionIndicator = ({ allowed }: { allowed: boolean }) => (
    allowed ? (
      <Check className="h-4 w-4 text-success" />
    ) : (
      <X className="h-4 w-4 text-destructive" />
    )
  );

  return (
    <AppLayout>
      <Header 
        title="User Access View" 
        subtitle="View user permissions and access controls"
      />
      
      <div className="p-6 space-y-6">
        {/* User Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select User to View</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({formatRoleName(user.role)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedUser && (
          <>
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedUser.name}
                  </CardTitle>
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="gap-1">
                    {getRoleIcon(selectedUser.role)}
                    {formatRoleName(selectedUser.role)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Assigned Leads</p>
                    <p className="font-medium">{selectedUser.assignedLeads}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Converted Leads</p>
                    <p className="font-medium text-success">{selectedUser.convertedLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead className="text-center">Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Can Add Leads</TableCell>
                      <TableCell className="text-center">
                        <PermissionIndicator allowed={selectedUser.permissions.canAddLeads} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Can Move Leads to Other Team Members</TableCell>
                      <TableCell className="text-center">
                        <PermissionIndicator allowed={selectedUser.permissions.canMoveLeadsToMembers} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Can Move Leads to Other Verticals</TableCell>
                      <TableCell className="text-center">
                        <PermissionIndicator allowed={selectedUser.permissions.canMoveLeadsToVerticals} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Can Create Users</TableCell>
                      <TableCell className="text-center">
                        <PermissionIndicator allowed={selectedUser.permissions.canCreateUsers} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Can Manage Permissions</TableCell>
                      <TableCell className="text-center">
                        <PermissionIndicator allowed={selectedUser.permissions.canManagePermissions} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Accessible Verticals */}
            <Card>
              <CardHeader>
                <CardTitle>Accessible Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUser.role === 'admin' ? (
                  <div className="rounded-lg bg-success/10 p-4 text-success">
                    <p className="font-medium">Admin has access to all verticals</p>
                  </div>
                ) : selectedUser.permissions.accessibleVerticals.length === 0 ? (
                  <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                    <p className="font-medium">No verticals assigned</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {VERTICALS.map((vertical) => {
                      const hasAccess = selectedUser.permissions.accessibleVerticals.includes(vertical.id);
                      return (
                        <div
                          key={vertical.id}
                          className={`rounded-lg p-3 border transition-colors ${
                            hasAccess 
                              ? 'bg-success/10 border-success/30' 
                              : 'bg-muted border-border opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {hasAccess ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={hasAccess ? 'font-medium' : 'text-muted-foreground'}>
                              {vertical.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Users Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Team Members Comparison</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Add Leads</TableHead>
                      <TableHead className="text-center">Move to Members</TableHead>
                      <TableHead className="text-center">Move to Verticals</TableHead>
                      <TableHead className="text-center">Create Users</TableHead>
                      <TableHead>Verticals Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow 
                        key={user.id} 
                        className={user.id === selectedUserId ? 'bg-primary/5' : ''}
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                            {getRoleIcon(user.role)}
                            {formatRoleName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <PermissionIndicator allowed={user.permissions.canAddLeads} />
                        </TableCell>
                        <TableCell className="text-center">
                          <PermissionIndicator allowed={user.permissions.canMoveLeadsToMembers} />
                        </TableCell>
                        <TableCell className="text-center">
                          <PermissionIndicator allowed={user.permissions.canMoveLeadsToVerticals} />
                        </TableCell>
                        <TableCell className="text-center">
                          <PermissionIndicator allowed={user.permissions.canCreateUsers} />
                        </TableCell>
                        <TableCell>
                          {user.role === 'admin' ? (
                            <Badge variant="secondary">All Verticals</Badge>
                          ) : user.permissions.accessibleVerticals.length === 0 ? (
                            <span className="text-muted-foreground text-sm">None</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.accessibleVerticals.slice(0, 2).map(v => {
                                const vertical = VERTICALS.find(vert => vert.id === v);
                                return (
                                  <Badge key={v} variant="outline" className="text-xs">
                                    {vertical?.name}
                                  </Badge>
                                );
                              })}
                              {user.permissions.accessibleVerticals.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.permissions.accessibleVerticals.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}