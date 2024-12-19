import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Customer, Vehicle } from '../types';

export function useCustomers() {
  const customers = useLiveQuery(async () => {
    const customersList = await db.customers.toArray();
    const customersWithVehicles = await Promise.all(
      customersList.map(async (customer) => {
        const vehicles = await db.vehicles.where('customerId').equals(customer.id).toArray();
        return { ...customer, vehicles };
      })
    );
    return customersWithVehicles;
  }) || [];

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const customerId = crypto.randomUUID();
      
      // Add customer
      await db.customers.add({
        id: customerId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        vehicles: [],
      });

      // Add vehicles
      if (customerData.vehicles && customerData.vehicles.length > 0) {
        const vehiclesToAdd = customerData.vehicles.map(vehicle => ({
          ...vehicle,
          id: crypto.randomUUID(),
          customerId,
        }));
        await db.vehicles.bulkAdd(vehiclesToAdd);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    try {
      // Update customer basic info
      await db.customers.put({
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        vehicles: [],
      });

      // Delete existing vehicles
      await db.vehicles.where('customerId').equals(updatedCustomer.id).delete();

      // Add updated vehicles
      if (updatedCustomer.vehicles && updatedCustomer.vehicles.length > 0) {
        const vehiclesToAdd = updatedCustomer.vehicles.map(vehicle => ({
          ...vehicle,
          id: vehicle.id || crypto.randomUUID(),
          customerId: updatedCustomer.id,
        }));
        await db.vehicles.bulkAdd(vehiclesToAdd);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await db.customers.delete(id);
      // Also delete related vehicles
      await db.vehicles.where('customerId').equals(id).delete();
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}