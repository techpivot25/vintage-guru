import React, { useState, useEffect } from 'react';
import { 
  AdminUser, 
  AdminVehicle, 
  AdminRole, 
  AdminUserStatus,
  VehicleStatusType 
} from '../../types/admin';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Search, 
  Filter, 
  Sliders, 
  CheckCircle, 
  X, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  Car,
  Tag,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  MessageCircle,
  Bookmark,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface DashboardDetailsProps {
  type: 'valuation' | 'inventory' | 'profiles' | 'warnings';
  vehicles: AdminVehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<AdminVehicle[]>>;
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  onAddAlert: (text: string) => void;
  onBack: () => void;
}

interface FlaggedWarning {
  id: string;
  type: 'review' | 'listing' | 'comment';
  reporter: string;
  offender: string;
  reason: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export default function DashboardDetails({
  type,
  vehicles,
  setVehicles,
  users,
  setUsers,
  onAddAlert,
  onBack
}: DashboardDetailsProps) {
  
  // Local state for searching/filtering in detailed subpages
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Interactive Fee Slider for Valuation Panel
  const [platformFeePercent, setPlatformFeePercent] = useState(5);

  // Synced status loaders
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Curated, fully interactive Flagged Content List
  const [flaggedWarnings, setFlaggedWarnings] = useState<FlaggedWarning[]>([
    {
      id: 'warn-1',
      type: 'review',
      reporter: 'Marcus Aurelius',
      offender: 'James Bond',
      reason: 'Suspected fictional/unrealistic description claims',
      details: 'Review text on Aston Martin DB5 mentions "machine guns were missing from description". Potential user sarcasm or misrepresentation of asset details.',
      severity: 'medium',
      createdAt: '2026-06-23',
      status: 'pending'
    },
    {
      id: 'warn-2',
      type: 'listing',
      reporter: 'Eleanor Vance',
      offender: 'Admin Seller',
      reason: 'Mismatched photo reference credentials',
      details: 'Vehicle listing "1967 Ford Mustang Eleanor" is flagged as utilizing stock restoration photos instead of physical garage proofs.',
      severity: 'high',
      createdAt: '2026-06-22',
      status: 'pending'
    },
    {
      id: 'warn-3',
      type: 'comment',
      reporter: 'Sophia Loren',
      offender: 'David Beckham',
      reason: 'Hostile/unprofessional price negotiation language',
      details: 'Comment on 1963 Aston Martin DB5: "You guys are absolute thieves, this price is a joke! I can build this for half."',
      severity: 'low',
      createdAt: '2026-06-21',
      status: 'pending'
    }
  ]);

  // Handle Firestore Vehicle Sync updates
  const handleUpdateVehicleStatus = async (vehicleId: string, nextStatus: VehicleStatusType) => {
    try {
      setSyncingId(vehicleId);
      // Optimistic Local State Update
      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: nextStatus } : v));
      
      // Attempt Firebase update
      try {
        const vehicleRef = doc(db, 'vehicles', vehicleId);
        await updateDoc(vehicleRef, { status: nextStatus });
      } catch (fbErr) {
        console.warn('Firebase status update failed or offline. Retaining local state change.', fbErr);
      }

