'use client';

import { useState } from 'react';
import { 
  Building2, 
  Save, 
  ArrowLeft,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyDetailsPage() {
  const [formData, setFormData] = useState({
    companyName: 'MarketForge AI',
    country: 'United States',
    city: 'San Francisco',
    street: '123 Market Street, Suite 400',
    email: 'contact@marketforge.ai',
    phone: '+1 (555) 123-4567',
    specialization: 'AI-Powered Market Analysis'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving company details:', formData);
    // Handle save logic here
  };

  const formFields = [
    {
      label: 'Company Name',
      field: 'companyName',
      placeholder: 'Enter company name'
    },
    {
      label: 'Company Location Country',
      field: 'country',
      placeholder: 'Enter country'
    },
    {
      label: 'Company Location City',
      field: 'city',
      placeholder: 'Enter city'
    },
    {
      label: 'Company Location Street',
      field: 'street',
      placeholder: 'Enter street address'
    },
    {
      label: 'Company Email',
      field: 'email',
      placeholder: 'Enter company email'
    },
    {
      label: 'Company Phone Number',
      field: 'phone',
      placeholder: 'Enter phone number'
    },
    {
      label: 'Company Specialization',
      field: 'specialization',
      placeholder: 'Ex. Bakery, Weed Shop'
    }
  ];

  return (
    <div className="page-scrollable">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </Link>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gradient">Company Details</h1>
                <p className="text-sm text-slate-400">Update company information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 pb-12">
        <div className="glass rounded-2xl p-6">
          <div className="space-y-6">
            {formFields.map((field, index) => (
              <div key={index}>
                <label className="block text-white font-medium text-sm mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.field as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.field, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full glass rounded-xl p-4 bg-white/5 text-white placeholder-gray-400 outline-none focus:bg-white/10 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl p-4 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Save size={18} className="text-white" />
              <span className="text-white font-medium">Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}