import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Settings,
  Target,
  LogOut,
  Hexagon,
  User,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface DashboardLayoutProps {
  pageTitle?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tighter text-black flex items-center gap-2 font-sans">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <Hexagon size={18} className="text-white fill-current" />
          </div>
          Esprit
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active={isActive('/dashboard') && !isActive('/dashboard/pentest')}
          onClick={() => navigate('/dashboard')}
        />
        <SidebarItem
          icon={<Target size={18} />}
          label="Pentest"
          active={isActive('/dashboard/pentest')}
          onClick={() => navigate('/dashboard/pentest')}
        />
        <SidebarItem
          icon={<ShieldAlert size={18} />}
          label="Scans"
          active={isActive('/dashboard/scans') || isActive('/dashboard/vulnerabilities')}
          onClick={() => navigate('/dashboard/scans')}
        />
        <SidebarItem
          icon={<FileText size={18} />}
          label="Billing"
          active={isActive('/dashboard/billing')}
          onClick={() => navigate('/dashboard/billing')}
        />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={isActive('/dashboard/settings')}
          onClick={() => navigate('/dashboard/settings')}
        />
        <div className="mt-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-black hover:bg-gray-50 w-full rounded transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-mono text-xs uppercase tracking-widest font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded transition-all duration-200 group ${
      active
        ? 'bg-black text-white shadow-md shadow-gray-200'
        : 'text-gray-500 hover:text-black hover:bg-gray-50'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
      {icon}
    </span>
    <span className="font-mono text-xs uppercase tracking-widest font-medium">{label}</span>
  </button>
);

// User profile dropdown component
const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split('@')[0] || 'User';
  };

  // Plan badge color
  const getPlanBadge = () => {
    const plan = profile?.plan || 'free';
    const colors = {
      free: 'bg-gray-100 text-gray-600',
      pro: 'bg-orange-100 text-orange-600',
      team: 'bg-purple-100 text-purple-600',
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
            <span className="font-mono text-xs">{getInitials()}</span>
          </div>
        )}
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
          {/* User info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <span className="font-mono text-sm">{getInitials()}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{getDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${getPlanBadge()}`}>
                {profile?.plan || 'free'} plan
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => { navigate('/dashboard/settings'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => { navigate('/dashboard/billing'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard size={16} />
              <span>Billing & Plans</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ pageTitle }) => {
  const location = useLocation();

  // Determine page title from route
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    if (location.pathname.includes('/pentest')) return 'Pentest';
    if (location.pathname.includes('/vulnerabilities')) return 'Vulnerabilities';
    if (location.pathname.includes('/reports')) return 'Reports';
    if (location.pathname.includes('/settings')) return 'Settings';
    if (location.pathname.includes('/billing')) return 'Billing';
    return 'Main Dashboard';
  };

  return (
    <div className="max-w-[1440px] mx-auto flex min-h-screen bg-[#f9f9f9] text-gray-900 selection:bg-orange-100 selection:text-orange-900 border-x border-white shadow-2xl">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden overflow-y-auto relative bg-[#f9f9f9]">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#f9f9f9]/90 backdrop-blur-md border-b border-gray-200 px-6 lg:px-8 py-4 flex justify-between items-center h-[72px]">
          <div>
             <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Workspace / <span className="text-black font-medium">{getPageTitle()}</span></h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative text-gray-500 hover:text-black transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#f9f9f9]"></span>
              </button>
              <UserDropdown />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

