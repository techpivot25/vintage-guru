import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronRight, Fuel, Settings, Eye, HelpCircle, ArrowUpDown, Shield, SlidersHorizontal } from 'lucide-react';
import { INDIAN_POPULAR_CARS, CarData } from '../data/cars';

interface BudgetRangeConfig {
  title: string;
  min: number;
  max: number;
  seoDescription: string;
}

const BUDGET_CONFIGS: Record<string, BudgetRangeConfig> = {
  "under-5-lakh": {
    title: "Popular Cars Under ₹ 5 Lakh in India",
    min: 0,
    max: 5,
    seoDescription: "Browse the best cars under 5 Lakh in India. Check out popular models with their ex-showroom prices, mileage, user reviews, engine capacities, and key specifications."
  },
  "5-10-lakh": {
    title: "Popular Cars Between ₹ 5 - ₹ 10 Lakh in India",
    min: 5,
    max: 10,
    seoDescription: "Looking for cars between 5 Lakh and 10 Lakh? Explore top-rated compact SUVs, premium hatchbacks and sedans with detailed features, variants and user experiences."
  },
  "10-15-lakh": {
    title: "Popular Cars Between ₹ 10 - ₹ 15 Lakh in India",
    min: 10,
    max: 15,
    seoDescription: "Discover the best selling SUVs and sedans in the 10 Lakh to 15 Lakh budget segment. Read genuine customer reviews, check ex-showroom pricing, and get detailed mileage specs."
  },
  "15-20-lakh": {
    title: "Popular Cars Between ₹ 15 - ₹ 20 Lakh in India",
    min: 15,
    max: 20,
    seoDescription: "Find premium midsize SUVs and luxury sedans within the 15 Lakh to 20 Lakh price bracket. See popular models with high-tech features, ADAS levels, and safety ratings."
  },
  "20-30-lakh": {
    title: "Popular Cars Between ₹ 20 - ₹ 30 Lakh in India",
    min: 20,
    max: 30,
    seoDescription: "Explore luxury 7-seater SUVs and executive cars between 20 Lakh and 30 Lakh. Compare on-road prices, cabin comfort features, and performance specifications."
  },
  "over-30-lakh": {
    title: "Popular Cars Over ₹ 30 Lakh in India",
    min: 30,
    max: 1000,
    seoDescription: "Experience high-end premium and luxury cars priced above 30 Lakh in India. Explore rugged full-size off-roaders and luxury European brands with specifications."
  }
};

