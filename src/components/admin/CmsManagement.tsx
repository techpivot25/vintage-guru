import React, { useState, useEffect } from 'react';
import { 
  CmsCategory, 
  CmsMedia, 
  CmsBlog, 
  NewsletterSubscriber 
} from '../../types/admin';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon, 
  BookOpen, 
  Layers, 
  Mail, 
  Send, 
  RefreshCw, 
  FileText, 
  AlertCircle,
  Clock,
  Bold,
  Italic,
  Heading2,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CmsManagementProps {
  initialSubTab?: 'categories' | 'media' | 'blogs' | 'newsletters';
  onAddAlert: (text: string) => void;
  showAddCategoryNow: boolean;
  setShowAddCategoryNow: (show: boolean) => void;
  showAddBlogNow: boolean;
  setShowAddBlogNow: (show: boolean) => void;
}

export default function CmsManagement({ 
  initialSubTab = 'categories', 
  onAddAlert,
  showAddCategoryNow,
  setShowAddCategoryNow,
  showAddBlogNow,
  setShowAddBlogNow
}: CmsManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'media' | 'blogs' | 'newsletters'>(initialSubTab);

  // Sync sub-tab updates from parent triggers
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // CATEGORIES STATE
  const [categories, setCategories] = useState<CmsCategory[]>([
    { id: 'cat-1', name: 'Classic Cars', subcategoriesCount: 15, status: 'Active', description: 'Legendary four-wheeled passenger automobiles from 1920 to 1980.' },
    { id: 'cat-2', name: 'Vintage Bikes', subcategoriesCount: 8, status: 'Active', description: 'Rare motorcycles, cruisers, and cafe racers from Golden Era makers.' },
    { id: 'cat-3', name: 'Antique Trucks', subcategoriesCount: 6, status: 'Active', description: 'Historical utility vehicles, pickups, and work rigs built to last.' },
    { id: 'cat-4', name: 'Commercial', subcategoriesCount: 4, status: 'Inactive', description: 'Heavy diesel transport and vintage mass transit carriers.' }
  ]);
  const [catSearch, setCatSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<CmsCategory | null>(null);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catStatus, setCatStatus] = useState<'Active' | 'Inactive'>('Active');

  // MEDIA LIBRARY STATE
  const [mediaAssets, setMediaAssets] = useState<CmsMedia[]>([
    { id: 'med-1', name: 'Main Hero Banner Classic', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', category: 'Banner', size: '242 KB' },
    { id: 'med-2', name: 'Promo Summer Auction', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', category: 'Promo', size: '184 KB' },
    { id: 'med-3', name: 'Detail Jaguar Engine Coupe', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80', category: 'Detail', size: '312 KB' },
    { id: 'med-4', name: 'Detail Chevy Cheyenne Grille', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', category: 'Detail', size: '156 KB' }
  ]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCat, setNewMediaCat] = useState<'Banner' | 'Promo' | 'Detail' | 'General'>('General');
  const [isMediaFormOpen, setIsMediaFormOpen] = useState(false);

  // BLOGS STATE
  const [blogs, setBlogs] = useState<CmsBlog[]>([
    { 
      id: 'blog-1', 
      title: 'The Art of Sourcing Original Parts', 
      content: 'Finding authentic vintage components requires deep research and networking. Always verify serialization codes on engines and body panels. This guide shows how...', 
      author: 'Alistair Green', 
      category: 'Restoration Guidelines', 
      date: '2026-06-20', 
      status: 'Published', 
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: 'blog-2', 
      title: 'Top 5 Antique Investments in 2026', 
      content: 'Relational metrics indicate classic Aston Martins and early utility trucks are rising rapidly in collector value. In this article, we map auction indexes and analyze curves...', 
      author: 'Sophia Sterling', 
      category: 'Investment Trends', 
      date: '2026-06-22', 
      status: 'Draft', 
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80' 
    }
  ]);
  const [blogSearch, setBlogSearch] = useState('');
  const [editingBlog, setEditingBlog] = useState<CmsBlog | null>(null);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCat, setBlogCat] = useState('');
  const [blogImg, setBlogImg] = useState('');
  const [blogStatus, setBlogStatus] = useState<'Draft' | 'Published'>('Draft');
  const [blogContent, setBlogContent] = useState('');

  // NEWSLETTER STATE
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([
    { id: 'sub-1', email: 'gordon@ramsay.com', status: 'Subscribed', date: '2026-06-19' },
    { id: 'sub-2', email: 'bale@christian.org', status: 'Subscribed', date: '2026-06-21' },
    { id: 'sub-3', email: 'satoshi@blockmail.io', status: 'Subscribed', date: '2026-06-22' },
    { id: 'sub-4', email: 'elon@spacexvintage.com', status: 'Unsubscribed', date: '2026-06-10' }
  ]);
  const [subSearch, setSubSearch] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);

  // Monitor quick-add requests from header
  useEffect(() => {
    if (showAddCategoryNow) {
      handleOpenCreateCat();
      setShowAddCategoryNow(false);
    }
  }, [showAddCategoryNow]);

  useEffect(() => {
    if (showAddBlogNow) {
      handleOpenCreateBlog();
      setShowAddBlogNow(false);
    }
  }, [showAddBlogNow]);


  // ==========================================
  // CATEGORIES ACTIONS
  // ==========================================
  const handleOpenCreateCat = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatStatus('Active');
    setIsCatFormOpen(true);
  };

  const handleOpenEditCat = (cat: CmsCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatStatus(cat.status);
    setIsCatFormOpen(true);
  };

  const handleSubmitCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: catName,
        description: catDesc,
        status: catStatus
      } : c));
      onAddAlert(`Category edited successfully: ${catName}`);
    } else {
      const newCat: CmsCategory = {
        id: `cat-${Date.now()}`,
        name: catName,
        subcategoriesCount: 0,
        status: catStatus,
        description: catDesc
      };
      setCategories(prev => [...prev, newCat]);
      onAddAlert(`Registered new vehicle category: ${catName}`);
    }
    setIsCatFormOpen(false);
  };

  const handleDeleteCat = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    onAddAlert(`Permanently deleted category: ${name}`);
  };


  // ==========================================
  // MEDIA ACTIONS
  // ==========================================
  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onAddAlert(`Asset URL copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMediaAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName.trim() || !newMediaUrl.trim()) return;

    const newAsset: CmsMedia = {
      id: `med-${Date.now()}`,
      name: newMediaName,
      url: newMediaUrl,
      category: newMediaCat,
      size: `${Math.floor(Math.random() * 300) + 100} KB`
    };

    setMediaAssets(prev => [newAsset, ...prev]);
    setNewMediaName('');
    setNewMediaUrl('');
    setNewMediaCat('General');
    setIsMediaFormOpen(false);
    onAddAlert(`Added media asset to central library: ${newMediaName}`);
  };

  const handleDeleteMedia = (id: string, name: string) => {
    if (!window.confirm(`Remove ${name} from media library?`)) return;
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    onAddAlert(`Removed media asset: ${name}`);
  };


  // ==========================================
  // BLOGS ACTIONS
  // ==========================================
  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogAuthor('System Administrator');
    setBlogCat('Restoration Guides');
    setBlogImg('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80');
    setBlogStatus('Draft');
    setBlogContent('');
    setIsBlogFormOpen(true);
  };

  const handleOpenEditBlog = (b: CmsBlog) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogAuthor(b.author);
    setBlogCat(b.category);
    setBlogImg(b.image);
    setBlogStatus(b.status);
    setBlogContent(b.content);
    setIsBlogFormOpen(true);
  };

  const handleApplyEditorStyle = (styleType: 'bold' | 'italic' | 'heading' | 'quote') => {
    // Basic WYSIWYG helper that appends wrapping tags to selected or overall content
    let text = blogContent;
    if (styleType === 'bold') text += ' **bold text** ';
    if (styleType === 'italic') text += ' *italic text* ';
    if (styleType === 'heading') text += '\n\n## Section Heading\n';
    if (styleType === 'quote') text += '\n> Blockquote text';
    setBlogContent(text);
  };

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    const blogPayload = {
      title: blogTitle,
      content: blogContent,
      author: blogAuthor,
      category: blogCat,
      status: blogStatus,
      image: blogImg,
      date: new Date().toLocaleDateString()
    };

    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogPayload } : b));
      onAddAlert(`Edited Blog Draft: ${blogTitle}`);
    } else {
      const newBlog: CmsBlog = {
        id: `blog-${Date.now()}`,
        ...blogPayload
      };
      setBlogs(prev => [newBlog, ...prev]);
      onAddAlert(`Created new editorial post: ${blogTitle}`);
    }
    setIsBlogFormOpen(false);
  };

  const handleDeleteBlog = (id: string, name: string) => {
    if (!window.confirm(`Permanently delete article ${name}?`)) return;
    setBlogs(prev => prev.filter(b => b.id !== id));
    onAddAlert(`Permanently deleted editorial article: ${name}`);
  };


  // ==========================================
  // NEWSLETTERS ACTIONS
  // ==========================================
  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject.trim() || !campaignBody.trim()) return;

    setSendingCampaign(true);
    setCampaignProgress(10);

    const interval = setInterval(() => {
      setCampaignProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSendingCampaign(false);
          setCampaignSubject('');
          setCampaignBody('');
          onAddAlert(`Newsletter campaign sent successfully to all active subscribers!`);
          return 0;
        }
        return prev + 30;
      });
    }, 450);
  };

  const handleToggleSubscriber = (id: string, email: string, currentStatus: 'Subscribed' | 'Unsubscribed') => {
    const nextStatus = currentStatus === 'Subscribed' ? 'Unsubscribed' : 'Subscribed';
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
    onAddAlert(`Status updated for subscriber: ${email}`);
  };


  return (
    <div className="space-y-6">

      {/* Sub tabs header */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-4 rounded-t-3xl shadow-sm gap-2">
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'categories'
              ? 'border-[#d02326] text-[#d02326]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Categories CRUD
        </button>
        <button
          onClick={() => setActiveSubTab('media')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'media'
              ? 'border-[#d02326] text-[#d02326]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Media Library
        </button>
        <button
          onClick={() => setActiveSubTab('blogs')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'blogs'
              ? 'border-[#d02326] text-[#d02326]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Blogs Editorial
        </button>
        <button
          onClick={() => setActiveSubTab('newsletters')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'newsletters'
              ? 'border-[#d02326] text-[#d02326]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" /> Newsletters Setup
        </button>
      </div>

      {/* SUB TAB MAIN WRAPPERS */}
      <div className="bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-800 p-6 rounded-b-3xl shadow-sm">
        
        {/* TAB 1: CATEGORIES */}
        {activeSubTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Website Categories CMS</h3>
                <p className="text-xs text-gray-500">Edit core taxonomy classifications for vehicle inventory.</p>
              </div>
              <button
                onClick={handleOpenCreateCat}
                className="bg-[#d02326] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Category
              </button>
            </div>

            {/* Categories Table list */}
            <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-850 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-150">
                    <th className="px-5 py-3">Category Name</th>
                    <th className="px-5 py-3">Sub-items Count</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{cat.name}</td>
                      <td className="px-5 py-4 text-gray-500 font-semibold">{cat.subcategoriesCount} types</td>
                      <td className="px-5 py-4 text-gray-400 max-w-xs truncate">{cat.description}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEditCat(cat)} className="p-1.5 hover:bg-gray-100 rounded text-blue-500 cursor-pointer" title="Edit Category"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCat(cat.id, cat.name)} className="p-1.5 hover:bg-gray-100 rounded text-rose-500 cursor-pointer" title="Delete Category"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Category Form Dialog */}
            <AnimatePresence>
              {isCatFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCatFormOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 max-w-md w-full rounded-2xl p-6 shadow-2xl z-10 space-y-4"
                  >
                    <h4 className="font-serif text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-2">
                      {editingCategory ? 'Edit Vehicle Category' : 'Register Vehicle Category'}
                    </h4>
                    <form onSubmit={handleSubmitCat} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Category Title</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Vintage Bikes"
                          value={catName}
                          onChange={e => setCatName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Taxonomy Description</label>
                        <textarea
                          rows={3}
                          placeholder="Brief summary of vehicle types grouped here..."
                          value={catDesc}
                          onChange={e => setCatDesc(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Activity Status</label>
                        <select
                          value={catStatus}
                          onChange={e => setCatStatus(e.target.value as 'Active' | 'Inactive')}
                          className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs"
                        >
                          <option value="Active">Active (Permitted in search dropdowns)</option>
                          <option value="Inactive">Inactive (Disabled in front-end catalog)</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                        <button type="button" onClick={() => setIsCatFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#d02326] text-white rounded-xl font-bold cursor-pointer">Save Category</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 2: MEDIA LIBRARY */}
        {activeSubTab === 'media' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Centralized Media Assets Hub</h3>
                <p className="text-xs text-gray-500">Host, organize, copy links for homepage promos, detailing files, and headers.</p>
              </div>
              <button
                onClick={() => setIsMediaFormOpen(true)}
                className="bg-[#d02326] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Upload Asset link
              </button>
            </div>

            {/* Media Asset List Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaAssets.map(asset => (
                <div key={asset.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white dark:bg-gray-850">
                  <div className="h-32 bg-gray-100 dark:bg-gray-850 relative group">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-slate-900/75 text-white font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm">
                      {asset.category}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-1">{asset.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">{asset.size}</span>
                    </div>
                    <div className="flex gap-1.5 border-t border-gray-100 pt-2 text-[10px]">
                      <button
                        onClick={() => handleCopyUrl(asset.id, asset.url)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded transition border cursor-pointer ${
                          copiedId === asset.id 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-350' 
                            : 'border-gray-300 hover:bg-gray-50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {copiedId === asset.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === asset.id ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(asset.id, asset.name)}
                        className="p-1 border border-transparent hover:border-rose-150 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Remove Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload link dialog */}
            <AnimatePresence>
              {isMediaFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMediaFormOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 max-w-md w-full rounded-2xl p-6 shadow-2xl z-10 space-y-4"
                  >
                    <h4 className="font-serif text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-2">Link Media Asset to Library</h4>
                    <form onSubmit={handleAddMediaAsset} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Asset Name</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Classic Mustang Red Front"
                          value={newMediaName}
                          onChange={e => setNewMediaName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Photo Asset URL Link</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/photo-..."
                          value={newMediaUrl}
                          onChange={e => setNewMediaUrl(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Classification Tag</label>
                        <select
                          value={newMediaCat}
                          onChange={e => setNewMediaCat(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs"
                        >
                          <option value="General">General Graphic</option>
                          <option value="Banner">Homepage Banner Promo</option>
                          <option value="Promo">Promotion Banner Grid</option>
                          <option value="Detail">Technical Asset Details</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                        <button type="button" onClick={() => setIsMediaFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#d02326] text-white rounded-xl font-bold cursor-pointer">Save Asset</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 3: BLOGS */}
        {activeSubTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Blogs & Editorial CMS</h3>
                <p className="text-xs text-gray-500">Draft or publish rich articles for classic restorers and vintage fans.</p>
              </div>
              <button
                onClick={handleOpenCreateBlog}
                className="bg-[#d02326] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Blog Post
              </button>
            </div>

            {/* Blogs Editorial Data list rows */}
            <div className="divide-y divide-gray-150 dark:divide-gray-800 border border-gray-150 dark:border-gray-800 rounded-3xl overflow-hidden bg-white dark:bg-gray-850">
              {blogs.map(blog => (
                <div key={blog.id} className="p-6 hover:bg-gray-55/30 transition-colors flex flex-col sm:flex-row gap-5 items-start text-xs">
                  <div className="w-24 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                        {blog.category}
                      </span>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        blog.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">{blog.title}</h4>
                    <p className="text-gray-400 line-clamp-1">{blog.content}</p>
                    <div className="flex gap-2 text-[10px] text-gray-450 font-mono">
                      <span>Author: {blog.author}</span>
                      <span>|</span>
                      <span>Date: {blog.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 self-center">
                    <button onClick={() => handleOpenEditBlog(blog)} className="p-1.5 hover:bg-gray-100 text-blue-500 rounded cursor-pointer" title="Edit Article"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(blog.id, blog.title)} className="p-1.5 hover:bg-gray-100 text-rose-500 rounded cursor-pointer" title="Delete Article"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* WYSIWYG Form Dialog */}
            <AnimatePresence>
              {isBlogFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBlogFormOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 max-w-2xl w-full rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] flex flex-col justify-between"
                  >
                    <div className="border-b border-gray-150 pb-2 flex justify-between items-center mb-1">
                      <div>
                        <h4 className="font-serif text-base font-bold text-gray-900 dark:text-white">
                          {editingBlog ? 'Modify Editorial Blog Post' : 'Compose Editorial Blog Post'}
                        </h4>
                        <p className="text-[9px] text-gray-450 uppercase tracking-wider">Restoration and Investment Trends Newsroom</p>
                      </div>
                      <button onClick={() => setIsBlogFormOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <form onSubmit={handleSubmitBlog} className="space-y-4 text-xs overflow-y-auto pr-1.5 scrollbar-thin">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Article Title</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Sourcing Vintage Gaskets"
                            value={blogTitle}
                            onChange={e => setBlogTitle(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Featured Cover Photo URL</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. https://images.unsplash.com/..."
                            value={blogImg}
                            onChange={e => setBlogImg(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Author Name</label>
                          <input
                            required
                            type="text"
                            value={blogAuthor}
                            onChange={e => setBlogAuthor(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Category Classification</label>
                          <input
                            required
                            type="text"
                            value={blogCat}
                            onChange={e => setBlogCat(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Editorial Status</label>
                          <select
                            value={blogStatus}
                            onChange={e => setBlogStatus(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs"
                          >
                            <option value="Draft">Save Draft (Hidden from community)</option>
                            <option value="Published">Publish (Live on Community page)</option>
                          </select>
                        </div>
                      </div>

                      {/* WYSIWYG Editor Styling controls */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Body Content Editor</label>
                        
                        {/* Editor Controls Bar */}
                        <div className="flex border border-gray-250 border-b-0 bg-gray-50/70 p-1.5 rounded-t-xl gap-1">
                          <button
                            type="button"
                            onClick={() => handleApplyEditorStyle('bold')}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"
                            title="Insert Bold Text"
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyEditorStyle('italic')}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"
                            title="Insert Italic Text"
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyEditorStyle('heading')}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"
                            title="Insert Heading"
                          >
                            <Heading2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyEditorStyle('quote')}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"
                            title="Insert Quote Block"
                          >
                            <Quote className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          required
                          rows={8}
                          placeholder="Draft beautiful editorial content here..."
                          value={blogContent}
                          onChange={e => setBlogContent(e.target.value)}
                          className="w-full p-3 rounded-b-xl border border-gray-300 bg-white text-xs font-sans focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                        <button type="button" onClick={() => setIsBlogFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#d02326] text-white rounded-xl font-bold cursor-pointer">Save Article</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 4: NEWSLETTERS */}
        {activeSubTab === 'newsletters' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs">
              
              {/* Campaign Composer Form */}
              <div className="bg-gray-50/50 dark:bg-gray-850/15 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <Mail className="w-5 h-5 text-[#d02326]" />
                  <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">Compose Newsletter Campaign</h4>
                </div>
                
                <form onSubmit={handleSendCampaign} className="space-y-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Campaign Subject Line</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Hot Deals: Summer Auctions Launch Tomorrow!"
                      value={campaignSubject}
                      onChange={e => setCampaignSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">Campaign Body Markdown/HTML</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Compose deep insights, promote specific vehicles with images..."
                      value={campaignBody}
                      onChange={e => setCampaignBody(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs dark:bg-gray-900"
                    />
                  </div>

                  {sendingCampaign ? (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between font-bold text-[9px] uppercase tracking-wider text-[#d02326]">
                        <span>Simulated Server Dispatching Campaign...</span>
                        <span>{campaignProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d02326] rounded-full transition-all duration-300" style={{ width: `${campaignProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-[#d02326] hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                    >
                      <Send className="w-4 h-4" /> Dispatch Newsletter to Subscribers
                    </button>
                  )}
                </form>
              </div>

              {/* Subscribers List Panel */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-850">
                  <div className="p-4 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800">
                    <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">Active Subscriber List</h4>
                    <p className="text-[10px] text-gray-400">Total verified emails: {subscribers.filter(s => s.status === 'Subscribed').length}</p>
                  </div>
                  <div className="divide-y divide-gray-150 dark:divide-gray-800 max-h-80 overflow-y-auto">
                    {subscribers.map(sub => (
                      <div key={sub.id} className="p-3.5 hover:bg-gray-55/40 transition-colors flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">{sub.email}</span>
                          <span className="text-[9px] text-gray-400 font-mono block">Registered: {sub.date}</span>
                        </div>
                        <button
                          onClick={() => handleToggleSubscriber(sub.id, sub.email, sub.status)}
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-colors cursor-pointer uppercase tracking-wider ${
                            sub.status === 'Subscribed'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {sub.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
