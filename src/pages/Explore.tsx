import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { 
  MapPin, 
  Search, 
  X, 
  Shield, 
  Award, 
  Calendar, 
  Gauge, 
  Fuel, 
  Wrench, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Share2, 
  Heart, 
  ExternalLink, 
  Send,
  User,
  Car,
  ChevronRight,
  RefreshCw,
  Navigation,
  SlidersHorizontal,
  Filter,
  Check,
  Sparkles,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { HERITAGE_VEHICLES, HeritageVehicle } from '../data/heritageCars';

const PRESET_CITIES = [
  { name: 'Noida / NCR, India', lat: 28.5355, lng: 77.3910 },
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru, India', lat: 12.9716, lng: 77.5946 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
];

const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', logo: '🚘' },
  { name: 'Hyundai', logo: '🚙' },
  { name: 'Tata', logo: '🚘' },
  { name: 'Mahindra', logo: '🛻' },
  { name: 'Toyota', logo: '🚘' },
  { name: 'Ford', logo: '🏎️' },
  { name: 'Aston Martin', logo: '🏎️' },
  { name: 'Mercedes-Benz', logo: '✨' },
  { name: 'Chevrolet', logo: '🛻' },
  { name: 'Jaguar', logo: '🐆' },
  { name: 'Vespa', logo: '🛵' }
];

