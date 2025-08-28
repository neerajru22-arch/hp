
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Floor, Table, User, UserRole } from '../types';
import { UserCircleIcon } from '../components/icons/Icons';

const WaiterDraggable: React.FC<{ waiter: User }> = ({ waiter }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('waiterId', waiter.id);
        e.dataTransfer.setData('waiterName', waiter.name);
    };

    return (
        <div 
            draggable 
            onDragStart={handleDragStart}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing"
        >
            <UserCircleIcon className="w-8 h-8 text-slate-400" />
            <span className="font-medium text-slate-800">{waiter.name}</span>
        </div>
    );
};

const TableDropTarget: React.FC<{ table: Table; onDrop: (tableId: string, waiterId: string) => void }> = ({ table, onDrop }) => {
    const [isOver, setIsOver] = useState(false);
    const { data: allUsers } = useApi(api.getAllUsers);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        const waiterId = e.dataTransfer.getData('waiterId');
        if (waiterId) {
            onDrop(table.id, waiterId);
        }
    };
    
    const assignedWaiter = allUsers?.find(u => u.id === table.assignedWaiterId);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-3 border-2 border-dashed rounded-lg transition-colors ${isOver ? 'border-primary bg-primary-50' : 'border-slate-300 bg-slate-50'}`}
        >
            <p className="font-semibold text-slate-800">{table.name}</p>
            <p className="text-sm text-slate-500">Capacity: {table.capacity}</p>
            {assignedWaiter && (
                <div className="mt-2 flex items-center space-x-2 text-xs bg-slate-200 rounded-full px-2 py-1">
                    <UserCircleIcon className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-700">{assignedWaiter.name}</span>
                </div>
            )}
        </div>
    );
};


const FloorSection: React.FC<{ floor: Floor, onTableAssignment: () => void }> = ({ floor, onTableAssignment }) => {
    const { user, selectedOutlet } = useAuth();
    const { data: tables, loading, error, refetch } = useApi(api.getTablesForFloor, floor.id);

    const handleDrop = async (tableId: string, waiterId: string) => {
        if (user && selectedOutlet) {
            await api.updateTableAssignment(tableId, waiterId, user, selectedOutlet);
            refetch(); // Refetch tables for this floor
            onTableAssignment(); // Propagate up to refetch metrics if needed
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-secondary border-b-2 border-slate-200 pb-2 mb-4">{floor.name}</h3>
            {loading && <p>Loading tables...</p>}
            {error && <p className="text-danger">Failed to load tables.</p>}
            {tables && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {tables.map(table => (
                        <TableDropTarget key={table.id} table={table} onDrop={handleDrop} />
                    ))}
                </div>
            )}
        </div>
    );
};


const FloorManagement: React.FC = () => {
    const { user, selectedOutlet } = useAuth();

    const { data: waiters, loading: waitersLoading, error: waitersError } = useApi(api.getWaitersForOutlet, selectedOutlet?.id);
    const { data: floors, loading: floorsLoading, error: floorsError } = useApi(api.getFloors, selectedOutlet?.id);
    
    const canManage = user && [UserRole.Manager, UserRole.Admin, UserRole.RestaurantOwner].includes(user.role);

    if (!canManage) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
                <p className="text-slate-600 mt-2">You do not have permission to manage the floor.</p>
            </div>
        );
    }
    
    if (!selectedOutlet) {
        return <div className="text-center p-8">Please select an outlet to manage the floor.</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Floor & Table Assignment for {selectedOutlet.name}</h2>
            <p className="text-slate-600">Drag waiters from the left panel and drop them onto tables to assign them for the current shift.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Available Waiters</h3>
                    {waitersLoading && <p>Loading waiters...</p>}
                    {waitersError && <p className="text-danger">Failed to load waiters.</p>}
                    <div className="space-y-3">
                        {waiters?.map(waiter => <WaiterDraggable key={waiter.id} waiter={waiter} />)}
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                     {floorsLoading && <p>Loading floors...</p>}
                     {floorsError && <p className="text-danger">Failed to load floors.</p>}
                     {floors?.map(floor => (
                         <FloorSection key={floor.id} floor={floor} onTableAssignment={() => { /* Could refetch data here if needed */ }} />
                     ))}
                </div>
            </div>
        </div>
    );
};

export default FloorManagement;
