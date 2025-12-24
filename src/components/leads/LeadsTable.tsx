import { Lead, VERTICALS } from '@/types';
import { mockUsers } from '@/data/mockData';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, UserPlus, Phone, CheckCircle, XCircle, Pencil, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface LeadsTableProps {
  leads: Lead[];
  onAssign?: (leadId: string, userId: string) => void;
  onConvert?: (leadId: string) => void;
  onConvertWithSubscription?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  showVertical?: boolean;
}

export function LeadsTable({ leads, onAssign, onConvert, onConvertWithSubscription, onEdit, showVertical = true }: LeadsTableProps) {
  const getVerticalName = (verticalId: string) => {
    return VERTICALS.find((v) => v.id === verticalId)?.name || verticalId;
  };

  const getAssignedUser = (userId: string | null) => {
    if (!userId) return null;
    return mockUsers.find((u) => u.id === userId);
  };

  const getLastNote = (lead: Lead) => {
    if (!lead.notes || lead.notes.length === 0) return null;
    return lead.notes[lead.notes.length - 1];
  };

  const handleAssign = (leadId: string, userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    toast.success(`Lead assigned to ${user?.name}`);
    onAssign?.(leadId, userId);
  };

  const handleConvert = (lead: Lead) => {
    if (lead.vertical === 'buy-leads') {
      // For buy-leads, open the edit dialog so user can set status to converted
      // which will trigger the post lead dialog
      onEdit?.(lead);
      toast.info('Set status to "Converted" to post this lead');
    } else if (lead.vertical === 'app-b2b' || lead.vertical === 'app-b2c') {
      // For B2B/B2C apps, show subscription selection dialog
      if (onConvertWithSubscription) {
        onConvertWithSubscription(lead);
      } else {
        // Fallback if no subscription handler
        toast.success('Lead converted!');
        onConvert?.(lead.id);
      }
    } else {
      toast.success('Lead converted!');
      onConvert?.(lead.id);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No leads found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Lead</TableHead>
            {showVertical && <TableHead className="font-semibold">Vertical</TableHead>}
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => {
            const assignedUser = getAssignedUser(lead.assignedTo);
            const lastNote = getLastNote(lead);
            return (
              <TableRow 
                key={lead.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-card-foreground">{lead.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                    {lastNote && (
                      <div className="flex items-start gap-1 mt-2 text-sm">
                        <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground line-clamp-2">{lastNote.text}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                {showVertical && (
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm font-medium">
                      {getVerticalName(lead.vertical)}
                    </span>
                  </TableCell>
                )}
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  {assignedUser ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {assignedUser.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignedUser.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(lead.updatedAt || lead.createdAt), 'MMM d, h:mm a')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Edit */}
                      <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Lead
                      </DropdownMenuItem>
                      
                      {/* Assign submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign to
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {mockUsers.map((user) => (
                            <DropdownMenuItem
                              key={user.id}
                              onClick={() => handleAssign(lead.id, user.id)}
                            >
                              {user.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      
                      <DropdownMenuSeparator />
                      
                      {lead.status !== 'converted' && (
                        <DropdownMenuItem onClick={() => handleConvert(lead)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-success" />
                          {lead.vertical === 'buy-leads' ? 'Convert & Post Lead' : 'Mark Converted'}
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Lost
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
