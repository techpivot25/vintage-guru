import React, { useState, useRef, useCallback } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Search, ChevronRight, PlayCircle, Star, Zap, Fuel, Car, CalendarRange, Navigation, BadgePercent, CarFront, Truck, BusFront, Gem, Wind, ChevronLeft, Mic, MicOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CityIcon } from '../components/CityIcons';
import AnimateInView from '../components/AnimateInView';
import BrandLogo from '../components/BrandLogo';
import { useUserLocation } from '../hooks/useUserLocation';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { HERITAGE_VEHICLES } from '../data/heritageCars';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Car');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'brand' | 'budget'>('text');
  
  // Custom Hook
  const userCity = useUserLocation();

  // Budget state
  const [minBudget, setMinBudget] = useState<number | ''>('');
  const [maxBudget, setMaxBudget] = useState<number | ''>('');
  
  const navigate = useNavigate();
  const cityScrollRef = useRef<HTMLDivElement>(null);

  const scrollCities = (direction: 'left' | 'right') => {
    if (cityScrollRef.current) {
      const { scrollLeft, clientWidth } = cityScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      cityScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleVoiceResult = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const { isListening, toggleListening } = useSpeechRecognition({ onResult: handleVoiceResult });

  const handleSearch = () => {
    navigate(`/explore?type=${activeTab}&q=${encodeURIComponent(searchQuery)}`);
  };

  const handleBudgetSearch = () => {
    navigate(`/explore?type=${activeTab}&minPrice=${minBudget || 0}&maxPrice=${maxBudget || 10000000}`);
  };

  const handleBrandSelect = (brandName: string) => {
    navigate(`/explore?type=${activeTab}&make=${encodeURIComponent(brandName)}`);
  };

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'Two-Wheeler': return 'Type to select motorcycle name, e.g. Royal Enfield';
      case 'Truck': return 'Type to select truck name, e.g. Chevrolet C10';
      default: return 'Type to select car name, e.g. Aston Martin';
    }
  };

  const BRANDS = [
    { name: "Maruti Suzuki", logo: "https://logo.clearbit.com/marutisuzuki.com" },
    { name: "Tata", logo: "https://logo.clearbit.com/tatamotors.com" },
    { name: "Mahindra", logo: "https://logo.clearbit.com/mahindra.com" },
    { name: "Hyundai", logo: "https://logo.clearbit.com/hyundai.com" },
    { name: "Toyota", logo: "https://logo.clearbit.com/toyota.com" },
    { name: "Kia", logo: "https://logo.clearbit.com/kia.com" },
    { name: "Skoda", logo: "https://logo.clearbit.com/skoda-auto.com" },
    { name: "BMW", logo: "https://logo.clearbit.com/bmw.com" },
    { name: "Volkswagen", logo: "https://logo.clearbit.com/vw.com" },
    { name: "MG", logo: "https://logo.clearbit.com/mgmotor.co.in" },
    { name: "Renault", logo: "https://logo.clearbit.com/renault.co.in" },
    { name: "Mercedes-Benz", logo: "https://logo.clearbit.com/mercedes-benz.com" },
    { name: "Honda", logo: "https://logo.clearbit.com/honda.com" },
    { name: "Land Rover", logo: "https://logo.clearbit.com/landrover.com" },
    { name: "Nissan", logo: "https://logo.clearbit.com/nissan-global.com" },
    { name: "Audi", logo: "https://logo.clearbit.com/audi.com" },
    { name: "Citroen", logo: "https://logo.clearbit.com/citroen.com" },
    { name: "Jeep", logo: "https://logo.clearbit.com/jeep.com" },
    { name: "BYD", logo: "https://logo.clearbit.com/byd.com" },
    { name: "VinFast", logo: "https://logo.clearbit.com/vinfastauto.com" },
    { name: "Volvo", logo: "https://logo.clearbit.com/volvocars.com" },
    { name: "Porsche", logo: "https://logo.clearbit.com/porsche.com" },
    { name: "Lexus", logo: "https://logo.clearbit.com/lexus.com" },
    { name: "Mini", logo: "https://logo.clearbit.com/mini.com" },
    { name: "Force Motors", logo: "https://logo.clearbit.com/forcemotors.com" },
    { name: "JSW", logo: "https://logo.clearbit.com/jsw.in" },
    { name: "Jaguar", logo: "https://logo.clearbit.com/jaguar.com" },
    { name: "Lamborghini", logo: "https://logo.clearbit.com/lamborghini.com" },
    { name: "Ferrari", logo: "https://logo.clearbit.com/ferrari.com" },
    { name: "Rolls-Royce", logo: "https://logo.clearbit.com/rolls-roycemotorcars.com" },
    { name: "Isuzu", logo: "https://logo.clearbit.com/isuzu.co.jp" },
    { name: "Maserati", logo: "https://logo.clearbit.com/maserati.com" },
    { name: "Tesla", logo: "https://logo.clearbit.com/tesla.com" },
    { name: "Aston Martin", logo: "https://logo.clearbit.com/astonmartin.com" },
    { name: "McLaren", logo: "https://logo.clearbit.com/mclaren.com" },
    { name: "Bentley", logo: "https://logo.clearbit.com/bentleymotors.com" },
    { name: "Lotus", logo: "https://logo.clearbit.com/lotuscars.com" },
    { name: "OLA", logo: "https://logo.clearbit.com/olaelectric.com" },
    { name: "Genesis", logo: "https://logo.clearbit.com/genesis.com" },
    { name: "Leapmotor", logo: "https://logo.clearbit.com/leapmotor.com" },
    { name: "Pravaig", logo: "https://logo.clearbit.com/pravaig.com" },
    { name: "Fisker", logo: "https://logo.clearbit.com/fiskerinc.com" }
  ];

  const MOTORCYCLE_BRANDS = [
    { name: "Royal Enfield", logo: "https://logo.clearbit.com/royalenfield.com" },
    { name: "Vespa", logo: "https://logo.clearbit.com/vespa.com" },
    { name: "Harley-Davidson", logo: "https://logo.clearbit.com/harley-davidson.com" },
    { name: "Triumph", logo: "https://logo.clearbit.com/triumphmotorcycles.com" },
    { name: "Honda", logo: "https://logo.clearbit.com/honda.com" },
    { name: "Yamaha", logo: "https://logo.clearbit.com/yamaha-motor.com" },
    { name: "Kawasaki", logo: "https://logo.clearbit.com/kawasaki.com" },
    { name: "Suzuki", logo: "https://logo.clearbit.com/suzuki.com" },
    { name: "BMW", logo: "https://logo.clearbit.com/bmw.com" },
    { name: "Ducati", logo: "https://logo.clearbit.com/ducati.com" },
    { name: "Indian Motorcycle", logo: "https://logo.clearbit.com/indianmotorcycle.com" },
    { name: "Norton", logo: "https://logo.clearbit.com/nortonmotorcycles.com" }
  ];

  const TRUCK_BRANDS = [
    { name: "Chevrolet", logo: "https://logo.clearbit.com/chevrolet.com" },
    { name: "Ford", logo: "https://logo.clearbit.com/ford.com" },
    { name: "GMC", logo: "https://logo.clearbit.com/gmc.com" },
    { name: "Dodge", logo: "https://logo.clearbit.com/dodge.com" },
    { name: "Mack", logo: "https://logo.clearbit.com/macktrucks.com" },
    { name: "Kenworth", logo: "https://logo.clearbit.com/kenworth.com" },
    { name: "Peterbilt", logo: "https://logo.clearbit.com/peterbilt.com" },
    { name: "International", logo: "https://logo.clearbit.com/internationaltrucks.com" },
    { name: "Tata", logo: "https://logo.clearbit.com/tatamotors.com" },
    { name: "Volvo", logo: "https://logo.clearbit.com/volvotrucks.com" },
    { name: "Ashok Leyland", logo: "https://logo.clearbit.com/ashokleyland.com" },
    { name: "Scania", logo: "https://logo.clearbit.com/scania.com" }
  ];

  const getActiveBrands = () => {
    if (activeTab === 'Two-Wheeler') return MOTORCYCLE_BRANDS;
    if (activeTab === 'Truck') return TRUCK_BRANDS;
    return BRANDS;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[var(--color-page-bg)] pt-12 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-3">
              Find the right vintage car
            </h1>
            <p className="text-base md:text-lg text-[var(--color-text-muted)]">
              Research, buy, and sell classic cars and motorcycles with confidence.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)] p-2">
            <div className="flex border-b border-[var(--color-border)] mb-4">
              <button 
                onClick={() => setActiveTab('Car')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'Car' ? 'text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-b-2 border-transparent'}`}
              >
                Vintage Cars
              </button>
              <button 
                onClick={() => setActiveTab('Two-Wheeler')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'Two-Wheeler' ? 'text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-b-2 border-transparent'}`}
              >
                Motorcycles
              </button>
              <button 
                onClick={() => setActiveTab('Truck')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'Truck' ? 'text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-b-2 border-transparent'}`}
              >
                Trucks & Buses
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex gap-4 text-sm mb-4">
                <button 
                  onClick={() => setSearchMode('text')}
                  className={`font-semibold border px-4 py-2 rounded transition-colors ${searchMode === 'text' ? 'bg-[var(--color-brand-red)] text-white border-[var(--color-brand-red)]' : 'text-[var(--color-text-main)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'}`}
                >
                  By Text
                </button>
                <button 
                  onClick={() => setSearchMode('brand')}
                  className={`font-semibold border px-4 py-2 rounded transition-colors ${searchMode === 'brand' ? 'bg-[var(--color-brand-red)] text-white border-[var(--color-brand-red)]' : 'text-[var(--color-text-main)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'}`}
                >
                  By Brand
                </button>
                <button 
                  onClick={() => setSearchMode('budget')}
                  className={`font-semibold border px-4 py-2 rounded transition-colors ${searchMode === 'budget' ? 'bg-[var(--color-brand-red)] text-white border-[var(--color-brand-red)]' : 'text-[var(--color-text-main)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'}`}
                >
                  By Budget
                </button>
              </div>

              {searchMode === 'text' && (
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                  <div className="flex-1 relative">
                    <div className="flex bg-white border border-[var(--color-border)] rounded overflow-hidden focus-within:border-[var(--color-brand-red)] transition-colors">
                      <span className="pl-4 pr-2 py-3 flex items-center text-gray-400">
                        <Search className="w-5 h-5" />
                      </span>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={getPlaceholder()} 
                        className="w-full py-3 pr-4 outline-none text-sm text-[var(--color-text-main)]"
                      />
                      <button
                        onClick={toggleListening}
                        className={`pr-4 flex items-center transition-colors ${isListening ? 'text-[#d72c1c] animate-pulse' : 'text-gray-400 hover:text-[#d72c1c]'}`}
                        title={isListening ? "Listening..." : "Search by voice"}
                      >
                        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-[var(--color-brand-red)] text-white px-8 py-3 rounded text-sm font-bold hover:bg-opacity-90 transition-all whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              )}

              {searchMode === 'brand' && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-2">
                  {getActiveBrands().map((brand) => (
                    <button
                      key={brand.name}
                      onClick={() => handleBrandSelect(brand.name)}
                      className="border border-[var(--color-border)] rounded-lg p-4 flex flex-col items-center justify-center hover:border-[var(--color-brand-red)] hover:shadow-sm transition-all bg-gray-50 hover:bg-white group"
                    >
                      <BrandLogo logo={brand.logo} name={brand.name} className="h-10 w-auto" />
                      <span className="text-xs font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors">{brand.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchMode === 'budget' && (
                <div className="p-4 border border-[var(--color-border)] rounded-lg bg-gray-50 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 w-full flex flex-col space-y-4 text-sm font-semibold">
                    <div className="flex justify-between text-[var(--color-text-main)]">
                      <span>Min: ₹{minBudget ? minBudget.toLocaleString('en-IN') : '0'}</span>
                      <span>Max: ₹{maxBudget ? maxBudget.toLocaleString('en-IN') : '1,00,00,000+'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10000000" 
                      step="100000"
                      value={maxBudget || 10000000}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-red)]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : '')}
                      className="w-28 p-2 border border-[var(--color-border)] rounded outline-none focus:border-[var(--color-brand-red)] text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : '')}
                      className="w-28 p-2 border border-[var(--color-border)] rounded outline-none focus:border-[var(--color-brand-red)] text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleBudgetSearch}
                    className="bg-[var(--color-brand-red)] text-white px-8 py-3 rounded text-sm font-bold hover:bg-opacity-90 transition-all whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="bg-white py-12 border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center p-4">
              <ShieldCheck className="w-12 h-12 text-[var(--color-brand-red)] mb-4" />
              <h3 className="text-[var(--color-text-main)] font-bold text-lg mb-2">Verified Sellers</h3>
              <p className="text-[var(--color-text-muted)] text-sm">Every high-end listing undergoes strict verification.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Search className="w-12 h-12 text-[var(--color-brand-red)] mb-4" />
              <h3 className="text-[var(--color-text-main)] font-bold text-lg mb-2">Heritage Storytelling</h3>
              <p className="text-[var(--color-text-muted)] text-sm">Original vs restored parts documented clearly.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <MapPin className="w-12 h-12 text-[var(--color-brand-red)] mb-4" />
              <h3 className="text-[var(--color-text-main)] font-bold text-lg mb-2">Global Community</h3>
              <p className="text-[var(--color-text-muted)] text-sm">Connect with collectors and museums worldwide.</p>
            </div>
          </div>
        </AnimateInView>
      </section>

      {/* Trending Cars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">Trending Cars</h2>
            <p className="text-[var(--color-text-muted)] text-sm">Most popular vehicles currently listed</p>
          </div>
          <Link to="/explore" className="text-[var(--color-brand-red)] text-sm font-semibold hover:underline hidden md:block">
            View All Offers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link to="/car/1" className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col cursor-pointer">
            <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
              <div className="absolute top-3 left-3 bg-white text-[var(--color-text-main)] text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                Premium
              </div>
              <img src="https://images.unsplash.com/photo-1532989508544-b0ec6d1ed1dc?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="1934 Packard Twelve" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors mb-1">1934 Packard Twelve</h3>
                <p className="text-xs font-semibold text-gray-500">Pre-War Classics</p>
              </div>
              <div className="pt-3 border-t border-gray-100 mt-2 flex justify-between items-center">
                <span className="font-bold text-lg">₹2,45,00,000</span>
                <span className="text-[var(--color-brand-red)] text-sm font-semibold group-hover:underline">View Details</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to="/car/2" className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col cursor-pointer">
             <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
              <div className="absolute top-3 left-3 bg-white text-[var(--color-text-main)] text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                Verified
              </div>
              <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Vintage Motorcycle" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors mb-1">1948 Indian Chief</h3>
                <p className="text-xs font-semibold text-gray-500">Vintage Two-Wheelers</p>
              </div>
              <div className="pt-3 border-t border-gray-100 mt-2 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-500 line-through mr-2"></span>
                <span className="font-bold text-lg">Inquire Price</span>
                <span className="text-[var(--color-brand-red)] text-sm font-semibold group-hover:underline">Contact Seller</span>
              </div>
            </div>
          </Link>

          {/* Card 3 - Promo */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group flex flex-col justify-center items-center text-center p-8">
            <h3 className="font-bold text-2xl text-[var(--color-text-main)] mb-3">Sell your car at the <span className="text-[var(--color-brand-red)]">best price</span></h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-6">List your vehicle to our global community of collectors.</p>
            <Link to="/marketplace" className="bg-[var(--color-brand-red)] text-white px-6 py-2 rounded font-bold hover:bg-opacity-90 transition-colors shadow">
              Start Listing
            </Link>
          </div>
        </div>
        </AnimateInView>
      </section>

      {/* Select Location */}
      <section className="py-12 bg-[#f4f7f8]">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-4">Select Location</h2>
          
          <div className="max-w-xl relative mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type your City, e.g. Mumbai, Delhi, Bengaluru"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[var(--color-brand-red)] text-sm bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    navigate(`/explore?city=${encodeURIComponent(e.currentTarget.value.trim())}`);
                  }
                }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">Popular Cities</p>
          
          <div className="relative group/scroll">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block">
              <button 
                onClick={() => scrollCities('left')}
                className="bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 hover:text-[#d02326] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div 
              ref={cityScrollRef}
              className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mb-4 snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Navi Mumbai', 'Hyderabad',
                'Ahmedabad', 'Chennai', 'Kolkata', 'Chandigarh'
              ].map((city) => (
                <div 
                  key={city} 
                  onClick={() => navigate(`/explore?city=${encodeURIComponent(city)}`)}
                  className="flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center hover:border-[var(--color-brand-red)] hover:shadow transition-all cursor-pointer w-32 h-28 group"
                >
                  <CityIcon city={city} className="w-10 h-10 text-gray-500 group-hover:text-[var(--color-brand-red)] mb-3 transition-colors stroke-[1.5]" />
                  <span className="text-sm font-medium text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors text-center">{city}</span>
                </div>
              ))}
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block">
              <button 
                onClick={() => scrollCities('right')}
                className="bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 hover:text-[#d02326] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </AnimateInView>
      </section>

      {/* Popular Used Cars in India & Popular Cars By Budget */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Used Cars */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Popular Used Cars</h2>
                <Link to="/explore?used=true" className="text-[var(--color-brand-red)] text-sm font-semibold hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {HERITAGE_VEHICLES.filter(v => v.type === 'Car').slice(0, 3).map((car) => {
                  const formattedPrice = car.price >= 10000000 
                    ? `₹ ${(car.price / 10000000).toFixed(2)} Crore`
                    : `₹ ${(car.price / 100000).toFixed(2)} Lakh`;
                    
                  return (
                    <Link key={car.id} to={`/car/${car.id}`} className="flex gap-4 bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md shadow-2xs transition-all cursor-pointer group">
                      <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={car.image} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          alt={car.name} 
                        />
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1">{car.name}</h3>
                          <p className="text-xs text-gray-500 mt-1.5 flex gap-2 items-center">
                            <Navigation className="w-3 h-3 text-[#d02326]"/> {car.odometer} • <Fuel className="w-3 h-3 text-[#d02326]"/> {car.fuelType}
                          </p>
                        </div>
                        <p className="font-bold text-base text-[var(--color-text-main)]">{formattedPrice}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Popular Cars By Budget */}
            <div>
               <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Popular Cars By Budget</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Under ₹ 5 Lakh', slug: 'under-5-lakh' },
                  { label: '₹ 5 - ₹ 10 Lakh', slug: '5-10-lakh' },
                  { label: '₹ 10 - ₹ 15 Lakh', slug: '10-15-lakh' },
                  { label: '₹ 15 - ₹ 20 Lakh', slug: '15-20-lakh' },
                  { label: '₹ 20 - ₹ 30 Lakh', slug: '20-30-lakh' },
                  { label: 'Over ₹ 30 Lakh', slug: 'over-30-lakh' }
                ].map((item) => (
                  <Link 
                    key={item.slug} 
                    to={`/budget/${item.slug}`}
                    className="border border-gray-200 bg-white rounded-lg p-4 font-semibold text-sm text-center text-[var(--color-text-main)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] hover:shadow-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 h-24"
                  >
                     <span className="text-[var(--color-text-main)] transition-colors duration-200 hover:text-inherit">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimateInView>
      </section>

      {/* Cars Above 10 Lakh */}
      <section className="py-12 bg-white border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Cars Above 10 Lakh</h2>
            <Link to="/explore?minPrice=1000000" className="text-[var(--color-brand-red)] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HERITAGE_VEHICLES.filter(v => v.price >= 1000000).slice(0, 4).map((car) => {
              const formattedPrice = car.price >= 10000000 
                ? `₹ ${(car.price / 10000000).toFixed(2)} Crore`
                : `₹ ${(car.price / 100000).toFixed(2)} Lakh`;

              return (
                <Link to={`/car/${car.id}`} key={car.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all cursor-pointer flex flex-col bg-white">
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm">Premium</div>
                    <img src={car.image} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={car.name}/>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors mb-2 line-clamp-1">{car.name}</h3>
                    <p className="font-bold text-xl text-[var(--color-text-main)]">{formattedPrice}</p>
                    <p className="text-xs text-gray-500 mt-1">{car.location}</p>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 mt-auto bg-gray-50 flex justify-center group-hover:bg-[var(--color-brand-red)] transition-colors">
                    <span className="text-sm font-semibold text-[var(--color-brand-red)] group-hover:text-white transition-colors">Show Price Details</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </AnimateInView>
      </section>

      {/* Get Offers on Popular Cars */}
      <section className="bg-gray-100 border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[var(--color-brand-red)] to-red-800 rounded-xl my-12 overflow-hidden shadow-xl mx-4 sm:mx-6 lg:mx-8">
             <div className="p-8 md:p-12 text-white flex-1 z-10">
               <div className="flex items-center gap-2 mb-4">
                 <BadgePercent className="w-6 h-6 text-yellow-300" />
                 <span className="font-bold text-yellow-300 tracking-wider text-sm uppercase">Limited Time</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Get Offers on Popular Cars</h2>
               <p className="text-red-100 text-lg mb-8 max-w-md">Find the best deals, exchange bonuses, and special discounts on your dream car this festive season.</p>
               <button 
                 onClick={() => navigate('/explore')}
                 className="bg-white text-[var(--color-brand-red)] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
               >
                 View All Offers <ChevronRight className="w-5 h-5"/>
               </button>
             </div>
             <div className="hidden md:block w-1/3 min-h-[300px] relative bg-black bg-opacity-10" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Offers" />
             </div>
          </div>
        </AnimateInView>
      </section>

      {/* All Brands */}
      <section className="py-12 bg-white border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">All Brands</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-gray-200 gap-[1px]">
              {getActiveBrands().map((brand) => (
                <div 
                  key={brand.name} 
                  onClick={() => handleBrandSelect(brand.name)}
                  className="p-4 flex flex-col items-center justify-center hover:shadow-md hover:z-10 relative transition-all cursor-pointer bg-white h-28 group"
                >
                  <BrandLogo logo={brand.logo} name={brand.name} className="h-10 w-auto" />
                  <span className="text-xs font-semibold text-[var(--color-text-main)] group-hover:text-[#d02326] text-center line-clamp-1 transition-colors">{brand.name}</span>
                </div>
              ))}
            </div>
            <div 
              onClick={() => navigate('/explore')}
              className="w-full py-4 text-center bg-white hover:bg-gray-50 text-[var(--color-text-main)] text-sm font-semibold cursor-pointer border-t border-gray-200 transition-colors"
            >
              View More Brands & Models
            </div>
          </div>
        </AnimateInView>
      </section>

      {/* Find The Cars Of Your Choice */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Find The Cars Of Your Choice</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {[
             { name: 'Hatchback', Icon: Car },
             { name: 'Sedan', Icon: CarFront },
             { name: 'SUV', Icon: Truck },
             { name: 'MUV', Icon: BusFront },
             { name: 'Luxury', Icon: Gem },
             { name: 'Convertible', Icon: Wind }
           ].map((body) => {
              const Icon = body.Icon;
              return (
                <div 
                  key={body.name} 
                  onClick={() => navigate(`/explore?bodyType=${encodeURIComponent(body.name)}`)}
                  className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-[var(--color-brand-red)] hover:shadow-md transition-all cursor-pointer gap-4 h-32 group"
                >
                  <Icon className="w-10 h-10 text-gray-400 group-hover:text-[var(--color-brand-red)] transition-colors" />
                  <span className="text-sm font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors">{body.name}</span>
                </div>
              );
            })}
          </div>
        </AnimateInView>
      </section>

      {/* Upcoming and Recently Launched Cars */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
         <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Upcoming and Recently Launched Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HERITAGE_VEHICLES.slice(0, 4).map((car, i) => (
              <div 
                key={car.id} 
                onClick={() => navigate(`/car/${car.id}`)}
                className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all cursor-pointer bg-white flex flex-col"
              >
                <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                  <div className="absolute top-2 left-2 bg-yellow-400 text-[10px] text-yellow-900 font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                    {i % 2 === 0 ? 'Expected Oct 2026' : 'Recently Launched'}
                  </div>
                  <img src={car.image} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={car.name} />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-lg text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors mb-2 line-clamp-1">{car.name}</h3>
                  <p className="font-bold text-xl text-[var(--color-text-main)]">
                    {car.price >= 10000000 ? `₹ ${(car.price / 10000000).toFixed(2)} Cr` : `₹ ${(car.price / 100000).toFixed(2)} Lakh`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{car.location}</p>
                </div>
                <div className="px-4 pb-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Subscribed for launch alerts on ${car.name}!`);
                    }}
                    className="w-full py-2 border border-[var(--color-brand-red)] text-[var(--color-brand-red)] font-bold rounded-md hover:bg-[var(--color-brand-red)] hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Alert Me
                  </button>
                </div>
              </div>
            ))}
          </div>
         </AnimateInView>
      </section>

      {/* Cars by Fuel Type */}
      <section className="py-12 bg-white border-b border-gray-200">
         <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Cars by Fuel Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((fuel) => (
                <div 
                  key={fuel} 
                  onClick={() => navigate(`/explore?fuelType=${encodeURIComponent(fuel)}`)}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-[var(--color-brand-red)] hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:bg-red-50 transition-colors">
                      <Fuel className="w-6 h-6 text-gray-600 group-hover:text-[var(--color-brand-red)] transition-colors" />
                    </div>
                    <span className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors">{fuel}</span>
                </div>
              ))}
            </div>
         </AnimateInView>
      </section>

      {/* Compare Cars & Latest Car Updates */}
      <section className="py-12 bg-gray-50">
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Compare Cars</h2>
              <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div 
                  onClick={() => navigate('/explore')}
                  className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[var(--color-brand-red)] cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                    <span className="text-2xl text-gray-400 group-hover:text-[var(--color-brand-red)] transition-colors">+</span>
                  </div>
                  <span className="font-bold text-gray-500 group-hover:text-[var(--color-brand-red)] transition-colors">Select Car 1</span>
                </div>
                <div className="bg-gray-100 rounded-full w-12 h-12 flex flex-shrink-0 items-center justify-center font-black text-gray-400 z-10 my-[-24px] md:my-0 md:mx-[-24px] border-4 border-white">
                  VS
                </div>
                <div 
                  onClick={() => navigate('/explore')}
                  className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[var(--color-brand-red)] cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                    <span className="text-2xl text-gray-400 group-hover:text-[var(--color-brand-red)] transition-colors">+</span>
                  </div>
                  <span className="font-bold text-gray-500 group-hover:text-[var(--color-brand-red)] transition-colors">Select Car 2</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                 <button 
                   onClick={() => navigate('/explore')}
                   className="bg-[var(--color-brand-red)] text-white font-bold px-8 py-3 rounded hover:bg-opacity-90 cursor-pointer w-full md:w-auto md:px-12 transition-all shadow"
                 >
                   Compare Cars
                 </button>
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-[var(--color-text-main)] mb-6">Popular Comparisons</h3>
                <div className="flex flex-wrap gap-4">
                  {['Swift vs Baleno', 'Creta vs Seltos', 'Thar vs Jimny', 'Nexon vs Brezza', 'Scorpio N vs XUV700'].map(comp => (
                    <span 
                      key={comp} 
                      onClick={() => navigate(`/explore?q=${encodeURIComponent(comp.split(' ')[0])}`)}
                      className="px-5 py-3 border border-gray-200 bg-white rounded-full text-sm font-bold text-[var(--color-text-main)] cursor-pointer hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] shadow-sm transition-all hover:-translate-y-0.5"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Latest Car Updates</h2>
                <Link to="/community" className="text-[var(--color-brand-red)] text-sm font-semibold hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <Link to="/community" key={i} className="flex gap-4 group cursor-pointer bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow">
                    <div className="w-28 h-20 rounded bg-gray-200 flex-shrink-0 overflow-hidden relative">
                      <img src={`https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=300&auto=format&fit=crop&sig=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News"/>
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-8 h-8 text-white opacity-90"/>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <h4 className="font-bold text-sm text-[var(--color-text-main)] group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2 leading-tight">New Gen Sports Car Officially Teased Ahead Of Launch</h4>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">2 days ago</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimateInView>
      </section>
    </div>
  );
}
