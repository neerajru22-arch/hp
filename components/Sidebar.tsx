import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon, ArchiveBoxIcon, BookOpenIcon, BanknotesIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ShareIcon } from './icons/Icons';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const navLinkClasses = 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors';
  const activeClass = 'bg-primary-50 text-primary';
  const inactiveClass = 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900';

  const commonLinks = [
    { to: '/dashboard', icon: ChartBarIcon, text: 'Dashboard' },
    { to: '/orders', icon: DocumentTextIcon, text: 'Orders' },
    { to: '/inventory', icon: ArchiveBoxIcon, text: 'Inventory' },
  ];

  const roleLinks = {
    [UserRole.RestaurantOwner]: [
      ...commonLinks,
      { to: '/recipes', icon: BookOpenIcon, text: 'Recipes' },
      { to: '/finance', icon: BanknotesIcon, text: 'Finance' },
    ],
    [UserRole.Admin]: [
      ...commonLinks,
      { to: '/finance', icon: BanknotesIcon, text: 'Finance' },
      { to: '/org-chart', icon: ShareIcon, text: 'Org Chart' },
    ],
    [UserRole.Chef]: [
      ...commonLinks,
      { to: '/recipes', icon: BookOpenIcon, text: 'Recipes' },
    ],
    // Default or other roles
    [UserRole.Procurement]: commonLinks,
    [UserRole.Vendor]: commonLinks.slice(0, 2), // Example: Vendor only sees Dashboard and Orders
  };

  const links = user ? roleLinks[user.role] || commonLinks : [];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-neutral-200">
      <div className="flex items-center justify-center h-20 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-primary">Halfplate</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <link.icon className="w-6 h-6 mr-3" />
            {link.text}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-neutral-200 space-y-2">
        <a href="#" className={`${navLinkClasses} ${inactiveClass}`}>
            <Cog6ToothIcon className="w-6 h-6 mr-3" />
            Settings
        </a>
        <a href="#" className={`${navLinkClasses} ${inactiveClass}`}>
            <QuestionMarkCircleIcon className="w-6 h-6 mr-3" />
            Support
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
