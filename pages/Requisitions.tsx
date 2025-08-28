
import React from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import { Requisition, RequisitionStatus } from '../types';
import { useAuth } from '../auth/AuthContext';

const getStatusBadge = (status: RequisitionStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [RequisitionStatus.Fulfilled]: 'bg-green-100 text-green-800',
    [RequisitionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [RequisitionStatus.Cancelled]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Requisitions: React.FC = () => {
  const { selectedOutlet } = useAuth();
  const { data: requisitions, loading, error } = useApi(api.getRequisitions, selectedOutlet?.id);

  const columns: Column<Requisition>[] = [
    { header: 'Req. ID', accessor: 'id', className: 'font-medium text-secondary' },
    { header: 'Department', accessor: 'department' },
    { header: 'Requested By', accessor: 'requestedBy' },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: 'itemCount' },
    { header: 'Status', accessor: (item: Requisition) => getStatusBadge(item.status) },
  ];

  const renderRequisitionActions = (item: Requisition) => (
    <div className="flex items-center space-x-2 justify-end">
       {item.status === RequisitionStatus.Pending && (
         <Button variant="primary" size="sm" onClick={() => alert(`Fulfilling requisition ${item.id}`)}>
            Fulfill
          </Button>
       )}
      <Button variant="secondary" size="sm" onClick={() => alert(`Viewing details for ${item.id}`)}>
        Details
      </Button>
    </div>
  );

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view requisitions.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Internal Requisitions for {selectedOutlet.name}</h2>
      </div>

      {loading && <div className="text-center p-8">Loading requisitions...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load requisitions.</div>}
      {requisitions && <Table data={requisitions} columns={columns} renderActions={renderRequisitionActions} />}
    </div>
  );
};

export default Requisitions;