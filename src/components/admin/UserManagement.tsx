import React, { useState, useEffect } from 'react';
import { 
  AdminUser, 
  AdminRole, 
  AdminUserStatus 
} from '../../types/admin';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  UserX, 
  Edit2, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Shield,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { blockCommunityUser, unblockCommunityUser, removeCommunityUser } from '../../utils/communityModeration';

interface UserManagementProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  onAddAlert: (text: string) => void;
}

export default function UserManagement({ users, setUsers, onAddAlert }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof AdminUser>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Detail Modal & Edit Modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const roles: (AdminRole | 'All')[] = ['All', 'Super Admin', 'Moderator', 'Buyer', 'Seller'];
  const statuses: (AdminUserStatus | 'All')[] = ['All', 'Active', 'Pending', 'Blocked'];

  // Load registered users from firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fbUsers: AdminUser[] = [];
      querySnapshot.forEach((docSnap) => {
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

      // If no users exist, populate with beautiful defaults
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
      console.warn("Firestore user query failed or offline. Using local default admin profiles.", err);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sort & Filter Logic
  const handleSort = (field: keyof AdminUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal as string) 
        : (bVal as string).localeCompare(aVal);
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Actions
  const handleApprove = async (id: string, name: string) => {
    try {
      // Local state update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Active' } : u));
      // Firestore update if it exists
      try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, { status: 'Active' });
      } catch (e) {
        // Safe to ignore if mock user is handled
      }
      onAddAlert(`Membership approved for: ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Blocked' } : u));
      try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, { status: 'Blocked' });
      } catch (e) {}
      onAddAlert(`Membership rejected for: ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockToggle = async (id: string, currentStatus: AdminUserStatus, name: string) => {
    const nextStatus: AdminUserStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
    try {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, { status: nextStatus });
      } catch (e) {}

      // Synchronize community posting rights
      if (nextStatus === 'Blocked') {
        blockCommunityUser(name, 'Account suspended by Admin via RBAC User Management', 'Super Admin');
      } else {
        unblockCommunityUser(name);
      }

      onAddAlert(`User ${name} has been ${nextStatus === 'Blocked' ? 'Blocked/Suspended' : 'Unblocked'}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${name}? This action is permanent.`)) return;
    try {
      setUsers(prev => prev.filter(u => u.id !== id));
      try {
        const userRef = doc(db, 'users', id);
        await deleteDoc(userRef);
      } catch (e) {}

      // Also remove from community
      removeCommunityUser(name, true);

      onAddAlert(`Permanently deleted profile: ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setUsers(prev => prev.map(u => u.id === editUser.id ? editUser : u));
      try {
        const userRef = doc(db, 'users', editUser.id);
        await updateDoc(userRef, { 
          role: editUser.role === 'Super Admin' ? 'admin' : 'user',
          status: editUser.status 
        });
      } catch (e) {}
      setIsEditOpen(false);
      onAddAlert(`Successfully updated privileges for ${editUser.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Pending Registrations Queue (Approval Area) */}
      {users.some(u => u.status === 'Pending') && (
        <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Pending Registrations Approval Queue</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.filter(u => u.status === 'Pending').map(pendingUser => (
              <motion.div 
                layoutId={`pending-card-${pendingUser.id}`}
                key={pendingUser.id}
                className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      {pendingUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">{pendingUser.name}</h3>
                      <p className="text-[10px] text-gray-500 font-mono">{pendingUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                      Role: {pendingUser.role}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      Joined: {pendingUser.registrationDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-3 mt-1">
                  <button 
                    onClick={() => handleApprove(pendingUser.id, pendingUser.name)}
                    className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(pendingUser.id, pendingUser.name)}
                    className="flex-1 flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Table Controls (Search, Filter, Reset) */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#d02326]/25 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Role:</span>
              <select
                value={selectedRole}
                onChange={e => { setSelectedRole(e.target.value); setCurrentPage(1); }}
                className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button 
              onClick={fetchUsers}
              title="Refresh profiles"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-850 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-150 dark:border-gray-800">
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Name <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1">
                    Email <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-1">
                    Role <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none" onClick={() => handleSort('registrationDate')}>
                  <div className="flex items-center gap-1">
                    Registered <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-xs">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No users matching the filters found.
                  </td>
                </tr>
              ) : (
                currentItems.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/25 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">{u.email}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.role === 'Super Admin' ? 'bg-red-50 text-red-700 dark:bg-red-950/25 dark:text-red-400' :
                        u.role === 'Moderator' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/25 dark:text-indigo-400' :
                        u.role === 'Seller' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-[11px]">{u.registrationDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        u.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-500' :
                          u.status === 'Pending' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Details */}
                        <button
                          onClick={() => { setSelectedUser(u); setIsDetailOpen(true); }}
                          title="View Details"
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#d02326] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Role */}
                        <button
                          onClick={() => { setEditUser(u); setIsEditOpen(true); }}
                          title="Edit Role & Privileges"
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Suspend/Unsuspend */}
                        <button
                          onClick={() => handleBlockToggle(u.id, u.status, u.name)}
                          title={u.status === 'Blocked' ? 'Activate User' : 'Suspend User'}
                          className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer ${
                            u.status === 'Blocked' 
                              ? 'text-emerald-500 hover:text-emerald-600' 
                              : 'text-amber-500 hover:text-amber-600'
                          }`}
                        >
                          {u.status === 'Blocked' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>

                        {/* Delete Permanently */}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Delete Account"
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(indexOfLastItem, sortedUsers.length)}</span> of <span className="font-semibold text-gray-800 dark:text-gray-200">{sortedUsers.length}</span> members
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-[#d02326] border-[#d02326] text-white shadow'
                      : 'border-gray-250 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* User Detail Slideover / Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between"
              >
                <div className="p-6 overflow-y-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-white">Profile Details</h3>
                    <button onClick={() => setIsDetailOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-3xl mx-auto shadow-inner">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{selectedUser.name}</h4>
                      <p className="text-xs text-gray-400 font-mono">{selectedUser.email}</p>
                    </div>
                    <span className="inline-block bg-[#d02326] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedUser.role}
                    </span>
                  </div>

                  <div className="border-t border-gray-150 dark:border-gray-850 pt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Unique ID</span>
                        <span className="font-mono text-[11px] text-gray-800 dark:text-gray-200">{selectedUser.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block">Member Status</span>
                        <span className={`font-semibold ${selectedUser.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block">Registration Date</span>
                        <span className="text-gray-800 dark:text-gray-200 font-mono">{selectedUser.registrationDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block">Platform Access</span>
                        <span className="text-gray-800 dark:text-gray-200">Standard / Web Console</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl space-y-2 border border-gray-100 dark:border-gray-800">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Activity Stats</h5>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800">
                          <span className="font-bold block text-gray-900 dark:text-white">12</span>
                          <span className="text-[9px] text-gray-500 uppercase">Listings</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800">
                          <span className="font-bold block text-gray-900 dark:text-white">4</span>
                          <span className="text-[9px] text-gray-500 uppercase">Offers</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800">
                          <span className="font-bold block text-gray-900 dark:text-white">98%</span>
                          <span className="text-[9px] text-gray-500 uppercase">Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                  <button 
                    onClick={() => { setIsDetailOpen(false); setEditUser(selectedUser); setIsEditOpen(true); }}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Modify Access Role
                  </button>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="flex-1 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-350 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Close Slider
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {isEditOpen && editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-md w-full rounded-3xl overflow-hidden shadow-2xl z-10 p-6 space-y-5"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Modify Security Role & Status</h3>
                <p className="text-[11px] text-gray-400 mt-1">Configure role levels and workspace states for {editUser.name}.</p>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Access Role Level</label>
                  <select
                    value={editUser.role}
                    onChange={e => setEditUser({ ...editUser, role: e.target.value as AdminRole })}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value="Super Admin">Super Admin (Full Root Permissions)</option>
                    <option value="Moderator">Moderator (Review and Support)</option>
                    <option value="Seller">Seller (Inventory and Catalog Access)</option>
                    <option value="Buyer">Buyer (Standard Customer Level)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Workspace Status</label>
                  <select
                    value={editUser.status}
                    onChange={e => setEditUser({ ...editUser, status: e.target.value as AdminUserStatus })}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value="Active">Active (Permitted State)</option>
                    <option value="Pending">Pending Approval (Restricted State)</option>
                    <option value="Blocked">Blocked/Suspended (Deauthorized)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-150 dark:border-gray-800 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#d02326] text-white rounded-xl font-bold hover:bg-red-700 transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
