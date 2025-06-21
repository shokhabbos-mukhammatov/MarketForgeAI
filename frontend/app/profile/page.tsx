'use client';

import { useState } from 'react';
import { 
  User, 
  Building2, 
  CreditCard, 
  Settings, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Crown,
  Shield,
  Bell,
  Users,
  FileText,
  HelpCircle,
  ChevronRight,
  Star,
  Briefcase
} from 'lucide-react';

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
    name: 'MarketForge Inc.',
    industry: 'Technology',
    employees: '50-100',
    founded: '2020',
    plan: 'Professional'
  };

  const menuItems = [
    {
      category: 'Account',
      items: [
        { icon: User, label: 'Personal Information', description: 'Update your profile details', action: 'edit-profile' },
        { icon: Shield, label: 'Security & Privacy', description: 'Password, 2FA, and privacy settings', action: 'security' },
        { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences', action: 'notifications' },
      ]
    },
    {
      category: 'Company',
      items: [
        { icon: Building2, label: 'Company Details', description: 'Update company information', action: 'company-details' },
        { icon: Users, label: 'Team Management', description: 'Manage team members and roles', action: 'team' },
        { icon: Crown, label: 'Subscription Plan', description: 'Manage your subscription and billing', action: 'subscription' },
        { icon: CreditCard, label: 'Payment Methods', description: 'Update payment and billing info', action: 'payment' },
      ]
    },
    {
      category: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support', action: 'help' },
        { icon: Mail, label: 'Contact Support', description: 'Reach out to our support team', action: 'contact' },
        { icon: FileText, label: 'Documentation', description: 'API docs and guides', action: 'docs' },
      ]
    }
  ];

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    // Handle different actions here
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Handle logout logic
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gradient">Account Settings</h1>
              <p className="text-slate-400">Manage your profile and company</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm">
              {/* User Avatar & Info */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                  {userData.avatar}
                </div>
                <h2 className="text-2xl font-semibold text-white mb-1">{userData.name}</h2>
                <p className="text-gray-400 mb-3">{userData.role}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <Calendar size={14} />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>

              {/* Current Plan */}
              <div className="bg-white/5 rounded-2xl p-5 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <Crown size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Current Plan</p>
                      <p className="text-gray-400 text-sm">{companyData.plan}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <Star size={14} className="text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
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
            <div className="bg-white/5 rounded-3xl backdrop-blur-sm overflow-hidden">
              {/* Company Header */}
              <div className="p-8 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <Building2 size={24} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{companyData.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Briefcase size={14} />
                        <span className="text-sm">{companyData.industry}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span className="text-sm">{companyData.employees} employees</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span className="text-sm">Founded {companyData.founded}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-8">
                <div className="space-y-8">
                  {menuItems.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="text-lg font-medium text-white mb-4">
                        {category.category}
                      </h4>
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <button
                            key={itemIndex}
                            onClick={() => handleAction(item.action)}
                            className="w-full bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                  <item.icon size={18} className="text-white" />
                                </div>
                                <div className="text-left">
                                  <p className="text-white font-medium">{item.label}</p>
                                  <p className="text-gray-400 text-sm mt-0.5">{item.description}</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 rounded-2xl p-5 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <LogOut size={20} className="text-red-400" />
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