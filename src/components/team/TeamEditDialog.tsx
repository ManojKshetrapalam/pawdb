import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface TeamEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: User | null;
  onSave: (member: User) => void;
}

export function TeamEditDialog({ open, onOpenChange, member, onSave }: TeamEditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent' as 'admin' | 'agent',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!member;

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'agent',
      });
    }
    setErrors({});
  }, [member, open]);

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
      assignedLeads: member?.assignedLeads || 0,
      convertedLeads: member?.convertedLeads || 0,
    };

    onSave(savedMember);
    toast.success(isEditing ? 'Member updated successfully' : 'Member added successfully');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update team member details.' : 'Add a new team member to your organization.'}
          </DialogDescription>
        </DialogHeader>

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
              onValueChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'agent' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Add'} Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
