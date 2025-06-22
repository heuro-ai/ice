import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity } from '../types';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          shipment:shipments(*),
          customer:customers(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('activities')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
        setActivities(prev => [payload.new as Activity, ...prev.slice(0, 9)]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { activities, loading };
}