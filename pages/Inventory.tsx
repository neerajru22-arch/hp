
import React from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import { InventoryItem } from '../types';
import { useAuth } from '../auth/AuthContext';

// Returns the visual indicator and a status string for row styling
const getStockLevelIndicator = (stock: number, par: number) => {
    const percentage = par > 0 ? (stock / par) * 100 : 100;
    let bgColor = 'bg-green-500';
    let status: 'ok' | 'warning' | 'critical' = 'ok';

    if (percentage < 50) {
        bgColor = 'bg-yellow-500';
        status = 'warning';
    }
    if (percentage < 25) {
        bgColor = 'bg-red-500';
        status = 'critical';
    }
    
    const indicator = (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
    );
    return { indicator, status };
}

const Inventory: React.FC = () => {
  const { selectedOutlet } = useAuth();
  const { data: items, loading, error } = useApi(api.getInventory, selectedOutlet?.id);

  const columns: Column<InventoryItem>[] = [
    { header: 'Item Name', accessor: 'name', className: 'font-medium text-secondary' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Category', accessor: 'category' },
    { header: 'Stock Level', accessor: (item: InventoryItem) => getStockLevelIndicator(item.stock, item.par).indicator },
    { header: 'On Hand', accessor: (item: InventoryItem) => `${item.stock} / ${item.par} ${item.unit}` },
  ];
  
  const renderItemActions = (item: InventoryItem) => (
      <div className="space-x-2">
        <Button variant="secondary" size="sm" onClick={() => alert(`Returning ${item.name} to vendor.`)}>
            Return
        </Button>
        <Button variant="secondary" size="sm" onClick={() => alert(`Adjusting stock for ${item.name}`)}>
            Adjust
        </Button>
      </div>
  );

  const getRowClassName = (item: InventoryItem): string => {
    const { status } = getStockLevelIndicator(item.stock, item.par);
    if (status === 'critical') {
        return 'bg-red-50 hover:bg-red-100';
    }
    if (status === 'warning') {
        return 'bg-yellow-50 hover:bg-yellow-100';
    }
    return '';
  };

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view inventory.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Inventory for {selectedOutlet.name}</h2>
        <Button onClick={() => alert('Simulating goods received note...')} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Receive Goods
        </Button>
      </div>

      {loading && <div className="text-center p-8">Loading inventory...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load inventory.</div>}
      {items && <Table data={items} columns={columns} renderActions={renderItemActions} rowClassName={getRowClassName} />}
    </div>
  );
};

export default Inventory;