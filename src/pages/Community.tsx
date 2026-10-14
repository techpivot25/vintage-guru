import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Search, 
  PlusCircle, 
  Filter, 
  Car, 
  Bike, 
  Navigation, 
  DollarSign, 
  Sparkles, 
  Wrench, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  X, 
  Send, 
  Star, 
  AlertCircle,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  UserX,
  UserCheck,
  Trash2,
  Ban
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FORUM_CATEGORIES, 
  POPULAR_BRANDS, 
  INITIAL_THREADS, 
  REAL_PRICE_TICKER, 
  COMMUNITY_STATS, 
  ForumThread, 
  ForumReply 
} from '../data/forumData';
import { 
  getStoredThreads, 
  saveStoredThreads, 
  getBlockedUsers, 
  isUserBlocked, 
  blockCommunityUser, 
  unblockCommunityUser, 
  removeCommunityUser, 
  deleteCommunityThread, 
  deleteCommunityReply 
} from '../utils/communityModeration';

export default function Community() {
  const { user, userData } = useAuth();

  // Load threads and blocked users map from central community utility
  const [threads, setThreads] = useState<ForumThread[]>(() => getStoredThreads());
  const [blockedMap, setBlockedMap] = useState<Record<string, any>>(() => getBlockedUsers());
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Detect admin status
  const isAdmin = (() => {
    try {
      return (
        sessionStorage.getItem('vintage_admin_authenticated') === 'true' ||
        userData?.role === 'admin' ||
        user?.email === 'admin@vintagemarket.com'
      );
    } catch (e) {
      return false;
    }
  })();

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Synchronize with any updates made elsewhere (e.g. Admin Console)
  useEffect(() => {
    const handleUpdate = () => {
      setThreads(getStoredThreads());
      setBlockedMap(getBlockedUsers());
    };
    window.addEventListener('iaf_community_updated', handleUpdate);
    return () => {
      window.removeEventListener('iaf_community_updated', handleUpdate);
    };
  }, []);

  // Filters and search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'hot' | 'upvotes' | 'views'>('recent');

  // Modals state
  const [isStartThreadOpen, setIsStartThreadOpen] = useState(false);
  const [activeThreadModal, setActiveThreadModal] = useState<ForumThread | null>(null);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('Car Ownership Review');
  const [newBrand, setNewBrand] = useState('Tata');
  const [newModel, setNewModel] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [authorName, setAuthorName] = useState(userData?.displayName || 'AutoEnthusiast');
  const [authorCity, setAuthorCity] = useState('Mumbai, MH');

  // Category specific inputs
  const [kmDriven, setKmDriven] = useState<number>(15000);
  const [mileage, setMileage] = useState('14.2 kmpl');
  const [rating, setRating] = useState<number>(4);
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid'>('Petrol');
  const [prosText, setProsText] = useState('Superb ride quality, Great high-speed stability');
  const [consText, setConsText] = useState('City fuel economy drops in heavy traffic');

  const [tripRoute, setTripRoute] = useState('Bengaluru to Goa via Shimoga');
  const [tripDistance, setTripDistance] = useState<number>(580);
  const [tripDays, setTripDays] = useState<number>(4);
  const [tripFuelCost, setTripFuelCost] = useState('₹ 6,800');
  const [tripTollCost, setTripTollCost] = useState('₹ 640');

  const [priceCity, setPriceCity] = useState('Delhi NCR');
  const [priceVariant, setPriceVariant] = useState('Top Model Automatic');
  const [priceExShowroom, setPriceExShowroom] = useState('₹ 15,40,000');
  const [priceDiscount, setPriceDiscount] = useState('₹ 45,000');
  const [priceFinalOnRoad, setPriceFinalOnRoad] = useState('₹ 17,20,000');

  // Reply Form State inside Reader Modal
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(userData?.displayName || 'AutoEnthusiast');
  const [replyCity, setReplyCity] = useState('Bengaluru, KA');
  const [copiedToast, setCopiedToast] = useState(false);

  // Update current user info when auth updates
  useEffect(() => {
    if (userData?.displayName) {
      setAuthorName(userData.displayName);
      setReplyAuthor(userData.displayName);
    }
  }, [userData]);

  // Handle Upvote Thread
  const handleToggleUpvote = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = threads.map(t => {
      if (t.id === threadId) {
        const isUpvoted = !t.isUpvoted;
        const upvotes = isUpvoted ? t.upvotes + 1 : Math.max(0, t.upvotes - 1);
        return { ...t, isUpvoted, upvotes };
      }
      return t;
    });
    setThreads(updated);
    saveStoredThreads(updated);
    if (activeThreadModal && activeThreadModal.id === threadId) {
      setActiveThreadModal(prev => {
        if (!prev) return null;
        const isUpvoted = !prev.isUpvoted;
        const upvotes = isUpvoted ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1);
        return { ...prev, isUpvoted, upvotes };
      });
    }
  };

  // Handle Bookmark Thread
  const handleToggleBookmark = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = threads.map(t => {
      if (t.id === threadId) {
        return { ...t, isBookmarked: !t.isBookmarked };
      }
      return t;
    });
    setThreads(updated);
    saveStoredThreads(updated);
    if (activeThreadModal && activeThreadModal.id === threadId) {
      setActiveThreadModal(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  };

  // Handle Share Thread
  const handleShareThread = (thread: ForumThread, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `/community#${thread.id}`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Admin moderation handlers directly in Community
  const handleAdminBlockUser = (targetAuthor: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    const isCurrentlyBlocked = isUserBlocked(targetAuthor);
    if (isCurrentlyBlocked) {
      unblockCommunityUser(targetAuthor);
      showAdminToast(`Restored community posting privileges for "${targetAuthor}".`);
    } else {
      const reason = window.prompt(`Enter suspension reason for "${targetAuthor}":`, 'Violation of community moderation guidelines');
      if (reason !== null) {
        blockCommunityUser(targetAuthor, reason.trim() || 'Moderator action', 'Super Admin');
        showAdminToast(`Community member "${targetAuthor}" has been BLOCKED.`);
      }
    }
  };

  const handleAdminRemoveUser = (targetAuthor: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to permanently remove user "${targetAuthor}" from the community? All their threads and replies will be purged.`)) {
      removeCommunityUser(targetAuthor, true);
      showAdminToast(`Permanently removed user "${targetAuthor}" and purged all associated discussions.`);
      if (activeThreadModal && activeThreadModal.author.toLowerCase() === targetAuthor.toLowerCase()) {
        setActiveThreadModal(null);
      }
    }
  };

  const handleAdminDeleteThread = (threadId: string, threadTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm(`Admin: Permanently delete discussion "${threadTitle}"?`)) {
      deleteCommunityThread(threadId);
      showAdminToast(`Discussion thread "${threadTitle}" removed.`);
      if (activeThreadModal && activeThreadModal.id === threadId) {
        setActiveThreadModal(null);
      }
    }
  };

  const handleAdminDeleteReply = (threadId: string, replyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm('Admin: Delete this community reply?')) {
      deleteCommunityReply(threadId, replyId);
      if (activeThreadModal && activeThreadModal.id === threadId) {
        setActiveThreadModal(prev => prev ? {
          ...prev,
          replies: prev.replies.filter(r => r.id !== replyId)
        } : null);
      }
      showAdminToast('Reply deleted by Administrator.');
    }
  };

  // Handle Submit Reply
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadModal) return;

    if (isUserBlocked(replyAuthor)) {
      alert(`Account Restricted: The user "${replyAuthor}" is currently blocked by forum administrators from submitting replies.`);
      return;
    }

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: replyAuthor.trim() || 'Fellow Enthusiast',
      authorBadge: 'Senior Contributor',
      authorCity: replyCity.trim() || 'India',
      avatar: userData?.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      content: replyText.trim(),
      createdAt: 'Just now',
      upvotes: 1
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadModal.id) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    saveStoredThreads(updatedThreads);
    setActiveThreadModal(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : null);
    setReplyText('');
  };

  // Handle Submit New Thread
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out the thread title and discussion content.');
      return;
    }

    if (isUserBlocked(authorName)) {
      alert(`Account Restricted: The user "${authorName}" is currently blocked by forum administrators and cannot post new threads.`);
      return;
    }

    const tagArray = newTags
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(Boolean);

    const created: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      brand: newBrand,
      model: newModel.trim() || `${newBrand} Vehicle`,
      author: authorName.trim() || 'Auto Enthusiast',
      authorBadge: 'Verified Owner',
      authorCity: authorCity.trim() || 'India',
      avatar: userData?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      views: 12,
      upvotes: 1,
      isHot: true,
      tags: tagArray.length > 0 ? tagArray : [newBrand, 'CommunityReview'],
      content: newContent.trim(),
      replies: []
    };

    // Attach specific metadata based on category
    if (newCategory === 'Car Ownership Review' || newCategory === 'Bike Ownership Review') {
      created.ownershipDetails = {
        kmDriven: Number(kmDriven) || 5000,
        mileage: mileage || '15 kmpl',
        rating: rating,
        fuelType: fuelType,
        pros: prosText.split(',').map(s => s.trim()).filter(Boolean),
        cons: consText.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (newCategory === 'No-BS Trip Reports') {
      created.tripDetails = {
        route: tripRoute,
        distanceKm: Number(tripDistance) || 450,
        durationDays: Number(tripDays) || 2,
        fuelCost: tripFuelCost || '₹ 4,500',
        tollCost: tripTollCost || '₹ 450',
        roadCondition: 'Mixed Country Roads',
        highlight: 'Scenic ghat passes and smooth highway stretches'
      };
    } else if (newCategory === 'Real On-Road Prices') {
      created.priceReportDetails = {
        city: priceCity,
        variant: priceVariant,
        exShowroom: priceExShowroom,
        rtoTax: 'Included in quote',
        insurance: 'Third-party price matched',
        dealerDiscount: priceDiscount,
        finalOnRoad: priceFinalOnRoad,
        waitingPeriod: 'Immediate delivery'
      };
    }

    const updated = [created, ...threads];
    setThreads(updated);
    saveStoredThreads(updated);
    setIsStartThreadOpen(false);
    // Reset inputs
    setNewTitle('');
    setNewModel('');
    setNewContent('');
    setNewTags('');
    // Open new thread directly in modal for user feedback
    setActiveThreadModal(created);
  };

  // Filter threads
  const filteredThreads = threads.filter(thread => {
    // Category filter
    if (selectedCategory === 'hot') {
      if (!thread.isHot && thread.replies.length < 2 && thread.upvotes < 50) return false;
    } else if (selectedCategory === 'car-ownership') {
      if (thread.category !== 'Car Ownership Review') return false;
    } else if (selectedCategory === 'bike-ownership') {
      if (thread.category !== 'Bike Ownership Review') return false;
    } else if (selectedCategory === 'trip-reports') {
      if (thread.category !== 'No-BS Trip Reports') return false;
    } else if (selectedCategory === 'price-reports') {
      if (thread.category !== 'Real On-Road Prices') return false;
    } else if (selectedCategory === 'advice') {
      if (thread.category !== 'What Car Next / Advice') return false;
    } else if (selectedCategory === 'technical') {
      if (thread.category !== 'Technical & DIY') return false;
    }

    // Brand filter
    if (selectedBrand !== 'All Brands' && thread.brand !== selectedBrand) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = thread.title.toLowerCase().includes(q);
      const matchContent = thread.content.toLowerCase().includes(q);
      const matchAuthor = thread.author.toLowerCase().includes(q);
      const matchModel = thread.model.toLowerCase().includes(q);
      const matchTags = thread.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchAuthor && !matchModel && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Sort threads
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortBy === 'hot') {
      return (b.replies.length * 2 + b.upvotes) - (a.replies.length * 2 + a.upvotes);
    }
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    if (sortBy === 'views') {
      return b.views - a.views;
    }
    // recent default
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-16">
      
      {/* Admin Broadcast Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-800 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-xs font-semibold">{adminToast}</span>
        </div>
      )}

      {/* Thread Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold">Thread link copied to clipboard!</span>
        </div>
      )}

      {/* Admin Moderation Mode Top Banner */}
      {isAdmin && (
        <div className="bg-slate-950 text-white border-b border-red-900/60 px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Admin Moderation Active:
              </span>
              <span className="text-xs text-slate-300 hidden md:inline">
                You have full rights to remove or block any user and purge discussions in the community.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="/admin"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-900/40"
              >
                <span>Community Moderation Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Suspended User Warning Banner */}
      {!isAdmin && isUserBlocked(authorName) && (
        <div className="bg-red-700 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Ban className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Community Access Suspended</span>
              <span>An administrator has restricted your posting privileges in Indian Auto Forum. Starting discussions and posting replies are currently disabled.</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header & Value Props - Indian Auto Forum Style */}
      <section className="bg-gradient-to-r from-red-800 via-[#d02326] to-red-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-red-900 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm mb-3">
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                India&apos;s Automotive Community &amp; Forum
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                Indian Auto Enthusiasts Forum
              </h1>
              <p className="text-red-100 text-sm sm:text-base leading-relaxed">
                100% Real Owner Reviews, No-BS Highway Trip Reports, Transparent On-Road Invoices &amp; Advice from real motorists across 28 Indian states.
              </p>
            </div>

            {/* Quick Community Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-center px-2">
                <span className="block text-xl font-black text-white">{COMMUNITY_STATS.activeMembers}</span>
                <span className="text-[11px] font-medium text-red-100 uppercase tracking-wider">Members</span>
              </div>
              <div className="text-center px-2 border-l border-white/20">
                <span className="block text-xl font-black text-white">{COMMUNITY_STATS.totalDiscussions}</span>
                <span className="text-[11px] font-medium text-red-100 uppercase tracking-wider">Threads</span>
              </div>
              <div className="text-center px-2 border-l border-white/20">
                <span className="block text-xl font-black text-white">{COMMUNITY_STATS.totalReplies}</span>
                <span className="text-[11px] font-medium text-red-100 uppercase tracking-wider">Replies</span>
              </div>
              <div className="text-center px-2 border-l border-white/20">
                <span className="block text-xl font-black text-yellow-300">28 States</span>
                <span className="text-[11px] font-medium text-red-100 uppercase tracking-wider">Crew Across India</span>
              </div>
            </div>
          </div>

          {/* Interactive Search & Start a Thread Action Row */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics, car/bike models, travel routes, or user reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl text-sm font-medium shadow-inner outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-200 dark:border-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsStartThreadOpen(true)}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-5 h-5" />
              Start a Thread
            </button>
          </div>
        </div>
      </section>

      {/* Main Forum Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Category Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 hide-scrollbar border-b border-gray-200 dark:border-gray-800">
          {FORUM_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[var(--color-brand-red)] text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat.id === 'hot' && <Flame className="w-4 h-4 text-orange-400 animate-pulse" />}
                {cat.id === 'car-ownership' && <Car className="w-4 h-4 text-blue-500" />}
                {cat.id === 'bike-ownership' && <Bike className="w-4 h-4 text-emerald-500" />}
                {cat.id === 'trip-reports' && <Navigation className="w-4 h-4 text-purple-500" />}
                {cat.id === 'price-reports' && <DollarSign className="w-4 h-4 text-amber-500" />}
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Brand Filter Row & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Brands:
            </span>
            {POPULAR_BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-[var(--color-brand-red)]"
            >
              <option value="recent">Latest Discussions</option>
              <option value="hot">🔥 Hot / Most Active</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Discussions List (Left) + Forum Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
          
          {/* Threads Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {sortedThreads.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No discussions match your filters</h3>
                <p className="text-sm text-gray-500 mb-6">Try searching for a different keyword or start a new thread to kick off this topic!</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedBrand('All Brands'); setSearchQuery(''); }}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 mr-2"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsStartThreadOpen(true)}
                  className="bg-[var(--color-brand-red)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Start a Thread
                </button>
              </div>
            ) : (
              sortedThreads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadModal(thread)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[var(--color-brand-red)] dark:hover:border-[var(--color-brand-red)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category, Brand, Hot badge, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[var(--color-brand-red)] dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                          {thread.category}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {thread.brand}
                        </span>
                        {thread.isHot && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Hot
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {thread.createdAt}
                      </span>
                    </div>

                    {/* Thread Title */}
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-[var(--color-brand-red)] transition-colors leading-snug mb-2">
                      {thread.title}
                    </h2>

                    {/* Snippet / Category specific preview tags */}
                    {thread.ownershipDetails && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                          🛣️ {thread.ownershipDetails.kmDriven.toLocaleString()} km clocked
                        </span>
                        <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                          ⛽ {thread.ownershipDetails.mileage}
                        </span>
                        <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {thread.ownershipDetails.rating}/5 Rating
                        </span>
                      </div>
                    )}

                    {thread.tripDetails && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                          📍 {thread.tripDetails.route}
                        </span>
                        <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {thread.tripDetails.distanceKm} km • {thread.tripDetails.durationDays} Days
                        </span>
                        <span className="text-xs font-semibold bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                          Fuel: {thread.tripDetails.fuelCost}
                        </span>
                      </div>
                    )}

                    {thread.priceReportDetails && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                          🏙️ {thread.priceReportDetails.city}
                        </span>
                        <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                          On-Road: {thread.priceReportDetails.finalOnRoad}
                        </span>
                        <span className="text-xs font-semibold bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                          Discount: {thread.priceReportDetails.dealerDiscount}
                        </span>
                      </div>
                    )}

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {thread.content}
                    </p>
                  </div>

                  {/* Bottom Row: Author details + Metrics + Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={thread.avatar}
                        alt={thread.author}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{thread.author}</span>
                          {isUserBlocked(thread.author) ? (
                            <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                              <Ban className="w-2.5 h-2.5" /> Suspended
                            </span>
                          ) : (
                            <span className="text-[10px] bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> {thread.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">{thread.authorCity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <span className="hidden sm:inline-block">
                        {thread.views.toLocaleString()} views
                      </span>

                      <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        {thread.replies.length} replies
                      </span>

                      {/* Interactive Upvote Pill */}
                      <button
                        onClick={(e) => handleToggleUpvote(thread.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          thread.isUpvoted
                            ? 'bg-red-50 text-[var(--color-brand-red)] border-red-200 dark:bg-red-950 dark:border-red-900'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                        title="Upvote thread"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${thread.isUpvoted ? 'fill-[var(--color-brand-red)]' : ''}`} />
                        <span>{thread.upvotes}</span>
                      </button>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => handleToggleBookmark(thread.id, e)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          thread.isBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950 dark:border-amber-900'
                            : 'text-gray-400 hover:text-gray-600 border-transparent hover:border-gray-200'
                        }`}
                        title="Save discussion"
                      >
                        <Bookmark className={`w-4 h-4 ${thread.isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>

                      {/* Share Icon */}
                      <button
                        onClick={(e) => handleShareThread(thread, e)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        title="Share link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Admin Fast Moderation Strip on Feed Card */}
                    {isAdmin && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full mt-3 pt-2.5 border-t border-red-200 dark:border-red-900/50 flex items-center justify-between text-xs bg-red-50/60 dark:bg-red-950/20 px-3 py-1.5 rounded-xl flex-wrap gap-2"
                      >
                        <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Admin Control:</span>
                          <span className="font-normal text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{thread.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleAdminBlockUser(thread.author, e)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                              isUserBlocked(thread.author)
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                            title="Block or unblock user from community"
                          >
                            {isUserBlocked(thread.author) ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            <span>{isUserBlocked(thread.author) ? 'Unblock' : 'Block Author'}</span>
                          </button>
                          <button
                            onClick={(e) => handleAdminDeleteThread(thread.id, thread.title, e)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition flex items-center gap-1"
                            title="Delete thread"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

          </div>

          {/* Right Sidebar Column (4 Cols) - Indian Auto Forum Style */}
          <div className="lg:col-span-4 space-y-6">

            {/* Hot in the Forum Widget */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  Hot in the Forum
                </h3>
                <span className="text-[11px] font-bold text-[var(--color-brand-red)]">Trending</span>
              </div>
              <div className="space-y-3.5">
                {threads.filter(t => t.isHot).slice(0, 4).map(hotThread => (
                  <div
                    key={hotThread.id}
                    onClick={() => setActiveThreadModal(hotThread)}
                    className="group cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 mb-1">
                      <span className="text-red-600 dark:text-red-400 font-bold">{hotThread.brand}</span>
                      <span>•</span>
                      <span>{hotThread.replies.length} replies</span>
                      <span>•</span>
                      <span>{hotThread.upvotes} upvotes</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2 leading-snug">
                      {hotThread.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Real On-Road Price Transparency Tracker */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Real On-Road Price Tracker
                </h3>
                <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded">
                  Verified Invoices
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                What actual community buyers paid across Indian cities (after discounts &amp; insurance matching):
              </p>
              <div className="space-y-3">
                {REAL_PRICE_TICKER.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-gray-200">{item.model}</h5>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500" /> {item.city} • Saved {item.discount}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">{item.onRoad}</span>
                      <span className="text-[9px] text-gray-400">Net On-Road</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('price-reports');
                }}
                className="w-full mt-4 text-center text-xs font-bold text-[var(--color-brand-red)] hover:underline flex items-center justify-center gap-1"
              >
                View all on-road price reports <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Regional Chapters / Community Crew in Every State */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-5 shadow-sm border border-gray-700">
              <h3 className="font-extrabold text-base mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                Crew in Every State
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Join regional weekend drives, monsoon trails, and tech meetups organized by local verified chapter leads.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-center cursor-pointer transition-colors">
                  Delhi NCR (4.2k)
                </div>
                <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-center cursor-pointer transition-colors">
                  Mumbai &amp; Pune (5.1k)
                </div>
                <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-center cursor-pointer transition-colors">
                  Bengaluru (6.8k)
                </div>
                <div className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-center cursor-pointer transition-colors">
                  Kerala Chapter (3.9k)
                </div>
              </div>
            </div>

            {/* IAF Forum Guidelines & Authenticity Pledge */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-xs text-gray-600 dark:text-gray-400 space-y-2.5">
              <h4 className="font-bold text-gray-900 dark:text-gray-200 flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4 text-yellow-500" /> Forum Integrity Rules
              </h4>
              <p>• <strong>Zero Dealership Sponsorship:</strong> Unfiltered ownership reviews by real car and bike owners.</p>
              <p>• <strong>Civil Discussions:</strong> Constructive debates on reliability, mileage, and safety ratings.</p>
              <p>• <strong>No Spam or Dealer Marketing:</strong> Strictly moderated by senior BHPian &amp; IAF veterans.</p>
            </div>

          </div>

        </div>

      </div>

      {/* START A THREAD MODAL */}
      {isStartThreadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Start a New Discussion</h3>
                <p className="text-xs text-gray-500">Contribute your review, road trip report, price report, or ask for car advice.</p>
              </div>
              <button
                onClick={() => setIsStartThreadOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Discussion Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)]"
                >
                  <option value="Car Ownership Review">🚗 Car Ownership Review (Detailed Long-term)</option>
                  <option value="Bike Ownership Review">🏍️ Bike Ownership Review (2-Wheeler / EV)</option>
                  <option value="No-BS Trip Reports">🛣️ No-BS Trip Report / Highway Travelogue</option>
                  <option value="Real On-Road Prices">💰 Real On-Road Price Transparency Report</option>
                  <option value="What Car Next / Advice">💡 What Car Next / Buying Advice</option>
                  <option value="Technical & DIY">🔧 Technical, Maintenance &amp; DIY Guide</option>
                  <option value="Car Reviews & News">📰 Car Reviews &amp; News</option>
                  <option value="Introductions & Garage">👋 Introductions &amp; Member Garage</option>
                </select>
              </div>

              {/* Brand and Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Brand *
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)]"
                  >
                    {POPULAR_BRANDS.filter(b => b !== 'All Brands').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Specific Model &amp; Variant *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Safari Dark XZA+ or Thar Petrol 4x4"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>

              {/* Thread Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Thread Title *
                </label>
                <input
                  type="text"
                  placeholder="Give a descriptive, engaging title (e.g. 20,000 km Review of Scorpio N)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)]"
                />
              </div>

              {/* DYNAMIC CATEGORY FIELDS */}
              {(newCategory === 'Car Ownership Review' || newCategory === 'Bike Ownership Review') && (
                <div className="bg-red-50/60 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-[var(--color-brand-red)] uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4" /> Ownership Verification Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Kilometers Driven</label>
                      <input
                        type="number"
                        value={kmDriven}
                        onChange={(e) => setKmDriven(Number(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Real Fuel Mileage</label>
                      <input
                        type="text"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        placeholder="e.g. 14.5 kmpl"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Rating (1 to 5)</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      >
                        <option value={5}>5 Stars - Exceptional</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Below Average</option>
                        <option value={1}>1 Star - Unsatisfactory</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Fuel Type</label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value as any)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Key Likes / Pros (comma-separated)</label>
                    <input
                      type="text"
                      value={prosText}
                      onChange={(e) => setProsText(e.target.value)}
                      placeholder="e.g. High speed stability, punchy diesel engine, comfortable seats"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Key Dislikes / Cons (comma-separated)</label>
                    <input
                      type="text"
                      value={consText}
                      onChange={(e) => setConsText(e.target.value)}
                      placeholder="e.g. Heavy clutch, blind spot on A-pillar"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              )}

              {newCategory === 'No-BS Trip Reports' && (
                <div className="bg-purple-50/60 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-4 h-4" /> Road Trip Itinerary Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Route (Start to End)</label>
                      <input
                        type="text"
                        value={tripRoute}
                        onChange={(e) => setTripRoute(e.target.value)}
                        placeholder="e.g. Mumbai to Goa via Pune Expressway"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Total KM</label>
                        <input
                          type="number"
                          value={tripDistance}
                          onChange={(e) => setTripDistance(Number(e.target.value))}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Days</label>
                        <input
                          type="number"
                          value={tripDays}
                          onChange={(e) => setTripDays(Number(e.target.value))}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {newCategory === 'Real On-Road Prices' && (
                <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Quotation / Invoice Figures
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">City / State</label>
                      <input
                        type="text"
                        value={priceCity}
                        onChange={(e) => setPriceCity(e.target.value)}
                        placeholder="e.g. Bengaluru, KA"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Discounts Received (₹)</label>
                      <input
                        type="text"
                        value={priceDiscount}
                        onChange={(e) => setPriceDiscount(e.target.value)}
                        placeholder="e.g. ₹ 55,000"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">Final On-Road Paid (₹)</label>
                      <input
                        type="text"
                        value={priceFinalOnRoad}
                        onChange={(e) => setPriceFinalOnRoad(e.target.value)}
                        placeholder="e.g. ₹ 16,80,000"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Discussion Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Discussion Content / Story / Query *
                </label>
                <textarea
                  rows={5}
                  placeholder="Share detailed experience, service issues, highway reports, or specific technical questions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)]"
                />
              </div>

              {/* Tags, Author Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">Your City / State</label>
                  <input
                    type="text"
                    value={authorCity}
                    onChange={(e) => setAuthorCity(e.target.value)}
                    placeholder="e.g. Pune, MH"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Mileage, Service, Highway"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                {isUserBlocked(authorName) ? (
                  <div className="w-full sm:w-auto p-2.5 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                    <Ban className="w-4 h-4 shrink-0" />
                    <span>Account Suspended: Cannot publish discussions.</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400">All submissions are monitored by community moderation.</span>
                )}

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsStartThreadOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUserBlocked(authorName)}
                    className={`px-6 py-2.5 rounded-xl bg-[var(--color-brand-red)] text-white text-xs font-bold shadow-md transition-colors ${
                      isUserBlocked(authorName) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 cursor-pointer'
                    }`}
                  >
                    Publish Thread
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD DETAIL READER MODAL */}
      {activeThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 my-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[var(--color-brand-red)] dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                    {activeThreadModal.category}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {activeThreadModal.brand} • {activeThreadModal.model}
                  </span>
                  {activeThreadModal.isHot && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Hot in Forum
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
                  {activeThreadModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveThreadModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Fast Governance Toolbar inside Reader Modal */}
            {isAdmin && (
              <div className="bg-red-950/70 border-b border-red-900/80 px-5 py-2.5 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2 text-red-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Admin Moderation:</span>
                  <span className="font-semibold text-white">{activeThreadModal.author}</span>
                  {isUserBlocked(activeThreadModal.author) && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold">Suspended</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleAdminBlockUser(activeThreadModal.author, e)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 text-white ${
                      isUserBlocked(activeThreadModal.author) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    {isUserBlocked(activeThreadModal.author) ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    <span>{isUserBlocked(activeThreadModal.author) ? 'Unblock Author' : 'Block Author'}</span>
                  </button>
                  <button
                    onClick={(e) => handleAdminRemoveUser(activeThreadModal.author, e)}
                    className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-white text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Purge User</span>
                  </button>
                  <button
                    onClick={(e) => handleAdminDeleteThread(activeThreadModal.id, activeThreadModal.title, e)}
                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Author Strip */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThreadModal.avatar}
                    alt={activeThreadModal.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-brand-red)]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{activeThreadModal.author}</span>
                      {isUserBlocked(activeThreadModal.author) ? (
                        <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Suspended Member
                        </span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {activeThreadModal.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{activeThreadModal.authorCity}</span> • <span>{activeThreadModal.createdAt}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleUpvote(activeThreadModal.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      activeThreadModal.isUpvoted
                        ? 'bg-red-50 text-[var(--color-brand-red)] border-red-200 dark:bg-red-950 dark:border-red-900'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${activeThreadModal.isUpvoted ? 'fill-[var(--color-brand-red)]' : ''}`} />
                    <span>{activeThreadModal.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(activeThreadModal.id)}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      activeThreadModal.isBookmarked
                        ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950 dark:border-amber-900'
                        : 'text-gray-400 hover:text-gray-600 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${activeThreadModal.isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleShareThread(activeThreadModal)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SPECIFIC REPORT CARDS */}
              {activeThreadModal.ownershipDetails && (
                <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-blue-500" /> Ownership Specs &amp; Vitals
                    </h4>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {activeThreadModal.ownershipDetails.rating} / 5 Rating
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Odometer</span>
                      <strong className="text-gray-800 dark:text-gray-200">{activeThreadModal.ownershipDetails.kmDriven.toLocaleString()} KM</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Fuel &amp; Efficiency</span>
                      <strong className="text-gray-800 dark:text-gray-200">{activeThreadModal.ownershipDetails.mileage}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Powertrain</span>
                      <strong className="text-gray-800 dark:text-gray-200">{activeThreadModal.ownershipDetails.fuelType}</strong>
                    </div>
                    {activeThreadModal.ownershipDetails.serviceCostYearly && (
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase">Annual Service</span>
                        <strong className="text-gray-800 dark:text-gray-200">{activeThreadModal.ownershipDetails.serviceCostYearly}</strong>
                      </div>
                    )}
                  </div>

                  {/* Pros & Cons pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> What I Love (Pros):
                      </span>
                      <ul className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1 list-disc pl-4">
                        {activeThreadModal.ownershipDetails.pros.map((pro, idx) => (
                          <li key={idx}>{pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border border-red-200 dark:border-red-900/40">
                      <span className="text-xs font-bold text-red-800 dark:text-red-300 block mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" /> What Could Be Better (Cons):
                      </span>
                      <ul className="text-xs text-red-950 dark:text-red-200 space-y-1 list-disc pl-4">
                        {activeThreadModal.ownershipDetails.cons.map((con, idx) => (
                          <li key={idx}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeThreadModal.tripDetails && (
                <div className="bg-purple-50/70 dark:bg-purple-950/40 rounded-xl p-4 border border-purple-200 dark:border-purple-900/60 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-purple-600" /> Highway Travelogue Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Route</span>
                      <strong className="text-gray-900 dark:text-gray-100">{activeThreadModal.tripDetails.route}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Distance &amp; Time</span>
                      <strong className="text-gray-900 dark:text-gray-100">{activeThreadModal.tripDetails.distanceKm} km ({activeThreadModal.tripDetails.durationDays} Days)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Fuel Expense</span>
                      <strong className="text-green-700 dark:text-green-400">{activeThreadModal.tripDetails.fuelCost}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Fastag Tolls</span>
                      <strong className="text-gray-900 dark:text-gray-100">{activeThreadModal.tripDetails.tollCost}</strong>
                    </div>
                  </div>
                  <div className="text-xs text-purple-950 dark:text-purple-200 bg-white/60 dark:bg-black/20 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/40 mt-1">
                    <strong>Highlight:</strong> {activeThreadModal.tripDetails.highlight}
                  </div>
                </div>
              )}

              {activeThreadModal.priceReportDetails && (
                <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-xl p-4 border border-amber-200 dark:border-amber-900/60 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" /> Invoice Breakdown &amp; Negotiation Report
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px]">City / Location</span>
                      <strong className="text-gray-900 dark:text-gray-100">{activeThreadModal.priceReportDetails.city}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Ex-Showroom</span>
                      <strong className="text-gray-900 dark:text-gray-100">{activeThreadModal.priceReportDetails.exShowroom}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Discount Slashed</span>
                      <strong className="text-red-600 dark:text-red-400">{activeThreadModal.priceReportDetails.dealerDiscount}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Final Net On-Road</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{activeThreadModal.priceReportDetails.finalOnRoad}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Text Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                {activeThreadModal.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {activeThreadModal.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* REPLIES SECTION */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[var(--color-brand-red)]" />
                    Community Replies ({activeThreadModal.replies.length})
                  </h3>
                  <span className="text-xs text-gray-400">Join the discussion below</span>
                </div>

                {/* Replies list */}
                <div className="space-y-3">
                  {activeThreadModal.replies.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500">No replies yet. Be the first to share your thoughts or ask a question!</p>
                    </div>
                  ) : (
                    activeThreadModal.replies.map((reply) => {
                      const isReplyAuthorBlocked = isUserBlocked(reply.author);
                      return (
                        <div key={reply.id} className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={reply.avatar}
                                alt={reply.author}
                                className="w-6 h-6 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{reply.author}</span>
                              {isReplyAuthorBlocked ? (
                                <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                                  <Ban className="w-2.5 h-2.5" /> Suspended
                                </span>
                              ) : (
                                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.2 rounded font-semibold">
                                  {reply.authorBadge}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400">{reply.authorCity}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">{reply.createdAt}</span>

                              {/* Admin quick actions on reply */}
                              {isAdmin && (
                                <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 dark:border-gray-700 pl-2">
                                  <button
                                    onClick={(e) => handleAdminBlockUser(reply.author, e)}
                                    className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                                    title="Block/Unblock this comment author"
                                  >
                                    {isReplyAuthorBlocked ? 'Unblock' : 'Block'}
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={(e) => handleAdminDeleteReply(activeThreadModal.id, reply.id, e)}
                                    className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
                                    title="Delete this reply"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* POST A REPLY FORM */}
                <form onSubmit={handleSubmitReply} className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Post a Reply
                    </h4>
                    {isUserBlocked(replyAuthor) && (
                      <span className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                        <Ban className="w-3.5 h-3.5" /> Account suspended from replying
                      </span>
                    )}
                  </div>

                  {isUserBlocked(replyAuthor) && (
                    <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
                      <Ban className="w-4 h-4 shrink-0" />
                      <span>The account &quot;{replyAuthor}&quot; has been suspended by an administrator. You cannot post replies until access is restored.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name / Handle"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Your City (e.g. Delhi NCR)"
                      value={replyCity}
                      onChange={(e) => setReplyCity(e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder={
                      isUserBlocked(replyAuthor)
                        ? "Replying disabled due to administrative suspension..."
                        : "Write a helpful response, experience, or follow-up question..."
                    }
                    disabled={isUserBlocked(replyAuthor)}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[var(--color-brand-red)] disabled:opacity-50"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUserBlocked(replyAuthor)}
                      className={`text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md ${
                        isUserBlocked(replyAuthor)
                          ? 'bg-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-[var(--color-brand-red)] hover:bg-red-700 cursor-pointer'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Reply
                    </button>
                  </div>
                </form>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
