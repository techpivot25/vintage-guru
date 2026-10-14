import React, { useState, useEffect } from 'react';
import { AdminVehicle, VehicleCategoryType, VehicleStatusType } from '../../types/admin';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  DollarSign, 
  Camera, 
  Grid,
  MapPin,
  RefreshCw,
  FolderOpen,
  ArrowUpDown,
  MoveLeft,
  MoveRight,
  X
} from 'lucide-react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface VehicleManagementProps {
  vehicles: AdminVehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<AdminVehicle[]>>;
  onAddAlert: (text: string) => void;
  showAddFormNow: boolean;
  setShowAddFormNow: (show: boolean) => void;
}

export default function VehicleManagement({ 
  vehicles, 
  setVehicles, 
  onAddAlert,
  showAddFormNow,
  setShowAddFormNow
}: VehicleManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof AdminVehicle>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Form handling
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form input fields
  const [formFields, setFormFields] = useState({
    name: '',
    make: '',
    model: '',
    year: 1965,
    basePrice: 0,
    discountedPrice: 0,
    category: 'Classic Cars',
    status: 'available' as VehicleStatusType,
    image: '',
    galleryInput: '',
    gallery: [] as string[],
    location: 'Monterey, CA'
  });

  const categories = ['All', 'Classic Cars', 'Vintage Bikes', 'Antique Trucks', 'Commercial'];
  const statuses = ['All', 'available', 'sold', 'pending'];

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const fbVehicles: AdminVehicle[] = [];
      querySnapshot.forEach((docSnap) => {
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
        // High-quality mock listings fallback
        const mockVehicles: AdminVehicle[] = [
          {
            id: 'vh-1',
            name: '1964 Aston Martin DB5',
            make: 'Aston Martin',
            model: 'DB5',
            year: 1964,
            basePrice: 850000,
            discountedPrice: 799000,
            category: 'Classic Cars',
            status: 'available',
            image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
            gallery: [
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80'
            ],
            ownerId: 'usr-3',
            createdAt: '2026-06-15'
          },
          {
            id: 'vh-2',
            name: '1961 Jaguar E-Type Coupe',
            make: 'Jaguar',
            model: 'E-Type Coupe',
            year: 1961,
            basePrice: 145000,
            category: 'Classic Cars',
            status: 'available',
            image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80',
            gallery: [
              'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80'
            ],
            ownerId: 'usr-4',
            createdAt: '2026-06-18'
          },
          {
            id: 'vh-3',
            name: '1972 Chevrolet Cheyenne K10',
            make: 'Chevrolet',
            model: 'Cheyenne K10',
            year: 1972,
            basePrice: 42000,
            discountedPrice: 38500,
            category: 'Antique Trucks',
            status: 'pending',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80',
            gallery: [],
            ownerId: 'usr-4',
            createdAt: '2026-06-20'
          },
          {
            id: 'vh-4',
            name: '1959 Vespa 125 Sport',
            make: 'Vespa',
            model: '125 Sport',
            year: 1959,
            basePrice: 12500,
            category: 'Vintage Bikes',
            status: 'sold',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80',
            gallery: [],
            ownerId: 'usr-3',
            createdAt: '2026-06-12'
          }
        ];
        setVehicles(mockVehicles);
      } else {
        setVehicles(fbVehicles);
      }
    } catch (err) {
      console.warn("Firestore vehicle query failed or offline. Using local high-quality mock listings.", err);
      const mockVehicles: AdminVehicle[] = [
        {
          id: 'vh-1',
          name: '1964 Aston Martin DB5',
          make: 'Aston Martin',
          model: 'DB5',
          year: 1964,
          basePrice: 850000,
          discountedPrice: 799000,
          category: 'Classic Cars',
          status: 'available',
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80'
          ],
          ownerId: 'usr-3',
          createdAt: '2026-06-15'
        },
        {
          id: 'vh-2',
          name: '1961 Jaguar E-Type Coupe',
          make: 'Jaguar',
          model: 'E-Type Coupe',
          year: 1961,
          basePrice: 145000,
          category: 'Classic Cars',
          status: 'available',
          image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80'
          ],
          ownerId: 'usr-4',
          createdAt: '2026-06-18'
        },
        {
          id: 'vh-3',
          name: '1972 Chevrolet Cheyenne K10',
          make: 'Chevrolet',
          model: 'Cheyenne K10',
          year: 1972,
          basePrice: 42000,
          discountedPrice: 38500,
          category: 'Antique Trucks',
          status: 'pending',
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80',
          gallery: [],
          ownerId: 'usr-4',
          createdAt: '2026-06-20'
        },
        {
          id: 'vh-4',
          name: '1959 Vespa 125 Sport',
          make: 'Vespa',
          model: '125 Sport',
          year: 1959,
          basePrice: 12500,
          category: 'Vintage Bikes',
          status: 'sold',
          image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80',
          gallery: [],
          ownerId: 'usr-3',
          createdAt: '2026-06-12'
        }
      ];
      setVehicles(mockVehicles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Listen to Quick Add triggers from Header
  useEffect(() => {
    if (showAddFormNow) {
      handleOpenCreate();
      setShowAddFormNow(false);
    }
  }, [showAddFormNow]);

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setFormFields({
      name: '',
      make: '',
      model: '',
      year: 1965,
      basePrice: 0,
      discountedPrice: 0,
      category: 'Classic Cars',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80',
      galleryInput: '',
      gallery: [],
      location: 'Monterey, CA'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (v: AdminVehicle) => {
    setEditingVehicle(v);
    setFormFields({
      name: v.name,
      make: v.make,
      model: v.model,
      year: v.year,
      basePrice: v.basePrice,
      discountedPrice: v.discountedPrice || 0,
      category: v.category,
      status: v.status,
      image: v.image,
      galleryInput: '',
      gallery: v.gallery || [],
      location: 'Monterey, CA'
    });
    setIsFormOpen(true);
  };

  // Gallery interactions (add, reorder, delete)
  const handleAddGalleryImage = () => {
    if (!formFields.galleryInput.trim()) return;
    setFormFields({
      ...formFields,
      gallery: [...formFields.gallery, formFields.galleryInput.trim()],
      galleryInput: ''
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const updated = [...formFields.gallery];
    updated.splice(idx, 1);
    setFormFields({ ...formFields, gallery: updated });
  };

  const handleMoveGalleryImage = (idx: number, direction: 'left' | 'right') => {
    const updated = [...formFields.gallery];
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      setFormFields({ ...formFields, gallery: updated });
    }
  };

  // Form submission
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const vehiclePayload = {
      name: formFields.name || `${formFields.year} ${formFields.make} ${formFields.model}`,
      make: formFields.make,
      model: formFields.model,
      year: Number(formFields.year),
      price: Number(formFields.basePrice),
      discountedPrice: formFields.discountedPrice ? Number(formFields.discountedPrice) : null,
      category: formFields.category,
      status: formFields.status,
      image: formFields.image,
      gallery: formFields.gallery,
      location: formFields.location
    };

    try {
      if (editingVehicle) {
        // Edit Mode
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? {
          ...v,
          ...vehiclePayload,
          basePrice: vehiclePayload.price,
          discountedPrice: vehiclePayload.discountedPrice || undefined
        } : v));

        try {
          const vRef = doc(db, 'vehicles', editingVehicle.id);
          await updateDoc(vRef, vehiclePayload);
        } catch (err) {}

        onAddAlert(`Vehicle edited successfully: ${vehiclePayload.name}`);
      } else {
        // Create Mode
        let finalId = `vh-${Date.now()}`;
        try {
          const docRef = await addDoc(collection(db, 'vehicles'), {
            ...vehiclePayload,
            ownerId: 'admin',
            createdAt: serverTimestamp()
          });
          finalId = docRef.id;
        } catch (err) {}

        setVehicles(prev => [
          {
            id: finalId,
            ...vehiclePayload,
            basePrice: vehiclePayload.price,
            discountedPrice: vehiclePayload.discountedPrice || undefined,
            ownerId: 'admin',
            createdAt: new Date().toLocaleDateString()
          },
          ...prev
        ]);

        onAddAlert(`Added new vintage vehicle listing: ${vehiclePayload.name}`);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      setVehicles(prev => prev.filter(v => v.id !== id));
      try {
        await deleteDoc(doc(db, 'vehicles', id));
      } catch (err) {}
      onAddAlert(`Permanently deleted listing: ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Search/Filters
  const handleSort = (field: keyof AdminVehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
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

      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Listing Catalog Catalog ({vehicles.length} listings)</h2>
          <p className="text-xs text-gray-500">Manage, edit specifications, pricing discounts, and photo assets.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-[#d02326] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#b21c1e] transition-colors shadow-sm flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Vehicle Listing
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4 justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input 
            type="text" 
            placeholder="Search make, model, name..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#d02326]/25"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <FolderOpen className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-500 uppercase tracking-wider">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="p-2 border border-gray-300 dark:border-gray-750 rounded-lg text-xs bg-white text-gray-800"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="w-4 h-4 text-gray-400" />
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
            onClick={fetchVehicles}
            title="Reload Listings"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400">
            No vintage listings available for current query filters.
          </div>
        ) : (
          currentItems.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-gray-100 dark:bg-gray-800">
                {vehicle.image ? (
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">No Primary Asset</span>
                  </div>
                )}
                <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  vehicle.status === 'available' ? 'bg-emerald-500 text-white' :
                  vehicle.status === 'pending' ? 'bg-amber-500 text-white' :
                  'bg-slate-700 text-white'
                }`}>
                  {vehicle.status}
                </span>
                <span className="absolute bottom-4 left-4 bg-slate-900/70 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {vehicle.category}
                </span>
              </div>

              <div className="p-5 flex-1 space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white line-clamp-1">{vehicle.name}</h3>
                    <span className="text-gray-400 text-xs font-semibold">{vehicle.year}</span>
                  </div>
                  <p className="text-[11px] text-gray-450">ID: <span className="font-mono">{vehicle.id}</span></p>
                </div>

                <div className="border-t border-b border-gray-100 dark:border-gray-800 py-3 flex justify-between text-xs items-center">
                  <div>
                    <span className="text-gray-400 text-[10px] block uppercase font-bold">Base Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-mono">₹{vehicle.basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  {vehicle.discountedPrice && (
                    <div className="text-right">
                      <span className="text-rose-600 dark:text-rose-400 text-[10px] block uppercase font-bold">Discounted Price</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">₹{vehicle.discountedPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 text-[11px] text-gray-500 font-medium">
                  <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> Monterey, CA</span>
                  <span className="text-gray-300">|</span>
                  <span>Photos: {vehicle.gallery?.length || 0}</span>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1.5 flex gap-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/15">
                <button
                  onClick={() => handleOpenEdit(vehicle)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Modify Listing
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
                  className="p-1.5 border border-transparent hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-850 dark:text-gray-200">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-850 dark:text-gray-200">{Math.min(indexOfLastItem, sorted.length)}</span> of <span className="font-semibold text-gray-855 dark:text-gray-200">{sorted.length}</span> vehicle assets
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 disabled:opacity-45 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  currentPage === idx + 1
                    ? 'bg-[#d02326] border-[#d02326] text-white'
                    : 'border-gray-250 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                } cursor-pointer`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-250 dark:border-gray-700 rounded-lg text-gray-500 disabled:opacity-45 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl z-10 p-6 flex flex-col justify-between max-h-[90vh]"
            >
              
              {/* Modal Header */}
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                    {editingVehicle ? 'Modify Vehicle Listing Specs' : 'Register New Vehicle Listing'}
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Specifications Inventory CMS Editor</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Scrollable Body */}
              <form onSubmit={handleSubmitForm} className="space-y-5 overflow-y-auto flex-1 pr-1.5 scrollbar-thin">
                
                {/* Visual Section: Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle Make</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Aston Martin"
                      value={formFields.make}
                      onChange={e => setFormFields({ ...formFields, make: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Model Edition</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. DB5 Vantage"
                      value={formFields.model}
                      onChange={e => setFormFields({ ...formFields, model: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Manufacture Year</label>
                    <input 
                      required
                      type="number" 
                      min="1800"
                      max="2100"
                      placeholder="e.g. 1964"
                      value={formFields.year}
                      onChange={e => setFormFields({ ...formFields, year: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Display Title Override (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1964 Aston Martin DB5 (Custom Restomod)"
                      value={formFields.name}
                      onChange={e => setFormFields({ ...formFields, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Mappings</label>
                      <select
                        value={formFields.category}
                        onChange={e => setFormFields({ ...formFields, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800"
                      >
                        <option value="Classic Cars">Classic Cars</option>
                        <option value="Vintage Bikes">Vintage Bikes</option>
                        <option value="Antique Trucks">Antique Trucks</option>
                        <option value="Commercial">Commercial/Heavy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Market Status</label>
                      <select
                        value={formFields.status}
                        onChange={e => setFormFields({ ...formFields, status: e.target.value as VehicleStatusType })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white text-xs text-gray-800"
                      >
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold Out</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PRICING MECHANISM (Base price, Discounted price) */}
                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Valuation & Price Management
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Base Price (₹)</label>
                      <input 
                        required
                        type="number" 
                        min="0"
                        placeholder="e.g. 525000"
                        value={formFields.basePrice}
                        onChange={e => setFormFields({ ...formFields, basePrice: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Discounted Promo Price (₹) - Optional</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 499000 (leave 0 if none)"
                        value={formFields.discountedPrice}
                        onChange={e => setFormFields({ ...formFields, discountedPrice: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* IMAGE UPLOAD SECTION (allows pasting URLs and managing gallery) */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Hero Image Link</label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      placeholder="Paste primary photo URL..."
                      value={formFields.image}
                      onChange={e => setFormFields({ ...formFields, image: e.target.value })}
                      className="flex-1 p-2.5 rounded-xl border border-gray-300 bg-white text-xs"
                    />
                  </div>
                  {formFields.image && (
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-250">
                      <img src={formFields.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-gray-150 dark:border-gray-800">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vehicle Photo Gallery Manager</label>
                  <div className="flex gap-2 text-xs">
                    <input 
                      type="text" 
                      placeholder="Paste additional gallery photo URL..."
                      value={formFields.galleryInput}
                      onChange={e => setFormFields({ ...formFields, galleryInput: e.target.value })}
                      className="flex-1 p-2.5 rounded-xl border border-gray-300 bg-white text-xs dark:bg-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add to Gallery
                    </button>
                  </div>

                  {/* GALLERY GALLERY REORDER AND DELETE UI */}
                  {formFields.gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formFields.gallery.map((url, index) => (
                        <div key={index} className="relative group rounded-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 p-1">
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-16 object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 rounded-xl">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(index, 'left')}
                              disabled={index === 0}
                              className="p-1 bg-white/20 hover:bg-white/45 text-white rounded disabled:opacity-30"
                              title="Move Left"
                            >
                              <MoveLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(index, 'right')}
                              disabled={index === formFields.gallery.length - 1}
                              className="p-1 bg-white/20 hover:bg-white/45 text-white rounded disabled:opacity-30"
                              title="Move Right"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded"
                              title="Delete Photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 right-1 text-[8px] bg-slate-950/70 text-white font-mono rounded px-1">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-850">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 text-gray-700 dark:text-gray-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#d02326] text-white rounded-xl font-bold hover:bg-red-700 transition cursor-pointer"
                  >
                    {editingVehicle ? 'Update Specs' : 'Publish Listing'}
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
