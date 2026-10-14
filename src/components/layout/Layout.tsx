import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, User, LogOut, Menu, X, ChevronDown, Sun, Moon, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumbs from './Breadcrumbs';
// @ts-ignore
import logoImg from '../../assets/images/vintage_guru_logo_1782245578578.jpg';

export default function Layout() {
  const { user, userData, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleUserLogin = async () => {
    try {
      try {
        sessionStorage.removeItem('vintage_admin_authenticated');
      } catch (e) {}
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    // Only clear vintage_admin_authenticated if the user is explicitly logged in as a normal user (role !== 'admin')
    if (user && userData && userData.role !== 'admin') {
      try {
        if (sessionStorage.getItem('vintage_admin_authenticated') === 'true') {
          sessionStorage.removeItem('vintage_admin_authenticated');
          window.location.reload();
        }
      } catch (e) {
        // ignore
      }
    }
  }, [user, userData]);
  
  // Initialize theme from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      // Small scroll state for sticky header shrink
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Show Scroll-to-Top Button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isAdminPath = window.location.pathname === '/admin';

  if (isAdminPath) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-page-bg)] font-sans transition-colors duration-200">
      <header className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-1' : 'py-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center transition-all duration-300">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center justify-center"
                >
                  <img 
                    src={logoImg} 
                    alt="VintageGuru Logo" 
                    className="w-10 h-10 object-contain rounded-full" 
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
                <span className="text-sm font-bold tracking-tight text-[var(--color-text-main)] transition-colors duration-200 whitespace-nowrap">
                  VintageGuru
                </span>
              </Link>
            </div>
            
            <nav className="hidden lg:flex space-x-0.5 lg:space-x-1 xl:space-x-2 items-center mx-3">
              {/* New Cars Link */}
              <Link 
                to="/new-cars" 
                className="p-2 xl:p-3 border-b-2 border-transparent hover:border-[#d72c1c] transition-colors"
              >
                <span className="text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide whitespace-nowrap">
                  New Cars
                </span>
              </Link>

              {/* Used Cars Link */}
              <Link 
                to="/used-cars" 
                className="p-2 xl:p-3 border-b-2 border-transparent hover:border-[#d72c1c] transition-colors"
              >
                <span className="text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide whitespace-nowrap">
                  Used Cars
                </span>
              </Link>

              {/* Reviews & News Dropdown */}
              <div 
                className="relative p-2 xl:p-3 border-b-2 border-transparent hover:border-[#d72c1c] transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredTab('reviews-news')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span className="text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide flex items-center gap-0.5 whitespace-nowrap">
                  Reviews & News <ChevronDown className="w-3.5 h-3.5" />
                </span>
                <AnimatePresence>
                  {hoveredTab === 'reviews-news' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-750 rounded-b-lg w-48 z-50"
                    >
                      <div className="py-1.5">
                        <Link to="/community" className="block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] whitespace-nowrap">Car Reviews</Link>
                        <Link to="/community" className="block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] whitespace-nowrap">Latest News</Link>
                        <Link to="/community" className="block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] whitespace-nowrap">User Reviews</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* General Links with Underline Animations */}
              <Link to="/explore" className="relative p-2 xl:p-3 text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide group transition-colors whitespace-nowrap">
                Explore
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d72c1c] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/marketplace" className="relative p-2 xl:p-3 text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide group transition-colors whitespace-nowrap">
                Marketplace
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d72c1c] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/community" className="relative p-2 xl:p-3 text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide group transition-colors whitespace-nowrap">
                Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d72c1c] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/membership" className="relative p-2 xl:p-3 text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide group transition-colors whitespace-nowrap">
                Membership
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d72c1c] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/admin" className="relative p-2 xl:p-3 text-[9.5px] xl:text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#d72c1c] dark:hover:text-[#d72c1c] uppercase tracking-wide group transition-colors whitespace-nowrap">
                Admin CMS
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d72c1c] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-3 flex-shrink-0">
              {/* Theme Toggle Button Desktop with Micro-Animation */}
              <motion.button 
                onClick={toggleTheme}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#d72c1c] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Toggle Theme"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-500" /> : <Moon className="w-4.5 h-4.5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {user ? (
                <div className="flex items-center space-x-1.5 xl:space-x-3">
                  <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-750" />
                    ) : (
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                    <span className="text-[10.5px] font-medium whitespace-nowrap">My Vintage</span>
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="text-gray-500 dark:text-gray-400 hover:text-[var(--color-brand-red)] transition-colors cursor-pointer" title="Logout">
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <motion.button 
                  onClick={handleUserLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[var(--color-brand-red)] text-white px-3.5 xl:px-4 py-1.5 rounded text-[10.5px] font-semibold hover:bg-opacity-90 transition-all border border-transparent cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Login / Register
                </motion.button>
              )}
            </div>

            <div className="lg:hidden flex items-center space-x-2">
              {/* Theme Toggle Button Mobile with Micro-Animation */}
              <motion.button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#d72c1c] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Theme"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[var(--color-text-main)] p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Mobile Menu with Smooth Height slide down and fade transition */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 absolute w-full z-10 left-0 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-2 pb-5 space-y-2">
                <Link to="/new-cars" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">NEW CARS</Link>
                <Link to="/used-cars" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">USED CARS</Link>
                <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">REVIEWS & NEWS</Link>

                <div className="py-2 space-y-1">
                  <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Explore</Link>
                  <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Marketplace</Link>
                  <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Community</Link>
                  <Link to="/membership" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Membership</Link>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Admin CMS</Link>
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">My Vintage</Link>
                      <button onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Logout</button>
                    </>
                  ) : (
                    <button onClick={() => { handleUserLogin(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-[var(--color-brand-red)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Sign In / Sign Up</button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <Breadcrumbs />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-brand-dark)] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={logoImg} 
                  alt="VintageGuru Logo" 
                  className="w-12 h-12 object-contain rounded-full" 
                  referrerPolicy="no-referrer" 
                />
                <span className="text-2xl font-bold tracking-tight text-white">
                  VintageGuru
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed max-w-sm text-gray-400">
                A global digital destination for vintage and classic vehicles. Showcasing transport heritage from around the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/new-cars" className="hover:text-[#d72c1c] transition-colors">New Cars</Link></li>
                <li><Link to="/used-cars" className="hover:text-[#d72c1c] transition-colors">Used Cars / Old Cars</Link></li>
                <li><Link to="/explore" className="hover:text-[#d72c1c] transition-colors">Explore Vehicles</Link></li>
                <li><Link to="/marketplace" className="hover:text-[#d72c1c] transition-colors">Marketplace</Link></li>
                <li><Link to="/community" className="hover:text-[#d72c1c] transition-colors">Community & Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="#" className="hover:text-[var(--color-brand-red)] transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-[var(--color-brand-red)] transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-[var(--color-brand-red)] transition-colors">Listing Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex justify-between items-center text-sm text-gray-500 font-light">
            <p>&copy; {new Date().getFullYear()} VintageGuru.in. All rights reserved.</p>
            <p>Made with passion for classic vehicles.</p>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button with micro-interactions and transitions */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 w-12 h-12 bg-white dark:bg-gray-800 text-[#d02326] dark:text-red-400 border border-gray-200 dark:border-gray-750 rounded-full flex items-center justify-center shadow-2xl transition-shadow z-40 cursor-pointer"
            aria-label="Scroll to Top"
            title="Scroll to Top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
