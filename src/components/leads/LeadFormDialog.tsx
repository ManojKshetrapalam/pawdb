import { useState, useEffect } from 'react';
import { Lead, VERTICALS, LeadStatus, LeadSource, Vertical, LeadNote } from '@/types';
import { mockUsers } from '@/data/mockData';
import { PostLeadDialog, PostLeadData } from './PostLeadDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSave: (lead: Partial<Lead>) => void;
  onPostLead?: (leadId: string, postData: PostLeadData) => void;
  defaultVertical?: Vertical;
}

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  vertical: '' as Vertical | '',
  status: 'new' as LeadStatus,
  source: 'meta' as LeadSource,
  assignedTo: '',
  newNote: '',
  followUpDate: undefined as Date | undefined,
  followUpTime: '10:00',
};

export function LeadFormDialog({ 
  open, 
  onOpenChange, 
  lead, 
  onSave,
  onPostLead,
  defaultVertical 
}: LeadFormDialogProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingNotes, setExistingNotes] = useState<LeadNote[]>([]);
  const [showPostLeadDialog, setShowPostLeadDialog] = useState(false);
  const [pendingLeadData, setPendingLeadData] = useState<Partial<Lead> | null>(null);

  const isEditing = !!lead;

  useEffect(() => {
    if (lead) {
      const followUpDateTime = lead.followUpDate ? new Date(lead.followUpDate) : undefined;
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        vertical: lead.vertical,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assignedTo || '',
        newNote: '',
        followUpDate: followUpDateTime,
        followUpTime: followUpDateTime 
          ? `${String(followUpDateTime.getHours()).padStart(2, '0')}:${String(followUpDateTime.getMinutes()).padStart(2, '0')}`
          : '10:00',
      });
      setExistingNotes(lead.notes || []);
    } else {
      setFormData({
        ...initialFormState,
        vertical: defaultVertical || '',
      });
      setExistingNotes([]);
    }
    setErrors({});
  }, [lead, defaultVertical, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.vertical) {
      newErrors.vertical = 'Vertical is required';
    }

    if (formData.status === 'follow-up' && !formData.followUpDate) {
      newErrors.followUpDate = 'Follow-up date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNoteBlur = () => {
    if (formData.newNote.trim()) {
      const newNote: LeadNote = {
        text: formData.newNote.trim(),
        timestamp: new Date().toISOString(),
      };
      setExistingNotes([...existingNotes, newNote]);
      setFormData({ ...formData, newNote: '' });
      toast.success('Note saved');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    // Add any pending note
    let finalNotes = [...existingNotes];
    if (formData.newNote.trim()) {
      finalNotes.push({
        text: formData.newNote.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    // Combine date and time for follow-up
    let followUpDateTime: string | undefined;
    if (formData.status === 'follow-up' && formData.followUpDate) {
      const [hours, minutes] = formData.followUpTime.split(':').map(Number);
      const dateTime = new Date(formData.followUpDate);
      dateTime.setHours(hours, minutes, 0, 0);
      followUpDateTime = dateTime.toISOString();
    }

    const leadData: Partial<Lead> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      vertical: formData.vertical as Vertical,
      status: formData.status,
      source: formData.source,
      assignedTo: formData.assignedTo || null,
      notes: finalNotes,
      updatedAt: new Date().toISOString(),
      followUpDate: followUpDateTime,
    };

    // Check if this is a buy-lead being converted
    if (formData.vertical === 'buy-leads' && formData.status === 'converted') {
      // Store the lead data and show post lead dialog
      setPendingLeadData(leadData);
      setShowPostLeadDialog(true);
    } else {
      onSave(leadData);
      toast.success(isEditing ? 'Lead updated successfully' : 'Lead created successfully');
      onOpenChange(false);
    }
  };

  const handlePostLead = (leadId: string, postData: PostLeadData) => {
    if (pendingLeadData) {
      onSave(pendingLeadData);
      onPostLead?.(lead?.id || leadId, postData);
      toast.success('Lead converted and posted to vendors!');
      setPendingLeadData(null);
      onOpenChange(false);
    }
  };

  const handlePostLeadCancel = () => {
    setShowPostLeadDialog(false);
    setPendingLeadData(null);
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the lead information below.' 
              : 'Fill in the details to create a new lead.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            <div className="space-y-4 py-4 pb-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter lead name"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
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
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Vertical & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vertical">Vertical *</Label>
                  <Select
                    value={formData.vertical}
                    onValueChange={(value) => setFormData({ ...formData, vertical: value as Vertical })}
                  >
                    <SelectTrigger className={errors.vertical ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select vertical" />
                    </SelectTrigger>
                    <SelectContent>
                      {VERTICALS.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vertical && (
                    <p className="text-sm text-destructive">{errors.vertical}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as LeadStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Follow-up Date & Time (shown only when status is follow-up) */}
              {formData.status === 'follow-up' && (
                <div className="space-y-2 p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <Label className="text-purple-600">Follow-up Schedule *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="followUpDate" className="text-sm text-muted-foreground">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.followUpDate && "text-muted-foreground",
                              errors.followUpDate && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.followUpDate}
                            onSelect={(date) => setFormData({ ...formData, followUpDate: date })}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.followUpDate && (
                        <p className="text-sm text-destructive">{errors.followUpDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followUpTime" className="text-sm text-muted-foreground">Time</Label>
                      <Select
                        value={formData.followUpTime}
                        onValueChange={(value) => setFormData({ ...formData, followUpTime: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Source & Assigned To */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value as LeadSource })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta">Meta (Facebook/Instagram)</SelectItem>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={formData.assignedTo || 'unassigned'}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value === 'unassigned' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Previous Notes (Read-only) */}
              {existingNotes.length > 0 && (
                <div className="space-y-2">
                  <Label>Previous Notes</Label>
                  <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                    {existingNotes.map((note, index) => (
                      <div 
                        key={index} 
                        className="rounded-md bg-background p-3 border border-border/50"
                      >
                        <p className="text-sm text-foreground">{note.text}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Note */}
              <div className="space-y-2">
                <Label htmlFor="newNote">Add New Note</Label>
                <Textarea
                  id="newNote"
                  value={formData.newNote}
                  onChange={(e) => setFormData({ ...formData, newNote: e.target.value })}
                  onBlur={handleNoteBlur}
                  placeholder="Add a note... (auto-saves when you click outside)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Note will be saved with timestamp when you click outside the field
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Post Lead Dialog for buy-leads conversion */}
      <PostLeadDialog
        open={showPostLeadDialog}
        onOpenChange={handlePostLeadCancel}
        lead={lead || { id: 'new', name: formData.name, email: formData.email, phone: formData.phone } as Lead}
        onPost={handlePostLead}
      />
    </Dialog>
  );
}
