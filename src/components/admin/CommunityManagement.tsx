import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Trash2, 
  Search, 
  Filter, 
  MessageSquare, 
  Flame, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  X, 
  Ban, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Clock,
  MapPin,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityMember } from '../../types/admin';
import { ForumThread } from '../../data/forumData';
import { 
  getStoredThreads, 
  saveStoredThreads, 
  getBlockedUsers, 
  blockCommunityUser, 
  unblockCommunityUser, 
  removeCommunityUser, 
  deleteCommunityThread, 
  deleteCommunityReply, 
  extractCommunityMembers,
  THREADS_STORAGE_KEY
} from '../../utils/communityModeration';

interface CommunityManagementProps {
  onAddAlert: (text: string) => void;
}

export default function CommunityManagement({ onAddAlert }: CommunityManagementProps) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'threads' | 'blocked'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [badgeFilter, setBadgeFilter] = useState<string>('All');

  // Modals state
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockTargetUser, setBlockTargetUser] = useState<CommunityMember | null>(null);
  const [blockReason, setBlockReason] = useState('Commercial spam & promotional links');
  const [customReason, setCustomReason] = useState('');

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removeTargetUser, setRemoveTargetUser] = useState<CommunityMember | null>(null);
  const [purgeUserContent, setPurgeUserContent] = useState(true);

  // Sorting
  const [sortField, setSortField] = useState<keyof CommunityMember>('threadsCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load threads & members
  const refreshData = () => {
    const loadedThreads = getStoredThreads();
    setThreads(loadedThreads);
    const loadedMembers = extractCommunityMembers(loadedThreads);
    setMembers(loadedMembers);
  };

  useEffect(() => {
    refreshData();

    // Listen to updates broadcasted from Community page or other admin actions
    const handleUpdate = () => {
      refreshData();
    };
    window.addEventListener('iaf_community_updated', handleUpdate);
    return () => {
      window.removeEventListener('iaf_community_updated', handleUpdate);
    };
  }, []);

  // Quick stats
  const totalMembersCount = members.length;
  const blockedMembersCount = members.filter(m => m.status === 'Blocked').length;
  const activeMembersCount = totalMembersCount - blockedMembersCount;
  const totalThreadsCount = threads.length;
  const totalRepliesCount = threads.reduce((acc, t) => acc + (t.replies ? t.replies.length : 0), 0);

  // Actions
  const handleOpenBlockModal = (member: CommunityMember) => {
    setBlockTargetUser(member);
    setBlockReason('Commercial spam & promotional links');
    setCustomReason('');
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = () => {
    if (!blockTargetUser) return;
    const finalReason = blockReason === 'Other' && customReason.trim() ? customReason.trim() : blockReason;
    blockCommunityUser(blockTargetUser.name, finalReason, 'Super Admin');
    onAddAlert(`Community member "${blockTargetUser.name}" has been BLOCKED. Posting privileges suspended.`);
    setIsBlockModalOpen(false);
    setBlockTargetUser(null);
    refreshData();
  };

  const handleUnblockUser = (name: string) => {
    unblockCommunityUser(name);
    onAddAlert(`Community member "${name}" has been UNBLOCKED. Full posting rights restored.`);
    refreshData();
  };

  const handleOpenRemoveModal = (member: CommunityMember) => {
    setRemoveTargetUser(member);
    setPurgeUserContent(true);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!removeTargetUser) return;
    removeCommunityUser(removeTargetUser.name, purgeUserContent);
    onAddAlert(`Member "${removeTargetUser.name}" has been REMOVED from the community.${purgeUserContent ? ' All associated posts were purged.' : ''}`);
    setIsRemoveModalOpen(false);
    setRemoveTargetUser(null);
    refreshData();
  };

  const handleDeleteThread = (threadId: string, threadTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete this discussion?\n\n"${threadTitle}"`)) return;
    deleteCommunityThread(threadId);
    onAddAlert(`Discussion thread "${threadTitle}" removed.`);
    refreshData();
  };

  const handleDeleteReply = (threadId: string, replyId: string) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    deleteCommunityReply(threadId, replyId);
    onAddAlert('Forum reply removed.');
    refreshData();
  };

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesBadge = badgeFilter === 'All' || m.badge === badgeFilter;
    return matchesSearch && matchesStatus && matchesBadge;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal || '');
    const bStr = String(bVal || '');
    return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  const handleSort = (field: keyof CommunityMember) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const commonReasons = [
    'Commercial spam & promotional links',
    'Abusive language & personal harassment',
    'Fabricated ownership claim or mileage claims',
    'Fake on-road price quotes & dealership scamming',
    'Repeated off-topic derailment of threads',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-red-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Community Governance Console</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              Community Moderation & User Control
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Full administrator rights to monitor discussion threads, remove or suspend disruptive users, purge malicious posts, and safeguard Indian Auto Forum integrity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={refreshData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Registry</span>
            </button>
            <a
              href="/community"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Forum &rarr;</span>
            </a>
          </div>
        </div>

        {/* Community KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Total Members</span>
            <span className="text-2xl font-bold font-serif text-white mt-1 block">{totalMembersCount}</span>
            <span className="text-[10px] text-emerald-400 mt-1 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {activeMembersCount} Active
            </span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Blocked / Suspended</span>
            <span className="text-2xl font-bold font-serif text-red-400 mt-1 block">{blockedMembersCount}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Zero tolerance policy</span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Active Discussions</span>
            <span className="text-2xl font-bold font-serif text-white mt-1 block">{totalThreadsCount}</span>
            <span className="text-[10px] text-blue-400 mt-1 block">Owner reviews & logs</span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Replies & Answers</span>
            <span className="text-2xl font-bold font-serif text-white mt-1 block">{totalRepliesCount}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Across all categories</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2">
        <button
          onClick={() => setActiveSubTab('members')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeSubTab === 'members'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Community Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('threads')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeSubTab === 'threads'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussions & Threads ({threads.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('blocked')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeSubTab === 'blocked'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Ban className="w-4 h-4 text-red-500" />
          <span>Blocked Registry ({blockedMembersCount})</span>
        </button>
      </div>

      {/* SUB-TAB 1: MEMBERS DIRECTORY & MODERATION */}
      {activeSubTab === 'members' && (
        <div className="space-y-4">
          {/* Controls: Search, Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member by name, city, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Blocked">Blocked Only</option>
                </select>
              </div>

              {/* Badge Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400 font-medium">Badge:</span>
                <select
                  value={badgeFilter}
                  onChange={e => setBadgeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200"
                >
                  <option value="All">All Badges</option>
                  <option value="Verified Owner">Verified Owner</option>
                  <option value="Senior Contributor">Senior Contributor</option>
                  <option value="Forum Veteran">Forum Veteran</option>
                  <option value="Community Moderator">Community Moderator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-850 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-4 px-6">Member Profile</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-red-500" onClick={() => handleSort('city')}>
                      Location
                    </th>
                    <th className="py-4 px-4">Badge / Tier</th>
                    <th className="py-4 px-4 text-center cursor-pointer hover:text-red-500" onClick={() => handleSort('threadsCount')}>
                      Discussions
                    </th>
                    <th className="py-4 px-4 text-center cursor-pointer hover:text-red-500" onClick={() => handleSort('repliesCount')}>
                      Replies
                    </th>
                    <th className="py-4 px-4 text-center">Forum Status</th>
                    <th className="py-4 px-6 text-right">Admin Moderation Rights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                  {sortedMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                        No community members matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    sortedMembers.map(member => {
                      const isBlocked = member.status === 'Blocked';
                      return (
                        <tr 
                          key={member.id} 
                          className={`hover:bg-gray-50/80 dark:hover:bg-gray-850/40 transition-colors ${
                            isBlocked ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                          }`}
                        >
                          {/* Member Profile */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                                    {member.name}
                                  </span>
                                  {isBlocked && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                                      Suspended
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-400 block">{member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@user`}</span>
                              </div>
                            </div>
                          </td>

                          {/* City */}
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{member.city}</span>
                            </div>
                          </td>

                          {/* Badge */}
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                              <ShieldCheck className="w-3 h-3 text-red-500" />
                              {member.badge}
                            </span>
                          </td>

                          {/* Threads count */}
                          <td className="py-4 px-4 text-center font-bold text-gray-900 dark:text-white">
                            {member.threadsCount}
                          </td>

                          {/* Replies count */}
                          <td className="py-4 px-4 text-center font-bold text-gray-900 dark:text-white">
                            {member.repliesCount}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            {isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                                <Ban className="w-3 h-3" />
                                Blocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>

                          {/* Admin Rights: Block / Unblock / Remove */}
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Block / Unblock Button */}
                              {isBlocked ? (
                                <button
                                  onClick={() => handleUnblockUser(member.name)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                                  title="Unblock this user and restore community posting rights"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Unblock</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenBlockModal(member)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition"
                                  title="Block this user from creating discussions or replies"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Block User</span>
                                </button>
                              )}

                              {/* Remove / Purge User Button */}
                              <button
                                onClick={() => handleOpenRemoveModal(member)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 dark:border-red-900/50 text-xs font-semibold transition"
                                title="Permanently remove user and optionally purge all their posts"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: THREADS & DISCUSSIONS MODERATION */}
      {activeSubTab === 'threads' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              All Active Discussions ({threads.length})
            </h3>
            <span className="text-xs text-gray-400">
              Directly remove inappropriate discussions or block offending authors.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {threads.map(thread => {
              const isAuthorBlocked = members.some(m => m.name.toLowerCase() === thread.author.toLowerCase() && m.status === 'Blocked');
              return (
                <div 
                  key={thread.id}
                  className={`bg-white dark:bg-gray-900 p-5 rounded-2xl border transition-all ${
                    isAuthorBlocked 
                      ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10' 
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                          {thread.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {thread.brand} • {thread.model}
                        </span>
                        {isAuthorBlocked && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white flex items-center gap-1">
                            <Ban className="w-3 h-3" /> Author Blocked
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {thread.title}
                      </h4>

                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          Author: {thread.author} ({thread.authorCity})
                        </span>
                        <span>•</span>
                        <span>Posted: {thread.createdAt}</span>
                        <span>•</span>
                        <span>{thread.upvotes} Upvotes</span>
                        <span>•</span>
                        <span>{thread.replies?.length || 0} Replies</span>
                        <span>•</span>
                        <span>{thread.views} Views</span>
                      </div>
                    </div>

                    {/* Admin Action Bar on Thread */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-150 dark:border-gray-800">
                      {isAuthorBlocked ? (
                        <button
                          onClick={() => handleUnblockUser(thread.author)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Unblock {thread.author}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const found = members.find(m => m.name.toLowerCase() === thread.author.toLowerCase()) || {
                              id: 'dyn',
                              name: thread.author,
                              city: thread.authorCity,
                              badge: thread.authorBadge,
                              joinedDate: '2026',
                              status: 'Active',
                              threadsCount: 1,
                              repliesCount: 0
                            };
                            handleOpenBlockModal(found);
                          }}
                          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Block Author</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteThread(thread.id, thread.title)}
                        className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Thread</span>
                      </button>
                    </div>
                  </div>

                  {/* Replies Preview & Quick Delete */}
                  {thread.replies && thread.replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Discussion Replies ({thread.replies.length}):
                      </span>
                      <div className="space-y-2">
                        {thread.replies.slice(0, 3).map(reply => (
                          <div 
                            key={reply.id} 
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-xs"
                          >
                            <div className="flex-1 truncate">
                              <span className="font-bold text-gray-800 dark:text-gray-200 mr-2">{reply.author}:</span>
                              <span className="text-gray-500 dark:text-gray-400">{reply.content}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  const found = members.find(m => m.name.toLowerCase() === reply.author.toLowerCase()) || {
                                    id: 'dyn',
                                    name: reply.author,
                                    city: reply.authorCity,
                                    badge: reply.authorBadge,
                                    joinedDate: '2026',
                                    status: 'Active',
                                    threadsCount: 0,
                                    repliesCount: 1
                                  };
                                  handleOpenBlockModal(found);
                                }}
                                className="text-[10px] text-amber-500 hover:underline font-semibold"
                              >
                                Block
                              </button>
                              <button
                                onClick={() => handleDeleteReply(thread.id, reply.id)}
                                className="text-[10px] text-red-500 hover:text-red-600 font-semibold flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BLOCKED REGISTRY */}
      {activeSubTab === 'blocked' && (
        <div className="space-y-4">
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Active Community Sanctions & Blocklist</span>
            </div>
            <p className="text-xs text-red-600/80 dark:text-red-300/80 mt-1">
              Users on this list are barred from creating discussions or commenting in the Indian Auto Forum. Admins can restore access at any time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {members.filter(m => m.status === 'Blocked').length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">No Users Currently Blocked</p>
                <p className="text-xs text-gray-400">The community is free of active restrictions.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {members.filter(m => m.status === 'Blocked').map(blocked => (
                  <div key={blocked.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={blocked.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt={blocked.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-400 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-base">{blocked.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                            Blocked
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {blocked.city} • Joined {blocked.joinedDate}
                        </p>
                        <div className="mt-2 text-xs bg-red-100/60 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg">
                          <span className="font-semibold">Reason:</span> {blocked.blockedReason || 'Violation of community guidelines'}
                          {blocked.blockedAt && <span className="ml-2 text-red-500 text-[10px]">({blocked.blockedAt})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUnblockUser(blocked.name)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Unblock User</span>
                      </button>
                      <button
                        onClick={() => handleOpenRemoveModal(blocked)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Purge from Community</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: BLOCK USER CONFIRMATION & REASON */}
      <AnimatePresence>
        {isBlockModalOpen && blockTargetUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                      Block Community Member
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Restrict posting & reply privileges in the forum
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBlockModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target user info */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                  src={blockTargetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={blockTargetUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{blockTargetUser.name}</p>
                  <p className="text-xs text-gray-400">{blockTargetUser.city} • {blockTargetUser.badge}</p>
                </div>
              </div>

              {/* Select Reason */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Select Violation Reason:
                </label>
                <div className="space-y-2">
                  {commonReasons.map((reason) => (
                    <label 
                      key={reason}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        blockReason === reason 
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-gray-900 dark:text-white font-semibold' 
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="blockReason"
                        checked={blockReason === reason}
                        onChange={() => setBlockReason(reason)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                {blockReason === 'Other' && (
                  <textarea
                    rows={2}
                    placeholder="Enter custom sanction reason..."
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-gray-800">
                <button
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBlock}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-900/20 transition flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  <span>Confirm Block User</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: REMOVE USER FROM COMMUNITY */}
      <AnimatePresence>
        {isRemoveModalOpen && removeTargetUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                      Remove User from Community
                    </h3>
                    <p className="text-xs text-red-500 font-medium">
                      Permanent deletion of community presence
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 space-y-2">
                <p className="font-bold">Are you sure you want to remove {removeTargetUser.name}?</p>
                <p>
                  This will ban this member profile from the forum and revoke community participation.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={purgeUserContent}
                    onChange={e => setPurgeUserContent(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 dark:text-white block">
                      Purge All User Content (Recommended)
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Immediately deletes all discussion threads, ratings, and replies authored by {removeTargetUser.name}.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-gray-800">
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-900/20 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Remove User</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
