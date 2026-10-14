import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Plus, ChevronDown, User, LogOut, FileText, FolderPlus, ShieldAlert, Car } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onQuickAdd: (type: 'vehicle' | 'blog' | 'category') => void;
  notificationsCount: number;
  notifications: Array<{ id: string; text: string; time: string; read: boolean }>;
  onMarkNotificationsRead: () => void;
  adminProfile?: { name: string; email: string };
  onAdminLogout?: () => void;
}

export default function AdminHeader({ 
  sidebarOpen, 
  setSidebarOpen, 
  onQuickAdd,
  notificationsCount,
  notifications,
  onMarkNotificationsRead,
  adminProfile,
  onAdminLogout
}: HeaderProps) {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (addRef.current && !addRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      
      {/* Left: Mobile Toggle & Welcome */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <h1 className="text-lg font-bold font-serif text-gray-900 dark:text-white">Control Center</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {adminProfile?.name || userData?.displayName || 'Administrator'}</p>
        </div>
      </div>

      {/* Right: Quick Action Dropdown, Notification icon, and Admin profile details */}
      <div className="flex items-center gap-4">
        
        {/* Quick Add Dropdown */}
        <div className="relative" ref={addRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 bg-[#d02326] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#b21c1e] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showAddMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-40 overflow-hidden"
              >
                <button
                  onClick={() => { onQuickAdd('vehicle'); setShowAddMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                >
                  <Car className="w-4 h-4 text-emerald-500" />
                  <span>New Vehicle Listing</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('blog'); setShowAddMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>New Blog Draft</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('category'); setShowAddMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                >
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span>New Category</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                onMarkNotificationsRead();
              }
            }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#d02326] text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                {notificationsCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-40"
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-gray-800 dark:text-white uppercase tracking-wider">System Alerts</h3>
                  <span className="text-[10px] bg-red-100 text-[#d02326] px-1.5 py-0.5 rounded-full font-bold">
                    {notifications.length} Info
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No new alerts. Your system is optimal.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 flex gap-2.5 transition-colors ${
                          !notif.read ? 'bg-amber-50/40 dark:bg-amber-500/5' : ''
                        }`}
                      >
                        <ShieldAlert className="w-4.5 h-4.5 text-[#d02326] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-750 dark:text-gray-200 font-medium">{notif.text}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 hidden sm:block" />

        {/* User Admin Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left cursor-pointer"
          >
            {userData?.photoURL && !adminProfile ? (
              <img src={userData.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-serif uppercase">
                {(adminProfile?.name || userData?.displayName || 'A').charAt(0)}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{adminProfile?.name || userData?.displayName || 'Administrator'}</p>
              <span className="text-[10px] text-gray-400 font-medium leading-none">{adminProfile ? 'Console Admin' : 'Super User'}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1.5 z-40 overflow-hidden"
              >
                <Link
                  to="/dashboard"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>My Vintage Dashboard</span>
                </Link>
                <div className="border-t border-gray-150 dark:border-gray-700 my-1" />
                <button
                  onClick={() => {
                    if (onAdminLogout) {
                      onAdminLogout();
                    } else {
                      logout();
                      navigate('/');
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Platform</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
