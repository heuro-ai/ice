import React from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  Ship,
  TrendingUp,
  Globe
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'shipments', label: 'Shipments', icon: Ship },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'tracking', label: 'Tracking', icon: Package },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">LogisticsPro</h1>
            <p className="text-slate-400 text-sm">Import & Export Hub</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-slate-400">Operations Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}