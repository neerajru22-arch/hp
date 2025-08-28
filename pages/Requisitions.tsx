
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { Requisition, RequisitionStatus } from '../types';
import { useAuth } from '../auth/AuthContext';
import Modal from '../components/Modal';

const getStatusBadge = (status: RequisitionStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [RequisitionStatus.Fulfilled]: 'bg-green-100 text-green-800',
    [RequisitionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [RequisitionStatus.Cancelled]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const RequisitionDetailsModal: React.FC<{ requisition: Requisition; onClose: () => void }> = ({ requisition, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Details for Requisition #${requisition.id}`}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
                    <p><span className="font-semibold">Department:</span> {requisition.department}</p>
                    <p><span className="font-semibold">Requested By:</span> {requisition.requestedBy}</p>
                    <p><span className="font-semibold">Date:</span> {requisition.date}</p>
                </div>
                <h4 className="font-semibold text-secondary mb-2">Requested Items</h4>
                <div className="border rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase">Item Name</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase">Quantity</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase">Unit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {requisition.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800">{item.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{item.quantity}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-2">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                {requisition.status === RequisitionStatus.Pending && (
                    <Button variant="primary" onClick={() => { alert(`Fulfilling ${requisition.id}`); onClose(); }}>Fulfill Requisition</Button>
                )}
            </div>
        </Modal>
    );
};

const Requisitions: React.FC = () => {
  const { selectedOutlet } = useAuth();
  const { data: requisitions, loading, error } = useApi(api.getRequisitions, selectedOutlet?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);

  const handleOpenModal = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setIsModalOpen(true);
  };

  const columns: Column<Requisition>[] = [
    { header: 'Req. ID', accessor: 'id', className: 'font-medium text-secondary' },
    { header: 'Department', accessor: 'department' },
    { header: 'Requested By', accessor: 'requestedBy' },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: (item) => item.items.length },
    { header: 'Status', accessor: (item: Requisition) => getStatusBadge(item.status) },
  ];

  const renderRequisitionActions = (item: Requisition) => (
    <div className="flex items-center space-x-2 justify-end">
       {item.status === RequisitionStatus.Pending && (
         <Button variant="primary" size="sm" onClick={() => alert(`Fulfilling requisition ${item.id}`)}>
            Fulfill
          </Button>
       )}
      <Button variant="secondary" size="sm" onClick={() => handleOpenModal(item)}>
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

      {isModalOpen && selectedRequisition && (
        <RequisitionDetailsModal requisition={selectedRequisition} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Requisitions;