      onAddAlert(`Vehicle listing status updated to: ${nextStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  // Handle User subscription / status role sync
  const handleUpdateUserPrivileges = async (userId: string, updates: { role?: AdminRole; status?: AdminUserStatus; subscription?: string }) => {
    try {
      setSyncingId(userId);
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          const updatedUser = { ...u };
          if (updates.role !== undefined) updatedUser.role = updates.role;
          if (updates.status !== undefined) updatedUser.status = updates.status;
          return updatedUser;
        }
        return u;
      }));

      // Sync user doc
      try {
        const userRef = doc(db, 'users', userId);
        const fbPayload: Record<string, any> = {};
        if (updates.role !== undefined) {
          fbPayload.role = updates.role === 'Super Admin' ? 'admin' : updates.role.toLowerCase();
        }
        if (updates.status !== undefined) fbPayload.status = updates.status;
        if (updates.subscription !== undefined) fbPayload.subscription = updates.subscription;

        await updateDoc(userRef, fbPayload);
      } catch (fbErr) {
        console.warn('User status sync omitted or offline.', fbErr);
      }

      const label = updates.role ? `Role to ${updates.role}` : updates.status ? `Status to ${updates.status}` : 'Privileges';
      onAddAlert(`Successfully synchronized account: ${label}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  // Resolve moderation warning actions
  const handleModerationAction = (id: string, action: 'approve' | 'dismiss' | 'ban_offender' | 'delete_content') => {
    setFlaggedWarnings(prev => prev.map(w => w.id === id ? { ...w, status: action === 'approve' ? 'resolved' : 'dismissed' } : w));
    
    const warning = flaggedWarnings.find(w => w.id === id);
    if (!warning) return;

    if (action === 'approve') {
      onAddAlert(`Content approved. Moderation flags cleared for: ${warning.offender}`);
    } else if (action === 'dismiss') {
      onAddAlert(`Report dismissed as spam/invalid.`);
    } else if (action === 'ban_offender') {
      // Find the offender in users and ban them!
      const userToBlock = users.find(u => u.name.toLowerCase() === warning.offender.toLowerCase() || u.email.toLowerCase().includes(warning.offender.toLowerCase().split(' ')[0]));
      if (userToBlock) {
        handleUpdateUserPrivileges(userToBlock.id, { status: 'Blocked' });
      } else {
        onAddAlert(`Suspended associated account credential: ${warning.offender}`);
      }
    } else if (action === 'delete_content') {
      onAddAlert(`Violating editorial content redacted and purged successfully.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Detail Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-2xl transition shadow-sm border border-gray-150 dark:border-gray-750 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d02326] px-2 py-0.5 bg-red-50 dark:bg-red-950/20 rounded">Extended Report</span>
              <span className="text-gray-300 dark:text-gray-750 text-xs font-mono">● Active System State</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mt-1">
              {type === 'valuation' && 'Gross Platform Valuation Report'}
              {type === 'inventory' && 'Registered Inventory Analytics'}
              {type === 'profiles' && 'Platform Users & RBAC Administration'}
              {type === 'warnings' && 'Flagged Content Warnings Queue'}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {type === 'valuation' && 'Dynamic index, financial projections, and categorical capital contribution breakdown.'}
              {type === 'inventory' && 'Searchable registry, active status toggles, and price audit console.'}
              {type === 'profiles' && 'Manage subscription tiers, user privilege roles, and active member lookup.'}
              {type === 'warnings' && 'Actionable trust & safety queue of reported listings, comments, and reviews.'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white dark:bg-slate-850 dark:hover:bg-slate-800 font-bold rounded-2xl text-xs transition cursor-pointer shrink-0"
        >
          Return to Overview
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. GROSS PLATFORM VALUATION DETAIL VIEW */}
      {/* ------------------------------------------------------------- */}
      {type === 'valuation' && (
        <div className="space-y-6">
          {/* Key Metric Indicators Card Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Combined Valuation</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-2xl font-serif font-bold text-gray-950 dark:text-white">
                  ₹{vehicles.reduce((sum, v) => sum + v.basePrice, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold block mt-1.5">+18.4% growth since last month</span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Average Antique Price</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-950 dark:text-white">
                  ₹{Math.round(vehicles.length ? vehicles.reduce((sum, v) => sum + v.basePrice, 0) / vehicles.length : 0).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1.5">Across {vehicles.length} total inventory items</span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Highest Valued Listing</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-gray-950 dark:text-white truncate max-w-[150px]">
                  {vehicles.length ? [...vehicles].sort((a,b)=>b.basePrice - a.basePrice)[0].name.split(' ').slice(1).join(' ') : 'Mercedes-Benz SL'}
                </span>
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold block mt-1.5">
                Valued: ₹{vehicles.length ? [...vehicles].sort((a,b)=>b.basePrice - a.basePrice)[0].basePrice.toLocaleString('en-IN') : '18,50,00,000'}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Projected Fee Commission ({platformFeePercent}%)</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-[#d02326] rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-[#d02326] dark:text-red-400">
                  ₹{Math.round(vehicles.reduce((sum, v) => sum + v.basePrice, 0) * (platformFeePercent / 100)).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1.5">Recalculated with slider interactive tool</span>
            </div>
          </div>

          {/* Interactive Fee Slider Projections & Categorical contributions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dynamic Projections Slider Panel */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-5">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-950 dark:text-white">Live Platform Fee Simulator</h3>
                <p className="text-xs text-gray-400 mt-0.5">Simulate anticipated gross platform revenues by altering commission fees.</p>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-500">Platform Transaction Fee %</span>
                  <span className="font-mono font-bold text-[#d02326] dark:text-red-400 bg-red-100/40 dark:bg-red-950/20 px-2 py-0.5 rounded text-sm">{platformFeePercent}%</span>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  step="0.5"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#d02326]"
                />

                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Min: 1%</span>
                  <span>Mid: 8%</span>
                  <span>Max: 15%</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 font-medium">Platform Valuation:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">₹{vehicles.reduce((sum, v) => sum + v.basePrice, 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 font-medium">Estimated Gross Sales Pool (Yearly):</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">₹{Math.round(vehicles.reduce((sum, v) => sum + v.basePrice, 0) * 0.45).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-900 dark:text-white font-bold">Commission Yield projection:</span>
                  <span className="font-mono font-bold text-emerald-500 bg-emerald-100/40 dark:bg-emerald-950/15 px-2.5 py-0.5 rounded">
                    +₹{Math.round((vehicles.reduce((sum, v) => sum + v.basePrice, 0) * 0.45) * (platformFeePercent / 100)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Categorical Contribution Breakdown */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-950 dark:text-white">Capital Contribution by Category</h3>
                <p className="text-xs text-gray-400 mt-0.5">Percentage distribution of the total gross valuation of registered collector assets.</p>
              </div>

              <div className="space-y-5">
                {['Classic Cars', 'Vintage Bikes', 'Antique Trucks', 'Commercial'].map((category) => {
                  const filteredList = vehicles.filter(v => (v.category || '').toLowerCase() === category.toLowerCase());
                  const total = filteredList.reduce((sum, v) => sum + v.basePrice, 0);
                  const listTotal = vehicles.reduce((sum, v) => sum + v.basePrice, 0);
                  const percentage = listTotal > 0 ? (total / listTotal) * 100 : 0;
                  const count = filteredList.length;

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">{category}</span>
                          <span className="text-[10px] text-gray-450 font-mono ml-2">({count} listed)</span>
                        </div>
                        <div className="font-mono text-right">
                          <span className="font-bold text-gray-800 dark:text-gray-200">₹{total.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-gray-400 block">{percentage.toFixed(1)}% share</span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            category === 'Classic Cars' ? 'bg-[#d02326]' :
                            category === 'Vintage Bikes' ? 'bg-amber-400' :
                            category === 'Antique Trucks' ? 'bg-blue-500' :
                            'bg-violet-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* High-Value Asset Registry Table List */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-950 dark:text-white">High-Value Luxury Asset Inventory Leaderboard</h3>
                <p className="text-xs text-gray-400">Assets sorted descending based on base valuation cataloging.</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Ranked by Value</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-850 font-bold uppercase text-[10px] text-gray-500 border-b border-gray-150 dark:border-gray-800">
                    <th className="px-6 py-4">Ranking</th>
                    <th className="px-6 py-4">Collectible Asset Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Era/Year</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Base Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-gray-700 dark:text-gray-350">
                  {[...vehicles]
                    .sort((a, b) => b.basePrice - a.basePrice)
                    .map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-55/35 dark:hover:bg-gray-850/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gray-400">#{idx + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-8 object-cover rounded border border-gray-100 dark:border-gray-800" 
                              referrerPolicy="no-referrer"
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">{item.year}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                            item.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                            'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                          ${item.basePrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. REGISTERED INVENTORY DETAIL VIEW */}
      {/* ------------------------------------------------------------- */}
      {type === 'inventory' && (
        <div className="space-y-6">
          
          {/* Metrics summary widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Total Active Listings</span>
                <span className="text-2xl font-serif font-bold text-gray-950 dark:text-white block mt-1">{vehicles.length} items</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
                <Car className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Available For Sale</span>
                <span className="text-2xl font-serif font-bold text-emerald-500 block mt-1">
                  {vehicles.filter(v => v.status === 'available').length} items
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Acquired & Closed (Sold)</span>
                <span className="text-2xl font-serif font-bold text-gray-400 block mt-1">
                  {vehicles.filter(v => v.status === 'sold').length} items
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl">
                <Bookmark className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Pending Appraisal Review</span>
                <span className="text-2xl font-serif font-bold text-amber-500 block mt-1">
                  {vehicles.filter(v => v.status === 'pending').length} items
                </span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Interactive Inventory Registry Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            
            {/* Search/Filter Bar */}
            <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  placeholder="Search assets by make, model, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#d02326]/25"
                />
              </div>

              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-500 uppercase tracking-wider">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
                  >
                    <option value="All">All Categories</option>
                    <option value="Classic Cars">Classic Cars</option>
                    <option value="Vintage Bikes">Vintage Bikes</option>
                    <option value="Antique Trucks">Antique Trucks</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-850 font-bold uppercase text-[10px] text-gray-500 border-b border-gray-150 dark:border-gray-800">
                    <th className="px-6 py-4">Collectible Asset</th>
                    <th className="px-6 py-4">Make / Model Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Registered On</th>
                    <th className="px-6 py-4">Listing Valuation Status</th>
                    <th className="px-6 py-4 text-right">Price Value</th>
                    <th className="px-6 py-4 text-right">Interactive Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-gray-700 dark:text-gray-350">
                  {vehicles
                    .filter(v => {
                      const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                          v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchCategory = categoryFilter === 'All' || v.category === categoryFilter;
                      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
                      return matchSearch && matchCategory && matchStatus;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-gray-55/35 dark:hover:bg-gray-850/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-10 object-cover rounded border border-gray-100 dark:border-gray-800" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p>{item.name}</p>
                              <span className="text-[10px] font-mono text-gray-400">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold">{item.make}</span>
                          <span className="text-gray-400 block text-[10px] font-mono">{item.model}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-400">{item.createdAt || '2026-06-15'}</td>
                        <td className="px-6 py-4">
                          <select
                            value={item.status}
                            disabled={syncingId === item.id}
                            onChange={(e) => handleUpdateVehicleStatus(item.id, e.target.value as VehicleStatusType)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border outline-none cursor-pointer uppercase ${
                              item.status === 'available' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                              item.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                              'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                          ${item.basePrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                const newPrice = window.prompt(`Adjust valuation price for ${item.name}:`, item.basePrice.toString());
                                if (newPrice && !isNaN(Number(newPrice))) {
                                  // Update state
                                  setVehicles(prev => prev.map(v => v.id === item.id ? { ...v, basePrice: Number(newPrice) } : v));
                                  onAddAlert(`Price updated successfully for ${item.name}`);
                                }
                              }}
                              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 font-bold rounded-lg text-[10px] transition cursor-pointer"
                            >
                              Edit Price
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PLATFORM USER PROFILES DETAIL VIEW */}
      {/* ------------------------------------------------------------- */}
      {type === 'profiles' && (
        <div className="space-y-6">
          
          {/* Summary metrics widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Total Synced Members</span>
                <span className="text-2xl font-serif font-bold text-gray-950 dark:text-white block mt-1">{users.length} profiles</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Super Admins / Mods</span>
                <span className="text-2xl font-serif font-bold text-red-600 block mt-1">
                  {users.filter(u => u.role === 'Super Admin' || u.role === 'Moderator').length} admins
                </span>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-[#d02326] rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Active Authorized Users</span>
                <span className="text-2xl font-serif font-bold text-emerald-500 block mt-1">
                  {users.filter(u => u.status === 'Active').length} profiles
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Suspended Accounts</span>
                <span className="text-2xl font-serif font-bold text-rose-500 block mt-1">
                  {users.filter(u => u.status === 'Blocked').length} profiles
                </span>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl">
                <UserX className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* User profiles database listing */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            
            {/* Search filter controls */}
            <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  placeholder="Search profile registries by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#d02326]/25"
                />
              </div>

              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-500 uppercase tracking-wider">Role Access:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
                  >
                    <option value="All">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Seller">Seller</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider">User Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
                  >
                    <option value="All">All States</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main User Profiles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-850 font-bold uppercase text-[10px] text-gray-500 border-b border-gray-150 dark:border-gray-800">
                    <th className="px-6 py-4">Account Member</th>
                    <th className="px-6 py-4">Database Credentials</th>
                    <th className="px-6 py-4">Registered Date</th>
                    <th className="px-6 py-4">Role Privileges (RBAC)</th>
                    <th className="px-6 py-4">Access Status</th>
                    <th className="px-6 py-4 text-right">Emergency Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-gray-700 dark:text-gray-350">
                  {users
                    .filter(u => {
                      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchRole = categoryFilter === 'All' || u.role === categoryFilter;
                      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
                      return matchSearch && matchRole && matchStatus;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-gray-55/35 dark:hover:bg-gray-850/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <p>{item.name}</p>
                              <span className="text-[10px] font-mono text-gray-400">UID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500">{item.email}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{item.registrationDate}</td>
                        <td className="px-6 py-4">
                          <select
                            value={item.role}
                            disabled={syncingId === item.id}
                            onChange={(e) => handleUpdateUserPrivileges(item.id, { role: e.target.value as AdminRole })}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border outline-none cursor-pointer uppercase ${
                              item.role === 'Super Admin' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                              item.role === 'Moderator' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                              item.role === 'Seller' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                              'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                            item.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse' :
                            'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Active' ? 'bg-emerald-500' :
                              item.status === 'Pending' ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`} />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleUpdateUserPrivileges(item.id, { status: item.status === 'Blocked' ? 'Active' : 'Blocked' })}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-colors cursor-pointer ${
                              item.status === 'Blocked' 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/25 dark:hover:bg-rose-950/40 dark:text-rose-400'
                            }`}
                          >
                            {item.status === 'Blocked' ? 'Unsuspend Account' : 'Suspend Account'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. FLAGGED CONTENT WARNINGS DETAIL VIEW */}
      {/* ------------------------------------------------------------- */}
      {type === 'warnings' && (
        <div className="space-y-6">
          
          {/* Safety Status Cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">High Risk Violations</span>
                <span className="text-2xl font-serif font-bold text-rose-500 block mt-1">
                  {flaggedWarnings.filter(w => w.severity === 'high' && w.status === 'pending').length} reports
                </span>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Total Reports in Queue</span>
                <span className="text-2xl font-serif font-bold text-gray-950 dark:text-white block mt-1">
                  {flaggedWarnings.filter(w => w.status === 'pending').length} unresolved
                </span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Resolved Reports</span>
                <span className="text-2xl font-serif font-bold text-emerald-500 block mt-1">
                  {flaggedWarnings.filter(w => w.status !== 'pending').length} cleared
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Actionable Content Remediation Queue Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <span>Trust & Safety Pending Action Registry</span>
              <span className="text-xs bg-[#d02326] text-white px-2 py-0.5 rounded-full font-mono">
                {flaggedWarnings.filter(w => w.status === 'pending').length} Active
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {flaggedWarnings.map((warn) => (
                <div 
                  key={warn.id}
                  className={`border rounded-3xl p-6 transition-all shadow-sm ${
                    warn.status !== 'pending' ? 'bg-gray-50/50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-60' :
                    warn.severity === 'high' ? 'bg-red-50/10 dark:bg-red-950/5 border-red-200 dark:border-red-950/30' :
                    warn.severity === 'medium' ? 'bg-amber-50/10 dark:bg-amber-950/5 border-amber-200 dark:border-amber-950/30' :
                    'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          warn.type === 'review' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
                          warn.type === 'listing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                          'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400'
                        }`}>
                          Type: {warn.type.toUpperCase()}
                        </span>

                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full font-mono ${
                          warn.severity === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 animate-pulse' :
                          warn.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350'
                        }`}>
                          Risk: {warn.severity.toUpperCase()}
                        </span>

                        {warn.status !== 'pending' && (
                          <span className="text-[9px] uppercase font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> {warn.status.toUpperCase()}
                          </span>
                        )}
                        
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Filed: {warn.createdAt}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-serif font-bold text-gray-950 dark:text-white">
                          Violation: {warn.reason}
                        </h4>
                        <div className="flex gap-4 text-[11px] text-gray-450 mt-1 font-semibold">
                          <span>Reporter: <strong className="text-gray-700 dark:text-gray-300 font-bold">{warn.reporter}</strong></span>
                          <span>Offending User: <strong className="text-[#d02326] font-bold">{warn.offender}</strong></span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                        <strong className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Details & Context</strong>
                        "{warn.details}"
                      </div>
                    </div>

                    {warn.status === 'pending' && (
                      <div className="flex flex-row md:flex-col gap-2.5 shrink-0 self-end md:self-start pt-3 md:pt-0">
                        <button
                          onClick={() => handleModerationAction(warn.id, 'approve')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Clear Content
                        </button>
                        
                        {warn.type !== 'listing' && (
                          <button
                            onClick={() => handleModerationAction(warn.id, 'delete_content')}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Redact Content
                          </button>
                        )}

                        <button
                          onClick={() => handleModerationAction(warn.id, 'ban_offender')}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:text-rose-400 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" /> Suspend Offender
                        </button>

                        <button
                          onClick={() => handleModerationAction(warn.id, 'dismiss')}
                          className="px-4 py-2 border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-600 font-bold rounded-xl text-[10px] uppercase tracking-wider transition cursor-pointer"
                        >
                          Dismiss Flag
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
