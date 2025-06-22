export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          address: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      shipments: {
        Row: {
          id: string;
          reference: string;
          customer_id: string | null;
          origin: string;
          destination: string;
          status: 'pending' | 'in-transit' | 'customs' | 'delivered' | 'delayed';
          type: 'import' | 'export';
          value: number;
          weight: number;
          estimated_delivery: string | null;
          actual_delivery: string | null;
          carrier: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          customer_id?: string | null;
          origin: string;
          destination: string;
          status?: 'pending' | 'in-transit' | 'customs' | 'delivered' | 'delayed';
          type?: 'import' | 'export';
          value?: number;
          weight?: number;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          carrier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          customer_id?: string | null;
          origin?: string;
          destination?: string;
          status?: 'pending' | 'in-transit' | 'customs' | 'delivered' | 'delayed';
          type?: 'import' | 'export';
          value?: number;
          weight?: number;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          carrier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          type: 'shipment' | 'customer' | 'document' | 'alert' | 'completion';
          title: string;
          description: string | null;
          shipment_id: string | null;
          customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'shipment' | 'customer' | 'document' | 'alert' | 'completion';
          title: string;
          description?: string | null;
          shipment_id?: string | null;
          customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'shipment' | 'customer' | 'document' | 'alert' | 'completion';
          title?: string;
          description?: string | null;
          shipment_id?: string | null;
          customer_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}