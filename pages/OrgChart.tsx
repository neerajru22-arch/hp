import React, { useState } from 'react';
import { Outlet, UserRole } from '../types';
import Button from '../components/Button';
import { useAuth } from '../auth/AuthContext';
import { PlusIcon } from '../components/icons/Icons';


const OutletNode: React.FC<{ 
  outlet: Outlet; 
  allOutlets: Outlet[]; 
  onEdit: (outlet: Outlet) => void;
  canEdit: boolean;
  onReparent: (childId: string, parentId: string) => void;
}> = ({ outlet, allOutlets, onEdit, canEdit, onReparent }) => {
  const children = allOutlets.filter(o => o.parentId === outlet.id);
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('outletId', outlet.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(canEdit) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(!canEdit) return;
    setIsOver(false);
    const childId = e.dataTransfer.getData('outletId');
    const parentId = outlet.id;

    if (childId && parentId && childId !== parentId) {
      // Basic check to prevent dropping a parent into its own child.
      // A full check would traverse the child's descendants.
      let current = allOutlets.find(o => o.id === parentId);
      while(current) {
        if(current.parentId === childId) {
          alert("Cannot move a parent outlet into one of its children.");
          return;
        }
        current = allOutlets.find(o => o.id === current?.parentId);
      }
      onReparent(childId, parentId);
    }
  };


  return (
    <div className="flex items-start">
      {/* Node Card */}
      <div 
        draggable={canEdit}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-shrink-0 relative transition-all duration-200 ${canEdit ? 'cursor-move' : ''}`}
      >
        <div className={`bg-white p-4 rounded-lg border-2 shadow w-64 text-center transition-colors ${isOver ? 'border-primary' : 'border-neutral-300'}`}>
            <h4 className="font-bold text-primary">{outlet.name}</h4>
            <p className="text-sm text-neutral-600">{outlet.location}</p>
            <p className="text-xs text-neutral-500 mt-1">Manager: {outlet.manager}</p>
            {canEdit && <Button size="sm" variant="secondary" className="mt-3" onClick={() => onEdit(outlet)}>Edit</Button>}
        </div>
      </div>
      
      {/* Children Container */}
      {children.length > 0 && (
        <div className="ml-12 pl-12 border-l border-neutral-300 flex flex-col space-y-8">
          {children.map(child => (
            <div key={child.id} className="relative">
                 {/* Horizontal Connector */}
                <div className="absolute top-1/2 -left-12 w-12 h-px bg-neutral-300"></div>
                <OutletNode 
                  outlet={child} 
                  allOutlets={allOutlets} 
                  onEdit={onEdit}
                  canEdit={canEdit}
                  onReparent={onReparent}
                />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditOutletModal: React.FC<{ outlet: Outlet; onClose: () => void; onSave: (outlet: Outlet) => void }> = ({ outlet, onClose, onSave }) => {
    const [formData, setFormData] = useState(outlet);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-secondary">Edit Outlet</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Outlet Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        </div>
                        <div>
                            <label htmlFor="manager" className="block text-sm font-medium text-neutral-700">Manager</label>
                            <input type="text" name="manager" id="manager" value={formData.manager} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-b-lg flex justify-end space-x-4">
                        <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const OrgChart: React.FC = () => {
  const { outlets, user, updateOutletDetails, reparentOutlet } = useAuth();
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  const canEdit = user?.role === UserRole.Admin;

  const handleSave = (updatedOutlet: Outlet) => {
    updateOutletDetails(updatedOutlet);
  };
  
  if (!outlets) {
      return <div className="text-center p-8">Loading organization chart...</div>;
  }

  const rootOutlets = outlets.filter(o => !o.parentId);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-secondary">Organization Structure</h2>
            {canEdit && (
                <Button onClick={() => alert('Adding new outlet...')} leftIcon={<PlusIcon className="w-5 h-5"/>}>
                    Add Outlet
                </Button>
            )}
        </div>
        
        <div className="p-8 bg-white rounded-lg border overflow-x-auto">
            {canEdit && <p className="text-sm text-neutral-600 mb-6 bg-primary-50 p-3 rounded-md">As an Admin, you can drag and drop outlets to change their reporting structure.</p>}
            <div className="inline-block min-w-full space-y-8">
                 {rootOutlets.map(outlet => (
                    <OutletNode 
                        key={outlet.id} 
                        outlet={outlet} 
                        allOutlets={outlets} 
                        onEdit={setEditingOutlet}
                        canEdit={canEdit}
                        onReparent={reparentOutlet}
                    />
                 ))}
                 {rootOutlets.length === 0 && <p className="text-neutral-500">No root outlets found.</p>}
            </div>
        </div>
        {editingOutlet && <EditOutletModal outlet={editingOutlet} onClose={() => setEditingOutlet(null)} onSave={handleSave} />}
    </div>
  );
};

export default OrgChart;