import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { VehicleForm } from './VehicleForm';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
  customerId: string;
  initialData?: Vehicle;
}

export function VehicleModal({ isOpen, onClose, onSave, customerId, initialData }: VehicleModalProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    customerId,
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || '',
    plate: initialData?.plate || '',
    color: initialData?.color || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Editar Veículo' : 'Novo Veículo'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <VehicleForm formData={formData} setFormData={setFormData} />
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}