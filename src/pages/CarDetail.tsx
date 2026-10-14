import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  CheckCircle2, 
  Shield, 
  MapPin, 
  Calculator, 
  Camera, 
  Palette, 
  Share2, 
  Heart, 
  Award, 
  FileText, 
  Smartphone, 
  Zap, 
  Settings, 
  Users, 
  Battery, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Check, 
  Sparkles, 
  Car as CarIcon, 
  Wrench, 
  AlertCircle, 
  RefreshCw, 
  Truck, 
  X, 
  CheckSquare, 
  ArrowRight,
  Gauge,
  Fuel,
  Key,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { INDIAN_POPULAR_CARS } from '../data/cars';
import { HERITAGE_VEHICLES, HeritageVehicle } from '../data/heritageCars';
import { useGeolocation } from '../hooks/useGeolocation';

export default function CarDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, signInWithGoogle } = useAuth();
  const userLocation = useGeolocation();
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [inspectionTab, setInspectionTab] = useState<'engine' | 'ac' | 'brakes' | 'electrical' | 'body' | 'tyres' | 'imperfections'>('engine');
  
  // Test Drive Modal State
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveType, setTestDriveType] = useState<'home' | 'hub'>('home');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [testDriveBooked, setTestDriveBooked] = useState(false);
  
  // Reserve Modal State
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // EMI Calculator State
  const [downPayment, setDownPayment] = useState(1000);
  const [tenureMonths, setTenureMonths] = useState(48);

  // Scroll to top on mount or car change
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedGalleryIdx(0);
    setTestDriveBooked(false);
    setReserveSuccess(false);
  }, [id]);

  // Reviews state
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Rahul Verma', rating: 5, comment: 'Pristine condition car! The 140-point inspection report was completely accurate. Zero hassle during RC transfer.', date: '12 Jun 2026' },
    { id: 2, user: 'Ananya Sharma', rating: 5, comment: 'Drove this i20 for 3 months now. Absolutely smooth transmission and impressive fuel economy.', date: '28 May 2026' },
    { id: 3, user: 'David Miller', rating: 4, comment: 'Verified heritage listing with full documentation. Excellent service.', date: '10 Apr 2026' }
  ]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const submitReview = () => {
    if (!user) return;
    if (newRating === 0 || newComment.trim() === '') return alert('Please provide a rating and a review comment.');
    
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        user: user.displayName || 'Anonymous Driver',
        rating: newRating,
        comment: newComment,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    ]);
    setNewRating(0);
    setNewComment('');
  };

  // Find Car by ID across both datasets
  const foundCar = INDIAN_POPULAR_CARS.find(c => c.id === id);
  const foundHeritage = HERITAGE_VEHICLES.find(h => h.id === id || String(h.numericId) === id);

  // Build uniform Vehicle Details Object modeled after Cars24 Detailed Structure
  const heritageAsCar = foundHeritage ? {
    id: foundHeritage.id,
    name: foundHeritage.name,
    make: foundHeritage.make,
    model: foundHeritage.model,
    variant: foundHeritage.variant,
    year: foundHeritage.year,
    price: `₹${foundHeritage.price.toLocaleString('en-IN')}`,
    numericPrice: foundHeritage.price,
    formattedInrPrice: `₹${foundHeritage.price.toLocaleString('en-IN')}`,
    priceRange: `₹${foundHeritage.price.toLocaleString('en-IN')}`,
    exShowroom: `₹${foundHeritage.price.toLocaleString('en-IN')}`,
    description: foundHeritage.description,
    image: foundHeritage.image,
    gallery: foundHeritage.gallery && foundHeritage.gallery.length > 0 ? foundHeritage.gallery : [foundHeritage.image],
    fuelType: foundHeritage.fuelType,
    transmission: foundHeritage.transmission,
    seatingCapacity: foundHeritage.type === 'Two-Wheeler' ? '1 Seater' : '5 Seater',
    mileage: foundHeritage.odometer,
    engine: foundHeritage.engine,
    power: foundHeritage.power,
    torque: foundHeritage.torque,
    vin: foundHeritage.vin,
    location: foundHeritage.location,
    lat: foundHeritage.lat,
    lng: foundHeritage.lng,
    condition: foundHeritage.condition,
    sellerName: foundHeritage.sellerName,
    sellerType: foundHeritage.sellerType,
    sellerPhone: foundHeritage.sellerPhone,
    sellerEmail: foundHeritage.sellerEmail,
    regYear: foundHeritage.year,
    ownership: "1st Owner",
    insurance: "Comprehensive / Zero-Dep valid till Nov 2026",
    spareKeys: "2 Original Keys Available",
    rto: foundHeritage.location.includes("Noida") ? "UP-16 (Noida RTO)" : `${foundHeritage.location.split(',')[0]} RTO`,
    inspectionScore: "4.9 / 5.0 (Passed)",
    thingsToKnow: foundHeritage.highlights.map((h, idx) => ({
      title: `Key Highlight #${idx + 1}`,
      text: h,
      image: foundHeritage.gallery[idx % foundHeritage.gallery.length] || foundHeritage.image
    })),
    variants: [
      { name: `${foundHeritage.name} (${foundHeritage.variant})`, price: `₹${foundHeritage.price.toLocaleString('en-IN')}`, specs: `${foundHeritage.engine}, VIN: ${foundHeritage.vin}` }
    ],
    colors: [
      { name: foundHeritage.exteriorColor || "Star Dust Gray", hex: "#4A4E51" },
      { name: "Polar White", hex: "#F5F5F5" },
      { name: "Fiery Red", hex: "#A81C1C" }
    ],
    news: [
      { headline: `140-Point Quality Inspection Report: Passed with 100% Zero Major Faults`, date: "Certified Record" },
      { headline: `Verified Seller: ${foundHeritage.sellerName} (${foundHeritage.sellerType})`, date: "Verified Listing" },
      { headline: `Location Hub: ${foundHeritage.location}`, date: "Available for Doorstep Test Drive" }
    ],
    similar: HERITAGE_VEHICLES.filter(v => v.id !== foundHeritage.id).slice(0, 4).map(v => ({
      id: v.id,
      name: v.name,
      price: `₹${v.price.toLocaleString('en-IN')}`,
      image: v.image,
      odometer: v.odometer,
      fuelType: v.fuelType,
      transmission: v.transmission
    })),
    cityPrices: [
      { city: "Noida / NCR", price: `₹${foundHeritage.price.toLocaleString('en-IN')}` },
      { city: "Delhi", price: `₹${Math.round(foundHeritage.price * 1.005).toLocaleString('en-IN')}` },
      { city: "Mumbai", price: `₹${Math.round(foundHeritage.price * 1.01).toLocaleString('en-IN')}` },
      { city: "Bangalore", price: `₹${Math.round(foundHeritage.price * 1.015).toLocaleString('en-IN')}` }
    ]
  } : null;

  const car = foundCar ? {
    id: foundCar.id,
    name: foundCar.name,
    make: foundCar.name.split(' ')[0],
    model: foundCar.name.split(' ').slice(1).join(' '),
    variant: "Asta Top Spec",
    year: 2023,
    price: foundCar.exShowroom,
    numericPrice: 650000,
    formattedInrPrice: foundCar.exShowroom,
    priceRange: foundCar.priceRange,
    exShowroom: foundCar.exShowroom,
    description: foundCar.description,
    image: foundCar.image,
    gallery: [
      foundCar.image,
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop"
    ],
    fuelType: foundCar.fuelType,
    transmission: foundCar.transmission,
    seatingCapacity: foundCar.seatingCapacity,
    mileage: foundCar.mileage,
    engine: foundCar.engine,
    power: foundCar.power,
    torque: foundCar.torque,
    vin: "IND98234812039",
    location: "Noida, Uttar Pradesh, India",
    lat: 28.5355,
    lng: 77.3910,
    condition: "Certified 140-Point Inspection Pass",
    sellerName: "CARS24 Hub Noida Sector 63",
    sellerType: "Authorized Certified Dealer",
    sellerPhone: "1800 258 5656",
    sellerEmail: "noida.hub@cars24.com",
    regYear: 2023,
    ownership: "1st Owner",
    insurance: "Comprehensive Valid till Oct 2026",
    spareKeys: "2 Keys Available",
    rto: "UP-16 (Noida)",
    inspectionScore: "4.9 / 5.0 (Passed)",
    thingsToKnow: foundCar.thingsToKnow,
    variants: foundCar.variants,
    colors: foundCar.colors,
    news: foundCar.news,
    similar: foundCar.similar.map(s => ({
      id: s.id,
      name: s.name,
      price: s.price,
      image: s.image,
      odometer: "32,000 km",
      fuelType: "Petrol",
      transmission: "Manual"
    })),
    cityPrices: foundCar.cityPrices
  } : (heritageAsCar || {
    id: "hyundai-elite-i20-2017",
    name: "2017 Hyundai Elite i20 Asta 1.2",
    make: "Hyundai",
    model: "Elite i20",
    variant: "Asta 1.2 Petrol",
    year: 2017,
    price: "₹5,25,000",
    numericPrice: 525000,
    formattedInrPrice: "₹5,25,000",
    priceRange: "₹5.25 Lakh",
    exShowroom: "₹5,25,000",
    description: "Pristine 2017 Hyundai Elite i20 Asta 1.2 Petrol in Star Dust Gray. 1st owner non-accidental car with full Hyundai service history. Features touchscreen navigation, reverse camera, push button start, projector headlamps, rear AC vents, alloy wheels, and dual front airbags. Certified by CARS24 140-point quality report.",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=2670&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop"
    ],
    fuelType: "Petrol",
    transmission: "5-Speed Manual",
    seatingCapacity: "5 Seater",
    mileage: "42,500 km",
    engine: "1.2L Kappa VTVT",
    power: "82 bhp @ 6,000 rpm",
    torque: "115 Nm @ 4,000 rpm",
    vin: "MALC1234567890NOIDA",
    location: "Noida, Uttar Pradesh, India",
    lat: 28.5355,
    lng: 77.3910,
    condition: "CARS24 Certified 140-Point Pass",
    sellerName: "CARS24 Hub Noida Sector 63",
    sellerType: "Verified Certified Dealer",
    sellerPhone: "1800 258 5656",
    sellerEmail: "noida.hub@cars24.com",
    regYear: 2017,
    ownership: "1st Owner",
    insurance: "Zero-Depreciation valid till Nov 2026",
    spareKeys: "2 Keys Available",
    rto: "UP-16 (Noida)",
    inspectionScore: "4.9 / 5.0 (Passed)",
    thingsToKnow: [
      { title: "140-Point Quality Certificate", text: "Inspected across 140 mechanical, electrical, structural, and cosmetic checkpoints with zero major defects.", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=2670&auto=format&fit=crop" },
      { title: "1-Year Warranty Included", text: "Comes with 12 months / 15,000 km comprehensive warranty covering engine, transmission & electricals.", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop" }
    ],
    variants: [
      { name: "Hyundai Elite i20 Asta 1.2 Petrol", price: "₹5,25,000", specs: "1.2L Petrol, 5-Speed Manual, 42,500 km" }
    ],
    colors: [
      { name: "Star Dust Gray", hex: "#4A4E51" },
      { name: "Polar White", hex: "#FFFFFF" },
      { name: "Passion Red", hex: "#9E1B1B" }
    ],
    news: [
      { headline: "140-Point CARS24 Quality Certificate Issued: Rating 4.9/5", date: "Verified Inspection" },
      { headline: "Single Owner Non-Accidental Verified by RTO History Log", date: "Verified Record" }
    ],
    similar: [
      { id: "aston-martin-db5", name: "1964 Aston Martin DB5", price: "₹12,00,00,000", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop", odometer: "38,450 miles", fuelType: "Petrol", transmission: "Manual" },
      { id: "vespa-150-vl1", name: "1955 Vespa 150 VL1", price: "₹12,00,000", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop", odometer: "12,100 km", fuelType: "Petrol", transmission: "Manual" }
    ],
    cityPrices: [
      { city: "Noida / NCR", price: "₹5,25,000" },
      { city: "Delhi", price: "₹5,28,000" },
      { city: "Mumbai", price: "₹5,35,000" },
      { city: "Bangalore", price: "₹5,40,000" }
    ]
  });

  const calculatedRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "4.9";
  
  // Monthly EMI Calculation
  const loanPrincipal = Math.max(0, car.numericPrice - downPayment);
  const monthlyInterestRate = 0.09 / 12; // 9% annual interest
  const calculatedEmi = loanPrincipal > 0 
    ? Math.round((loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1))
    : 0;

  return (
    <div className="bg-[#F6F7F9] min-h-screen font-sans pb-16 text-gray-900">
      
      {/* ================= TOP BREADCRUMB & HEADER ================= */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-[var(--color-brand-red)]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/explore?used=true" className="hover:text-[var(--color-brand-red)]">Heritage & Used Vehicles</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate">{car.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> CARS24 Certified
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {car.regYear || car.year} Reg
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {car.ownership}
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {car.rto}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{car.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1 font-medium"><Gauge className="w-4 h-4 text-gray-400"/> {car.mileage}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium"><Fuel className="w-4 h-4 text-gray-400"/> {car.fuelType}</span>
                <span>•</span>
                <span className="font-medium">{car.transmission}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold"><MapPin className="w-4 h-4 text-emerald-600"/> {car.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Vehicle link copied to clipboard!');
                }}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                title="Share Car"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => alert('Saved to your favorites wishlist!')}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                title="Save Car"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARS24 4 GUARANTEES STRIP ================= */}
      <div className="bg-gradient-to-r from-emerald-900 via-[var(--color-bottle)] to-teal-900 text-white py-3.5 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">12-Month / 15k km Warranty</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-white/10">
            <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">7-Day Money Back Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-white/10">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">140-Point Certified Inspection</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-white/10">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">Free RC Transfer & Doorstep Delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT MAIN CONTENT (COL 8) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO IMAGE GALLERY & ANGLE SELECTOR */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="aspect-[16/10] bg-gray-900 rounded-xl overflow-hidden relative group">
                <img 
                  src={car.gallery[selectedGalleryIdx] || car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transition-all duration-300" 
                />
                
                {/* Navigation Arrows */}
                {car.gallery.length > 1 && (
                  <>
                    <button 
                      onClick={() => setSelectedGalleryIdx((prev) => (prev === 0 ? car.gallery.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white text-gray-800 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedGalleryIdx((prev) => (prev === car.gallery.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white text-gray-800 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Overlays */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Photo {selectedGalleryIdx + 1} of {car.gallery.length}</span>
                </div>
                
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 140-Point Inspected
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${selectedGalleryIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* CAR OVERVIEW & KEY SPECIFICATIONS GRID */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CarIcon className="w-5 h-5 text-emerald-600" /> Car Overview & Specs
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Registration Year</div>
                  <div className="font-bold text-gray-900">{car.regYear || car.year}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Ownership</div>
                  <div className="font-bold text-gray-900">{car.ownership}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Km Driven</div>
                  <div className="font-bold text-gray-900">{car.mileage}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Fuel Type</div>
                  <div className="font-bold text-gray-900">{car.fuelType}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Transmission</div>
                  <div className="font-bold text-gray-900">{car.transmission}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">RTO Location</div>
                  <div className="font-bold text-gray-900">{car.rto}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 col-span-2 sm:col-span-2">
                  <div className="text-xs text-gray-500 font-medium mb-1">Insurance Type</div>
                  <div className="font-bold text-emerald-700">{car.insurance}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1">Keys</div>
                  <div className="font-bold text-gray-900">{car.spareKeys}</div>
                </div>
              </div>
            </div>

            {/* ================= CARS24 140-POINT INSPECTION REPORT ================= */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">CARS24 Quality Certificate</div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">140-Point Detailed Inspection Report</h2>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="text-2xl font-black text-emerald-700">4.9/5</div>
                  <div className="text-xs text-emerald-900 font-medium">Certified Inspection<br/><span className="text-emerald-700 font-bold">100% Passed</span></div>
                </div>
              </div>

              {/* Inspection Subsystem Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 mb-6">
                {[
                  { id: 'engine', label: 'Engine & Gearbox', icon: Wrench },
                  { id: 'ac', label: 'AC & Climate', icon: Zap },
                  { id: 'brakes', label: 'Steering & Brakes', icon: Settings },
                  { id: 'electrical', label: 'Electricals', icon: Smartphone },
                  { id: 'body', label: 'Chassis & Frame', icon: Shield },
                  { id: 'tyres', label: 'Tyres & Wheels', icon: Gauge },
                  { id: 'imperfections', label: 'Imperfections (2)', icon: AlertCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = inspectionTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInspectionTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${isActive ? 'bg-[var(--color-bottle)] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Inspection Details View */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-sm space-y-3">
                {inspectionTab === 'engine' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Engine Oil Level & Quality</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Pass</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Engine Mounting & Idle Sound</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Pass</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Exhaust Smoke & Emissions</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Clean / Pass</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Gear Transmission & Clutch Engagement</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Smooth / Pass</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'ac' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">AC Cooling Temperature (Min 11.5°C)</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Pass (11.2°C)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Blower Fan & Rear Vents</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Pass</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'brakes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Front Brake Pads Life (&gt;80%)</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 85% Life Remaining</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Steering Rack & Alignment</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Perfectly Aligned</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'electrical' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Battery Voltage Check</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 12.8V Healthy</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Touchscreen, Reverse Camera & Power Windows</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Fully Operational</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'body' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Chassis & Pillar Structural Integrity</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 100% Non-Accidental</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Original Factory Paint Inspection</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified Original</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'tyres' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Tyre Tread Depth (&gt;6.0mm)</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 6.2mm Tread Life</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Spare Tyre & Jack Tool Roll</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Included</span>
                    </div>
                  </div>
                )}

                {inspectionTab === 'imperfections' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-900">Minor Scratch on Rear Left Bumper (Scuff)</div>
                        <p className="text-xs text-amber-800">Cosmetic imperfection touch-up completed during CARS24 refurbishment process.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-900">Minor Wear on Driver Seat Bolster</div>
                        <p className="text-xs text-amber-800">Cleaned & sanitized. Upholstery intact with no tears.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= INTERACTIVE EMI CALCULATOR ================= */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" /> Loan & Monthly EMI Calculator
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Down Payment: <span className="font-bold text-gray-900">₹{downPayment.toLocaleString('en-IN')}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max={car.numericPrice * 0.8} 
                    step="500"
                    value={downPayment} 
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                    <span>₹0 (Zero Down)</span>
                    <span>₹{(car.numericPrice * 0.8).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Loan Tenure (Months)</label>
                  <div className="flex gap-2">
                    {[24, 36, 48, 60, 72].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTenureMonths(m)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${tenureMonths === m ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block">Estimated Monthly EMI</span>
                  <span className="text-2xl font-black text-emerald-900">₹{calculatedEmi.toLocaleString('en-IN')} <span className="text-xs font-normal text-emerald-700">/ month</span></span>
                </div>
                <button 
                  onClick={() => setShowTestDriveModal(true)}
                  className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all cursor-pointer shadow-sm"
                >
                  Apply for Loan
                </button>
              </div>
            </div>

            {/* DESCRIPTION & HIGHLIGHTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Vehicle Description</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{car.description}</p>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Key Feature Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-700">
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Touchscreen Infotainment with Android Auto & Apple CarPlay</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Push Button Start / Stop with Smart Key</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reverse Parking Camera & Rear Sensors</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dual Airbags, ABS with EBD for Maximum Safety</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT STICKY ACTION PANEL (COL 4) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PRICING & BOOKING CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl sticky top-20 space-y-6">
              
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">CARS24 Certified Price</span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Fixed Fair Price</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {car.price}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  Includes Free 1-Year Warranty & Free RC Transfer
                </div>
              </div>

              {/* EMI Callout */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-600 block">EMI Starts From</span>
                  <span className="font-bold text-emerald-900 text-sm">₹{calculatedEmi ? calculatedEmi.toLocaleString('en-IN') : '8,500'} / month</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-1 rounded uppercase">Zero Down</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowTestDriveModal(true)}
                  className="w-full bg-[var(--color-bottle)] text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CarIcon className="w-4 h-4" /> Book Free Test Drive
                </button>

                <button 
                  onClick={() => setShowReserveModal(true)}
                  className="w-full bg-[var(--color-oxblood)] text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Reserve Car (₹2,000 Token)
                </button>

                <a 
                  href={`tel:${car.sellerPhone}`}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" /> Call Hub ({car.sellerPhone})
                </a>
              </div>

              {/* Location & Seller Info */}
              <div className="pt-4 border-t border-gray-100 text-xs space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-semibold">{car.sellerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{car.location}</span>
                </div>
                {userLocation.loaded && userLocation.coordinates && (
                  <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                    📍 Hub is located approx. 8 km from your current GPS position.
                  </div>
                )}
              </div>

            </div>

            {/* SIMILAR CARS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Similar Used Cars</h3>
              <div className="space-y-3">
                {car.similar.slice(0, 3).map((sim, idx) => (
                  <Link 
                    key={idx} 
                    to={`/car/${sim.id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all border border-gray-100 group"
                  >
                    <img src={sim.image} alt={sim.name} className="w-20 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex flex-col justify-between overflow-hidden">
                      <h4 className="font-bold text-xs text-gray-900 group-hover:text-emerald-700 truncate">{sim.name}</h4>
                      <div className="text-xs font-bold text-gray-800">{sim.price}</div>
                      <div className="text-[10px] text-gray-500 truncate">{sim.odometer} • {sim.fuelType}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ================= TEST DRIVE BOOKING MODAL ================= */}
      {showTestDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-fade-in text-gray-900">
            <button 
              onClick={() => { setShowTestDriveModal(false); setTestDriveBooked(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!testDriveBooked ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">Free Home / Hub Drive</span>
                  <h3 className="text-xl font-extrabold text-gray-900">Book Test Drive for {car.name}</h3>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setTestDriveType('home')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${testDriveType === 'home' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-600'}`}
                  >
                    🏡 Home Delivery Drive
                  </button>
                  <button 
                    onClick={() => setTestDriveType('hub')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${testDriveType === 'hub' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-600'}`}
                  >
                    🏢 Visit Hub Noida Sec 63
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Preferred Day</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'Day After'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 rounded-lg text-xs font-semibold cursor-pointer ${selectedDate === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Time Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['10:00 AM', '02:00 PM', '05:00 PM'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-xs font-semibold cursor-pointer ${selectedTime === t ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setTestDriveBooked(true)}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-emerald-700 transition-all cursor-pointer shadow-md"
                >
                  Confirm Test Drive Slot
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">Test Drive Confirmed!</h3>
                <p className="text-sm text-gray-600">
                  Your appointment for <span className="font-bold text-gray-800">{car.name}</span> is set for <span className="font-bold text-gray-800">{selectedDate} at {selectedTime}</span> ({testDriveType === 'home' ? 'Home Drive' : 'Hub Pickup'}).
                </p>
                <button 
                  onClick={() => { setShowTestDriveModal(false); setTestDriveBooked(false); }}
                  className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= RESERVE CAR MODAL ================= */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-fade-in text-gray-900">
            <button 
              onClick={() => { setShowReserveModal(false); setReserveSuccess(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!reserveSuccess ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">Refundable Booking Token</span>
                  <h3 className="text-xl font-extrabold text-gray-900">Hold & Reserve {car.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Locks this vehicle exclusively for 48 hours. 100% fully refundable anytime.</p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-red-900">Reserve Token Amount</span>
                  <span className="text-2xl font-black text-red-700">₹2,000</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={userPhone} 
                    onChange={e => setUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-red-600"
                  />
                </div>

                <button 
                  onClick={() => setReserveSuccess(true)}
                  className="w-full bg-[var(--color-oxblood)] text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
                >
                  Pay ₹2,000 Token & Reserve Now
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">Vehicle Successfully Reserved!</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">{car.name}</span> is held for you. Our concierge will contact you shortly at <span className="font-bold text-gray-800">{userPhone || 'your contact number'}</span>.
                </p>
                <button 
                  onClick={() => { setShowReserveModal(false); setReserveSuccess(false); }}
                  className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
