export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: ServiceCategory;
}

export type ServiceCategory = 'washing' | 'polishing' | 'coating' | 'detailing' | 'other';

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface QuoteItem {
  serviceId: string;
  price: number;
  discount: number;
}

export type QuoteStatus = 'aberto' | 'aprovado' | 'concluido';

export interface Quote {
  id: string;
  customerId: string;
  vehicleId: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  notes?: string;
  status: QuoteStatus;
}