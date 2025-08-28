import React from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import { Order, OrderStatus, UserRole } from '../types';
import { useAuth } from '../auth/AuthContext';

const getStatusBadge = (status: OrderStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
    [OrderStatus.Approved]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PendingApproval]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Orders: React.FC = () => {
  const { user, selectedOutlet } = useAuth();
  const { data: orders, loading, error } = useApi(api.getOrders, selectedOutlet?.id);
  
  const canApprove = user?.role === UserRole.RestaurantOwner || user?.role === UserRole.Procurement;

  const columns: Column<Order>[] = [
    { header: 'Order ID', accessor: 'id', className: 'font-medium text-secondary' },
    { header: 'Vendor', accessor: 'vendor' },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: 'itemCount' },
    { header: 'Total', accessor: (item: Order) => `$${item.total.toFixed(2)}` },
    { header: 'Status', accessor: (item: Order) => getStatusBadge(item.status) },
  ];

  const renderOrderActions = (item: Order) => (
    <div className="flex items-center space-x-2 justify-end">
       {item.status === OrderStatus.PendingApproval && (
         <Button 
            variant="primary" 
            size="sm" 
            onClick={() => alert(`Approving order ${item.id}`)}
            disabled={!canApprove}
            title={!canApprove ? "You don't have permission to approve orders." : "Approve this order"}
          >
            Approve
          </Button>
       )}
      <Button variant="secondary" size="sm" onClick={() => alert(`Viewing details for ${item.id}`)}>
        Details
      </Button>
    </div>
  );

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view orders.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Purchase Orders for {selectedOutlet.name}</h2>
        <Button onClick={() => alert('Opening new order form...')} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Create Order
        </Button>
      </div>

      {loading && <div className="text-center p-8">Loading orders...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load orders.</div>}
      {orders && <Table data={orders} columns={columns} renderActions={renderOrderActions} />}
    </div>
  );
};

export default Orders;