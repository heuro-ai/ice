import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shipment } from '../types';
import toast from 'react-hot-toast';

export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (shipmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert([shipmentData])
        .select(`
          *,
          customer:customers(*)
        `)
        .single();

      if (error) throw error;

      setShipments(prev => [data, ...prev]);
      
      // Create activity
      await supabase
        .from('activities')
        .insert([{
          type: 'shipment',
          title: 'New shipment created',
          description: `${data.reference} from ${data.origin} to ${data.destination}`,
          shipment_id: data.id
        }]);

      toast.success('Shipment created successfully');
      return data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment');
      throw error;
    }
  };

  const updateShipment = async (id: string, updates: Partial<Shipment>) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          customer:customers(*)
        `)
        .single();

      if (error) throw error;

      setShipments(prev => prev.map(s => s.id === id ? data : s));
      toast.success('Shipment updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error('Failed to update shipment');
      throw error;
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setShipments(prev => prev.filter(s => s.id !== id));
      toast.success('Shipment deleted successfully');
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast.error('Failed to delete shipment');
      throw error;
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return {
    shipments,
    loading,
    createShipment,
    updateShipment,
    deleteShipment,
    refetch: fetchShipments
  };
}