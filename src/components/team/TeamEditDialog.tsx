import { useState, useEffect } from 'react';
import { User, UserRole, UserPermissions, DEFAULT_PERMISSIONS, VERTICALS, Vertical } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface TeamEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: User | null;
  onSave: (member: User) => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'vertical-head', label: 'Vertical Head' },
  { value: 'manager', label: 'Manager' },
  { value: 'team-lead', label: 'Team Lead' },
  { value: 'associate', label: 'Associate' },
];

export function TeamEditDialog({ open, onOpenChange, member, onSave }: TeamEditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'associate' as UserRole,
  });
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS['associate']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!member;

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      });
      setPermissions(member.permissions);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'associate',
      });
      setPermissions(DEFAULT_PERMISSIONS['associate']);
    }
    setErrors({});
  }, [member, open]);

  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
    // Apply default permissions for the selected role
    const defaultPerms = DEFAULT_PERMISSIONS[role];
    setPermissions({
      ...defaultPerms,
      // Keep previously selected verticals if switching between non-admin roles
      accessibleVerticals: role === 'admin' 
        ? defaultPerms.accessibleVerticals 
        : permissions.accessibleVerticals.length > 0 
          ? permissions.accessibleVerticals 
          : defaultPerms.accessibleVerticals,
    });
  };

  const handlePermissionChange = (key: keyof Omit<UserPermissions, 'accessibleVerticals'>, value: boolean) => {
    setPermissions({ ...permissions, [key]: value });
  };

  const handleVerticalToggle = (vertical: Vertical) => {
    const currentVerticals = permissions.accessibleVerticals;
    if (currentVerticals.includes(vertical)) {
      setPermissions({
        ...permissions,
        accessibleVerticals: currentVerticals.filter(v => v !== vertical),
      });
    } else {
      setPermissions({
        ...permissions,
        accessibleVerticals: [...currentVerticals, vertical],
      });
    }
  };

  const selectAllVerticals = () => {
    setPermissions({
      ...permissions,
      accessibleVerticals: VERTICALS.map(v => v.id),
    });
  };

  const deselectAllVerticals = () => {
    setPermissions({
      ...permissions,
      accessibleVerticals: [],
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const savedMember: User = {
      id: member?.id || String(Date.now()),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: formData.role === 'admin' ? DEFAULT_PERMISSIONS['admin'] : permissions,
      assignedLeads: member?.assignedLeads || 0,
      convertedLeads: member?.convertedLeads || 0,
    };

    onSave(savedMember);
    toast.success(isEditing ? 'Member updated successfully' : 'Member added successfully');
    onOpenChange(false);
  };

  const showPermissions = formData.role !== 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update team member details and permissions.' : 'Add a new team member with specific permissions.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showPermissions && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Permissions</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canAddLeads"
                        checked={permissions.canAddLeads}
                        onCheckedChange={(checked) => handlePermissionChange('canAddLeads', !!checked)}
                      />
                      <Label htmlFor="canAddLeads" className="text-sm font-normal cursor-pointer">
                        Can add leads
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canMoveLeadsToMembers"
                        checked={permissions.canMoveLeadsToMembers}
                        onCheckedChange={(checked) => handlePermissionChange('canMoveLeadsToMembers', !!checked)}
                      />
                      <Label htmlFor="canMoveLeadsToMembers" className="text-sm font-normal cursor-pointer">
                        Can move leads to other team members
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canMoveLeadsToVerticals"
                        checked={permissions.canMoveLeadsToVerticals}
                        onCheckedChange={(checked) => handlePermissionChange('canMoveLeadsToVerticals', !!checked)}
                      />
                      <Label htmlFor="canMoveLeadsToVerticals" className="text-sm font-normal cursor-pointer">
                        Can move leads to other verticals
                      </Label>
                    </div>

                    {(formData.role === 'vertical-head') && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="canCreateUsers"
                            checked={permissions.canCreateUsers}
                            onCheckedChange={(checked) => handlePermissionChange('canCreateUsers', !!checked)}
                          />
                          <Label htmlFor="canCreateUsers" className="text-sm font-normal cursor-pointer">
                            Can create users
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="canManagePermissions"
                            checked={permissions.canManagePermissions}
                            onCheckedChange={(checked) => handlePermissionChange('canManagePermissions', !!checked)}
                          />
                          <Label htmlFor="canManagePermissions" className="text-sm font-normal cursor-pointer">
                            Can manage user permissions
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Accessible Verticals</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={selectAllVerticals}>
                        Select All
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={deselectAllVerticals}>
                        Deselect All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {VERTICALS.map((vertical) => (
                      <div key={vertical.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`vertical-${vertical.id}`}
                          checked={permissions.accessibleVerticals.includes(vertical.id)}
                          onCheckedChange={() => handleVerticalToggle(vertical.id)}
                        />
                        <Label htmlFor={`vertical-${vertical.id}`} className="text-sm font-normal cursor-pointer">
                          {vertical.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {formData.role === 'admin' && (
              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                Admins have full access to all features and verticals.
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Member</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
