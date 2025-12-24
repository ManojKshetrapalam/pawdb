import { useEffect, useRef, useCallback, useState } from 'react';
import { Lead } from '@/types';

interface UseFollowUpRemindersProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
  onUpdateLead?: (leadId: string, updates: Partial<Lead>) => void;
}

interface ReminderState {
  lead: Lead;
  minutesUntil: number;
}

export function useFollowUpReminders({ leads, onLeadClick, onUpdateLead }: UseFollowUpRemindersProps) {
  const notifiedLeads = useRef<Set<string>>(new Set());
  const snoozedLeads = useRef<Map<string, number>>(new Map()); // leadId -> snooze until timestamp
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [reminderLead, setReminderLead] = useState<ReminderState | null>(null);

  const checkFollowUps = useCallback(() => {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    leads.forEach((lead) => {
      if (
        lead.status === 'follow-up' && 
        lead.followUpDate && 
        !notifiedLeads.current.has(lead.id)
      ) {
        // Check if this lead is snoozed
        const snoozeUntil = snoozedLeads.current.get(lead.id);
        if (snoozeUntil && now.getTime() < snoozeUntil) {
          return; // Still snoozed, skip
        }
        
        // Clear expired snooze
        if (snoozeUntil) {
          snoozedLeads.current.delete(lead.id);
        }

        const followUpTime = new Date(lead.followUpDate);
        
        // Check if follow-up is within the next 5 minutes
        if (followUpTime > now && followUpTime <= fiveMinutesFromNow) {
          notifiedLeads.current.add(lead.id);
          
          const minutesUntil = Math.round((followUpTime.getTime() - now.getTime()) / 60000);
          
          setReminderLead({ lead, minutesUntil });
        }
      }
    });
  }, [leads]);

  useEffect(() => {
    // Check immediately on mount and when leads change
    checkFollowUps();

    // Set up interval to check every 30 seconds
    checkIntervalRef.current = setInterval(checkFollowUps, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkFollowUps]);

  // Reset notified leads when they're updated (e.g., status changed)
  useEffect(() => {
    const currentLeadIds = new Set(leads.map(l => l.id));
    notifiedLeads.current.forEach((id) => {
      if (!currentLeadIds.has(id)) {
        notifiedLeads.current.delete(id);
      }
    });
  }, [leads]);

  const dismissReminder = useCallback(() => {
    setReminderLead(null);
  }, []);

  const handleViewLead = useCallback((lead: Lead) => {
    onLeadClick?.(lead);
    setReminderLead(null);
  }, [onLeadClick]);

  const handleSnooze = useCallback((lead: Lead, minutes: number) => {
    const now = new Date();
    const snoozeUntil = now.getTime() + minutes * 60 * 1000;
    
    // Set snooze time
    snoozedLeads.current.set(lead.id, snoozeUntil);
    
    // Remove from notified so it can trigger again after snooze
    notifiedLeads.current.delete(lead.id);
    
    // Close the dialog
    setReminderLead(null);
  }, []);

  return {
    reminderLead: reminderLead?.lead ?? null,
    minutesUntil: reminderLead?.minutesUntil ?? 0,
    isReminderOpen: reminderLead !== null,
    dismissReminder,
    handleViewLead,
    handleSnooze,
  };
}
