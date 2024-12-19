import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Service } from '../types';

export function useServices() {
  const services = useLiveQuery(() => db.services.toArray()) || [];

  const addService = async (newService: Omit<Service, 'id'>) => {
    try {
      await db.services.add({
        ...newService,
        id: crypto.randomUUID()
      });
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const updateService = async (updatedService: Service) => {
    try {
      await db.services.put(updatedService);
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await db.services.delete(id);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  return {
    services,
    addService,
    updateService,
    deleteService,
  };
}