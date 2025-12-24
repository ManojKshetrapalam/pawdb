import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserPermissions } from '@/types';
import { mockUsers } from '@/data/mockData';

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUser: (userId: string) => void;
  hasPermission: (permission: keyof Omit<UserPermissions, 'accessibleVerticals'>) => boolean;
  canAccessVertical: (verticalId: string) => boolean;
  availableUsers: User[];
}

// Default context value for when used outside provider
const defaultContextValue: CurrentUserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
  switchUser: () => {},
  hasPermission: () => false,
  canAccessVertical: () => false,
  availableUsers: [],
};

const CurrentUserContext = createContext<CurrentUserContextType>(defaultContextValue);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Default to first user (admin)

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const hasPermission = (permission: keyof Omit<UserPermissions, 'accessibleVerticals'>): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions[permission];
  };

  const canAccessVertical = (verticalId: string): boolean => {
    if (!currentUser) return false;
    // Admin has access to all verticals
    if (currentUser.role === 'admin') return true;
    return currentUser.permissions.accessibleVerticals.includes(verticalId as any);
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        hasPermission,
        canAccessVertical,
        availableUsers: mockUsers,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (): CurrentUserContextType => {
  return useContext(CurrentUserContext);
};
