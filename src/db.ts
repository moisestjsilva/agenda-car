import Dexie, { Table } from 'dexie';
import { Customer, Service, Quote, Appointment, Vehicle } from './types';

export class AppDatabase extends Dexie {
  customers!: Table<Customer>;
  vehicles!: Table<Vehicle>;
  services!: Table<Service>;
  quotes!: Table<Quote>;
  appointments!: Table<Appointment>;

  constructor() {
    super('AutoEsteticaDB');
    
    this.version(1).stores({
      customers: '++id, name, email, phone',
      vehicles: '++id, customerId, plate',
      services: '++id, name, price, category',
      quotes: '++id, customerId, vehicleId, date, status',
      appointments: '++id, customerId, vehicleId, serviceId, date, status'
    });
  }
}

export const db = new AppDatabase();
