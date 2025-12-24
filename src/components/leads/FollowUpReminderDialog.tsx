import { Lead } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, Mail, User, Calendar, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface FollowUpReminderDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewLead: (lead: Lead) => void;
  minutesUntil: number;
}

export function FollowUpReminderDialog({
  lead,
  open,
  onOpenChange,
  onViewLead,
  minutesUntil,
}: FollowUpReminderDialogProps) {
  if (!lead) return null;

  const followUpTime = lead.followUpDate ? new Date(lead.followUpDate) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <Bell className="h-5 w-5 animate-pulse" />
            <DialogTitle className="text-lg">Follow-up Reminder</DialogTitle>
          </div>
          <DialogDescription>
            You have a follow-up scheduled in {minutesUntil} minute{minutesUntil !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Lead Name & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-lg">{lead.name}</span>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              Follow-up
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
            )}
          </div>

          {/* Follow-up Time */}
          {followUpTime && (
            <div className="flex items-center gap-2 text-sm bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {format(followUpTime, 'EEEE, MMMM d, yyyy')}
              </span>
              <Clock className="h-4 w-4 text-amber-600 ml-2" />
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {format(followUpTime, 'h:mm a')}
              </span>
            </div>
          )}

          {/* Latest Note */}
          {lead.notes && lead.notes.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Latest Note</span>
              <p className="text-sm bg-muted/50 rounded-lg p-3 line-clamp-3">
                {lead.notes[lead.notes.length - 1].text}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          <Button onClick={() => {
            onViewLead(lead);
            onOpenChange(false);
          }}>
            View Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
