import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className={`glass rounded-xl p-6 card-hover animate-slide-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2" style={{ color }}>{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
