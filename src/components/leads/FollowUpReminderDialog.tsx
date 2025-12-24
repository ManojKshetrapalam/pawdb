import { useEffect, useCallback } from 'react';
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
import { Clock, Phone, Mail, User, Calendar, Bell, AlarmClockPlus } from 'lucide-react';
import { format } from 'date-fns';

interface FollowUpReminderDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewLead: (lead: Lead) => void;
  onSnooze: (lead: Lead, minutes: number) => void;
  minutesUntil: number;
}

// Play a notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant two-tone chime
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playTone(880, now, 0.2);        // A5
    playTone(1108.73, now + 0.15, 0.25); // C#6
    playTone(1318.51, now + 0.3, 0.3);   // E6
    
    // Close context after sounds finish
    setTimeout(() => audioContext.close(), 1000);
  } catch (error) {
    console.log('Audio playback not available');
  }
};

export function FollowUpReminderDialog({
  lead,
  open,
  onOpenChange,
  onViewLead,
  onSnooze,
  minutesUntil,
}: FollowUpReminderDialogProps) {
  // Play sound when dialog opens
  useEffect(() => {
    if (open && lead) {
      playNotificationSound();
    }
  }, [open, lead]);

  const handleSnooze = useCallback((minutes: number) => {
    if (lead) {
      onSnooze(lead, minutes);
    }
  }, [lead, onSnooze]);

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

          {/* Snooze Options */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <AlarmClockPlus className="h-3 w-3" />
              <span>Snooze</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleSnooze(5)}
              >
                5 min
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleSnooze(10)}
              >
                10 min
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleSnooze(15)}
              >
                15 min
              </Button>
            </div>
          </div>
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
