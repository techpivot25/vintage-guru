import React from 'react';
import { ArrowRight, Shield, Car, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  return (
    <div className="py-20 bg-[var(--color-antique)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-5xl text-[var(--color-bottle)] mb-6">The Collector's Marketplace</h1>
          <p className="text-lg text-[var(--color-charcoal)] opacity-70">
            A trusted environment for enthusiasts to acquire and pass on heritage vehicles. Backed by specialized verification and transparent history.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          <div className="bg-[var(--color-parchment)] p-10 rounded-3xl border border-[var(--color-brass)] border-opacity-30 flex flex-col items-center text-center group cursor-pointer hover:shadow-xl transition-all">
            <div className="w-20 h-20 bg-[var(--color-bottle)] bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Car className="w-10 h-10 text-[var(--color-bottle)]" />
            </div>
            <h2 className="font-serif text-3xl text-[var(--color-bottle)] mb-4">Acquire a Classic</h2>
            <p className="text-gray-600 mb-8 max-w-sm">Browse our global inventory of verified vintage vehicles. Every listing is detailed with restoration phase and history.</p>
            <Link to="/explore" className="mt-auto bg-[var(--color-bottle)] text-[#F5F2ED] px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-opacity-90 flex items-center gap-2">
              Browse Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-[var(--color-bottle)] p-10 rounded-3xl border border-[var(--color-brass)] border-opacity-20 flex flex-col items-center text-center group cursor-pointer hover:shadow-xl transition-all relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             <div className="relative z-10 w-20 h-20 bg-[var(--color-brass)] bg-opacity-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-10 h-10 text-[var(--color-brass)]" />
            </div>
            <h2 className="relative z-10 font-serif text-3xl text-[#F5F2ED] mb-4">List Your Vehicle</h2>
            <p className="relative z-10 text-gray-300 mb-8 max-w-sm">Reach the right global collectors. Enjoy premium features like verification badges and detailed history modules.</p>
            <Link to="/dashboard" className="relative z-10 mt-auto bg-[var(--color-brass)] text-[var(--color-bottle)] px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-opacity-90 flex items-center gap-2">
              Create a Listing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Features/Trust Section */}
        <div className="border-t border-[var(--color-brass)] border-opacity-30 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="font-serif text-xl text-[var(--color-bottle)] mb-3">Escrow Payments</h3>
            <p className="text-sm text-gray-500">Secure transaction frameworks built for high-value vehicle purchases.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-[var(--color-bottle)] mb-3">Authenticity Check</h3>
            <p className="text-sm text-gray-500">Museum-level storytelling with clear documentation of original and restored parts.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-[var(--color-bottle)] mb-3">Direct Inquiries</h3>
            <p className="text-sm text-gray-500">Connect securely with sellers via our in-platform messaging system.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
