'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image, Eye, Settings, Home, RefreshCw } from 'lucide-react';

export default function AdminNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: Home,
      description: 'Vue d\'ensemble'
    },
    {
      name: 'Gestion des Images',
      href: '/admin/images',
      icon: Image,
      description: 'Upload et synchronisation'
    },
    {
      name: 'Test des Images',
      href: '/admin/test-images',
      icon: Image,
      description: 'Tester le système'
    },
    {
      name: 'Migration',
      href: '/admin/migrate-images',
      icon: RefreshCw,
      description: 'Guide de migration'
    },
    {
      name: 'Prévisualisation Cloudinary',
      href: '/admin/cloudinary-preview',
      icon: Eye,
      description: 'Voir depuis Cloudinary'
    },
    {
      name: 'Configuration',
      href: '/admin/setup',
      icon: Settings,
      description: 'Paramètres système'
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                🏪 Admin Restaurant
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Menu mobile */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <IconComponent className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
