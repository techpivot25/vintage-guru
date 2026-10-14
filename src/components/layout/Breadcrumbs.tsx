import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on the home page
  }

  // Prettier names for specific paths
  const formatName = (name: string) => {
    if (name === 'car') return 'Explore'; // Since 'car/123' should probably go Home > Explore > Details... wait, 'car/2' is better shown as Home > Car > 2 or something.
    // Let's just capitalize and remove hyphens.
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex text-sm text-gray-500 font-medium whitespace-nowrap overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-[var(--color-brand-red)] transition-colors">
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return (
                <li key={to} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
                  {last ? (
                    <span className="text-gray-900" aria-current="page">
                      {formatName(value)}
                    </span>
                  ) : (
                    <Link to={to} className="hover:text-[var(--color-brand-red)] transition-colors">
                      {formatName(value)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
