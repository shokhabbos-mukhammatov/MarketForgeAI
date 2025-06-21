'use client';

import { useState } from 'react';
import { 
  User, 
  Building2, 
  Settings, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Crown,
  Shield,
  FileText,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@marketforge.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    avatar: 'AJ',
    role: 'Admin'
  };

  const companyData = {
    name: 'MarketForge AI',
    industry: 'Technology',
    employees: '50-100',
    founded: '2020'
  };

  const menuItems = [
    {
      category: 'Account',
      items: [
        { 
          icon: User, 
          label: 'Personal Information', 
          description: 'Update your profile details', 
          action: 'edit-profile',
          disabled: true
        },
        { 
          icon: Shield, 
          label: 'Security & Privacy', 
          description: 'Password, 2FA, and privacy settings', 
          action: 'security',
          disabled: true
        },
      ]
    },
    {
      category: 'Company',
      items: [
        { 
          icon: Building2, 
          label: 'Company Details', 
          description: 'Update company information', 
          action: 'company-details',
          disabled: false
        },
        { 
          icon: Crown, 
          label: 'Subscription Plan', 
          description: 'Manage your subscription and billing', 
          action: 'subscription',
          disabled: true
        },
      ]
    },
    {
      category: 'Resources',
      items: [
        { 
          icon: FileText, 
          label: 'Documentation', 
          description: 'API docs and guides', 
          action: 'docs',
          disabled: false
        },
      ]
    }
  ];

  const handleAction = (action: string) => {
    if (action === 'docs') {
      // Will navigate to documentation page
      return;
    }
    console.log(`Action: ${action}`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen">
      {/* Header - Same style as home page */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gradient">MarketForge AI</h1>
                <p className="text-sm text-slate-400">Company Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6">
              {/* User Avatar & Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
                  {userData.avatar}
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{userData.name}</h2>
                <p className="text-gray-400 mb-2">{userData.role}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <Calendar size={14} />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm">{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm">{userData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              {/* Company Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <Building2 size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{companyData.name}</h3>
                    <div className="flex items-center space-x-3 text-gray-400 mt-1 text-sm">
                      <span>{companyData.industry}</span>
                      <span>•</span>
                      <span>{companyData.employees} employees</span>
                      <span>•</span>
                      <span>Founded {companyData.founded}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6">
                <div className="space-y-6">
                  {menuItems.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="text-base font-medium text-white mb-3">
                        {category.category}
                      </h4>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="relative">
                            {item.action === 'docs' ? (
                              <Link href="/docs">
                                <button className="w-full glass rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                                        <item.icon size={16} className="text-white" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-white font-medium text-sm">{item.label}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
                                      </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                  </div>
                                </button>
                              </Link>
                            ) : item.action === 'company-details' ? (
                              <Link href="/company-details">
                                <button className="w-full glass rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                                        <item.icon size={16} className="text-white" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-white font-medium text-sm">{item.label}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
                                      </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                  </div>
                                </button>
                              </Link>
                            ) : (
                              <button
                                onClick={() => !item.disabled && handleAction(item.action)}
                                disabled={item.disabled}
                                className={`w-full glass rounded-xl p-4 transition-all duration-200 group relative ${
                                  item.disabled 
                                    ? 'cursor-not-allowed opacity-60' 
                                    : 'hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg transition-colors ${
                                      item.disabled 
                                        ? 'bg-white/5' 
                                        : 'bg-white/10 group-hover:bg-white/20'
                                    }`}>
                                      <item.icon size={16} className={item.disabled ? 'text-gray-500' : 'text-white'} />
                                    </div>
                                    <div className="text-left">
                                      <p className={`font-medium text-sm ${item.disabled ? 'text-gray-500' : 'text-white'}`}>
                                        {item.label}
                                      </p>
                                      <p className={`text-xs mt-0.5 ${item.disabled ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                  {item.disabled ? (
                                    <Lock size={16} className="text-gray-500" />
                                  ) : (
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                  )}
                                </div>
                                {/* Disabled overlay with diagonal lines */}
                                {item.disabled && (
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-gray-500/10 to-transparent opacity-30"
                                       style={{
                                         backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156, 163, 175, 0.1) 2px, rgba(156, 163, 175, 0.1) 4px)'
                                       }} />
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 rounded-xl p-4 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <LogOut size={18} className="text-red-400" />
                      <span className="text-red-400 font-medium">Sign Out</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}