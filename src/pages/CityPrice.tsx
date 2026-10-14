import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Info, ChevronDown, CheckCircle2, Navigation, Settings2, Calculator, PhoneCall } from 'lucide-react';
import AnimateInView from '../components/AnimateInView';

export default function CityPrice() {
  const { city, id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState('E [2022-2023]');
  
  const formattedCity = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Mumbai';

  // Mock data
  const car = {
    name: "Toyota Urban Cruiser Hyryder",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2670&auto=format&fit=crop",
    variants: ['E [2022-2023]', 'S [2022-2023]', 'G [2022-2023]', 'V [2022-2023]', 'E CNG', 'S CNG', 'G CNG'],
    basePrice: 1114000, // 11.14 Lakh
  };

  const getPriceDetails = (variant: string) => {
    // Fake logic for prices based on variant
    const multiplier = car.variants.indexOf(variant) * 0.1 + 1;
    const exShowroom = Math.round(car.basePrice * multiplier);
    const rto = Math.round(exShowroom * 0.12);
    const insurance = Math.round(exShowroom * 0.04);
    const others = 12000;
    const optional = 35000;
    
    return {
      exShowroom,
      rto,
      insurance,
      others,
      optional,
      onRoad: exShowroom + rto + insurance + others,
    };
  };

  const currentPrices = getPriceDetails(selectedVariant);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimateInView>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              {/* Car Info Left */}
              <div className="w-full md:w-1/3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {car.name} On Road Price in {formattedCity}
                </h1>
                <div className="flex items-center gap-2 text-[#d72c1c] font-semibold text-sm mb-6 cursor-pointer hover:underline">
                  <MapPin className="w-4 h-4" />
                  <span>Change City</span>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group mb-4">
                   <img src={car.image} alt={car.name} className="w-full h-56 object-cover" />
                </div>
              </div>

              {/* Price Breakdown Right */}
              <div className="w-full md:w-2/3 border border-gray-200 rounded-xl p-0 overflow-hidden flex flex-col">
                 <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Version</label>
                      <select 
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full sm:w-64 border border-gray-300 rounded p-2 text-sm font-semibold text-gray-800 bg-white shadow-sm focus:outline-none focus:border-[#d72c1c]"
                      >
                        {car.variants.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                 </div>

                 <div className="p-0 sm:p-6 bg-white flex-1">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 pl-4 sm:pl-0 text-gray-600 font-medium">Ex-Showroom Price</td>
                          <td className="py-4 pr-4 sm:pr-0 text-right font-semibold text-gray-900">{formatCurrency(currentPrices.exShowroom)}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 pl-4 sm:pl-0 text-gray-600 font-medium flex items-center gap-1">
                            RTO
                            <Info className="w-3 h-3 text-gray-400" />
                          </td>
                          <td className="py-4 pr-4 sm:pr-0 text-right font-semibold text-gray-900">{formatCurrency(currentPrices.rto)}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 pl-4 sm:pl-0 text-gray-600 font-medium flex items-center gap-1">
                            Insurance
                            <Info className="w-3 h-3 text-gray-400" />
                          </td>
                          <td className="py-4 pr-4 sm:pr-0 text-right font-semibold text-gray-900">{formatCurrency(currentPrices.insurance)}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 pl-4 sm:pl-0 text-gray-600 font-medium flex items-center gap-1">
                            Others
                            <Info className="w-3 h-3 text-gray-400" />
                          </td>
                          <td className="py-4 pr-4 sm:pr-0 text-right font-semibold text-gray-900">{formatCurrency(currentPrices.others)}</td>
                        </tr>
                        
                        {/* Optional additions */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td className="py-3 pl-4 sm:pl-4 text-gray-500 font-medium flex items-center gap-2">
                             <input type="checkbox" className="w-4 h-4 rounded text-[#d72c1c]" />
                             Optional Packages
                          </td>
                          <td className="py-3 pr-4 sm:pr-4 text-right font-semibold text-gray-600">+{formatCurrency(currentPrices.optional)}</td>
                        </tr>

                        <tr className="bg-green-50">
                          <td className="py-5 pl-4 sm:pl-4 text-lg font-bold text-gray-900">On-Road Price in {formattedCity}</td>
                          <td className="py-5 pr-4 sm:pr-4 text-right text-xl font-bold text-[#d72c1c]">{formatCurrency(currentPrices.onRoad)}</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-[#d72c1c] text-white py-3 rounded-lg font-bold shadow-md hover:bg-opacity-90 flex items-center justify-center gap-2">
                      <Settings2 className="w-5 h-5" />
                      Get Offers from Dealer
                    </button>
                    <button className="flex-1 bg-white border-2 border-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                      <Calculator className="w-5 h-5" />
                      Check EMI
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </AnimateInView>

        {/* Loan Section */}
        <AnimateInView delay={0.1}>
          <div className="bg-blue-900 rounded-xl p-8 text-white mb-10 flex flex-col md:flex-row items-center justify-between shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
               <Calculator className="w-64 h-64 -mt-10 -mr-10" />
             </div>
             
             <div className="z-10 mb-6 md:mb-0 max-w-xl">
               <h3 className="text-2xl font-bold mb-2">Need a Car Loan?</h3>
               <p className="text-blue-200 font-medium mb-4">Get instant loan approval with lowest interest rates from top banks.</p>
               <ul className="space-y-2 mb-6">
                 <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle2 className="w-4 h-4 text-green-400" /> Up to 100% On-Road Funding</li>
                 <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle2 className="w-4 h-4 text-green-400" /> Flexible Tenure up to 7 Years</li>
               </ul>
             </div>
             
             <div className="z-10 bg-white p-6 rounded-lg w-full md:w-80 shadow-xl text-center md:text-left text-gray-900">
                <p className="text-sm font-semibold text-gray-500 mb-1">Starting EMI</p>
                <p className="text-3xl font-bold mb-6">₹ 15,899<span className="text-sm font-normal text-gray-500">/month</span></p>
                <button className="w-full bg-[#d72c1c] text-white py-3 rounded font-bold hover:bg-opacity-90 transition-colors shadow-sm">
                  Apply for Loan
                </button>
             </div>
          </div>
        </AnimateInView>

        {/* Variant Prices Table */}
        <AnimateInView delay={0.2}>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{car.name} Versions and On-Road Price in {formattedCity}</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 font-bold text-gray-700 text-sm">Versions</th>
                    <th className="py-4 px-6 font-bold text-gray-700 text-sm">Ex-Showroom Price</th>
                    <th className="py-4 px-6 font-bold text-gray-700 text-sm text-right">On-Road Price</th>
                  </tr>
                </thead>
                <tbody>
                  {car.variants.slice(0, 5).map((v, i) => {
                    const prices = getPriceDetails(v);
                    return (
                      <tr key={v} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-[#d72c1c] text-sm md:text-base cursor-pointer hover:underline mb-1">{v}</p>
                          <p className="text-xs text-gray-500 font-medium">1462 cc, Petrol, Manual, 21.12 kmpl</p>
                        </td>
                        <td className="py-4 px-6 text-gray-700 font-semibold">{formatCurrency(prices.exShowroom)}</td>
                        <td className="py-4 px-6 text-right font-bold text-gray-900">{formatCurrency(prices.onRoad)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AnimateInView>

         {/* Call to action dealer section */}
        <AnimateInView delay={0.3}>
          <div className="bg-white border border-[#d72c1c] border-opacity-30 rounded-xl p-8 mb-10 text-center shadow-lg shadow-red-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mt-10 -mr-10"></div>
             
             <PhoneCall className="w-12 h-12 text-[#d72c1c] mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Want to book {car.name} in {formattedCity}?</h2>
             <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Get connected with authorized Toyota dealers in {formattedCity} for best prices and test drive.</p>
             
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <input type="tel" placeholder="Enter your mobile number" className="px-4 py-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-[#d72c1c] sm:w-80" />
                <button className="bg-[#d72c1c] text-white px-8 py-3 rounded font-bold shadow-md hover:bg-opacity-90 transition-colors">
                  Get Dealer Details
                </button>
             </div>
          </div>
        </AnimateInView>

      </div>
    </div>
  );
}
