import React from 'react';
import { 
  Users, 
  Car, 
  Layers, 
  Image, 
  BookOpen, 
  Mail, 
  MessageSquare, 
  LayoutDashboard, 
  X,
  Gauge,
  User,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import logoImg from '../../assets/images/vintage_guru_logo_1782245578578.jpg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard },
    { id: 'users', label: 'Users & Access (RBAC)', icon: Users },
    { id: 'vehicles', label: 'Vehicles Inventory', icon: Car },
    { id: 'categories', label: 'CMS: Categories', icon: Layers },
    { id: 'media', label: 'CMS: Media Library', icon: Image },
    { id: 'blogs', label: 'CMS: Blogs', icon: BookOpen },
    { id: 'newsletters', label: 'CMS: Newsletters', icon: Mail },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'profile', label: 'Admin Profile Settings', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-100 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-850 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="VintageGuru Logo" 
              className="w-10 h-10 object-contain rounded-lg border border-slate-800" 
              referrerPolicy="no-referrer" 
            />
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white font-serif">VintageGuru</h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative group cursor-pointer ${
                  isActive 
                    ? 'bg-[#d02326] text-white shadow-lg shadow-[#d02326]/10 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/65'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                }`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {onLogout && (
          <div className="px-4 py-3 border-t border-slate-850/60">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/30 transition-all duration-200 cursor-pointer group"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-transform duration-200" />
              <span>Log Out Console</span>
            </button>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-850 bg-slate-950 text-xs text-slate-500 font-mono flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span>Server:</span>
            <span className="text-emerald-500 font-semibold uppercase animate-pulse">● Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version:</span>
            <span>v4.1.2-beta</span>
          </div>
        </div>
      </aside>
    </>
  );
}
