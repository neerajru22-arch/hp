
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import { PlusIcon, ShoppingCartIcon, MagnifyingGlassIcon, LinkIcon } from '../components/icons/Icons';
import { Vendor, VendorStatus, VendorPerformance, UserRole, VendorItem } from '../types';
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

// --- Modals ---

const VendorForm: React.FC<{
    vendor: Partial<Vendor>;
    onSave: (vendor: Partial<Vendor>) => void;
    onClose: () => void;
}> = ({ vendor, onSave, onClose }) => {
    const [formData, setFormData] = useState(vendor);
    const [vendorCode, setVendorCode] = useState('');
    const [linking, setLinking] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLinkVendor = async () => {
        if (!vendorCode) return;
        setLinking(true);
        setError('');
        try {
            const linkedVendor = await api.linkVendorByCode(vendorCode);
            setFormData({ ...linkedVendor, id: formData.id, isLinked: true }); // Keep original ID if editing
        } catch (err) {
            setError('Invalid or already linked vendor code.');
        } finally {
            setLinking(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                <div className="md:col-span-2 p-4 bg-slate-100 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">Link to an Existing Vendor</h4>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Enter Vendor's Unique Code"
                            value={vendorCode}
                            onChange={(e) => setVendorCode(e.target.value)}
                            className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            disabled={formData.isLinked}
                        />
                        <Button type="button" onClick={handleLinkVendor} disabled={linking || !vendorCode || formData.isLinked}>
                            {linking ? 'Linking...' : 'Link'}
                        </Button>
                    </div>
                    {error && <p className="text-sm text-danger mt-2">{error}</p>}
                </div>

                <hr className="md:col-span-2" />
                
                <h3 className="md:col-span-2 font-semibold text-slate-600 text-sm uppercase">Or Add Manually</h3>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Vendor Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" disabled={formData.isLinked} />
                </div>
                <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700">Contact Person</label>
                    <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" disabled={formData.isLinked} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" disabled={formData.isLinked} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" disabled={formData.isLinked} />
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

const VendorOfferingsModal: React.FC<{ vendor: Vendor, onClose: () => void }> = ({ vendor, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={`${vendor.name}'s Offerings`}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="mb-4"><span className="font-semibold">Specialty:</span> {vendor.specialty || 'Not specified'}</p>
                {vendor.items && vendor.items.length > 0 ? (
                    // FIX: Cannot find name 'TableComponent'.
                    <Table
                        data={vendor.items}
                        columns={[
                            { header: 'Item', accessor: 'name' },
                            { header: 'SKU', accessor: 'sku' },
                            { header: 'Price', accessor: (item) => `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)} / ${item.unit}` },
                        ]}
                    />
                ) : (
                    <p className="text-slate-500 text-center py-8">This vendor has not listed any items.</p>
                )}
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-between">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={() => alert(`Creating PO for ${vendor.name}`)}>Create Purchase Order</Button>
            </div>
        </Modal>
    );
};

const PriceComparisonModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<{ vendorName: string; price: number; unit: string }[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        const data = await api.getComparisonForItem(searchTerm);
        setResults(data);
        setLoading(false);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Compare Item Prices">
            <div className="p-6">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="e.g., Tomatoes, Paneer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <Button type="submit" disabled={loading} leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </form>

                <div className="mt-6 max-h-[40vh] overflow-y-auto">
                    {loading && <p className="text-center">Loading comparison...</p>}
                    {results && (
                        results.length > 0 ? (
                            // FIX: Cannot find name 'TableComponent'.
                             <Table
                                data={results.map((r, i) => ({...r, id: i}))}
                                columns={[
                                    { header: 'Vendor', accessor: 'vendorName' },
                                    { header: 'Price', accessor: (item) => `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)} / ${item.unit}` },
                                ]}
                            />
                        ) : (
                            <p className="text-slate-500 text-center py-8">No linked vendors found for this item.</p>
                        )
                    )}
                </div>
            </div>
             <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};


const Vendors: React.FC = () => {
  const { user } = useAuth();
  const { data: vendors, loading, error, refetch } = useApi(api.getVendors);
  const [modal, setModal] = useState<{ type: 'edit' | 'new' | 'offerings' | 'compare'; data: any } | null>(null);
  
  const canManage = user && [UserRole.Admin, UserRole.RestaurantOwner, UserRole.Procurement, UserRole.StoreManager].includes(user.role);

  if (!canManage) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-slate-600 mt-2">You do not have permission to manage vendors.</p>
        </div>
    );
  }

  const handleOpenModal = (type: 'edit' | 'new' | 'offerings' | 'compare', data: any = null) => {
    const defaultVendor = { status: VendorStatus.Active, performanceRating: VendorPerformance.Good };
    setModal({ type, data: type === 'new' ? defaultVendor : data });
  };

  const handleCloseModal = () => {
    setModal(null);
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
    { header: 'Vendor Name', accessor: (item) => (
        <div className="flex items-center space-x-2">
            {/* FIX: Property 'title' does not exist on type 'IntrinsicAttributes & SVGProps<SVGSVGElement>'. */}
            {item.isLinked && <span title="Dynamically Linked Vendor"><LinkIcon className="w-4 h-4 text-primary" /></span>}
            <span className="font-medium text-secondary">{item.name}</span>
        </div>
    )},
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
    <div className="flex space-x-1 justify-end">
        <Button variant="secondary" size="sm" onClick={() => handleOpenModal('offerings', item)} title="View Offerings">
            <ShoppingCartIcon className="w-4 h-4"/>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleOpenModal('edit', item)}>
            Edit
        </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-semibold text-secondary">Vendor Management</h2>
        <div className="flex space-x-2">
            <Button onClick={() => handleOpenModal('compare')} leftIcon={<MagnifyingGlassIcon className="w-5 h-5"/>} variant="secondary">
                Compare Prices
            </Button>
            <Button onClick={() => handleOpenModal('new')} leftIcon={<PlusIcon className="w-5 h-5"/>}>
                Add Vendor
            </Button>
        </div>
      </div>

      {loading && <div className="text-center p-8">Loading vendors...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load vendors.</div>}
      {vendors && <Table data={vendors} columns={columns} renderActions={renderVendorActions} />}
      
      {(modal?.type === 'new' || modal?.type === 'edit') && (
        <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={modal.type === 'edit' ? 'Edit Vendor' : 'Add New Vendor'}
        >
            <VendorForm vendor={modal.data} onSave={handleSaveVendor} onClose={handleCloseModal} />
        </Modal>
      )}

      {modal?.type === 'offerings' && <VendorOfferingsModal vendor={modal.data} onClose={handleCloseModal} />}
      {modal?.type === 'compare' && <PriceComparisonModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Vendors;