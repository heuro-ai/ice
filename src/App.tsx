import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import ShipmentList from './components/Shipments/ShipmentList';
import CustomerList from './components/Customers/CustomerList';
import ShipmentForm from './components/Forms/ShipmentForm';
import { useShipments } from './hooks/useShipments';
import { ShipmentFormData } from './types';

function App() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const { createShipment } = useShipments();

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'shipments':
        return 'Shipments';
      case 'customers':
        return 'Customers';
      case 'tracking':
        return 'Shipment Tracking';
      case 'documents':
        return 'Documents';
      case 'analytics':
        return 'Analytics & Reports';
      case 'communications':
        return 'Communications';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getSectionSubtitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Overview of your logistics operations';
      case 'shipments':
        return 'Manage all your import and export shipments';
      case 'customers':
        return 'Manage your customer relationships';
      case 'tracking':
        return 'Real-time shipment tracking';
      case 'documents':
        return 'Manage shipping documents and compliance';
      case 'analytics':
        return 'Business insights and performance metrics';
      case 'communications':
        return 'Customer communications and notifications';
      case 'settings':
        return 'System settings and preferences';
      default:
        return 'Overview of your logistics operations';
    }
  };

  const handleCreateShipment = async (data: ShipmentFormData) => {
    await createShipment({
      ...data,
      value: Number(data.value),
      weight: Number(data.weight)
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'shipments':
        return <ShipmentList />;
      case 'customers':
        return <CustomerList />;
      case 'tracking':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Shipment Tracking</h3>
            <p className="text-gray-600">Real-time tracking interface coming soon</p>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Management</h3>
            <p className="text-gray-600">Document management system coming soon</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
            <p className="text-gray-600">Advanced analytics dashboard coming soon</p>
          </div>
        );
      case 'communications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Communications</h3>
            <p className="text-gray-600">Communication center coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">System settings coming soon</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getSectionTitle()} 
          subtitle={getSectionSubtitle()}
          onNewShipment={activeSection === 'dashboard' ? () => setShowShipmentForm(true) : undefined}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>

      {/* Global Shipment Form */}
      {showShipmentForm && (
        <ShipmentForm
          onSubmit={handleCreateShipment}
          onClose={() => setShowShipmentForm(false)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;