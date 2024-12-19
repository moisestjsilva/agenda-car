import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/format';
import { formatServiceCategory } from '../../utils/serviceCategories';

interface ServiceListItemProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

export function ServiceListItem({ service, onEdit, onDelete }: ServiceListItemProps) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
      <div className="col-span-4">
        <h3 className="font-medium text-gray-900">{service.name}</h3>
        <p className="text-sm text-gray-500">{service.description}</p>
      </div>
      <div className="col-span-3">{formatServiceCategory(service.category)}</div>
      <div className="col-span-2">{service.duration} min</div>
      <div className="col-span-2">{formatCurrency(service.price)}</div>
      <div className="col-span-1 flex space-x-2">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-blue-500"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}