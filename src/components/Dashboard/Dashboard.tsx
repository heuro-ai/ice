import React, { useMemo } from 'react';
import MetricCard from './MetricCard';
import ShipmentTable from './ShipmentTable';
import ActivityFeed from './ActivityFeed';
import { Metric } from '../../types';
import { useShipments } from '../../hooks/useShipments';
import { useCustomers } from '../../hooks/useCustomers';

export default function Dashboard() {
  const { shipments, loading: shipmentsLoading } = useShipments();
  const { customers, loading: customersLoading } = useCustomers();

  const metrics: Metric[] = useMemo(() => {
    if (shipmentsLoading || customersLoading) {
      return [
        { label: 'Active Shipments', value: '...', change: 0, trend: 'neutral' },
        { label: 'Revenue This Month', value: '...', change: 0, trend: 'neutral' },
        { label: 'Customers', value: '...', change: 0, trend: 'neutral' },
        { label: 'On-Time Delivery', value: '...', change: 0, trend: 'neutral' },
      ];
    }

    const activeShipments = shipments.filter(s => s.status !== 'delivered').length;
    const totalRevenue = shipments.reduce((sum, s) => sum + s.value, 0);
    const deliveredOnTime = shipments.filter(s => s.status === 'delivered').length;
    const totalDelivered = shipments.filter(s => s.status === 'delivered').length;
    const onTimePercentage = totalDelivered > 0 ? (deliveredOnTime / totalDelivered) * 100 : 0;

    return [
      { label: 'Active Shipments', value: activeShipments.toString(), change: 12, trend: 'up' },
      { label: 'Revenue This Month', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, change: 8, trend: 'up' },
      { label: 'Customers', value: customers.length.toString(), change: 15, trend: 'up' },
      { label: 'On-Time Delivery', value: `${onTimePercentage.toFixed(1)}%`, change: -2, trend: 'down' },
    ];
  }, [shipments, customers, shipmentsLoading, customersLoading]);

  const recentShipments = shipments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShipmentTable shipments={recentShipments} />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}