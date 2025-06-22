import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import ShipmentForm from '../Forms/ShipmentForm';
import { ShipmentFormData } from '../../types';

export default function ShipmentList() {
  const { shipments, loading, createShipment, updateShipment, deleteShipment } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<any>(null);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shipment.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateShipment = async (data: ShipmentFormData) => {
    await createShipment({
      ...data,
      value: Number(data.value),
      weight: Number(data.weight)
    });
  };

  const handleUpdateShipment = async (data: ShipmentFormData) => {
    if (editingShipment) {
      await updateShipment(editingShipment.id, {
        ...data,
        value: Number(data.value),
        weight: Number(data.weight)
      });
      setEditingShipment(null);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      await deleteShipment(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="customs">Customs</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{shipment.reference}</h3>
                <p className="text-sm text-gray-500">{shipment.customer?.name || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingShipment(shipment)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteShipment(shipment.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="text-sm font-medium text-gray-900">{shipment.origin} → {shipment.destination}</p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="text-sm font-medium text-gray-900">${shipment.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-sm font-medium text-gray-900">{shipment.weight.toLocaleString()} kg</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="text-sm font-medium text-gray-900">
                  {shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                shipment.status === 'customs' ? 'bg-purple-100 text-purple-800' :
                shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
              </span>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{shipment.carrier}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first shipment'
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <ShipmentForm
          onSubmit={handleCreateShipment}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingShipment && (
        <ShipmentForm
          onSubmit={handleUpdateShipment}
          onClose={() => setEditingShipment(null)}
          initialData={{
            reference: editingShipment.reference,
            customer_id: editingShipment.customer_id,
            origin: editingShipment.origin,
            destination: editingShipment.destination,
            status: editingShipment.status,
            type: editingShipment.type,
            value: editingShipment.value,
            weight: editingShipment.weight,
            estimated_delivery: editingShipment.estimated_delivery,
            carrier: editingShipment.carrier,
          }}
        />
      )}
    </div>
  );
}