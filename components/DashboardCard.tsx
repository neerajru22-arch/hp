
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './icons/Icons';
import { DashboardMetric } from '../types';

const DashboardCard: React.FC<{ metric: DashboardMetric }> = ({ metric }) => {
  const isIncrease = metric.changeType === 'increase';
  const changeColor = isIncrease ? 'text-danger' : 'text-success';

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-600">{metric.title}</h3>
      <div className="mt-2 flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-secondary">{metric.value}</p>
        <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
          {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          <span>{metric.change}</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-neutral-500">{metric.description}</p>
    </div>
  );
};

export default DashboardCard;
