import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle2, Shield, Users, Zap, FileText, Car } from 'lucide-react';
import BrandLogo from './BrandLogo';

const CAR_BRANDS = [
  { name: 'Maruti Suzuki', logo: 'https://logo.clearbit.com/marutisuzuki.com' },
  { name: 'Hyundai', logo: 'https://logo.clearbit.com/hyundai.com' },
  { name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
  { name: 'Tata', logo: 'https://logo.clearbit.com/tatamotors.com' },
  { name: 'Honda', logo: 'https://logo.clearbit.com/honda.com' },
  { name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
  { name: 'Renault', logo: 'https://logo.clearbit.com/renault.co.in' },
  { name: 'Ford', logo: 'https://logo.clearbit.com/ford.com' },
  { name: 'Volkswagen', logo: 'https://logo.clearbit.com/vw.com' },
  { name: 'Kia', logo: 'https://logo.clearbit.com/kia.com' },
  { name: 'Skoda', logo: 'https://logo.clearbit.com/skoda-auto.com' },
  { name: 'Chevrolet', logo: 'https://logo.clearbit.com/chevrolet.com' },
];

export default function PostAd({ onNext }: { onNext: () => void }) {
  const [rcNumber, setRcNumber] = useState('');

  return (
    <div className="bg-white rounded-2xl w-full font-sans text-gray-800 p-6 md:p-8 border border-gray-200 shadow-sm mx-auto max-w-5xl">
      
      {/* Header text */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Sell Car Online - Get Best Resale Value</h2>
        <p className="text-gray-600 text-sm">
          Sell your used car at the best price in a few clicks for free. 60000+ sellers across India sell their old cars through CarWale every month. Selling is quick, easy, and absolutely free!
        </p>
      </div>

      {/* Box 1 & 2 combined: Enter RC and Select Brand */}
      <div className="border border-gray-200 rounded-xl bg-gray-50 mb-8 overflow-hidden font-sans">
        
        {/* RC Number Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            Enter Your Registration Number 
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 uppercase">
              <Zap className="w-3 h-3"/> Fastest
            </span>
          </h3>
          <p className="text-sm text-gray-500 mb-4">Automatically fetch your car details like Make, Model, Variant, KMS, etc. instantly.</p>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <input 
              type="text" 
              placeholder="Ex- DL 34 AC4564"
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded outline-none focus:border-[#d72c1c]"
            />
            <button 
              onClick={onNext}
              className="bg-[#d72c1c] text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition"
            >
              Sell Your Car
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center py-2">
            <span className="bg-white px-4 text-xs font-medium text-gray-500 border border-gray-200 rounded-full">Don't have RC number? List manually</span>
          </div>
        </div>

        {/* Brand Selection Section */}
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Select Your Car Brand to Get Started</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Type to select car brand"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#d72c1c] w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-200 gap-[1px]">
            {CAR_BRANDS.map(brand => (
              <button 
                key={brand.name} 
                onClick={onNext}
                className="bg-white p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition min-h-[100px] group"
              >
                <BrandLogo logo={brand.logo} name={brand.name} className="h-10 w-auto" />
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#d72c1c] transition-colors">{brand.name}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm text-gray-500 mt-4 hover:underline">
            View All Brands <ChevronDown className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Already Listed */}
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 border border-gray-200 rounded-lg">
             <Car className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Already Listed Your Car?</h4>
            <p className="text-xs text-gray-500">Please login and check activities on your car ad</p>
          </div>
        </div>
        <button className="border border-[#00a0c6] text-[#00a0c6] px-8 py-2 rounded text-sm font-semibold hover:bg-blue-50">
          Login
        </button>
      </div>

      {/* 2 Easy Steps */}
      <h3 className="font-bold text-xl mb-4">Sell Car Online on CarWale in Just 2 Easy Steps</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 border border-gray-200 rounded-xl flex gap-4 bg-white shadow-sm">
          <FileText className="w-8 h-8 text-[#00a0c6] flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">Step 1</div>
            <h4 className="font-bold mb-2">Post Your Ad</h4>
            <p className="text-sm text-gray-500">Your car listing is live to millions of individuals buyers & thousand of dealers across your city.</p>
          </div>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl flex gap-4 bg-white shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">Step 2</div>
            <h4 className="font-bold mb-2">Sell Your Car</h4>
            <p className="text-sm text-gray-500">You get the best price for your car by selling it to an individual, local dealer or CarWale.</p>
          </div>
        </div>
      </div>

      {/* Why Sell Your Car */}
      <h3 className="font-bold text-xl mb-4">Why Sell Your Car on CarWale?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 border border-gray-200 rounded-xl flex flex-col items-center text-center bg-white shadow-sm">
          <Users className="w-10 h-10 text-green-500 mb-4" />
          <h4 className="font-bold mb-2">60,000+ Sellers</h4>
          <p className="text-xs text-gray-500">Trusted by 60,000+ sellers each month who sell their cars</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl flex flex-col items-center text-center bg-white shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-[#00a0c6] mb-4" />
          <h4 className="font-bold mb-2">3.5 Million Visitors</h4>
          <p className="text-xs text-gray-500">Reach 3.5 million monthly visitors actively looking for cars</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl flex flex-col items-center text-center bg-white shadow-sm">
          <Shield className="w-10 h-10 text-blue-500 mb-4" />
          <h4 className="font-bold mb-2">Safety First</h4>
          <p className="text-xs text-gray-500">We prioritize your security with measures to protect your data and prevent fraud</p>
        </div>
      </div>

      {/* FAQs */}
      <h3 className="font-bold text-xl mb-4">FAQs About Selling Cars</h3>
      <div className="border border-gray-200 rounded-xl bg-white mb-8 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer">
          <h4 className="text-sm font-semibold text-gray-800">Why should I sell car on CarWale?</h4>
          <ChevronDown className="w-5 h-5 text-gray-400 rotate-180" />
        </div>
        <div className="p-4 border-b border-gray-200 text-sm text-gray-600 bg-white">
          <p>Sell car online on CarWale to over 3.5 million used car buyers who visit our site every month looking for a used car. Sell your car at the best price possible on CarWale. Sell your car in just a few steps. Simple, Fast and Free.</p>
        </div>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800">Why is CarWale the best site to sell car?</h4>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
        <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800">How can I sell car to CarWale?</h4>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <button className="text-sm text-gray-500 font-medium mb-12 hover:underline">
        View more FAQs ⌄
      </button>

    </div>
  );
}
