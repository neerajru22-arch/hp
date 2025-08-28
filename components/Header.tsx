
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BellIcon, Bars3Icon } from './icons/Icons';
import { useAuth } from '../auth/AuthContext';
import { InventoryItem } from '../types';
import { api } from '../services/api';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, outlets } = useAuth();
  const location = useLocation();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      if (user?.outletIds && user.outletIds.length > 0) {
        const inventory = await api.getInventoryForOutletIds(user.outletIds);
        const lowStock = inventory.filter(item => item.par > 0 && (item.stock / item.par) < 0.5);
        setLowStockItems(lowStock);
      }
    };
    fetchLowStockItems();
  }, [user]);

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    const title = path.replace('-', ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-8 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 hover:text-primary">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-4">
          <h2 className="text-xl md:text-2xl font-bold text-secondary">{getPageTitle()}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative" ref={notificationsRef}>
          <button onClick={() => setNotificationsOpen(prev => !prev)} className="relative text-slate-600 hover:text-primary">
            <BellIcon className="w-6 h-6" />
            {lowStockItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-danger text-white text-xs font-bold">
                  {lowStockItems.length}
                </span>
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
              <div className="p-3 border-b">
                <h4 className="font-semibold text-secondary">Low Stock Alerts</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map(item => {
                    const outletName = outlets.find(o => o.id === item.outletId)?.name || 'Unknown Outlet';
                    return (
                      <a href="#/inventory" onClick={() => setNotificationsOpen(false)} key={item.id} className="block p-3 hover:bg-slate-100 border-b border-slate-100">
                        <p className="font-medium text-sm text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">{outletName}</span>: <span className="text-danger font-bold">{item.stock}</span> / {item.par} {item.unit} left
                        </p>
                      </a>
                    )
                  })
                ) : (
                  <p className="p-4 text-sm text-slate-500 text-center">No low stock items. Great job!</p>
                )}
              </div>
              <div className="p-2 bg-slate-50 rounded-b-lg">
                <a href="#/inventory" onClick={() => setNotificationsOpen(false)} className="block text-center text-sm font-medium text-primary hover:underline">View All Inventory</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;