import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Metric } from '../../types';

interface MetricCardProps {
  metric: Metric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          metric.trend === 'up' 
            ? 'bg-green-100 text-green-800' 
            : metric.trend === 'down'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(metric.change)}%</span>
        </div>
      </div>
    </div>
  );
}