import Dexie, { Table } from 'dexie';
import { Customer, Service, Appointment, Quote, Vehicle } from '../types';

export class AppDatabase extends Dexie {
  customers!: Table<Customer>;
  services!: Table<Service>;
  appointments!: Table<Appointment>;
  quotes!: Table<Quote>;
  vehicles!: Table<Vehicle>;

  constructor() {
    super('boltAgenda');
    
    this.version(2).stores({
      customers: 'id, name, email, phone',
      services: 'id, name, price, duration, category',
      appointments: 'id, customerId, vehicleId, serviceId, date, status',
      quotes: 'id, customerId, vehicleId, date, status, appointmentId',
      vehicles: 'id, customerId, brand, model, year, licensePlate'
    });
  }
}

export const db = new AppDatabase();