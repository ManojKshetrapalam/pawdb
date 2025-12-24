import { Bell, Search, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/contexts/CurrentUserContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonLabel?: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-destructive text-destructive-foreground';
    case 'vertical-head': return 'bg-primary text-primary-foreground';
    case 'manager': return 'bg-blue-500 text-white';
    case 'team-lead': return 'bg-amber-500 text-white';
    case 'associate': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function Header({ title, subtitle, showAddButton, onAddClick, addButtonLabel = 'Add New' }: HeaderProps) {
  const { currentUser, switchUser, availableUsers, hasPermission } = useCurrentUser();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <div className="pl-10 lg:pl-0 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads, vendors..."
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Add Button - only show if user has permission */}
        {showAddButton && hasPermission('canAddLeads') && (
          <Button onClick={onAddClick} size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{addButtonLabel}</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User Menu with Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-auto py-1.5 px-2 gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{currentUser?.name || 'Select User'}</span>
                {currentUser && (
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getRoleColor(currentUser.role)}`}>
                    {currentUser.role.replace('-', ' ')}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch User</DropdownMenuLabel>
            {availableUsers.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`flex items-center gap-2 ${currentUser?.id === user.id ? 'bg-accent' : ''}`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-muted">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role.replace('-', ' ')}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
