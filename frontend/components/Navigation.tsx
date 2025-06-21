'use client';

import { useState } from 'react';
import { Home, Grid3X3, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, href: '/', label: 'Home' },
    { icon: Grid3X3, href: '/apps', label: 'Apps' },
    { icon: MessageCircle, href: '/chat', label: 'Chat' },
    { icon: User, href: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass rounded-2xl mx-4 mb-4 px-3">
        <div className="flex items-center justify-center space-x-3 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={22} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;