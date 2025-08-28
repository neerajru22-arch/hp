
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { WastageEntry, UserRole, WastageReason } from '../types';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon, TrashIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const WastageForm: React.FC<{
    onSave: (entry: Omit<WastageEntry, 'id' | 'date' | 'outletId' | 'loggedBy'>) => void;
    onClose: () => void;
}> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: 1,
        unit: 'kg',
        reason: WastageReason.Spoilage
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.itemName.trim() === '' || formData.quantity <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-slate-700">Item Name</label>
                    <input type="text" name="itemName" id="itemName" value={formData.itemName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
                        <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-slate-700">Unit</label>
                        <input type="text" name="unit" id="unit" value={formData.unit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason for Wastage</label>
                    <select name="reason" id="reason" value={formData.reason} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {Object.values(WastageReason).map(reason => (
                            <option key={reason} value={reason}>{reason}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Log Wastage</Button>
            </div>
        </form>
    );
};

const WastageLog: React.FC = () => {
    const { user, selectedOutlet } = useAuth();
    const { data: wastageLog, loading, error, refetch } = useApi(api.getWastageLog, selectedOutlet?.id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canLog = user && [UserRole.Admin, UserRole.RestaurantOwner, UserRole.Chef, UserRole.StoreManager].includes(user.role);

    if (!canLog) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
                <p className="text-slate-600 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    if (!selectedOutlet) {
        return <div className="text-center p-8">Please select an outlet to view the wastage log.</div>
    }

    const handleSaveWastage = async (entry: Omit<WastageEntry, 'id' | 'date' | 'outletId' | 'loggedBy'>) => {
        if (!user) return;
        
        const newEntryData = {
            ...entry,
            outletId: selectedOutlet.id,
            loggedBy: user.name
        };
        
        await api.addWastageEntry(newEntryData);

        await api.logActivity({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            outletId: selectedOutlet.id,
            outletName: selectedOutlet.name,
            action: 'Wastage Logged',
            details: `Logged ${entry.quantity} ${entry.unit} of ${entry.itemName} as ${entry.reason}`
        });
        
        refetch();
        setIsModalOpen(false);
    };

    const columns: Column<WastageEntry>[] = [
        { header: 'Date', accessor: 'date' },
        { header: 'Item Name', accessor: 'itemName', className: 'font-medium text-secondary' },
        { header: 'Quantity', accessor: (item) => `${item.quantity} ${item.unit}` },
        { header: 'Reason', accessor: 'reason' },
        { header: 'Logged By', accessor: 'loggedBy' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <h2 className="text-xl font-semibold text-secondary">Wastage Log for {selectedOutlet.name}</h2>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon className="w-5 h-5" />}>
                    Log Wastage
                </Button>
            </div>

            {loading && <div className="text-center p-8">Loading wastage log...</div>}
            {error && <div className="text-center p-8 text-danger">Failed to load log.</div>}
            {wastageLog && <Table data={wastageLog} columns={columns} />}
            
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Wastage Entry">
                    <WastageForm onSave={handleSaveWastage} onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

export default WastageLog;
