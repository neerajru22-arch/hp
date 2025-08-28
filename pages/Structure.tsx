
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Outlet, Kitchen, Floor, Table, User, UserRole } from '../types';
import Button from '../components/Button';
import { PlusIcon, PencilIcon, TrashIcon, IdentificationIcon, ChevronRightIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';
import TableComponent, { Column } from '../components/Table';


// --- Modals for Add/Edit (re-used from previous version) ---

const AddEditKitchenModal: React.FC<{ 
    outletId: string;
    kitchen: Partial<Kitchen> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ outletId, kitchen, onClose, onSave }) => {
    const [name, setName] = useState(kitchen?.name || '');
    const isEditing = !!kitchen?.id;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            if (isEditing) {
                await api.updateKitchen({ ...kitchen, name } as Kitchen);
            } else {
                await api.addKitchenToOutlet(name, outletId);
            }
            onSave();
            onClose();
        }
    };
    return (
        <Modal isOpen={true} onClose={onClose} title={isEditing ? "Edit Kitchen" : "Add New Kitchen"}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <label htmlFor="kitchenName" className="block text-sm font-medium text-slate-700">Kitchen Name</label>
                    <input type="text" id="kitchenName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{isEditing ? "Save Changes" : "Add Kitchen"}</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddEditFloorModal: React.FC<{ 
    outletId: string; 
    floor: Partial<Floor> | null;
    onClose: () => void; 
    onSave: () => void; 
}> = ({ outletId, floor, onClose, onSave }) => {
    const [name, setName] = useState(floor?.name || '');
    const isEditing = !!floor?.id;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            if(isEditing) {
                 await api.updateFloor({ ...floor, name } as Floor);
            } else {
                await api.addFloorToOutlet(name, outletId);
            }
            onSave();
            onClose();
        }
    };
    return (
        <Modal isOpen={true} onClose={onClose} title={isEditing ? "Edit Floor" : "Add New Floor"}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <label htmlFor="floorName" className="block text-sm font-medium text-slate-700">Floor Name</label>
                    <input type="text" id="floorName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{isEditing ? "Save Changes" : "Add Floor"}</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddEditTableModal: React.FC<{ 
    floorId: string; 
    table: Partial<Table> | null;
    onClose: () => void; 
    onSave: () => void; 
}> = ({ floorId, table, onClose, onSave }) => {
    const [name, setName] = useState(table?.name || '');
    const [capacity, setCapacity] = useState(table?.capacity || 2);
    const isEditing = !!table?.id;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && capacity > 0) {
            if(isEditing) {
                await api.updateTable({ ...table, name, capacity } as Table);
            } else {
                // Hardcoding waiter for simplicity in this mock setup
                await api.addTableToFloor(name, capacity, floorId, 'user-6');
            }
            onSave();
            onClose();
        }
    };
    return (
        <Modal isOpen={true} onClose={onClose} title={isEditing ? "Edit Table" : "Add New Table"}>
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
                    <Button type="submit">{isEditing ? "Save Changes" : "Add Table"}</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddEditUserModal: React.FC<{
    userToEdit: Partial<User> | null;
    allOutlets: Outlet[];
    onClose: () => void;
    onSave: () => void;
}> = ({ userToEdit, allOutlets, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        outletIds: [],
        kras: [],
        ...userToEdit
    });
    const isEditing = !!userToEdit?.id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'kras') {
            setFormData(prev => ({ ...prev, [name]: value.split('\n') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleOutletChange = (outletId: string) => {
        setFormData(prev => {
            const newOutletIds = prev.outletIds?.includes(outletId)
                ? prev.outletIds.filter(id => id !== outletId)
                : [...(prev.outletIds || []), outletId];
            return { ...prev, outletIds: newOutletIds };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.updateUser(formData as User);
            } else {
                await api.addUser(formData as Omit<User, 'id'>);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Failed to save user", err);
            alert("Error saving user.");
        }
    };
    
    return (
         <Modal isOpen={true} onClose={onClose} title={isEditing ? "Edit User" : "Add New User"}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                        <select name="role" id="role" value={formData.role || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option value="" disabled>Select a role</option>
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Assigned Outlets</label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border border-slate-300 rounded-md max-h-32 overflow-y-auto">
                            {allOutlets.map(outlet => (
                                <label key={outlet.id} className="flex items-center space-x-2">
                                    <input type="checkbox" checked={formData.outletIds?.includes(outlet.id)} onChange={() => handleOutletChange(outlet.id)} className="rounded text-primary focus:ring-primary" />
                                    <span>{outlet.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="kras" className="block text-sm font-medium text-slate-700">Key Responsibility Areas (one per line)</label>
                        <textarea name="kras" id="kras" rows={4} value={formData.kras?.join('\n') || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{isEditing ? "Save Changes" : "Add User"}</Button>
                </div>
            </form>
        </Modal>
    );
};

// --- Child Components for Structure Page ---

const TableNode: React.FC<{ table: Table; onEdit: () => void; onDelete: () => void; }> = ({ table, onEdit, onDelete }) => (
    <div className="flex items-center justify-between group py-1.5 px-2 rounded hover:bg-slate-100">
        <div>
            <span className="font-medium text-slate-700">{table.name}</span>
            <span className="text-sm text-slate-500 ml-2">(Cap: {table.capacity})</span>
        </div>
        <div className="flex items-center space-x-1">
            <button onClick={onEdit} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors md:opacity-0 group-hover:opacity-100">
                <PencilIcon className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors md:opacity-0 group-hover:opacity-100">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const FloorNode: React.FC<{ floor: Floor; onSave: () => void }> = ({ floor, onSave }) => {
    const { data: tables, refetch: refetchTables } = useApi(api.getTablesForFloor, floor.id);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState<{ type: 'edit-floor' | 'add-table' | 'edit-table'; data: any } | null>(null);

    const handleSave = () => {
        refetchTables();
        onSave(); 
    };

    const handleDeleteFloor = async () => {
        if (window.confirm('Are you sure you want to delete this floor? This will also delete all tables on it.')) {
            await api.deleteFloor(floor.id);
            onSave();
        }
    };
    
    const handleDeleteTable = async (tableId: string) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            await api.deleteTable(tableId);
            refetchTables();
        }
    };

    return (
        <div className="ml-4 pl-4 border-l border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between group py-1">
                <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <ChevronRightIcon className={`w-5 h-5 text-slate-500 mr-1 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    <span className="font-semibold text-slate-800">{floor.name}</span>
                </div>
                <div className="w-full sm:w-auto flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                    <div className="flex-grow sm:flex-grow-0 flex items-center space-x-1">
                        <button onClick={() => setModal({ type: 'edit-floor', data: floor })} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors md:opacity-0 group-hover:opacity-100">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={handleDeleteFloor} className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors md:opacity-0 group-hover:opacity-100">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto" onClick={() => setModal({ type: 'add-table', data: null })} leftIcon={<PlusIcon className="w-3 h-3" />}>
                        Add Table
                    </Button>
                </div>
            </div>
            {isOpen && (
                <div className="ml-2 pl-4 border-l border-slate-200 py-1">
                    {tables?.map(table => <TableNode key={table.id} table={table} onEdit={() => setModal({ type: 'edit-table', data: table })} onDelete={() => handleDeleteTable(table.id)} />)}
                    {tables?.length === 0 && <p className="text-sm text-slate-500 py-1 px-2">No tables on this floor.</p>}
                </div>
            )}
            
            {modal?.type === 'edit-floor' && <AddEditFloorModal outletId={floor.outletId} floor={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
            {(modal?.type === 'add-table' || modal?.type === 'edit-table') && <AddEditTableModal floorId={floor.id} table={modal.data} onClose={() => setModal(null)} onSave={refetchTables} />}
        </div>
    );
};

const OutletNode: React.FC<{ outlet: Outlet }> = ({ outlet }) => {
    const { data: kitchens, refetch: refetchKitchens } = useApi(api.getKitchens, outlet.id);
    const { data: floors, refetch: refetchFloors } = useApi(api.getFloors, outlet.id);
    const [openSections, setOpenSections] = useState({ kitchens: false, floors: true });
    const [modal, setModal] = useState<{ type: 'kitchen-add' | 'kitchen-edit' | 'floor-add' | 'floor-edit'; data: any } | null>(null);

    const handleSave = () => {
        refetchKitchens();
        refetchFloors();
    };

    const handleDeleteKitchen = async (kitchenId: string) => {
        if (window.confirm('Are you sure you want to delete this kitchen?')) {
            await api.deleteKitchen(kitchenId);
            refetchKitchens();
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-2">{outlet.name}</h3>
            
            {/* Kitchens */}
            <div className="py-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between group">
                    <div className="flex items-center cursor-pointer mb-2 sm:mb-0" onClick={() => setOpenSections(p => ({...p, kitchens: !p.kitchens}))}>
                        <ChevronRightIcon className={`w-5 h-5 text-slate-500 mr-1 transition-transform ${openSections.kitchens ? 'rotate-90' : ''}`} />
                        <h4 className="text-lg font-semibold text-secondary">Kitchens</h4>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto" onClick={(e) => { e.stopPropagation(); setModal({ type: 'kitchen-add', data: null }); }} leftIcon={<PlusIcon className="w-4 h-4" />}>Add Kitchen</Button>
                </div>
                {openSections.kitchens && (
                    <div className="ml-4 pl-4 border-l border-slate-200 mt-2 space-y-1">
                        {kitchens?.map(kitchen => (
                            <div key={kitchen.id} className="flex items-center justify-between group py-1 px-2 rounded hover:bg-slate-100">
                                <span className="text-slate-700">{kitchen.name}</span>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => setModal({ type: 'kitchen-edit', data: kitchen })} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors md:opacity-0 group-hover:opacity-100">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteKitchen(kitchen.id)} className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors md:opacity-0 group-hover:opacity-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                         {kitchens?.length === 0 && <p className="text-sm text-slate-500 py-1 px-2">No kitchens configured.</p>}
                    </div>
                )}
            </div>

            {/* Floors */}
            <div className="py-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between group">
                     <div className="flex items-center cursor-pointer mb-2 sm:mb-0" onClick={() => setOpenSections(p => ({...p, floors: !p.floors}))}>
                         <ChevronRightIcon className={`w-5 h-5 text-slate-500 mr-1 transition-transform ${openSections.floors ? 'rotate-90' : ''}`} />
                        <h4 className="text-lg font-semibold text-secondary">Floors & Tables</h4>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto" onClick={(e) => { e.stopPropagation(); setModal({ type: 'floor-add', data: null }); }} leftIcon={<PlusIcon className="w-4 h-4" />}>Add Floor</Button>
                </div>
                {openSections.floors && (
                    <div className="mt-2 space-y-2">
                        {floors?.map(floor => <FloorNode key={floor.id} floor={floor} onSave={refetchFloors} />)}
                        {floors?.length === 0 && <p className="ml-10 text-sm text-slate-500 py-1 px-2">No floors configured.</p>}
                    </div>
                )}
            </div>
            
            {(modal?.type === 'kitchen-add' || modal?.type === 'kitchen-edit') && <AddEditKitchenModal outletId={outlet.id} kitchen={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
            {(modal?.type === 'floor-add' || modal?.type === 'floor-edit') && <AddEditFloorModal outletId={outlet.id} floor={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
        </div>
    );
};

const UserManagement: React.FC = () => {
    const { outlets } = useAuth(); // All outlets available to the admin
    const { data: users, loading, error, refetch } = useApi(api.getAllUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    
    const handleOpenModal = (user?: User) => {
        setEditingUser(user || { name: '', email: '', role: UserRole.Waiter, outletIds: [], kras: [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        refetch();
    };
    
    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await api.deleteUser(userId);
            refetch();
        }
    };

    const columns: Column<User>[] = [
        { header: 'Name', accessor: (item) => (
            <div>
                <p className="font-medium text-secondary">{item.name}</p>
                <p className="text-xs text-slate-500">{item.email}</p>
            </div>
        )},
        { header: 'Role', accessor: 'role' },
        { header: 'Assigned Outlets', accessor: (item) => (
             item.outletIds.map(id => outlets.find(o => o.id === id)?.name || id).join(', ')
        )},
        { header: 'KRAs', accessor: (item) => (
            <ul className="list-disc list-inside text-xs">
                {item.kras?.map((kra, i) => <li key={i}>{kra}</li>)}
            </ul>
        )},
    ];

    return (
        <div className="mt-8 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-xl font-bold text-secondary flex items-center">
                    <IdentificationIcon className="w-6 h-6 mr-2 text-primary" />
                    User & KRA Management
                </h3>
                <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />}>
                    Add User
                </Button>
            </div>
            {loading && <p>Loading users...</p>}
            {error && <p className="text-danger">Failed to load users.</p>}
            {users && (
                <TableComponent
                    data={users} 
                    columns={columns} 
                    renderActions={(user) => (
                        <div className="space-x-2">
                            <Button size="sm" variant="secondary" onClick={() => handleOpenModal(user)}><PencilIcon className="w-4 h-4" /></Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}><TrashIcon className="w-4 h-4" /></Button>
                        </div>
                    )}
                />
            )}
            {isModalOpen && <AddEditUserModal userToEdit={editingUser} allOutlets={outlets} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};


// --- Main Component ---

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
    const restaurantOutlets = outlets.filter(o => o.id !== 'hq-1');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Entity Structure Management</h2>
            <div className="space-y-6">
                {restaurantOutlets.map(outlet => <OutletNode key={outlet.id} outlet={outlet} />)}
            </div>
            <UserManagement />
        </div>
    );
};

export default Structure;