import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PLANS = [
  {
    name: "Silver",
    price: "₹1,999",
    period: "/month",
    description: "For casual enthusiasts and first-time sellers.",
    features: [
      "Up to 2 active listings",
      "Join community forums",
      "Save vehicles & searches",
      "Basic member profile",
      "Standard support"
    ],
    tier: 'silver',
    theme: "border-gray-300 bg-white"
  },
  {
    name: "Gold",
    price: "₹7,999",
    period: "/month",
    description: "For active sellers, restorers, and collectors.",
    features: [
      "Up to 10 active listings",
      "2 featured placement credits",
      "Saved search instant alerts",
      "Direct inquiry tools",
      "Basic analytics",
      "Priority support"
    ],
    tier: 'gold',
    theme: "border-[var(--color-brass)] bg-[var(--color-parchment)] shadow-xl relative scale-105"
  },
  {
    name: "Platinum",
    price: "₹19,999",
    period: "/month",
    description: "For dealers, museum curators, and power users.",
    features: [
      "Unlimited listings",
      "Homepage promotion slots",
      "Verified badge priority",
      "Advanced analytics & trends",
      "Premium buyer leads",
      "Exclusive event invites",
      "Concierge 24/7 support"
    ],
    tier: 'platinum',
    theme: "border-[#1D1D1D] bg-[#1D1D1D] text-white"
  }
];

export default function Membership() {
  const { user, userData, signInWithGoogle } = useAuth();

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    
    // In a real app we'd redirect to Stripe. Here we just update Firestore.
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        subscription: tier
      });
      alert(`Successfully subscribed to ${tier.toUpperCase()} plan!`);
    } catch (error) {
      console.error("Subscription error", error);
    }
  };

  return (
    <div className="py-24 bg-[var(--color-antique)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-5xl text-[var(--color-bottle)] mb-4">Join the Inner Circle</h1>
        <p className="text-lg text-[var(--color-charcoal)] opacity-70 max-w-2xl mx-auto mb-16">
          Access exclusive listings, connect with global collectors, and unlock premium features tailored for your vintage journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col h-full ${plan.theme}`}>
              {plan.name === 'Gold' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-bottle)] text-[#F5F2ED] text-xs px-4 py-1 uppercase tracking-widest rounded-full font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`font-serif text-3xl mb-2 ${plan.name === 'Platinum' ? 'text-white' : 'text-[var(--color-bottle)]'}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 h-10 ${plan.name === 'Platinum' ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                <div className="flex justify-center items-baseline">
                  <span className={`text-5xl font-light font-sans ${plan.name === 'Platinum' ? 'text-white' : 'text-[var(--color-charcoal)]'}`}>{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.name === 'Platinum' ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.name === 'Platinum' ? 'text-[var(--color-brass)]' : 'text-[var(--color-bottle)]'}`} />
                    <span className={`text-sm ${plan.name === 'Platinum' ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(plan.tier)}
                disabled={userData?.subscription === plan.tier}
                className={`w-full py-4 rounded-xl text-sm uppercase tracking-widest font-semibold transition-all
                  ${userData?.subscription === plan.tier ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 
                    plan.name === 'Platinum' 
                      ? 'bg-[var(--color-brass)] text-[var(--color-charcoal)] hover:bg-opacity-90' 
                      : plan.name === 'Gold'
                        ? 'bg-[var(--color-bottle)] text-white hover:bg-opacity-90'
                        : 'border border-[var(--color-bottle)] text-[var(--color-bottle)] hover:bg-[var(--color-bottle)] hover:text-white'
                  }
                `}
              >
                {userData?.subscription === plan.tier ? 'Current Plan' : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
