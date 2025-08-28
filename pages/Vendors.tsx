
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import { Vendor, VendorStatus, VendorPerformance, UserRole } from '../types';
import { useAuth } from '../auth/AuthContext';
import Modal from '../components/Modal';

const getStatusBadge = (status: VendorStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [VendorStatus.Active]: 'bg-green-100 text-green-800',
    [VendorStatus.Inactive]: 'bg-slate-100 text-slate-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const getPerformanceBadge = (rating: VendorPerformance) => {
  const ratingClasses = {
    [VendorPerformance.Excellent]: 'text-success',
    [VendorPerformance.Good]: 'text-blue-600',
    [VendorPerformance.Average]: 'text-yellow-600',
    [VendorPerformance.Poor]: 'text-danger',
  };
  return <span className={`font-semibold ${ratingClasses[rating]}`}>{rating}</span>;
};


const VendorForm: React.FC<{
    vendor: Partial<Vendor>;
    onSave: (vendor: Partial<Vendor>) => void;
    onClose: () => void;
}> = ({ vendor, onSave, onClose }) => {
    const [formData, setFormData] = useState(vendor);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Vendor Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700">Contact Person</label>
                    <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                    <select name="status" id="status" value={formData.status || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {Object.values(VendorStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="performanceRating" className="block text-sm font-medium text-slate-700">Performance Rating</label>
                    <select name="performanceRating" id="performanceRating" value={formData.performanceRating || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {Object.values(VendorPerformance).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit">Save Vendor</Button>
            </div>
        </form>
    );
};


const Vendors: React.FC = () => {
  const { user } = useAuth();
  const { data: vendors, loading, error, refetch } = useApi(api.getVendors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Partial<Vendor> | null>(null);
  
  const canManage = user && [UserRole.Admin, UserRole.RestaurantOwner, UserRole.Procurement, UserRole.StoreManager].includes(user.role);

  if (!canManage) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-slate-600 mt-2">You do not have permission to manage vendors.</p>
        </div>
    );
  }

  const handleOpenModal = (vendor?: Vendor) => {
    setEditingVendor(vendor || { status: VendorStatus.Active, performanceRating: VendorPerformance.Good });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingVendor(null);
    setIsModalOpen(false);
  };

  const handleSaveVendor = async (vendorData: Partial<Vendor>) => {
    try {
        if (vendorData.id) {
            await api.updateVendor(vendorData as Vendor);
        } else {
            await api.addVendor(vendorData as Omit<Vendor, 'id'>);
        }
        refetch();
        handleCloseModal();
    } catch (e) {
        console.error("Failed to save vendor", e);
        alert("Could not save vendor.");
    }
  };


  const columns: Column<Vendor>[] = [
    { header: 'Vendor Name', accessor: 'name', className: 'font-medium text-secondary' },
    { header: 'Contact', accessor: (item) => (
        <div>
            <p>{item.contactPerson}</p>
            <p className="text-xs text-slate-500">{item.email}</p>
        </div>
    )},
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: (item) => getStatusBadge(item.status) },
    { header: 'Rating', accessor: (item) => getPerformanceBadge(item.performanceRating) },
  ];

  const renderVendorActions = (item: Vendor) => (
    <Button variant="secondary" size="sm" onClick={() => handleOpenModal(item)}>
      Edit
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Vendor Management</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Add Vendor
        </Button>
      </div>

      {loading && <div className="text-center p-8">Loading vendors...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load vendors.</div>}
      {vendors && <Table data={vendors} columns={columns} renderActions={renderVendorActions} />}
      
      {isModalOpen && editingVendor && (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingVendor.id ? 'Edit Vendor' : 'Add New Vendor'}
        >
            <VendorForm vendor={editingVendor} onSave={handleSaveVendor} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Vendors;