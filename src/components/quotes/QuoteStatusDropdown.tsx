import React from 'react';
import { QuoteStatus } from '../../types';

interface QuoteStatusDropdownProps {
  status: QuoteStatus;
  onChange: (status: QuoteStatus) => void;
}

const statusColors = {
  aberto: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  concluido: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  aberto: 'Aberto',
  aprovado: 'Aprovado',
  concluido: 'Concluído',
};

export function QuoteStatusDropdown({ status, onChange }: QuoteStatusDropdownProps) {
  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as QuoteStatus)}
        className={`appearance-none cursor-pointer rounded-full px-3 py-1 text-sm font-medium ${statusColors[status]} border-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className={`h-4 w-4 ${status === 'aberto' ? 'text-yellow-600' : status === 'aprovado' ? 'text-green-600' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
