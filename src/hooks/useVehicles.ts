import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Vehicle } from '../types';

export function useVehicles(customerId?: string) {
  const vehicles = useLiveQuery(
    () => customerId 
      ? db.vehicles.where('customerId').equals(customerId).toArray()
      : db.vehicles.toArray()
  ) || [];

  const addVehicle = async (newVehicle: Omit<Vehicle, 'id'>) => {
    try {
      const vehicle: Vehicle = {
        ...newVehicle,
        id: crypto.randomUUID(),
      };
      await db.vehicles.add(vehicle);
      return vehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const updateVehicle = async (updatedVehicle: Vehicle) => {
    try {
      await db.vehicles.put(updatedVehicle);
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await db.vehicles.delete(id);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  };

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}