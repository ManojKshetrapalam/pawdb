import { useEffect, useRef, useCallback } from 'react';
import { Lead } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UseFollowUpRemindersProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export function useFollowUpReminders({ leads, onLeadClick }: UseFollowUpRemindersProps) {
  const notifiedLeads = useRef<Set<string>>(new Set());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkFollowUps = useCallback(() => {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    leads.forEach((lead) => {
      if (
        lead.status === 'follow-up' && 
        lead.followUpDate && 
        !notifiedLeads.current.has(lead.id)
      ) {
        const followUpTime = new Date(lead.followUpDate);
        
        // Check if follow-up is within the next 5 minutes
        if (followUpTime > now && followUpTime <= fiveMinutesFromNow) {
          notifiedLeads.current.add(lead.id);
          
          const minutesUntil = Math.round((followUpTime.getTime() - now.getTime()) / 60000);
          
          toast.info(
            `Follow-up Reminder: ${lead.name}`,
            {
              description: `Scheduled for ${format(followUpTime, 'h:mm a')} (in ${minutesUntil} min)`,
              duration: 10000,
              action: {
                label: 'View Lead',
                onClick: () => onLeadClick?.(lead),
              },
            }
          );
        }
      }
    });
  }, [leads, onLeadClick]);

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
}
