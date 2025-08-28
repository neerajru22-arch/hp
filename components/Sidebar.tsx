
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon, ArchiveBoxIcon, BookOpenIcon, BanknotesIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ShareIcon, ClipboardDocumentListIcon, UserGroupIcon, BuildingStorefrontIcon, TableCellsIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from './icons/Icons';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const navLinkClasses = 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors';
  const activeClass = 'bg-primary-50 text-primary-700';
  const inactiveClass = 'text-slate-600 hover:bg-slate-200 hover:text-slate-900';

  const commonLinks = [
    { to: '/dashboard', icon: ChartBarIcon, text: 'Dashboard' },
    { to: '/orders', icon: DocumentTextIcon, text: 'Orders' },
    { to: '/inventory', icon: ArchiveBoxIcon, text: 'Inventory' },
  ];

  const managementLinks = [
      { to: '/vendors', icon: BuildingStorefrontIcon, text: 'Vendors' },
  ];

  const roleLinks = {
    [UserRole.RestaurantOwner]: [
      ...commonLinks,
      { to: '/recipes', icon: BookOpenIcon, text: 'Recipes' },
      { to: '/staff', icon: UserGroupIcon, text: 'Staff' },
      ...managementLinks,
      { to: '/finance', icon: BanknotesIcon, text: 'Finance' },
    ],
    [UserRole.Admin]: [
      ...commonLinks,
      ...managementLinks,
      { to: '/finance', icon: BanknotesIcon, text: 'Finance' },
      { to: '/structure', icon: ShareIcon, text: 'Entity Structure' },
    ],
    [UserRole.Chef]: [
      { to: '/dashboard', icon: ClipboardDocumentListIcon, text: 'KOT View' },
      { to: '/recipes', icon: BookOpenIcon, text: 'Recipes' },
    ],
    [UserRole.StoreManager]: [
        { to: '/dashboard', icon: ChartBarIcon, text: 'Dashboard' },
        { to: '/inventory', icon: ArchiveBoxIcon, text: 'Inventory' },
        { to: '/requisitions', icon: ClipboardDocumentListIcon, text: 'Requisitions' },
        ...managementLinks,
    ],
    [UserRole.Procurement]: [
        ...commonLinks,
        ...managementLinks
    ],
    [UserRole.Vendor]: commonLinks.slice(0, 2), // Example: Vendor only sees Dashboard and Orders
    [UserRole.Waiter]: [
      { to: '/dashboard', icon: TableCellsIcon, text: 'My Tables' },
    ],
  };

  const links = user ? roleLinks[user.role] || commonLinks : [];

  const sidebarClasses = `
    flex flex-col w-64 bg-white border-r border-slate-200
    fixed inset-y-0 left-0 z-40
    transform transition-transform duration-300 ease-in-out
    md:static md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  }

  return (
      <div className={sidebarClasses}>
        <div className="flex items-center justify-center h-20 border-b border-slate-200 flex-shrink-0">
          <h1 className="text-2xl font-bold text-primary">Halfplate</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
              onClick={() => setIsOpen(false)} // Close sidebar on link click on mobile
            >
              <link.icon className="w-6 h-6 mr-3" />
              {link.text}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <UserCircleIcon className="w-10 h-10 text-slate-400 flex-shrink-0"/>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-secondary truncate" title={user?.name}>{user?.name}</p>
              <p className="text-xs text-slate-600 truncate" title={user?.role}>{user?.role}</p>
            </div>
          </div>
          <a href="#/profile" onClick={() => setIsOpen(false)} className={`${navLinkClasses} ${inactiveClass} mb-2 w-full text-left`}>
            <UserCircleIcon className="w-6 h-6 mr-3" />
            My Profile
          </a>
          <button onClick={handleLogout} className={`w-full ${navLinkClasses} !text-red-600 hover:!bg-red-50`}>
            <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
            Logout
          </button>
        </div>
      </div>
  );
};

export default Sidebar;
