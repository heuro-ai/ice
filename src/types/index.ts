import { Database } from './database';

export type Shipment = Database['public']['Tables']['shipments']['Row'] & {
  customer?: Customer;
};

export type Customer = Database['public']['Tables']['customers']['Row'] & {
  totalShipments?: number;
  totalValue?: number;
  lastActivity?: string;
};

export type Activity = Database['public']['Tables']['activities']['Row'] & {
  shipment?: Shipment;
  customer?: Customer;
};

export interface Metric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface ShipmentFormData {
  reference: string;
  customer_id: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'customs' | 'delivered' | 'delayed';
  type: 'import' | 'export';
  value: number;
  weight: number;
  estimated_delivery: string;
  carrier: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}