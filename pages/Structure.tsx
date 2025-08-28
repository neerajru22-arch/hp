
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Outlet, Kitchen, Floor, Table, UserRole } from '../types';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const AddFloorModal: React.FC<{ outletId: string; onClose: () => void; onSave: () => void; }> = ({ outletId, onClose, onSave }) => {
    const [name, setName] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            await api.addFloorToOutlet(name, outletId);
            onSave();
            onClose();
        }
    };
    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Floor">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <label htmlFor="floorName" className="block text-sm font-medium text-slate-700">Floor Name</label>
                    <input type="text" id="floorName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add Floor</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddTableModal: React.FC<{ floorId: string; onClose: () => void; onSave: () => void; }> = ({ floorId, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(2);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && capacity > 0) {
            // Hardcoding waiter for simplicity in this mock setup
            await api.addTableToFloor(name, capacity, floorId, 'user-6');
            onSave();
            onClose();
        }
    };
    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Table">
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="tableName" className="block text-sm font-medium text-slate-700">Table Name / Number</label>
                        <input type="text" id="tableName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="tableCapacity" className="block text-sm font-medium text-slate-700">Capacity</label>
                        <input type="number" id="tableCapacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add Table</Button>
                </div>
            </form>
        </Modal>
    );
};

const OutletStructure: React.FC<{ outlet: Outlet }> = ({ outlet }) => {
    const { data: kitchens, loading: kitchensLoading, refetch: refetchKitchens } = useApi(api.getKitchens, outlet.id);
    const { data: floors, loading: floorsLoading, refetch: refetchFloors } = useApi(api.getFloors, outlet.id);
    
    const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
    
    const handleSave = () => {
        refetchKitchens();
        refetchFloors();
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-4">{outlet.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kitchens */}
                <div>
                    <h4 className="text-lg font-semibold text-secondary mb-2">Kitchens</h4>
                    {kitchensLoading ? <p>Loading...</p> : (
                        <ul className="space-y-2">
                            {kitchens?.map(kitchen => <li key={kitchen.id} className="p-3 bg-slate-100 rounded">{kitchen.name}</li>)}
                        </ul>
                    )}
                </div>
                {/* Floors & Tables */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="text-lg font-semibold text-secondary">Floors & Tables</h4>
                         <Button size="sm" onClick={() => setIsAddFloorModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>Add Floor</Button>
                    </div>
                    {floorsLoading ? <p>Loading...</p> : (
                        <div className="space-y-4">
                            {floors?.map(floor => <FloorStructure key={floor.id} floor={floor} onSave={handleSave} />)}
                        </div>
                    )}
                </div>
            </div>
            {isAddFloorModalOpen && <AddFloorModal outletId={outlet.id} onClose={() => setIsAddFloorModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

const FloorStructure: React.FC<{ floor: Floor; onSave: () => void }> = ({ floor, onSave }) => {
    const { data: tables, loading: tablesLoading, refetch: refetchTables } = useApi(api.getTablesForFloor, floor.id);
    const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
    
    const handleSave = () => {
        refetchTables();
        onSave(); // Propagate up to refetch floors if needed
    }

    return (
        <div className="p-3 bg-slate-50 rounded border">
            <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold">{floor.name}</h5>
                <Button size="sm" variant="secondary" onClick={() => setIsAddTableModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>Add Table</Button>
            </div>
            {tablesLoading ? <p>Loading tables...</p> : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {tables?.map(table => (
                        <div key={table.id} className="bg-white p-2 text-center rounded border text-sm">
                           <p className="font-semibold">{table.name}</p>
                           <p className="text-xs text-slate-500">Cap: {table.capacity}</p>
                        </div>
                    ))}
                </div>
            )}
            {isAddTableModalOpen && <AddTableModal floorId={floor.id} onClose={() => setIsAddTableModalOpen(false)} onSave={handleSave} />}
        </div>
    )
}

const Structure: React.FC = () => {
    const { user, outlets } = useAuth();

    if (user?.role !== UserRole.Admin) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
                <p className="text-slate-600 mt-2">Only Admins can manage the entity structure.</p>
            </div>
        );
    }
    
    // We only want to manage actual restaurant outlets, not HQ etc.
    const restaurantOutlets = outlets.filter(o => o.parentId);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Entity Structure Management</h2>
            <div className="space-y-6">
                {restaurantOutlets.map(outlet => <OutletStructure key={outlet.id} outlet={outlet} />)}
            </div>
        </div>
    );
};

export default Structure;
