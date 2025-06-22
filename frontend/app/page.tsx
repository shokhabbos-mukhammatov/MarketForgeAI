'use client';

import { useState, useEffect } from 'react';
import AnalyticsCard from '@/components/AnalyticsCard';
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart } from 'lucide-react';

export default function Dashboard() {
  const [greeting, setGreeting] = useState('');
  const username = 'Alex';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const analyticsData = [
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: DollarSign,
      data: [20, 35, 30, 45, 40, 60, 55, 70],
      chartType: 'line',
      size: 'large'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+12.5%',
      icon: Users,
      data: [65, 75, 70, 80, 85, 90, 95, 88],
      chartType: 'area',
      size: 'medium'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+4.3%',
      icon: TrendingUp,
      data: [40, 45, 55, 50, 60, 65, 70, 68],
      chartType: 'bar',
      size: 'medium'
    },
    {
      title: 'Performance',
      value: '94.2%',
      change: '+2.1%',
      icon: Activity,
      data: [88, 90, 92, 89, 94, 96, 93, 95],
      chartType: 'line',
      size: 'small'
    },
    {
      title: 'Sales Analytics',
      value: '1,234',
      change: '+8.2%',
      icon: BarChart3,
      data: [30, 40, 35, 50, 45, 55, 60, 58],
      chartType: 'bar',
      size: 'small'
    },
    {
      title: 'Distribution',
      value: '76.3%',
      change: '+1.8%',
      icon: PieChart,
      data: [45, 55, 40, 60, 50, 65, 70, 68],
      chartType: 'area',
      size: 'small'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-2">
                  <img 
                    src="/LogoArrow.png" 
                    alt="MarketForge AI Logo" 
                    className="w-6 h-6 opacity-90"
                    style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
                  />
                  <h1 className="text-xl font-medium text-gradient">MarketForge AI</h1>
                </div>
                <p className="text-sm text-slate-400">{greeting}, {username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map((card, index) => (
              <AnalyticsCard
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
                icon={card.icon}
                data={card.data}
                chartType={card.chartType}
                size={card.size}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}