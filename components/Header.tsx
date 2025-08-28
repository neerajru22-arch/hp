
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDownIcon, BellIcon, ArrowsRightLeftIcon, Bars3Icon } from './icons/Icons';
import { useAuth } from '../auth/AuthContext';
import { InventoryItem } from '../types';
import { api } from '../services/api';

const OutletSelector: React.FC = () => {
  const { outlets, selectedOutlet, setSelectedOutlet } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedOutlet || outlets.length <= 1) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-md bg-slate-100 hover:bg-slate-200">
        <ArrowsRightLeftIcon className="w-5 h-5 text-slate-600" />
        <div>
          <p className="font-semibold text-sm text-secondary">{selectedOutlet.name}</p>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-semibold text-slate-500">SELECT OUTLET</p>
            {outlets.map(outlet => (
              <button 
                key={outlet.id} 
                onClick={() => { setSelectedOutlet(outlet); setIsOpen(false); }} 
                className={`w-full text-left px-2 py-2 text-sm text-slate-700 rounded-md ${selectedOutlet.id === outlet.id ? 'bg-primary-50 font-semibold' : 'hover:bg-slate-100'}`}
              >
                {outlet.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
          <div className="hidden md:block">
            <OutletSelector />
          </div>
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
