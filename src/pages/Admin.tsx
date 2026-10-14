import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import UserManagement from '../components/admin/UserManagement';
import VehicleManagement from '../components/admin/VehicleManagement';
import CmsManagement from '../components/admin/CmsManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import AdminLoginForm from '../components/admin/AdminLoginForm';
import AdminProfileSection from '../components/admin/AdminProfileSection';
import DashboardDetails from '../components/admin/DashboardDetails';
import { AdminUser, AdminVehicle, AdminRole, AdminUserStatus, VehicleStatusType } from '../types/admin';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  TrendingUp, 
  Car, 
  Users, 
  MessageSquare, 
  Plus, 
  AlertCircle,
  Calendar,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { user, userData, logout } = useAuth();

  // Custom local admin auth state
  const [isLocalAdminAuthenticated, setIsLocalAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('vintage_admin_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Custom admin profile details
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('vintage_admin_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          parsed.password = 'Qwerty@9876';
          localStorage.setItem('vintage_admin_profile', JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    const defaultProfile = {
      name: 'Admin',
      email: 'admin@vintagemarket.com',
      mobile: '+1 (555) 0199',
      password: 'Qwerty@9876'
    };
    try {
      localStorage.setItem('vintage_admin_profile', JSON.stringify(defaultProfile));
    } catch (e) {
      // ignore
    }
    return defaultProfile;
  });

  const handleSaveProfile = (updatedProfile: typeof adminProfile) => {
    setAdminProfile(updatedProfile);
    try {
      localStorage.setItem('vintage_admin_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      // ignore
    }
  };

  const handleAdminLogout = () => {
    setIsLocalAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('vintage_admin_authenticated');
    } catch (e) {
      // ignore
    }
    window.location.href = '/';
  };

  // Active module state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeDetail, setActiveDetail] = useState<'valuation' | 'inventory' | 'profiles' | 'warnings' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Clear active sub-view when tab switches
  useEffect(() => {
    setActiveDetail(null);
  }, [activeTab]);

  // Synced dynamic state for alerts & listings shared among components
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);

  // Fetch initial data for counts and dashboards
  useEffect(() => {
    if (!isLocalAdminAuthenticated) return;

    const loadInitialData = async () => {
      // 1. Load Users with granular exception safety
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const fbUsers: AdminUser[] = [];
        usersSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fbUsers.push({
            id: docSnap.id,
            name: data.displayName || 'Unknown Member',
            email: data.email || '',
            role: (data.role === 'admin' ? 'Super Admin' : (data.role || 'Buyer')) as AdminRole,
            registrationDate: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '2026-06-15',
            status: (data.status || 'Active') as AdminUserStatus,
            avatar: data.photoURL || undefined
          });
        });

        if (fbUsers.length === 0) {
          const defaultUsers: AdminUser[] = [
            { id: 'usr-1', name: 'Alexander Sterling', email: 'sterling@vintagemarket.com', role: 'Super Admin', registrationDate: '2026-01-10', status: 'Active' },
            { id: 'usr-2', name: 'Sophia Loren', email: 'sophia@classicrides.it', role: 'Seller', registrationDate: '2026-06-21', status: 'Pending' },
            { id: 'usr-3', name: 'Marcus Aurelius', email: 'marcus@stoicgarages.org', role: 'Buyer', registrationDate: '2026-05-15', status: 'Active' },
            { id: 'usr-4', name: 'Eleanor Vance', email: 'eleanor@vancerestoration.net', role: 'Seller', registrationDate: '2026-06-22', status: 'Pending' },
            { id: 'usr-5', name: 'Gavin Newsom', email: 'gnewsom@californiapreserve.com', role: 'Moderator', registrationDate: '2026-03-02', status: 'Active' },
            { id: 'usr-6', name: 'David Beckham', email: 'db7@legendarygear.co.uk', role: 'Buyer', registrationDate: '2026-04-18', status: 'Blocked' },
            { id: 'usr-7', name: 'Clara Oswald', email: 'clara@tardisvintage.com', role: 'Seller', registrationDate: '2026-06-20', status: 'Active' },
          ];
          setUsers(defaultUsers);
        } else {
          setUsers(fbUsers);
        }
      } catch (err) {
        console.warn("Lacking Firestore permissions for entire user list or fetch failed. Gracefully falling back to default user profiles.", err);
        const defaultUsers: AdminUser[] = [
          { id: 'usr-1', name: 'Alexander Sterling', email: 'sterling@vintagemarket.com', role: 'Super Admin', registrationDate: '2026-01-10', status: 'Active' },
          { id: 'usr-2', name: 'Sophia Loren', email: 'sophia@classicrides.it', role: 'Seller', registrationDate: '2026-06-21', status: 'Pending' },
          { id: 'usr-3', name: 'Marcus Aurelius', email: 'marcus@stoicgarages.org', role: 'Buyer', registrationDate: '2026-05-15', status: 'Active' },
          { id: 'usr-4', name: 'Eleanor Vance', email: 'eleanor@vancerestoration.net', role: 'Seller', registrationDate: '2026-06-22', status: 'Pending' },
          { id: 'usr-5', name: 'Gavin Newsom', email: 'gnewsom@californiapreserve.com', role: 'Moderator', registrationDate: '2026-03-02', status: 'Active' },
          { id: 'usr-6', name: 'David Beckham', email: 'db7@legendarygear.co.uk', role: 'Buyer', registrationDate: '2026-04-18', status: 'Blocked' },
          { id: 'usr-7', name: 'Clara Oswald', email: 'clara@tardisvintage.com', role: 'Seller', registrationDate: '2026-06-20', status: 'Active' },
        ];
        setUsers(defaultUsers);
      }

      // 2. Load Vehicles with granular exception safety
      try {
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        const fbVehicles: AdminVehicle[] = [];
        vehiclesSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fbVehicles.push({
            id: docSnap.id,
            name: data.name || 'Unknown Antique',
            make: data.make || data.name?.split(' ')[1] || 'Unknown',
            model: data.model || data.name?.split(' ').slice(2).join(' ') || 'Unknown',
            year: Number(data.year) || 1960,
            basePrice: Number(data.price) || 0,
            discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : undefined,
            category: data.category || 'Classic Cars',
            status: (data.status || 'available') as VehicleStatusType,
            image: data.image || '',
            gallery: data.gallery || [],
            ownerId: data.ownerId || 'admin',
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '2026-06-10'
          });
        });

        if (fbVehicles.length === 0) {
          const defaultVehicles: AdminVehicle[] = [
            { id: 'v-1', name: '1961 Jaguar E-Type Series I Roadster', make: 'Jaguar', model: 'E-Type Series I Roadster', year: 1961, basePrice: 145000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-2', name: '1954 Mercedes-Benz 300SL Gullwing', make: 'Mercedes-Benz', model: '300SL Gullwing', year: 1954, basePrice: 1850000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-3', name: '1967 Ford Mustang Eleanor', make: 'Ford', model: 'Mustang Eleanor', year: 1967, basePrice: 280000, discountedPrice: 260000, category: 'Classic Cars', status: 'pending', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-4', name: '1973 Porsche 911 Carrera RS 2.7', make: 'Porsche', model: '911 Carrera RS 2.7', year: 1973, basePrice: 520000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-5', name: '1963 Aston Martin DB5', make: 'Aston Martin', model: 'DB5', year: 1963, basePrice: 980000, category: 'Classic Cars', status: 'sold', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-6', name: '1970 Chevrolet Chevelle SS 454', make: 'Chevrolet', model: 'Chevelle SS 454', year: 1970, basePrice: 120000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-7', name: '1948 Indian Chief Vintage Cruiser', make: 'Indian', model: 'Chief Vintage Cruiser', year: 1948, basePrice: 38000, category: 'Vintage Bikes', status: 'available', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
            { id: 'v-8', name: '1959 Chevrolet Apache 3100 pickup', make: 'Chevrolet', model: 'Apache 3100 pickup', year: 1959, basePrice: 48000, discountedPrice: 42000, category: 'Antique Trucks', status: 'available', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          ];
          setVehicles(defaultVehicles);
        } else {
          setVehicles(fbVehicles);
        }
      } catch (err) {
        console.warn("Lacking Firestore permissions for entire vehicle list or fetch failed. Gracefully falling back to default retro inventory.", err);
        const defaultVehicles: AdminVehicle[] = [
          { id: 'v-1', name: '1961 Jaguar E-Type Series I Roadster', make: 'Jaguar', model: 'E-Type Series I Roadster', year: 1961, basePrice: 145000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-2', name: '1954 Mercedes-Benz 300SL Gullwing', make: 'Mercedes-Benz', model: '300SL Gullwing', year: 1954, basePrice: 1850000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-3', name: '1967 Ford Mustang Eleanor', make: 'Ford', model: 'Mustang Eleanor', year: 1967, basePrice: 280000, discountedPrice: 260000, category: 'Classic Cars', status: 'pending', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-4', name: '1973 Porsche 911 Carrera RS 2.7', make: 'Porsche', model: '911 Carrera RS 2.7', year: 1973, basePrice: 520000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-5', name: '1963 Aston Martin DB5', make: 'Aston Martin', model: 'DB5', year: 1963, basePrice: 980000, category: 'Classic Cars', status: 'sold', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-6', name: '1970 Chevrolet Chevelle SS 454', make: 'Chevrolet', model: 'Chevelle SS 454', year: 1970, basePrice: 120000, category: 'Classic Cars', status: 'available', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-7', name: '1948 Indian Chief Vintage Cruiser', make: 'Indian', model: 'Chief Vintage Cruiser', year: 1948, basePrice: 38000, category: 'Vintage Bikes', status: 'available', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
          { id: 'v-8', name: '1959 Chevrolet Apache 3100 pickup', make: 'Chevrolet', model: 'Apache 3100 pickup', year: 1959, basePrice: 48000, discountedPrice: 42000, category: 'Antique Trucks', status: 'available', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200', gallery: [], ownerId: 'admin', createdAt: '2026-06-10' },
        ];
        setVehicles(defaultVehicles);
      }
    };

    loadInitialData();
  }, [isLocalAdminAuthenticated]);

  // Alerts banner (Toast alerts)
  const [toastAlerts, setToastAlerts] = useState<Array<{ id: string; text: string }>>([]);

  const addToast = (text: string) => {
    const id = Date.now().toString();
    setToastAlerts(prev => [...prev, { id, text }]);
    // Add to notification alerts list
    setNotifications(prev => [
      { id, text, time: 'Just now', read: false },
      ...prev
    ]);
    setTimeout(() => {
      setToastAlerts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Header notifications state
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'New registration pending approval: Sophia Loren', time: '5m ago', read: false },
    { id: 'n-2', text: 'New vehicle listing posted: 1961 Jaguar E-Type', time: '1h ago', read: false },
    { id: 'n-3', text: 'Review flagged for moderation: James Bond', time: '2h ago', read: false }
  ]);

  const notificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Quick Action triggers from Header
  const [showAddVehicleNow, setShowAddVehicleNow] = useState(false);
  const [showAddCategoryNow, setShowAddCategoryNow] = useState(false);
  const [showAddBlogNow, setShowAddBlogNow] = useState(false);

  const handleQuickAdd = (type: 'vehicle' | 'blog' | 'category') => {
    if (type === 'vehicle') {
      setActiveTab('vehicles');
      setShowAddVehicleNow(true);
    } else if (type === 'blog') {
      setActiveTab('blogs');
      setShowAddBlogNow(true);
    } else if (type === 'category') {
      setActiveTab('categories');
      setShowAddCategoryNow(true);
    }
  };

  // Shared statistics derived from active arrays
  const stats = [
    {
      id: 'valuation' as const,
      label: 'Gross Platform Valuation',
      value: `$${vehicles.reduce((acc, curr) => acc + curr.basePrice, 0).toLocaleString()}`,
      change: 'View detailed asset audit report',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/25'
    },
    {
      id: 'inventory' as const,
      label: 'Registered Inventory',
      value: vehicles.length ? vehicles.length : 8,
      change: 'Audit live listings catalog',
      icon: Car,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/25'
    },
    {
      id: 'profiles' as const,
      label: 'Platform User Profiles',
      value: users.length ? users.length : 7,
      change: 'Review tiers, roles & status',
      icon: Users,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/25'
    },
    {
      id: 'warnings' as const,
      label: 'Flagged Content Warnings',
      value: 2,
      change: 'Access remediation queue',
      icon: MessageSquare,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/25'
    }
  ];

  // Render Login Panel if not authenticated (unconditional hook execution occurs before this point)
  if (!isLocalAdminAuthenticated) {
    return (
      <AdminLoginForm 
        expectedPassword={adminProfile.password}
        onSuccess={async () => {
          if (user) {
            try {
              await logout();
            } catch (err) {
              console.error(err);
            }
          }
          setIsLocalAdminAuthenticated(true);
          try {
            sessionStorage.setItem('vintage_admin_authenticated', 'true');
          } catch (e) {
            // ignore
          }
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        
        {/* Header Console */}
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onQuickAdd={handleQuickAdd}
          notificationsCount={notificationsCount}
          notifications={notifications}
          onMarkNotificationsRead={markNotificationsRead}
          adminProfile={adminProfile}
          onAdminLogout={handleAdminLogout}
        />

        {/* Workspace body scrollable */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-thin">
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {activeDetail ? (
                  <DashboardDetails
                    type={activeDetail}
                    vehicles={vehicles}
                    setVehicles={setVehicles}
                    users={users}
                    setUsers={setUsers}
                    onAddAlert={addToast}
                    onBack={() => setActiveDetail(null)}
                  />
                ) : (
                  <>
                    {/* Stats summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setActiveDetail(stat.id)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="space-y-1 pr-2">
                              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block group-hover:text-[#d02326] transition-colors">{stat.label}</span>
                              <span className="text-2xl font-bold font-serif text-gray-900 dark:text-white block">{stat.value}</span>
                              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium block">{stat.change}</span>
                              <span className="text-[9px] text-[#d02326] font-bold block opacity-0 group-hover:opacity-100 transition-opacity mt-1">View Report &rarr;</span>
                            </div>
                            <div className={`p-4 rounded-2xl shrink-0 transition-all duration-300 group-hover:rotate-6 ${stat.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Growth Chart & Quick Activities Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Visual Platform metrics Growth Curve Chart */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                          <div>
                            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Collector Sales Growth Index</h3>
                            <p className="text-xs text-gray-400">Aggregated valuation trend curve for luxury retro assets.</p>
                          </div>
                          <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                            Target Met
                          </span>
                        </div>

                        {/* SVG Curve Graph representation */}
                        <div className="h-64 relative w-full pt-4">
                          <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d02326" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#d02326" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Horizontal gridlines */}
                            <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-gray-100 dark:text-gray-850" strokeDasharray="5,5" />
                            <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-gray-100 dark:text-gray-850" strokeDasharray="5,5" />
                            <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-gray-100 dark:text-gray-850" strokeDasharray="5,5" />
                            
                            {/* Shaded Area fill */}
                            <path 
                              d="M 0,200 L 0,160 Q 100,120 180,140 T 320,60 T 500,30 L 500,200 Z" 
                              fill="url(#chartGrad)" 
                            />
                            {/* Main Curve Line */}
                            <path 
                              d="M 0,160 Q 100,120 180,140 T 320,60 T 500,30" 
                              fill="none" 
                              stroke="#d02326" 
                              strokeWidth="3.5" 
                              strokeLinecap="round"
                            />
                            
                            {/* Data point indicators */}
                            <circle cx="180" cy="140" r="5" fill="#d02326" stroke="white" strokeWidth="2" />
                            <circle cx="320" cy="60" r="5" fill="#d02326" stroke="white" strokeWidth="2" />
                            <circle cx="500" cy="30" r="5" fill="#d02326" stroke="white" strokeWidth="2" />
                          </svg>
                          <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2 uppercase tracking-wider">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun (Active)</span>
                          </div>
                        </div>
                      </div>

                      {/* System Activity log column */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4">
                        <div className="border-b border-gray-150 pb-3">
                          <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Admin Operations Log</h3>
                          <p className="text-xs text-gray-400">Recent activities performed across CMS.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex gap-3 text-xs">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Approved Subscriber</p>
                              <span className="text-[10px] text-gray-400 font-mono">Just now | Gordon Ramsay</span>
                            </div>
                          </div>
                          <div className="flex gap-3 text-xs">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Published Editorial blog post</p>
                              <span className="text-[10px] text-gray-400 font-mono">2 hours ago | Alistair Green</span>
                            </div>
                          </div>
                          <div className="flex gap-3 text-xs">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Registered listing: Aston Martin</p>
                              <span className="text-[10px] text-gray-400 font-mono">1 day ago | Super Admin</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UserManagement users={users} setUsers={setUsers} onAddAlert={addToast} />
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div key="vehicles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <VehicleManagement 
                  vehicles={vehicles} 
                  setVehicles={setVehicles} 
                  onAddAlert={addToast} 
                  showAddFormNow={showAddVehicleNow}
                  setShowAddFormNow={setShowAddVehicleNow}
                />
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CmsManagement 
                  initialSubTab="categories" 
                  onAddAlert={addToast} 
                  showAddCategoryNow={showAddCategoryNow}
                  setShowAddCategoryNow={setShowAddCategoryNow}
                  showAddBlogNow={showAddBlogNow}
                  setShowAddBlogNow={setShowAddBlogNow}
                />
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CmsManagement 
                  initialSubTab="media" 
                  onAddAlert={addToast} 
                  showAddCategoryNow={showAddCategoryNow}
                  setShowAddCategoryNow={setShowAddCategoryNow}
                  showAddBlogNow={showAddBlogNow}
                  setShowAddBlogNow={setShowAddBlogNow}
                />
              </motion.div>
            )}

            {activeTab === 'blogs' && (
              <motion.div key="blogs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CmsManagement 
                  initialSubTab="blogs" 
                  onAddAlert={addToast} 
                  showAddCategoryNow={showAddCategoryNow}
                  setShowAddCategoryNow={setShowAddCategoryNow}
                  showAddBlogNow={showAddBlogNow}
                  setShowAddBlogNow={setShowAddBlogNow}
                />
              </motion.div>
            )}

            {activeTab === 'newsletters' && (
              <motion.div key="newsletters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CmsManagement 
                  initialSubTab="newsletters" 
                  onAddAlert={addToast} 
                  showAddCategoryNow={showAddCategoryNow}
                  setShowAddCategoryNow={setShowAddCategoryNow}
                  showAddBlogNow={showAddBlogNow}
                  setShowAddBlogNow={setShowAddBlogNow}
                />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ReviewModeration onAddAlert={addToast} />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdminProfileSection 
                  profile={adminProfile} 
                  onSave={handleSaveProfile} 
                  onAddAlert={addToast} 
                />
              </motion.div>
            )}
          </AnimatePresence>

        </main>

      </div>

      {/* Floating System Notification Toast Alerts Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toastAlerts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-2xl shadow-2xl flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1 text-xs font-medium">
                <p className="text-white">Admin System Broadcast</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">{toast.text}</p>
              </div>
              <button 
                onClick={() => setToastAlerts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
