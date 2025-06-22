import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Building, Edit, Trash2, Users } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerForm from '../Forms/CustomerForm';
import { CustomerFormData } from '../../types';

export default function CustomerList() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = async (data: CustomerFormData) => {
    await createCustomer(data);
  };

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This will also delete all associated shipments.')) {
      await deleteCustomer(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
            />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {customer.status}
                </span>
                <button
                  onClick={() => setEditingCustomer(customer)}
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Total Shipments</p>
                <p className="text-lg font-semibold text-gray-900">{customer.totalShipments || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${((customer.totalValue || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Last activity: {customer.lastActivity || 'Never'}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first customer'
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingCustomer && (
        <CustomerForm
          onSubmit={handleUpdateCustomer}
          onClose={() => setEditingCustomer(null)}
          initialData={{
            name: editingCustomer.name,
            email: editingCustomer.email,
            phone: editingCustomer.phone || '',
            company: editingCustomer.company || '',
            address: editingCustomer.address || '',
          }}
        />
      )}
    </div>
  );
}