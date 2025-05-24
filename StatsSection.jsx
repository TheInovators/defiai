import React from 'react';
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: <DollarSign size={32} />, value: '$240M+', label: 'Total Value Locked' },
    { icon: <Users size={32} />, value: '32,500+', label: 'Active Users' },
    { icon: <TrendingUp size={32} />, value: '85%', label: 'Win Rate' },
    { icon: <Activity size={32} />, value: '24/7', label: 'Market Monitoring' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-green-500 mb-4 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;