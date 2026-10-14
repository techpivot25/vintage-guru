import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Settings, Camera, MapPin, Truck, History } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import PostAd from '../components/PostAd';

export default function Dashboard() {
  const { user, userData, logout } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sellStep, setSellStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    type: 'Car',
    price: '',
    location: '',
    description: '',
    restorationStage: 'Original',
    history: ''
  });

  useEffect(() => {
    if (user) {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'vehicles'), where('ownerId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setVehicles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'vehicles'), {
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
      setShowAddForm(false);
      loadVehicles();
      alert('Vehicle successfully added to your garage!');
    } catch (error) {
      console.error("Error adding vehicle: ", error);
      alert('Failed to add vehicle');
    }
  };

  if (!user) {
    return (
      <div className="py-24 text-center max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif text-[var(--color-bottle)]">Please Sign In</h1>
        <p className="mt-4 text-[var(--color-charcoal)]">You must be logged in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[var(--color-antique)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="bg-[var(--color-parchment)] p-8 rounded-3xl border border-[var(--color-brass)] border-opacity-30 mb-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-2 border-[var(--color-brass)] shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--color-bottle)] text-white flex items-center justify-center text-3xl font-serif">
                {userData?.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-serif text-[var(--color-bottle)]">{userData?.displayName}</h1>
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">{userData?.email}</p>
              <span className="inline-block bg-[var(--color-brass)] px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-[var(--color-charcoal)] uppercase">
                {userData?.subscription} Member
              </span>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-charcoal)] border-opacity-20 rounded-xl hover:bg-gray-100 transition-colors">
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
            <button onClick={logout} className="px-4 py-2 text-sm text-[var(--color-oxblood)] font-medium hover:bg-red-50 rounded-xl transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full text-left bg-[var(--color-bottle)] text-white px-4 py-3 rounded-xl text-sm font-medium">My Garage ({vehicles.length})</button>
            <button className="w-full text-left px-4 py-3 text-[var(--color-charcoal)] hover:bg-[var(--color-parchment)] rounded-xl text-sm font-medium transition-colors">Saved Listings</button>
            <button className="w-full text-left px-4 py-3 text-[var(--color-charcoal)] hover:bg-[var(--color-parchment)] rounded-xl text-sm font-medium transition-colors">Messages</button>
            <button className="w-full text-left px-4 py-3 text-[var(--color-charcoal)] hover:bg-[var(--color-parchment)] rounded-xl text-sm font-medium transition-colors">Payments & Billing</button>
          </div>
          
          <div className="lg:col-span-3">
            {!showAddForm && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[var(--color-bottle)]">My Vehicles</h2>
                <button 
                  onClick={() => {
                    setShowAddForm(true);
                    setSellStep(1);
                  }}
                  className="flex items-center gap-2 bg-[#d72c1c] text-white px-5 py-2 rounded-xl text-sm font-semibold tracking-wide hover:bg-red-700 transition"
                >
                  <Plus className="w-4 h-4" /> Post Ad
                </button>
              </div>
            )}

            {showAddForm ? (
              sellStep === 1 ? (
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <button onClick={() => setShowAddForm(false)} className="text-sm text-gray-500 hover:text-gray-800 font-medium">← Back to Dashboard</button>
                   </div>
                   <PostAd onNext={() => setSellStep(2)} />
                </div>
              ) : (
                <div className="bg-[var(--color-parchment)] p-8 rounded-3xl border border-[var(--color-brass)] border-opacity-30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl border-b border-[var(--color-brass)] border-opacity-20 pb-2">New Listing (Step 2)</h3>
                    <button type="button" onClick={() => setSellStep(1)} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
                  </div>
                  <form onSubmit={handleAddVehicle} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Vehicle Name</label>
                      <input required type="text" placeholder="e.g. 1964 Aston Martin DB5" className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Year</label>
                      <input required type="number" placeholder="1964" className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Type</label>
                      <select className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option>Car</option>
                        <option>Two-Wheeler</option>
                        <option>Truck</option>
                        <option>Bus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Price ($)</label>
                      <input required type="number" placeholder="Total required or '0' for Auction" className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Location</label>
                      <input required type="text" placeholder="City, Country" className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Restoration Stage</label>
                      <select className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.restorationStage} onChange={e => setFormData({...formData, restorationStage: e.target.value})}>
                        <option>Original</option>
                        <option>Fully Restored</option>
                        <option>Partial Restoration</option>
                        <option>Project Car</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Chassis/Ownership History</label>
                    <textarea rows={3} placeholder="Provide details about previous owners, museum display, etc..." className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})}></textarea>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Description</label>
                    <textarea required rows={4} placeholder="Describe the vehicle's condition, unique features..." className="w-full p-3 rounded-lg border border-gray-300 bg-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button type="submit" className="bg-[var(--color-bottle)] text-white px-8 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase hover:bg-opacity-90">
                      Submit Listing
                    </button>
                  </div>
                </form>
              </div>
            ) ) : (
               <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-gray-400">Loading your garage...</div>
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-20 bg-[var(--color-parchment)] rounded-3xl border border-[var(--color-brass)] border-opacity-30 border-dashed">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-[var(--color-bottle)] font-medium mb-1">Your garage is empty</p>
                    <p className="text-sm text-gray-500 mb-6">Start by adding your first vintage vehicle to the marketplace.</p>
                    <button onClick={() => {
                        setShowAddForm(true);
                        setSellStep(1);
                      }} className="bg-[var(--color-bottle)] text-white px-6 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase">Post Ad</button>
                  </div>
                ) : (
                  vehicles.map(vehicle => (
                    <div key={vehicle.id} className="bg-[var(--color-parchment)] p-6 rounded-2xl border border-[var(--color-brass)] border-opacity-20 flex flex-col md:flex-row gap-6 items-center">
                       <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 shrink-0">
                         <Camera className="w-8 h-8 text-gray-400" />
                       </div>
                       <div className="flex-1 w-full">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-serif text-xl font-semibold text-[var(--color-bottle)]">{vehicle.year} {vehicle.name}</h3>
                           <span className="font-medium text-lg">${vehicle.price?.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                           <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vehicle.location}</span>
                           <span className="bg-[var(--color-bottle)] bg-opacity-10 px-2 py-0.5 rounded text-[var(--color-bottle)]">{vehicle.type}</span>
                         </div>
                         <div className="flex items-center gap-4 border-t border-[var(--color-brass)] border-opacity-20 pt-3 mt-2">
                             <button className="text-sm text-[var(--color-bottle)] font-medium hover:underline">Edit Listing</button>
                             <button className="text-sm text-[var(--color-oxblood)] font-medium hover:underline">Delete</button>
                         </div>
                       </div>
                    </div>
                  ))
                )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
