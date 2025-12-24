import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VERTICALS } from '@/types';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import {
  LayoutDashboard,
  Users,
  Store,
  Building2,
  Users as UsersIcon,
  ShoppingCart,
  GraduationCap,
  Heart,
  Plane,
  Hotel,
  ChevronDown,
  ChevronRight,
  Bell,
  Settings,
  Smartphone,
  Wallet,
  Eye,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Users: UsersIcon,
  ShoppingCart,
  GraduationCap,
  Heart,
  Plane,
  Hotel,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [isVerticalsOpen, setIsVerticalsOpen] = useState(true);
  const { currentUser, canAccessVertical, hasPermission } = useCurrentUser();

  const isActive = (path: string) => location.pathname === path;
  const isVerticalActive = (id: string) => location.pathname === `/verticals/${id}`;

  // Filter verticals based on user access
  const accessibleVerticals = VERTICALS.filter(v => canAccessVertical(v.id));

  // Check if user can manage team/users
  const canManageTeam = currentUser?.role === 'admin' || currentUser?.role === 'vertical-head' || hasPermission('canCreateUsers');
  const canViewAccounts = currentUser?.role === 'admin' || currentUser?.role === 'vertical-head';
  const canViewUserAccess = currentUser?.role === 'admin' || currentUser?.role === 'vertical-head' || hasPermission('canManagePermissions');

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Smartphone className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-accent-foreground">LeadFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Verticals Dropdown - only show accessible verticals */}
            {accessibleVerticals.length > 0 && (
              <div>
                <button
                  onClick={() => setIsVerticalsOpen(!isVerticalsOpen)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4" />
                    Verticals
                  </div>
                  {isVerticalsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isVerticalsOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                    {accessibleVerticals.map((vertical) => {
                      const Icon = iconMap[vertical.icon] || Building2;
                      return (
                        <Link
                          key={vertical.id}
                          to={`/verticals/${vertical.id}`}
                          onClick={handleLinkClick}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isVerticalActive(vertical.id)
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {vertical.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* All Leads - only if user can access any vertical */}
            {accessibleVerticals.length > 0 && (
              <Link
                to="/leads"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive('/leads')
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Users className="h-4 w-4" />
                All Leads
              </Link>
            )}

            <Link
              to="/marketplace"
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive('/marketplace')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </Link>

            <Link
              to="/vendors"
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive('/vendors')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Store className="h-4 w-4" />
              Vendors
            </Link>

            {/* Team - only for users who can manage team */}
            {canManageTeam && (
              <Link
                to="/team"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive('/team')
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <UsersIcon className="h-4 w-4" />
                Team
              </Link>
            )}

            {/* User Access - only for admin/vertical-head or those with permission */}
            {canViewUserAccess && (
              <Link
                to="/user-access"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive('/user-access')
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Eye className="h-4 w-4" />
                User Access
              </Link>
            )}

            {/* Accounts - only for admin/vertical-head */}
            {canViewAccounts && (
              <Link
                to="/accounts"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive('/accounts')
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Wallet className="h-4 w-4" />
                Accounts
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3">
          <div className="space-y-1">
            <Link
              to="/notifications"
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive('/notifications')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
            <Link
              to="/settings"
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive('/settings')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
