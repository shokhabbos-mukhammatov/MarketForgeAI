'use client';

import { DivideIcon as LucideIcon } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  data: number[];
  chartType: 'line' | 'area' | 'bar';
  size: 'small' | 'medium' | 'large';
}

const AnalyticsCard = ({ title, value, change, icon: Icon, data, chartType, size }: AnalyticsCardProps) => {
  const chartData = data.map((value, index) => ({ value, index }));
  
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 lg:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-4'
  };

  const heightClasses = {
    small: 'h-48',
    medium: 'h-48',
    large: 'h-64'
  };

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgba(255, 255, 255, 0.8)"
              fill="rgba(255, 255, 255, 0.1)"
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <Bar
              dataKey="value"
              fill="rgba(255, 255, 255, 0.2)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${heightClasses[size]}`}>
      <div className="glass rounded-2xl p-6 h-full glass-hover">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-sm font-medium">{change}</span>
            <div className="p-2 rounded-lg bg-white/10">
              <Icon size={20} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;