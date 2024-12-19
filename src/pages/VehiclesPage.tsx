import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { useCustomers } from '../hooks/useCustomers';
import { Vehicle } from '../types';
import { VehicleModal } from '../components/vehicles/VehicleModal';

export function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { customers } = useCustomers();

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedCustomerId(vehicle.customerId);
    setIsModalOpen(true);
  };

  const handleSave = async (vehicleData: Omit<Vehicle, 'id'>) => {
    if (selectedVehicle) {
      await updateVehicle({ ...selectedVehicle, ...vehicleData });
    } else {
      await addVehicle(vehicleData);
    }
    setIsModalOpen(false);
    setSelectedVehicle(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Veículos</h1>
        <div className="flex space-x-4">
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!selectedCustomerId) {
                alert('Selecione um cliente primeiro');
                return;
              }
              setSelectedVehicle(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Novo Veículo
          </button>
        </div>
      </div>

      {selectedCustomerId && (
        <VehicleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVehicle(undefined);
          }}
          onSave={handleSave}
          customerId={selectedCustomerId}
          initialData={selectedVehicle}
        />
      )}
    </div>
  );
}