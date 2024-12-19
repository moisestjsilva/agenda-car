import React from 'react';
import { Pencil, Trash2, Car, Phone } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerListItemProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerListItem({ customer, onEdit, onDelete }: CustomerListItemProps) {
  return (
    <div className="relative">
      {/* Versão Mobile */}
      <div className="md:hidden p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{customer.name}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm">{customer.phone}</span>
            </div>
          </div>
          <div className="flex space-x-2">
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
      </div>

      {/* Versão Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
        <div className="col-span-4">
          <h3 className="font-medium text-gray-900">{customer.name}</h3>
        </div>
        <div className="col-span-3">{customer.email}</div>
        <div className="col-span-2">{customer.phone}</div>
        <div className="col-span-2">
          <div className="flex items-center space-x-1">
            <Car className="w-4 h-4 text-gray-400" />
            <span>{customer.vehicles.length}</span>
          </div>
          {customer.vehicles.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {customer.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="truncate">
                  {vehicle.make} {vehicle.model} - {vehicle.plate}
                </div>
              )).slice(0, 2)}
              {customer.vehicles.length > 2 && (
                <div className="text-gray-400">
                  +{customer.vehicles.length - 2} mais
                </div>
              )}
            </div>
          )}
        </div>
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
    </div>
  );
}