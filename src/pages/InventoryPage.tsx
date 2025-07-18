import React from 'react';
import { ModernCard, StatCard } from '../components/ui/ModernCard';
import { AllInbox, Warning, Category } from '@mui/icons-material';

const InventoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Inventory Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Items"
            value="0"
            icon={<AllInbox />}
            color="#3b82f6"
            trend="+0% from last month"
          />
          <StatCard
            title="Low Stock"
            value="0"
            icon={<Warning />}
            color="#ef4444"
            trend="Needs attention"
          />
          <StatCard
            title="Categories"
            value="0"
            icon={<Category />}
            color="#10b981"
            trend="+0 new this week"
          />
        </div>

        <div className="mt-8">
          <ModernCard>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Inventory Items</h2>
              <p className="text-gray-400">Inventory management features coming soon...</p>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export { InventoryPage };
