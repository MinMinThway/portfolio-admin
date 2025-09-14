
import React from 'react';
import { StatCardData } from '../types';

interface StatCardProps {
  data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, change, changeType, icon } = data;
  const isPositive = changeType === 'positive';

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
        <p className={`text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-semibold">{change}</span> vs. last month
        </p>
      </div>
      <div className="bg-indigo-100 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
