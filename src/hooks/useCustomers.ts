import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Customer } from '../types';
import toast from 'react-hot-toast';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enhance customers with shipment data
      const enhancedCustomers = await Promise.all(
        (data || []).map(async (customer) => {
          const { data: shipments } = await supabase
            .from('shipments')
            .select('id, value')
            .eq('customer_id', customer.id);

          const totalShipments = shipments?.length || 0;
          const totalValue = shipments?.reduce((sum, s) => sum + s.value, 0) || 0;

          return {
            ...customer,
            totalShipments,
            totalValue,
            lastActivity: new Date(customer.updated_at).toLocaleDateString()
          };
        })
      );

      setCustomers(enhancedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: any) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;

      const enhancedCustomer = {
        ...data,
        totalShipments: 0,
        totalValue: 0,
        lastActivity: new Date().toLocaleDateString()
      };

      setCustomers(prev => [enhancedCustomer, ...prev]);
      
      // Create activity
      await supabase
        .from('activities')
        .insert([{
          type: 'customer',
          title: 'New customer registered',
          description: `${data.name} from ${data.company} completed registration`,
          customer_id: data.id
        }]);

      toast.success('Customer created successfully');
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => prev.map(c => 
        c.id === id ? { ...c, ...data } : c
      ));
      toast.success('Customer updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
}