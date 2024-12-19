export type QuoteStatus = 'aberto' | 'enviado' | 'aprovado' | 'rejeitado';

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: string;
  plate: string;
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
  description?: string;
  price: number;
  category: string;
}

export interface QuoteItem {
  serviceId: string;
  price: number;
  discount: number;
}

export interface Quote {
  id: string;
  customerId: string;
  vehicleId: string;
  items: QuoteItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  date: string;
  status: QuoteStatus;
  notes?: string;
  appointmentId?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  date: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  quoteId?: string;
}
