import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface AdminProfile {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface AdminProfileSectionProps {
  profile: AdminProfile;
  onSave: (updatedProfile: AdminProfile) => void;
  onAddAlert: (text: string) => void;
}

export default function AdminProfileSection({ profile, onSave, onAddAlert }: AdminProfileSectionProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [mobile, setMobile] = useState(profile.mobile);
  const [password, setPassword] = useState(profile.password);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onAddAlert('Name field cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onAddAlert('Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      onAddAlert('Password field cannot be empty');
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      onSave({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password: password.trim()
      });
      setIsSaving(false);
      onAddAlert('Admin Profile updated successfully!');
    }, 600);
  };

  const resetToDefault = () => {
    setName('Admin');
    setEmail('admin@vintagemarket.com');
    setMobile('+1 (555) 0199');
    setPassword('Qwerty@9876');
    onAddAlert('Form reset to default values');
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
      
      {/* Visual Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#d02326]" />
            Console Account Settings
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Update your administrator credentials, security passwords, and contact metadata.
          </p>
        </div>
        
        <button
          type="button"
          onClick={resetToDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset defaults
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Administrator"
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d02326] transition-all"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@vintagemarket.com"
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d02326] transition-all"
            />
          </div>

          {/* Contact Mobile */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Mobile Contact
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +1 (555) 0199"
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d02326] transition-all"
            />
          </div>

          {/* Console Password */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-4 pr-11 py-3 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d02326] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Security Alert Banner */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <p className="font-semibold">Security Credential Synchronicity</p>
            <p className="mt-0.5 opacity-90">
              Modifying the password changes your login credentials to this CMS console. The default username remains <code className="font-mono bg-amber-100 dark:bg-amber-900/35 px-1 py-0.5 rounded text-amber-900 dark:text-amber-100">admin</code>. Please ensure your new password is safe and recorded.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#d02326] text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-[#b21c1e] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Credentials</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
