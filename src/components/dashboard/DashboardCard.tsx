import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, value, icon, className = '' }: DashboardCardProps) {
  return (
    <div className={`rounded-lg p-3 md:p-6 shadow ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 md:space-y-2 min-w-0">
          <h3 className="text-xs md:text-sm font-medium text-gray-600 truncate">{title}</h3>
          <p className="text-lg md:text-2xl font-bold text-gray-900 break-words">{value}</p>
        </div>
        <div className="rounded-full p-2 md:p-3 bg-gray-50 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}