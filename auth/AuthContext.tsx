import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, Outlet } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  setSelectedOutlet: (outlet: Outlet) => void;
  updateOutletDetails: (outlet: Outlet) => void;
  reparentOutlet: (childId: string, parentId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutletState] = useState<Outlet | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      if (user) {
        const allOutlets = await api.getOutlets();
        // For Admins, show all outlets; for others, filter by their assigned IDs.
        const userOutlets = user.role === UserRole.Admin 
          ? allOutlets
          : allOutlets.filter(o => user.outletIds.includes(o.id));
        
        setOutlets(userOutlets);

        if (userOutlets.length > 0 && !userOutlets.find(o => o.id === selectedOutlet?.id)) {
          setSelectedOutletState(userOutlets[0]);
        } else if (userOutlets.length === 0) {
           setSelectedOutletState(null);
        }

      } else {
        setOutlets([]);
        setSelectedOutletState(null);
      }
    };
    fetchOutlets();
  }, [user, selectedOutlet?.id]);
  
  const login = async (email: string) => {
    const userData = await api.login(email);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };
  
  const setSelectedOutlet = (outlet: Outlet) => {
    setSelectedOutletState(outlet);
  };

  const updateOutletDetails = (updatedOutlet: Outlet) => {
    setOutlets(prev => prev.map(o => o.id === updatedOutlet.id ? updatedOutlet : o));
    if (selectedOutlet?.id === updatedOutlet.id) {
      setSelectedOutletState(updatedOutlet);
    }
    // In a real app, this would also call api.updateOutlet(updatedOutlet)
  };

  const reparentOutlet = (childId: string, parentId: string) => {
    setOutlets(prev => prev.map(o => o.id === childId ? { ...o, parentId } : o));
    // In a real app, this would also make an API call here.
    // e.g., await api.updateOutletParent(childId, parentId);
  };


  return (
    <AuthContext.Provider value={{ user, outlets, selectedOutlet, login, logout, setSelectedOutlet, updateOutletDetails, reparentOutlet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};