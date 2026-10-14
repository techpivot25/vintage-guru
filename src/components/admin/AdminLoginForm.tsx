import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertTriangle, Gauge, Home } from 'lucide-react';
// @ts-ignore
import logoImg from '../../assets/images/vintage_guru_logo_1782245578578.jpg';

interface AdminLoginFormProps {
  onSuccess: () => void;
  expectedPassword: string;
}

export default function AdminLoginForm({ onSuccess, expectedPassword }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Please fill out all credential fields.');
      return;
    }

    if (trimmedUser !== 'admin') {
      setError('Invalid admin username. Please use default username: admin');
      return;
    }

    setLoading(true);

    // Dynamic verification matching either default password or updated password
    setTimeout(() => {
      if (trimmedPass === expectedPassword || (expectedPassword === 'admin' && trimmedPass === 'admin')) {
        onSuccess();
      } else {
        setError('Incorrect password. Please verify console security keys.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Return to Home link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono transition-all z-20 px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900 hover:border-slate-700 shadow-sm"
      >
        <Home className="w-3.5 h-3.5 text-[var(--color-brand-red)]" />
        <span>Return to Home</span>
      </Link>
      
      {/* Visual background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(208,35,38,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(208,35,38,0.05),transparent_50%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative z-10"
      >
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="inline-flex">
            <img 
              src={logoImg} 
              alt="VintageGuru Logo" 
              className="w-16 h-16 object-contain rounded-full border border-slate-800 shadow-xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">VintageGuru Console</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Secure Access Restricted Panel</p>
          </div>
        </div>

        {/* Credentials error toast */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl flex items-center gap-2.5 text-left text-xs text-red-200"
          >
            <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Input credentials form */}
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Username / Login
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1.5 focus:ring-[#d02326] focus:border-[#d02326] transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Console Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-4 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1.5 focus:ring-[#d02326] focus:border-[#d02326] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#d02326] hover:bg-[#b21c1e] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#d02326]/10 hover:shadow-[#d02326]/20 disabled:opacity-55 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authorizing...</span>
              </>
            ) : (
              <span>Decrypt & Open Console</span>
            )}
          </button>

          <div className="text-center pt-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Return to Website Homepage</span>
            </Link>
          </div>

        </form>
      </motion.div>

      {/* Footer credits */}
      <div className="absolute bottom-6 text-center text-[10px] text-slate-600 font-mono">
        <span>Restricted Area. Authorized Access Only. © VintageGuru CMS</span>
      </div>

    </div>
  );
}
