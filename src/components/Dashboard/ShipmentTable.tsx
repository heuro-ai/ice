import React from 'react';
import { Package, Clock, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { Shipment } from '../../types';

interface ShipmentTableProps {
  shipments: Shipment[];
}

const statusIcons = {
  pending: Clock,
  'in-transit': Truck,
  customs: Package,
  delivered: CheckCircle,
  delayed: AlertTriangle,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-transit': 'bg-blue-100 text-blue-800',
  customs: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
};

export default function ShipmentTable({ shipments }: ShipmentTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ETA
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => {
              const StatusIcon = statusIcons[shipment.status];
              return (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shipment.reference}</div>
                      <div className="text-sm text-gray-500 capitalize">{shipment.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof shipment.customer === 'object' ? shipment.customer.name : shipment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.origin} → {shipment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${shipment.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.estimatedDelivery}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}