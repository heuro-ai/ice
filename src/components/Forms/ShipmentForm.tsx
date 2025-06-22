import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { ShipmentFormData } from '../../types';
import { useCustomers } from '../../hooks/useCustomers';

interface ShipmentFormProps {
  onSubmit: (data: ShipmentFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Partial<ShipmentFormData>;
}

export default function ShipmentForm({ onSubmit, onClose, initialData }: ShipmentFormProps) {
  const [loading, setLoading] = useState(false);
  const { customers } = useCustomers();
  const { register, handleSubmit, formState: { errors } } = useForm<ShipmentFormData>({
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: ShipmentFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SH-${year}-${random}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Shipment' : 'Create New Shipment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                {...register('reference', { required: 'Reference is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={generateReference()}
              />
              {errors.reference && (
                <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select
                {...register('customer_id', { required: 'Customer is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <input
                type="text"
                {...register('origin', { required: 'Origin is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Shanghai"
              />
              {errors.origin && (
                <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                {...register('destination', { required: 'Destination is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Los Angeles"
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="customs">Customs</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value (USD)
              </label>
              <input
                type="number"
                {...register('value', { 
                  required: 'Value is required',
                  min: { value: 0, message: 'Value must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                {...register('weight', { 
                  required: 'Weight is required',
                  min: { value: 0, message: 'Weight must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="date"
                {...register('estimated_delivery', { required: 'Estimated delivery is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.estimated_delivery && (
                <p className="mt-1 text-sm text-red-600">{errors.estimated_delivery.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier
              </label>
              <input
                type="text"
                {...register('carrier', { required: 'Carrier is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Maersk Line"
              />
              {errors.carrier && (
                <p className="mt-1 text-sm text-red-600">{errors.carrier.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')} Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}