export default function Explore() {
  const location = useGeolocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ make?: string }>();
  const navigate = useNavigate();

  // Active Origin Coordinates for Distance Calculation
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 28.5355,
    lng: 77.3910,
    label: 'Noida / NCR, India'
  });
  
  // URL Param Initialization
  const initialType = searchParams.get('type') || 'All';
  const initialQuery = searchParams.get('q') || '';
  
  // Support slug /new-cars/maruti-suzuki
  let initialMake = searchParams.get('make') || '';
  if (!initialMake && routeParams.make) {
    initialMake = routeParams.make.replace(/-/g, ' ');
  }

  // Condition filter: 'all', 'new', 'used'
  let initialCondition = searchParams.get('condition') || 'all';
  if (window.location.pathname.includes('/new-cars')) {
    initialCondition = 'new';
  } else if (window.location.pathname.includes('/used-cars') || searchParams.get('used') === 'true') {
    initialCondition = 'used';
  }

  const [conditionFilter, setConditionFilter] = useState<string>(initialCondition);
  const [filterType, setFilterType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [selectedMake, setSelectedMake] = useState<string>(initialMake);
  const [makeSearchTerm, setMakeSearchTerm] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  
  // Budget presets
  const [budgetPreset, setBudgetPreset] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');

  // View switch: grid or list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Detail Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<HeritageVehicle | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'specs' | 'provenance' | 'inquire'>('overview');
  
  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquiryPhone, setInquiryPhone] = useState<string>('');
  const [inquiryMessage, setInquiryMessage] = useState<string>('');
  const [inquirySent, setInquirySent] = useState<boolean>(false);

  // Update active coordinates when GPS fixes
  useEffect(() => {
    if (location.loaded && location.coordinates && location.coordinates.lat !== 0) {
      setActiveCoords({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        label: `GPS Position (${location.coordinates.lat.toFixed(2)}, ${location.coordinates.lng.toFixed(2)})`
      });
    }
  }, [location]);

  // Sync state when URL param or route changes
  useEffect(() => {
    if (routeParams.make) {
      const normalized = routeParams.make.replace(/-/g, ' ');
      // match case insensitive with makes list
      const matched = HERITAGE_VEHICLES.find(v => v.make.toLowerCase() === normalized.toLowerCase())?.make || normalized;
      setSelectedMake(matched);
      setConditionFilter('new');
    } else {
      const queryMake = searchParams.get('make');
      if (queryMake) setSelectedMake(queryMake);
    }

    if (window.location.pathname.includes('/new-cars')) {
      setConditionFilter('new');
    } else if (window.location.pathname.includes('/used-cars') || searchParams.get('used') === 'true') {
      setConditionFilter('used');
    }

    const queryFuel = searchParams.get('fuelType');
    if (queryFuel) setSelectedFuel(queryFuel);

    const queryCity = searchParams.get('city');
    if (queryCity) {
      setSearchQuery(queryCity);
    }

    const queryBody = searchParams.get('bodyType');
    if (queryBody) {
      setSearchQuery(queryBody);
    }
  }, [routeParams, searchParams]);

  // Price formatter helper in Indian Rupees
  const formatPriceINR = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const resetAllFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedVariant('');
    setSelectedYear('');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setBudgetPreset('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setFilterType('All');
    setConditionFilter('all');
    setSearchParams({});
    if (routeParams.make) {
      navigate('/explore');
    }
  };

  // Filter vehicles
  const filteredVehicles = HERITAGE_VEHICLES.filter(v => {
    // Condition filter (new vs used/heritage)
    if (conditionFilter === 'new') {
      if (v.year < 2020 && !v.condition.toLowerCase().includes('brand new') && !v.odometer.includes('0 km')) {
        return false;
      }
    } else if (conditionFilter === 'used') {
      if (v.odometer.includes('0 km') || v.condition.toLowerCase().includes('brand new')) {
        return false;
      }
    }

    // Vehicle type
    const matchesType = filterType === 'All' || v.type === filterType;

    // Search Query
    const matchesQuery = !searchQuery || 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.variant.toLowerCase().includes(searchQuery.toLowerCase());

    // Make match (case insensitive)
    const matchesMake = !selectedMake || v.make.toLowerCase() === selectedMake.toLowerCase();
    const matchesModel = !selectedModel || v.model === selectedModel;
    const matchesVariant = !selectedVariant || v.variant === selectedVariant;
    const matchesYear = !selectedYear || v.year.toString() === selectedYear;

    // Fuel & Transmission
    const matchesFuel = selectedFuel === 'All' || v.fuelType.toLowerCase().includes(selectedFuel.toLowerCase());
    const matchesTransmission = selectedTransmission === 'All' || v.transmission.toLowerCase().includes(selectedTransmission.toLowerCase());

    // Price
    let matchesPrice = true;
    if (budgetPreset === 'under-5l') matchesPrice = v.price <= 500000;
    else if (budgetPreset === '5l-10l') matchesPrice = v.price >= 500000 && v.price <= 1000000;
    else if (budgetPreset === '10l-20l') matchesPrice = v.price >= 1000000 && v.price <= 2000000;
    else if (budgetPreset === '20l-50l') matchesPrice = v.price >= 2000000 && v.price <= 5000000;
    else if (budgetPreset === 'above-50l') matchesPrice = v.price >= 5000000;

    const matchesMinPrice = !minPrice || v.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || v.price <= Number(maxPrice);

    return matchesType && matchesQuery && matchesMake && matchesModel && matchesVariant && matchesYear && matchesFuel && matchesTransmission && matchesPrice && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.year - a.year;
    return a.numericId - b.numericId; // default popular
  });

  // Dynamic list of unique makes & models
  const allMakes = Array.from(new Set(HERITAGE_VEHICLES.map(v => v.make))).sort();
  const visibleMakes = allMakes.filter(m => m.toLowerCase().includes(makeSearchTerm.toLowerCase()));
  
  const availableModels = Array.from(new Set(HERITAGE_VEHICLES.filter(v => !selectedMake || v.make.toLowerCase() === selectedMake.toLowerCase()).map(v => v.model)));

  // Distance calculator
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "0";
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const boundedA = Math.min(1, Math.max(0, a));
    const c = 2 * Math.atan2(Math.sqrt(boundedA), Math.sqrt(1 - boundedA)); 
    const dist = R * c;
    return isNaN(dist) ? "0" : Math.round(dist).toLocaleString('en-IN'); 
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquirySent(true);
  };

  const handleGoBack = () => {
    if (selectedMake) {
      setSelectedMake('');
      if (routeParams.make) {
        navigate('/explore');
      }
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-slate-950 min-h-screen py-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Breadcrumbs & Back Navigation Button */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium flex-wrap">
            <button 
              onClick={handleGoBack} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#d02326] dark:hover:text-[#d02326] hover:border-[#d02326] dark:hover:border-[#d02326] transition-all cursor-pointer shadow-2xs mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#d02326]" />
              <span>Back</span>
            </button>
            <Link to="/" className="hover:text-[var(--color-brand-red)] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/explore" className="hover:text-[var(--color-brand-red)] transition-colors">Vehicles</Link>
            {conditionFilter === 'new' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-700 dark:text-gray-300 font-semibold">New Cars</span>
              </>
            )}
            {conditionFilter === 'used' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-700 dark:text-gray-300 font-semibold">Used Cars</span>
              </>
            )}
            {selectedMake && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 dark:text-white font-bold">{selectedMake}</span>
              </>
            )}
          </div>
        </div>

        {/* Page Title & Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              {selectedMake ? `${selectedMake} ${conditionFilter === 'new' ? 'New' : conditionFilter === 'used' ? 'Used' : ''} Cars in India` : conditionFilter === 'new' ? 'New Cars in India 2026' : conditionFilter === 'used' ? 'Certified Used & Vintage Cars in India' : 'Explore All Vehicles'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Explore latest prices, specifications, variants, mileage, features and verified deals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-gray-200 dark:border-slate-700"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#d02326]" />
              <span>Filters</span>
            </button>
            <div className="text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-[#d02326] px-3.5 py-2 rounded-xl border border-rose-100 dark:border-rose-900/50">
              {filteredVehicles.length} Cars Found
            </div>
          </div>
        </div>

        {/* Quick Popular Brand Pills Row */}
        <div className="mb-6 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
            Filter By Popular Brands
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setSelectedMake(''); if (routeParams.make) navigate('/explore'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${!selectedMake ? 'bg-[#d02326] text-white shadow' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              <span>🚗</span> All Brands
            </button>
            {POPULAR_BRANDS.map(brand => {
              const isSelected = selectedMake.toLowerCase() === brand.name.toLowerCase();
              return (
                <button
                  key={brand.name}
                  onClick={() => {
                    setSelectedMake(brand.name);
                    setSelectedModel('');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${isSelected ? 'bg-[#d02326] text-white border-[#d02326] shadow-sm' : 'bg-gray-50 dark:bg-slate-800/80 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:border-[#d02326]'}`}
                >
                  <span>{brand.logo}</span>
                  <span>{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Origin Header */}
        <div className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Calculated distances from your city
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeCoords.label}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeCoords.label}
              onChange={(e) => {
                const found = PRESET_CITIES.find(c => c.name === e.target.value);
                if (found) {
                  setActiveCoords({ lat: found.lat, lng: found.lng, label: found.name });
                }
              }}
              className="px-3 py-1.5 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              {PRESET_CITIES.map(c => (
                <option key={c.name} value={c.name}>📍 Origin: {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= MAIN TWO-COLUMN LAYOUT ================= */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT SIDEBAR FILTERS (CARS24 STYLE) */}
          <aside className={`w-full lg:w-72 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm shrink-0 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#d02326]" />
                <span>Filter Cars</span>
              </div>
              <button 
                onClick={resetAllFilters}
                className="text-[11px] text-[#d02326] font-bold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Condition: All / New / Used */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Car Condition</label>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setConditionFilter('all')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${conditionFilter === 'all' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setConditionFilter('new')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${conditionFilter === 'new' ? 'bg-[#d02326] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  New
                </button>
                <button
                  onClick={() => setConditionFilter('used')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${conditionFilter === 'used' ? 'bg-[#d02326] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  Used
                </button>
              </div>
            </div>

            {/* Brand / Make Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Brand / Make</label>
                {selectedMake && (
                  <button onClick={() => setSelectedMake('')} className="text-[10px] text-gray-400 hover:text-red-500">Clear</button>
                )}
              </div>
              
              <div className="relative mb-2">
                <input 
                  type="text" 
                  placeholder="Search brand (e.g. Maruti)..." 
                  value={makeSearchTerm}
                  onChange={(e) => setMakeSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-[#d02326]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {visibleMakes.map(make => {
                  const isSelected = selectedMake.toLowerCase() === make.toLowerCase();
                  const count = HERITAGE_VEHICLES.filter(v => v.make.toLowerCase() === make.toLowerCase()).length;
                  return (
                    <button
                      key={make}
                      onClick={() => {
                        setSelectedMake(isSelected ? '' : make);
                        setSelectedModel('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSelected ? 'bg-rose-50 dark:bg-rose-950/50 text-[#d02326] font-bold border border-rose-200 dark:border-rose-900' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                    >
                      <span className="truncate">{make}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#d02326] text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Filter (If make selected) */}
            {selectedMake && availableModels.length > 0 && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Model</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none"
                >
                  <option value="">All {selectedMake} Models</option>
                  {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Price / Budget Filter */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Budget Range</label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Budgets' },
                  { id: 'under-5l', label: 'Under ₹5 Lakh' },
                  { id: '5l-10l', label: '₹5 Lakh - ₹10 Lakh' },
                  { id: '10l-20l', label: '₹10 Lakh - ₹20 Lakh' },
                  { id: '20l-50l', label: '₹20 Lakh - ₹50 Lakh' },
                  { id: 'above-50l', label: 'Above ₹50 Lakh' },
                ].map(b => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#d02326]">
                    <input 
                      type="radio" 
                      name="budget" 
                      checked={budgetPreset === b.id} 
                      onChange={() => setBudgetPreset(b.id)} 
                      className="accent-[#d02326]" 
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Min/Max price */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <input 
                  type="number" 
                  placeholder="Min ₹" 
                  value={minPrice} 
                  onChange={e => setMinPrice(e.target.value)}
                  className="p-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none"
                />
                <input 
                  type="number" 
                  placeholder="Max ₹" 
                  value={maxPrice} 
                  onChange={e => setMaxPrice(e.target.value)}
                  className="p-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Fuel Type</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'].map(fuel => (
                  <button
                    key={fuel}
                    onClick={() => setSelectedFuel(fuel)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${selectedFuel === fuel ? 'bg-[#d02326] text-white border-[#d02326]' : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700'}`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Transmission</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Manual', 'Automatic'].map(trans => (
                  <button
                    key={trans}
                    onClick={() => setSelectedTransmission(trans)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${selectedTransmission === trans ? 'bg-[#d02326] text-white border-[#d02326]' : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700'}`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type Filter */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Body / Category</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 text-xs border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Car">Cars / SUVs</option>
                <option value="Two-Wheeler">Two-Wheelers / Bikes</option>
                <option value="Truck">Trucks / Pickups</option>
              </select>
            </div>

          </aside>

          {/* RIGHT CAR LISTING SECTION */}
          <main className="flex-1 space-y-6">
            
            {/* Top Toolbar: Search, Active Tags, Sort By, View Mode */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search model, variant or keyword..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-[#d02326]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort By & View Switches */}
                <div className="flex items-center gap-2 justify-end">
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                    <span className="text-gray-400 text-[10px] uppercase font-bold pl-1.5">Sort:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-gray-800 dark:text-gray-200 font-bold outline-none cursor-pointer pr-1"
                    >
                      <option value="popular" className="bg-white dark:bg-slate-900">Popularity</option>
                      <option value="price-low" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                      <option value="price-high" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                      <option value="newest" className="bg-white dark:bg-slate-900">Year: Newest First</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-[#d02326] shadow-sm' : 'text-gray-400'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-[#d02326] shadow-sm' : 'text-gray-400'}`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Active Filter Badges */}
              {(selectedMake || searchQuery || selectedFuel !== 'All' || selectedTransmission !== 'All' || budgetPreset !== 'all' || conditionFilter !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Filters:</span>
                  {conditionFilter !== 'all' && (
                    <span className="bg-rose-50 text-[#d02326] px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-rose-100">
                      Condition: {conditionFilter.toUpperCase()}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setConditionFilter('all')} />
                    </span>
                  )}
                  {selectedMake && (
                    <span className="bg-rose-50 text-[#d02326] px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-rose-100">
                      Brand: {selectedMake}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => { setSelectedMake(''); if (routeParams.make) navigate('/explore'); }} />
                    </span>
                  )}
                  {selectedFuel !== 'All' && (
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                      Fuel: {selectedFuel}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFuel('All')} />
                    </span>
                  )}
                  {selectedTransmission !== 'All' && (
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                      Trans: {selectedTransmission}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTransmission('All')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                      Search: "{searchQuery}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  <button onClick={resetAllFilters} className="text-[10px] text-gray-400 hover:text-red-500 underline ml-auto font-semibold">Clear All</button>
                </div>
              )}
            </div>

            {/* CAR CARDS CONTAINER */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 my-4 shadow-sm">
                <Car className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Cars Match Your Filters</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Try relaxing your search parameters or selecting a different brand.</p>
                <button 
                  onClick={resetAllFilters}
                  className="bg-[#d02326] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 shadow-sm cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => {
                  const distanceKm = getDistance(activeCoords.lat, activeCoords.lng, vehicle.lat, vehicle.lng);
                  const isNewCar = vehicle.year >= 2020 || vehicle.condition.toLowerCase().includes('brand new') || vehicle.odometer.includes('0 km');
                  const emiMonthly = Math.round((vehicle.price * 0.8 * 0.09) / 12);

                  return (
                    <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col">
                      {/* Image Frame */}
                      <Link to={`/car/${vehicle.id}`} className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-slate-800 block">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${isNewCar ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                            {isNewCar ? 'BRAND NEW' : 'CERTIFIED USED'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                          {vehicle.year}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-1">
                          <Link to={`/car/${vehicle.id}`} className="hover:text-[#d02326] transition-colors">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">{vehicle.name}</h3>
                          </Link>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                            {vehicle.variant}
                          </div>
                        </div>

                        {/* Location & Distance */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400 my-2 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#d02326] shrink-0" />
                          <span className="truncate">{vehicle.location}</span>
                          <span className="text-[#d02326] font-bold shrink-0 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.2 rounded ml-auto">
                            {distanceKm} km away
                          </span>
                        </div>

                        {/* Specs Summary Pill */}
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-gray-50 dark:bg-slate-800/80 p-2 rounded-xl border border-gray-100 dark:border-slate-800 my-3">
                          <div className="truncate text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-gray-400" />
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <div className="truncate text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-gray-400" />
                            <span>{vehicle.transmission.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Price & EMI */}
                        <div className="border-t border-gray-100 dark:border-slate-800 pt-3 mt-auto">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ex-Showroom Price</span>
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              EMI from ₹{emiMonthly.toLocaleString('en-IN')}/mo
                            </span>
                          </div>
                          <div className="text-xl font-extrabold text-gray-900 dark:text-white font-mono mb-3">
                            {formatPriceINR(vehicle.price)}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Link 
                              to={`/car/${vehicle.id}`}
                              className="bg-[#d02326] hover:bg-red-700 text-white py-2 rounded-xl text-xs uppercase font-bold transition-all shadow-sm text-center"
                            >
                              View Details
                            </Link>
                            <Link 
                              to={`/price-in/noida/car/${vehicle.id}`}
                              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 py-2 rounded-xl text-[11px] font-bold transition-all text-center border border-gray-200 dark:border-slate-700 truncate px-1"
                            >
                              On-Road Price
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredVehicles.map(vehicle => {
                  const distanceKm = getDistance(activeCoords.lat, activeCoords.lng, vehicle.lat, vehicle.lng);
                  const isNewCar = vehicle.year >= 2020 || vehicle.condition.toLowerCase().includes('brand new') || vehicle.odometer.includes('0 km');
                  const emiMonthly = Math.round((vehicle.price * 0.8 * 0.09) / 12);

                  return (
                    <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-5 items-stretch">
                      {/* Image */}
                      <Link to={`/car/${vehicle.id}`} className="sm:w-64 h-44 rounded-xl overflow-hidden relative bg-gray-100 shrink-0 block">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name} 
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-white ${isNewCar ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                          {isNewCar ? 'NEW' : 'USED'}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <Link to={`/car/${vehicle.id}`} className="hover:text-[#d02326] transition-colors">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{vehicle.name}</h3>
                              </Link>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{vehicle.variant} | {vehicle.year}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-extrabold text-gray-900 dark:text-white font-mono">{formatPriceINR(vehicle.price)}</div>
                              <div className="text-[10px] text-emerald-600 font-bold">EMI from ₹{emiMonthly.toLocaleString('en-IN')}/mo</div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{vehicle.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-3">
                            <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium">{vehicle.fuelType}</span>
                            <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium">{vehicle.transmission}</span>
                            <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium">{vehicle.engine}</span>
                            <span className="text-[#d02326] font-bold text-xs flex items-center gap-1 ml-auto">
                              <MapPin className="w-3.5 h-3.5" /> {vehicle.location} ({distanceKm} km away)
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                          <Link 
                            to={`/car/${vehicle.id}`}
                            className="bg-[#d02326] hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs uppercase font-bold transition-all text-center"
                          >
                            View Details
                          </Link>
                          <Link 
                            to={`/price-in/noida/car/${vehicle.id}`}
                            className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all text-center border border-gray-200 dark:border-slate-700"
                          >
                            Check On-Road Price
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