export default function BudgetCars() {
  const { range } = useParams<{ range: string }>();
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [cars, setCars] = useState<CarData[]>([]);

  // Get active config
  const activeSlug = range || 'under-5-lakh';
  const config = BUDGET_CONFIGS[activeSlug] || BUDGET_CONFIGS['under-5-lakh'];

  useEffect(() => {
    // Filter cars based on budget range
    const filtered = INDIAN_POPULAR_CARS.filter(car => {
      // Check if the car price overlaps with the budget range
      // A car overlaps if its minPrice is less than or equal to the budget's max,
      // and its maxPrice is greater than or equal to the budget's min.
      return car.minPrice <= config.max && car.maxPrice >= config.min;
    });

    // Apply fuel filter
    const fuelFiltered = filtered.filter(car => {
      if (selectedFuel === 'All') return true;
      return car.fuelType.toLowerCase().includes(selectedFuel.toLowerCase());
    });

    // Apply sorting
    const sorted = [...fuelFiltered];
    if (sortBy === 'low-to-high') {
      sorted.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'high-to-low') {
      sorted.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sortBy === 'mileage') {
      // Sort roughly based on numeric part of mileage text
      const getMinMileage = (str: string) => {
        const match = str.match(/\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
      };
      sorted.sort((a, b) => getMinMileage(b.mileage) - getMinMileage(a.mileage));
    }

    setCars(sorted);
  }, [range, selectedFuel, sortBy, config]);

  // Handle scroll to top on mount or param change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [range]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Link to="/" className="hover:text-[var(--color-brand-red)] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/explore" className="hover:text-[var(--color-brand-red)] transition-colors">New Cars</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-semibold">{config.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5 font-serif">
            {config.title}
          </h1>
          <p className="text-sm text-gray-600 max-w-4xl leading-relaxed">
            {config.seoDescription} We feature the most-searched models, high-comfort cabins, reliable engines, and excellent resale values in this segment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filters Sidebar (Left Column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--color-brand-red)]" />
                  Filters
                </h3>
                <button 
                  onClick={() => { setSelectedFuel('All'); setSortBy('popularity'); }}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Fuel Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Fuel Type</h4>
                <div className="space-y-2">
                  {['All', 'Petrol', 'CNG', 'Diesel', 'Electric'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-950 transition-colors">
                      <input 
                        type="radio" 
                        name="fuelType" 
                        checked={selectedFuel === fuel}
                        onChange={() => setSelectedFuel(fuel)}
                        className="w-4 h-4 border-gray-300 text-[var(--color-brand-red)] focus:ring-[var(--color-brand-red)] cursor-pointer"
                      />
                      <span>{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { value: 'popularity', label: 'Popularity' },
                    { value: 'low-to-high', label: 'Price: Low to High' },
                    { value: 'high-to-low', label: 'Price: High to Low' },
                    { value: 'mileage', label: 'Mileage: Highest First' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-950 transition-colors">
                      <input 
                        type="radio" 
                        name="sortBy" 
                        checked={sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                        className="w-4 h-4 border-gray-300 text-[var(--color-brand-red)] focus:ring-[var(--color-brand-red)] cursor-pointer"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Popular Budgets */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 text-sm uppercase tracking-wider">Explore Other Budgets</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { slug: 'under-5-lakh', label: 'Under ₹ 5 Lakh' },
                  { slug: '5-10-lakh', label: '₹ 5 - ₹ 10 Lakh' },
                  { slug: '10-15-lakh', label: '₹ 10 - ₹ 15 Lakh' },
                  { slug: '15-20-lakh', label: '₹ 15 - ₹ 20 Lakh' },
                  { slug: '20-30-lakh', label: '₹ 20 - ₹ 30 Lakh' },
                  { slug: 'over-30-lakh', label: 'Over ₹ 30 Lakh' }
                ].filter(b => b.slug !== activeSlug).map((b) => (
                  <Link 
                    key={b.slug}
                    to={`/budget/${b.slug}`}
                    className="p-2.5 border border-gray-100 rounded-lg text-xs font-semibold text-gray-700 hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] transition-colors text-center bg-gray-50/50"
                  >
                    {b.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Cars List (Right columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* List Stats */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex justify-between items-center shadow-sm">
              <p className="text-sm font-semibold text-gray-800">
                Found <span className="text-[var(--color-brand-red)] font-bold">{cars.length}</span> popular cars in this range
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                <Shield className="w-4 h-4 text-green-500" />
                <span>100% Verified Specifications</span>
              </div>
            </div>

            {/* Empty State */}
            {cars.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-[var(--color-brand-red)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">No Matching Cars</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  We currently don't have cars matching your specific fuel filter. Try selecting 'All' or explore other budget ranges!
                </p>
                <button 
                  onClick={() => { setSelectedFuel('All'); }}
                  className="bg-[var(--color-brand-red)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all shadow"
                >
                  Reset Fuel Filter
                </button>
              </div>
            )}

            {/* Cars Cards */}
            {cars.map((car) => {
              const avgRating = car.reviews.length > 0 
                ? (car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length).toFixed(1)
                : "4.8";

              return (
                <div 
                  key={car.id} 
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group relative"
                >
                  {/* Car Image Area */}
                  <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-100 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                      Popular Choice
                    </div>
                  </div>

                  {/* Car Content Area */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      {/* Name, Brand and Rating */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[var(--color-brand-red)] transition-colors leading-tight">
                            {car.name}
                          </h2>
                          <p className="text-xs font-mono text-gray-400 mt-0.5 tracking-wider uppercase font-semibold">
                            {car.make} Cars India
                          </p>
                        </div>
                        
                        {/* Rating block */}
                        <div className="flex items-center gap-1 bg-green-100 text-green-800 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{avgRating}</span>
                        </div>
                      </div>

                      {/* Pricing Info */}
                      <div className="mb-4">
                        <p className="text-xl font-extrabold text-[#d72c1c]">
                          {car.priceRange}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Avg. Ex-Showroom price
                        </p>
                      </div>

                      {/* Short Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-5">
                        {car.description}
                      </p>

                      {/* Main key specs strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-4 py-3.5 px-4 bg-gray-50 border border-gray-100 rounded-lg mb-6">
                        <div className="flex items-center gap-2.5">
                          <Fuel className="w-4 h-4 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fuel Type</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{car.fuelType}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Transmission</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{car.transmission}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mileage</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{car.mileage}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center border-t border-gray-100 pt-4">
                      <Link 
                        to={`/car/${car.id}`}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#d72c1c] text-white text-center text-sm font-bold rounded-lg hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Full Specifications</span>
                      </Link>
                      <Link 
                        to={`/car/${car.id}#reviews`}
                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 text-center text-sm font-semibold rounded-lg hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center gap-1.5"
                      >
                        <span>User Reviews</span>
                        <span className="text-xs text-gray-400 font-normal">({car.reviews.length})</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Informative Section styled like CarWale FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Frequently Asked Questions (FAQs)</h3>
              <div className="space-y-4 divide-y divide-gray-100">
                <div className="pt-4 first:pt-0">
                  <h4 className="font-bold text-gray-800 text-sm mb-1.5">What is the most popular car in this range?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Based on recent buyer traffic and queries, the most-searched car in this budget is highly regarded for its exceptional safety ratings, massive ground clearance, and reliable mileage. Check the specifications for individual models.
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-1.5">How do I calculate the On-Road price?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    On-Road price consists of Ex-showroom price, RTO registration charges, road tax, comprehensive car insurance, and other optional dealer packages. You can request customized quotes directly.
                  </p>
                </div>
              </div>
            </div>

          </div>
          
        </div>
        
      </div>
    </div>
  );
}
