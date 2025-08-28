
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import { StaffMember, StaffRole, UserRole } from '../types';
import { useAuth } from '../auth/AuthContext';
import Modal from '../components/Modal';

const StaffForm: React.FC<{
    staffMember: Partial<StaffMember>;
    onSave: (staffMember: Partial<StaffMember>) => void;
    onClose: () => void;
}> = ({ staffMember, onSave, onClose }) => {
    const [formData, setFormData] = useState(staffMember);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' || name === 'attendance' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Staff Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                    <select name="role" id="role" value={formData.role || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="" disabled>Select a role</option>
                        {Object.values(StaffRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-slate-700">Salary (Annual)</label>
                    <input type="number" name="salary" id="salary" value={formData.salary || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="attendance" className="block text-sm font-medium text-slate-700">Attendance (%)</label>
                    <input type="number" name="attendance" id="attendance" min="0" max="100" value={formData.attendance || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit">Save Changes</Button>
            </div>
        </form>
    );
};

const Staff: React.FC = () => {
  const { user, selectedOutlet } = useAuth();
  const { data: staff, loading, error, refetch } = useApi(api.getStaff, selectedOutlet?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);

  if (user?.role !== UserRole.RestaurantOwner) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-slate-600 mt-2">Only Restaurant Owners can manage staff.</p>
        </div>
    );
  }

  const handleOpenModal = (staffMember?: StaffMember) => {
    setEditingStaff(staffMember || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingStaff(null);
    setIsModalOpen(false);
  };

  const handleSaveStaff = async (staffData: Partial<StaffMember>) => {
    try {
        if (staffData.id) {
            await api.updateStaff(staffData as StaffMember);
        } else {
            await api.addStaff({ ...staffData, outletId: selectedOutlet!.id } as Omit<StaffMember, 'id'>);
        }
        refetch();
        handleCloseModal();
    } catch (e) {
        console.error("Failed to save staff member", e);
        alert("Could not save staff member.");
    }
  };

  const columns: Column<StaffMember>[] = [
    { header: 'Name', accessor: 'name', className: 'font-medium text-secondary' },
    { header: 'Role', accessor: 'role' },
    { header: 'Salary', accessor: (item) => `$${item.salary.toLocaleString()}` },
    { header: 'Attendance', accessor: (item) => `${item.attendance}%` },
  ];

  const renderStaffActions = (item: StaffMember) => (
    <Button variant="secondary" size="sm" onClick={() => handleOpenModal(item)}>
      Edit
    </Button>
  );

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to manage staff.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Staff Management for {selectedOutlet.name}</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Add Staff
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-600">Total Staff</h3>
            <p className="text-3xl font-bold text-secondary">{staff?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-600">Total Payroll (Monthly)</h3>
            <p className="text-3xl font-bold text-secondary">${((staff?.reduce((sum, s) => sum + s.salary, 0) || 0) / 12).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-600">Avg. Attendance</h3>
            <p className="text-3xl font-bold text-secondary">{staff && staff.length > 0 ? (staff.reduce((sum, s) => sum + s.attendance, 0) / staff.length).toFixed(1) : '0'}%</p>
        </div>
      </div>


      {loading && <div className="text-center p-8">Loading staff...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load staff.</div>}
      {staff && <Table data={staff} columns={columns} renderActions={renderStaffActions} />}

      {isModalOpen && editingStaff && (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingStaff.id ? 'Edit Staff Member' : 'Add New Staff Member'}
        >
            <StaffForm staffMember={editingStaff} onSave={handleSaveStaff} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Staff;