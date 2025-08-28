import React from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { ThreeWayMatchItem, MatchStatus, UserRole } from '../types';
import { useAuth } from '../auth/AuthContext';

const getStatusBadge = (status: MatchStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [MatchStatus.Matched]: 'bg-green-100 text-green-800',
    [MatchStatus.Mismatched]: 'bg-red-100 text-red-800',
    [MatchStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Finance: React.FC = () => {
  const { user, selectedOutlet } = useAuth();

  if (!user || ![UserRole.RestaurantOwner, UserRole.Admin].includes(user.role)) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-slate-600 mt-2">You do not have the required permissions to view this page.</p>
        </div>
    );
  }

  const { data: items, loading, error } = useApi(api.getFinanceData, selectedOutlet?.id);

  const columns: Column<ThreeWayMatchItem>[] = [
    { header: 'PO ID', accessor: 'poId', className: 'font-medium text-secondary' },
    { header: 'Invoice ID', accessor: 'invoiceId' },
    { header: 'Vendor', accessor: 'vendor' },
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: (item: ThreeWayMatchItem) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount) },
    { header: 'Status', accessor: (item: ThreeWayMatchItem) => getStatusBadge(item.status) },
  ];

  const renderItemActions = (item: ThreeWayMatchItem) => (
    <Button variant="secondary" size="sm" onClick={() => alert(`Viewing details for PO ${item.poId}`)}>
      Resolve
    </Button>
  );
  
  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view financial data.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-semibold text-secondary">AP Automation & GST for {selectedOutlet.name}</h2>
        <Button onClick={() => alert('Exporting data to Tally/Zoho/QuickBooks/Razorpay...')}>
          Export to Tally/Zoho/Razorpay
        </Button>
      </div>

      <div className="flex space-x-2">
          <Button variant="primary">All</Button>
          <Button variant="secondary">Matched</Button>
          <Button variant="secondary">Mismatched</Button>
          <Button variant="secondary">Pending</Button>
      </div>

      {loading && <div className="text-center p-8">Loading financial data...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load data.</div>}
      {items && <Table data={items} columns={columns} renderActions={renderItemActions} />}
    </div>
  );
};

export default Finance;