import React, { useState, useEffect } from 'react';
import { AdminReview } from '../../types/admin';
import { 
  Search, 
  Filter, 
  Star, 
  Check, 
  EyeOff, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  RefreshCw,
  ThumbsDown,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewModerationProps {
  onAddAlert: (text: string) => void;
}

export default function ReviewModeration({ onAddAlert }: ReviewModerationProps) {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof AdminReview>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const ratings = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];
  const statuses = ['All', 'Approved', 'Hidden', 'Pending'];

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Populate with complete, exquisite sample data
      const sampleReviews: AdminReview[] = [
        {
          id: 'rev-1',
          user: 'Gordon Ramsay',
          vehicleName: '1961 Jaguar E-Type Coupe',
          rating: 5,
          text: 'This vehicle is absolute perfection. Smooth gear transitions, pristine leather restoration. A stellar masterpiece!',
          status: 'Approved',
          date: '2026-06-22'
        },
        {
          id: 'rev-2',
          user: 'Christian Bale',
          vehicleName: '1964 Aston Martin DB5',
          rating: 4,
          text: 'Feels very elegant, very spy-like. The base price is slightly elevated, but the historical restoration is phenomenal.',
          status: 'Pending',
          date: '2026-06-21'
        },
        {
          id: 'rev-3',
          user: 'Satoshi Nakamoto',
          vehicleName: '1972 Chevrolet Cheyenne K10',
          rating: 5,
          text: 'Superb utility and classic styling. Decentralized power in the K10 engine is impressive. Highly recommended!',
          status: 'Approved',
          date: '2026-06-19'
        },
        {
          id: 'rev-4',
          user: 'Donald Knuth',
          vehicleName: '1959 Vespa 125 Sport',
          rating: 2,
          text: 'Complexity of repair is high, and carburetor timing is slightly off. Not very optimal for daily algorithmic commutes.',
          status: 'Hidden',
          date: '2026-06-15'
        },
        {
          id: 'rev-5',
          user: 'James Bond',
          vehicleName: '1964 Aston Martin DB5',
          rating: 5,
          text: 'An icon of British engineering. Equipped perfectly for standard luxury. The machine guns were missing from description, but overall spectacular.',
          status: 'Pending',
          date: '2026-06-23'
        }
      ];
      setReviews(sampleReviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Actions
  const handleApprove = (id: string, name: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    onAddAlert(`Approved review by ${name}`);
  };

  const handleHide = (id: string, name: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
    onAddAlert(`Hidden review by ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Permanently delete this review by ${name}?`)) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    onAddAlert(`Deleted review by ${name}`);
  };

  // Sort & Filter
  const handleSort = (field: keyof AdminReview) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = r.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'All' || r.rating.toString() === selectedRating.split(' ')[0];
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    if (typeof aVal === 'number') {
      return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Aggregated Reviews</span>
            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1">{reviews.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Pending Moderation</span>
            <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-1">
              {reviews.filter(r => r.status === 'Pending').length}
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
            <Star className="w-6 h-6 fill-current" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Approved Content</span>
            <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {reviews.filter(r => r.status === 'Approved').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
            <ThumbsUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filter controls */}
        <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search user, review text, vehicle name..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#d02326]/25"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-500 uppercase tracking-wider">Stars:</span>
              <select
                value={selectedRating}
                onChange={e => { setSelectedRating(e.target.value); setCurrentPage(1); }}
                className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
              >
                {ratings.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button 
              onClick={fetchReviews}
              title="Refresh Reviews"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data list rows */}
        <div className="divide-y divide-gray-150 dark:divide-gray-800">
          {currentItems.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No feedback matching selected moderation filters.
            </div>
          ) : (
            currentItems.map((r) => (
              <div key={r.id} className="p-6 hover:bg-gray-55/40 dark:hover:bg-gray-850/15 transition-colors flex flex-col md:flex-row md:items-start gap-6">
                
                {/* User Info Column */}
                <div className="w-full md:w-48 shrink-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {r.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-xs">{r.user}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">{r.date}</span>
                    </div>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400' :
                    r.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400 animate-pulse' :
                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {r.status}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Reviewed Vehicle Listing</span>
                    <span className="font-serif font-bold text-sm text-[var(--color-brand-red)] hover:underline cursor-pointer">{r.vehicleName}</span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 py-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-4 h-4 ${
                          idx < r.rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-250 dark:text-gray-750'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Review Text Body */}
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-sans">{r.text}</p>
                </div>

                {/* Moderation Controls Column */}
                <div className="w-full md:w-auto shrink-0 flex items-center gap-1.5 md:flex-col md:items-end justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {r.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(r.id, r.user)}
                      className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Listing Review
                    </button>
                  )}
                  {r.status !== 'Hidden' && (
                    <button
                      onClick={() => handleHide(r.id, r.user)}
                      className="flex items-center justify-center gap-1 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-1.5 px-3.5 rounded-lg text-[10px] transition cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Hide Review
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id, r.user)}
                    className="p-2 border border-transparent hover:border-rose-150 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer md:mt-1.5"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(indexOfLastItem, sorted.length)}</span> of <span className="font-semibold text-gray-800 dark:text-gray-200">{sorted.length}</span> feedback records
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 disabled:opacity-45 hover:bg-gray-55 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    currentPage === idx + 1
                      ? 'bg-[#d02326] border-[#d02326] text-white shadow'
                      : 'border-gray-250 dark:border-gray-700 text-gray-500 hover:bg-gray-55 dark:hover:bg-gray-800'
                  } cursor-pointer`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 disabled:opacity-45 hover:bg-gray-55 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
