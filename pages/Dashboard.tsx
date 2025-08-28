
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table, { Column } from '../components/Table';
import { Order, OrderStatus, UserRole, Requisition, RequisitionStatus, Table as TableType, TableStatus, CustomerOrder, MenuItem, KOT, KotStatus, CustomerOrderItem, KOTItem, OrderType, RequisitionItem, Department, DashboardMetric, CustomerOrderItemStatus, StaffMember, StaffRole } from '../types';
import { useAuth } from '../auth/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { PlusIcon, TrashIcon } from '../components/icons/Icons';

const getOrderStatusBadge = (status: OrderStatus) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
    [OrderStatus.Approved]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PendingApproval]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const getRequisitionStatusBadge = (status: RequisitionStatus) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    const statusClasses = {
      [RequisitionStatus.Fulfilled]: 'bg-green-100 text-green-800',
      [RequisitionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [RequisitionStatus.Cancelled]: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

// Centralized metric value formatter to correctly handle currency vs. other units.
const formatMetricValue = (metric: DashboardMetric): string => {
    const { title, value } = metric;
    const currencyMetrics = ["Today's Sales", "Average Bill Value", "Total Inventory Value", "My Sales"];
    const percentageMetrics = ["Food Cost %", "Vendor OTIF", "Wastage %", "Staff Attendance"];

    const numberValue = Number(String(value).replace(/,/g, ''));
    if (isNaN(numberValue)) return String(value);

    if (currencyMetrics.includes(title)) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(numberValue);
    }
    
    if (percentageMetrics.includes(title)) {
        return `${value}%`;
    }
    
    // For values like Table Turnover
    if(title === 'Table Turnover') {
        return `${value}x`;
    }

    return new Intl.NumberFormat('en-IN').format(numberValue);
};


// --- START: Managerial Dashboards ---
const SalesDashboard: React.FC = () => {
    const { selectedOutlet } = useAuth();
    const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week');
    const { data: metrics, loading: metricsLoading } = useApi(api.getDashboardMetrics, selectedOutlet?.id);
    const { data: orders, loading: ordersLoading } = useApi(api.getOrders, selectedOutlet?.id);
    const { data: salesData, loading: salesLoading } = useApi(api.getSalesData, selectedOutlet?.id, timePeriod);

    const orderColumns: Column<Order>[] = [
        { header: 'Order ID', accessor: 'id' },
        { header: 'Vendor', accessor: 'vendor' },
        { header: 'Date', accessor: 'date' },
        { header: 'Total', accessor: (item: Order) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.total) },
        { header: 'Status', accessor: (item: Order) => getOrderStatusBadge(item.status) },
    ];

    const formatToINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact', compactDisplay: 'short' }).format(value);

    return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    </div>
                ))
            ) : (
              metrics?.map(metric => <DashboardCard key={metric.title} metric={{...metric, value: formatMetricValue(metric)}} />)
            )}
          </div>
    
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-secondary">Sales Trend</h3>
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                    {(['week', 'month', 'year'] as const).map(period => (
                        <Button
                            key={period}
                            size="sm"
                            variant={timePeriod === period ? 'primary' : 'secondary'}
                            onClick={() => setTimePeriod(period)}
                            className={timePeriod === period ? '' : 'bg-transparent shadow-none text-slate-600 hover:bg-slate-200'}
                        >
                           {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>
             {salesLoading ? <div className="h-[300px] flex items-center justify-center">Loading Chart...</div> : (
               <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} tickFormatter={(value) => formatToINR(value)}/>
                  <Tooltip 
                    cursor={{stroke: '#4338ca', strokeWidth: 1, strokeDasharray: '3 3'}} 
                    contentStyle={{borderRadius: '0.5rem', borderColor: '#e2e8f0'}}
                    formatter={(value: number) => [formatToINR(value), 'Sales']}
                  />
                  <Legend wrapperStyle={{fontSize: "14px"}}/>
                  <Line type="monotone" dataKey="sales" stroke="#4338ca" strokeWidth={2} dot={{r: 4, fill: '#4338ca'}} activeDot={{ r: 6 }} name="Sales"/>
                </LineChart>
              </ResponsiveContainer>
             )}
          </div>
    
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Recent Orders for {selectedOutlet?.name}</h3>
            {ordersLoading ? (
              <div className="text-center p-8 bg-white rounded-lg border">Loading...</div>
            ) : (
              <Table data={orders?.slice(0, 5) || []} columns={orderColumns} />
            )}
          </div>
        </div>
    );
};

const ManagerDashboard: React.FC = () => {
    const { selectedOutlet } = useAuth();
    const { data: metrics, loading: metricsLoading } = useApi(api.getManagerDashboardMetrics, selectedOutlet?.id);
    const { data: staff, loading: staffLoading } = useApi(api.getStaff, selectedOutlet?.id);
    
    const staffColumns: Column<StaffMember>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Attendance', accessor: item => `${item.attendance}%` }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsLoading ? (
                     Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : (
                  metrics?.map(metric => <DashboardCard key={metric.title} metric={{...metric, value: formatMetricValue(metric)}} />)
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Staff on Duty</h3>
                {staffLoading ? (
                    <div className="text-center p-8 bg-white rounded-lg border">Loading staff...</div>
                ) : (
                    <Table data={staff || []} columns={staffColumns} />
                )}
            </div>
        </div>
    );
};

const StoreManagerDashboard: React.FC = () => {
    const { selectedOutlet } = useAuth();
    const { data: metrics, loading: metricsLoading } = useApi(api.getStoreManagerDashboardMetrics, selectedOutlet?.id);
    const { data: requisitions, loading: requisitionsLoading } = useApi(api.getRequisitions, selectedOutlet?.id);
    const { data: inventory } = useApi(api.getInventory, selectedOutlet?.id);

    const requisitionColumns: Column<Requisition>[] = [
        { header: 'Req. ID', accessor: 'id' },
        { header: 'Department', accessor: 'department' },
        { header: 'Requested By', accessor: 'requestedBy' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: (item) => getRequisitionStatusBadge(item.status) },
    ];

    const pieData = [
        { name: 'Ok', value: inventory?.filter(i => (i.stock / i.par) >= 0.5).length || 0 },
        { name: 'Low', value: inventory?.filter(i => (i.stock / i.par) < 0.5 && (i.stock / i.par) >= 0.25).length || 0 },
        { name: 'Critical', value: inventory?.filter(i => (i.stock / i.par) < 0.25).length || 0 },
    ];
    const COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsLoading ? (
                     Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : (
                  metrics?.map(metric => <DashboardCard key={metric.title} metric={{...metric, value: formatMetricValue(metric)}} />)
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Recent Internal Requisitions</h3>
                    {requisitionsLoading ? (
                      <div className="text-center p-8">Loading...</div>
                    ) : (
                      <Table data={requisitions?.slice(0, 5) || []} columns={requisitionColumns} />
                    )}
                </div>
                 <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Inventory Status</h3>
                    <div className="flex-grow flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => `${entry.name}: ${entry.value}`}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END: Managerial Dashboards ---

const useElapsedTime = (startTime: number | null) => {
    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    useEffect(() => {
        if (startTime === null) {
            setElapsedTime("00:00:00");
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
            const minutes = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
            const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            setElapsedTime(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return elapsedTime;
};

// --- START: Waiter Dashboard ---
const TableManagementModal: React.FC<{
    table: TableType;
    onClose: () => void;
    onAction: () => void;
    waiterId: string;
}> = ({ table, onClose, onAction, waiterId }) => {
    const { data: orderResult, loading: orderLoading, refetch: refetchOrder } = useApi(api.getCustomerOrder, table.orderId || '');
    const { data: menuItems, loading: menuLoading } = useApi(api.getMenuItems);
    const [covers, setCovers] = useState(1);
    const [newlyAddedItems, setNewlyAddedItems] = useState<Omit<CustomerOrderItem, 'status'>[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const isCoversInvalid = covers <= 0 || covers > table.capacity;

    const handleSeatCustomers = async () => {
        if (isCoversInvalid) {
            alert(`Please enter a valid number of guests (1-${table.capacity}).`);
            return;
        }
        await api.startTableSession(table.id, covers, waiterId);
        onAction();
        onClose();
    };
    
    const handleAddItem = (item: MenuItem) => {
        setNewlyAddedItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const handleSendToKitchen = async () => {
        if (table.orderId && newlyAddedItems.length > 0) {
            await api.sendKotToKitchen(table.orderId, newlyAddedItems);
            setNewlyAddedItems([]);
            refetchOrder(); // Refetch the main order to show updated items
            onAction(); // This will refetch tables to update status from Seated -> Ordered
        }
    };

    const handleFinalizeBill = async () => {
        if (table.orderId) {
            await api.closeOrder(table.orderId);
            onAction();
            onClose();
        }
    };

    const elapsedTime = useElapsedTime(table.seatedAt);
    const newItemsTotal = newlyAddedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    const menuCategories = ['All', ...new Set(menuItems?.map(item => item.category) || [])];
    const filteredMenuItems = menuItems?.filter(item => selectedCategory === 'All' || item.category === selectedCategory);

    return (
        <Modal isOpen={true} onClose={onClose} title={`${table.name} - Management`}>
            {table.status === TableStatus.Available ? (
                <div>
                    <div className="p-6">
                        <h3 className="font-semibold text-lg text-secondary">Seat New Customers</h3>
                        <p className="text-sm text-slate-500">Capacity: {table.capacity}</p>
                        <div className="mt-4">
                            <label htmlFor="covers" className="block text-sm font-medium text-slate-700">Number of Guests</label>
                            <input 
                                type="number" 
                                id="covers" 
                                value={covers} 
                                onChange={(e) => setCovers(parseInt(e.target.value, 10) || 1)} 
                                min="1" 
                                max={table.capacity}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                             {isCoversInvalid && covers > 0 && <p className="text-red-600 text-sm mt-1">Please enter a number between 1 and {table.capacity}.</p>}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSeatCustomers} disabled={isCoversInvalid}>Seat Customers</Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-[85vh] md:h-auto md:max-h-[80vh]">
                    <div className="flex-grow overflow-y-auto md:grid md:grid-cols-2">
                        {/* Left Side: Order Summary */}
                        <div className="p-4 md:p-6 md:border-r md:border-slate-200 border-b border-slate-200 md:border-b-0 flex flex-col">
                            <div className="flex justify-between items-baseline mb-4">
                                <h3 className="font-semibold text-lg text-secondary">Current Order</h3>
                                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{elapsedTime}</span>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                                {orderLoading ? <p>Loading order...</p> : (
                                <>
                                    <ul className="divide-y divide-slate-200">
                                        {orderResult?.items.map((item, index) => {
                                            const isCancelled = item.status === 'Cancelled';
                                            return (
                                                <li key={`${item.id}-${index}`} className={`py-3 flex justify-between items-center ${isCancelled ? 'opacity-50' : ''}`}>
                                                    <div>
                                                        <p className={`font-medium text-slate-800 text-base ${isCancelled ? 'line-through' : ''}`}>{item.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            Qty: {item.quantity} {isCancelled && <span className="font-semibold text-red-600">(Cancelled)</span>}
                                                        </p>
                                                    </div>
                                                    <p className={`font-semibold text-secondary text-base ${isCancelled ? 'line-through' : ''}`}>{formatCurrency(item.price * item.quantity)}</p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-semibold text-secondary text-base">New Items to Send</h4>
                                        {newlyAddedItems.length > 0 ? (
                                            <ul className="divide-y divide-slate-100">
                                                {newlyAddedItems.map(item => (
                                                    <li key={item.id} className="py-2 flex justify-between text-base">
                                                        <span>{item.name} (x{item.quantity})</span>
                                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-sm text-slate-500 text-center py-2">No new items added.</p>}
                                    </div>
                                </>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-dashed flex justify-between font-bold text-xl text-primary">
                                <span>Total</span>
                                <span>{formatCurrency(orderResult?.total || 0)}</span>
                            </div>
                        </div>
                        {/* Right Side: Menu */}
                        <div className="p-4 md:p-6 flex flex-col">
                            <h3 className="font-semibold text-lg text-secondary mb-4">Add to Order</h3>
                            <div className="mb-4">
                                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                                    {menuCategories.map(category => (
                                        <Button
                                            key={category}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category)}
                                            variant={selectedCategory === category ? 'primary' : 'secondary'}
                                            className={`flex-shrink-0 ${selectedCategory !== category && 'bg-white'}`}
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {menuLoading ? <p>Loading menu...</p> : (
                            <div className="flex-grow overflow-y-auto -mr-4 pr-4">
                                <ul className="divide-y divide-slate-200">
                                    {filteredMenuItems?.map(item => (
                                        <li key={item.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-slate-800 text-base">{item.name}</p>
                                                <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                                            </div>
                                            <Button size="md" onClick={() => handleAddItem(item)}>Add</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        </div>
                    </div>
                     <div className="flex-shrink-0 p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center sticky bottom-0">
                        <Button variant="danger" size="md" onClick={handleFinalizeBill} className="py-3">Finalize Bill</Button>
                        <Button 
                            variant="primary" 
                            size="md"
                            onClick={handleSendToKitchen} 
                            disabled={newlyAddedItems.length === 0}
                            className="relative py-3"
                        >
                            Send to Kitchen
                            {newlyAddedItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-white text-xs font-bold">
                                    {newlyAddedItems.length}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

const TakeawayModal: React.FC<{
    onClose: () => void;
    outletId: string;
}> = ({ onClose, outletId }) => {
    const { data: menuItems, loading: menuLoading } = useApi(api.getMenuItems);
    const [newlyAddedItems, setNewlyAddedItems] = useState<Omit<CustomerOrderItem, 'status'>[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const handleAddItem = (item: MenuItem) => {
        setNewlyAddedItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const handleSendToKitchen = async () => {
        if (newlyAddedItems.length > 0) {
            await api.createTakeawayOrder(outletId, newlyAddedItems);
            onClose();
        }
    };
    
    const newItemsTotal = newlyAddedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    const menuCategories = ['All', ...new Set(menuItems?.map(item => item.category) || [])];
    const filteredMenuItems = menuItems?.filter(item => selectedCategory === 'All' || item.category === selectedCategory);

    return (
        <Modal isOpen={true} onClose={onClose} title="New Takeaway Order">
            <div className="flex flex-col h-[85vh] md:h-auto md:max-h-[80vh]">
                <div className="flex-grow overflow-y-auto md:grid md:grid-cols-2">
                    <div className="p-4 md:p-6 md:border-r md:border-slate-200 border-b border-slate-200 md:border-b-0 flex flex-col">
                        <h3 className="font-semibold text-lg text-secondary mb-4">Order Items</h3>
                        <div className="flex-grow overflow-y-auto">
                            {newlyAddedItems.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {newlyAddedItems.map(item => (
                                        <li key={item.id} className="py-2 flex justify-between text-base">
                                            <span>{item.name} (x{item.quantity})</span>
                                            <span>{formatCurrency(item.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-slate-500 text-center py-4">No items added.</p>}
                        </div>
                        <div className="mt-4 pt-4 border-t-2 border-dashed flex justify-between font-bold text-xl text-primary">
                            <span>Total</span>
                            <span>{formatCurrency(newItemsTotal)}</span>
                        </div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col">
                         <h3 className="font-semibold text-lg text-secondary mb-4">Menu</h3>
                        <div className="mb-4">
                            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                                {menuCategories.map(category => (
                                    <Button
                                        key={category}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        variant={selectedCategory === category ? 'primary' : 'secondary'}
                                        className={`flex-shrink-0 ${selectedCategory !== category && 'bg-white'}`}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        {menuLoading ? <p>Loading menu...</p> : (
                        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
                            <ul className="divide-y divide-slate-200">
                                {filteredMenuItems?.map(item => (
                                    <li key={item.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-800 text-base">{item.name}</p>
                                            <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                                        </div>
                                        <Button size="md" onClick={() => handleAddItem(item)}>Add</Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 p-4 bg-slate-100 border-t border-slate-200 flex justify-end items-center sticky bottom-0">
                    <div className="space-x-2">
                        <Button variant="secondary" size="md" onClick={onClose} className="py-3">Cancel</Button>
                        <Button 
                            variant="primary" 
                            size="md"
                            onClick={handleSendToKitchen} 
                            disabled={newlyAddedItems.length === 0}
                            className="py-3"
                        >
                            Send to Kitchen
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};


const TableCard: React.FC<{table: TableType, onClick: () => void}> = ({ table, onClick }) => {
    const elapsedTime = useElapsedTime(table.seatedAt);

    const statusStyles = {
        [TableStatus.Available]: {
            container: 'bg-green-100 border-green-300',
            primaryText: 'text-green-800',
            secondaryText: 'text-green-700',
            badge: 'bg-green-200 text-green-800',
            timer: 'bg-green-200 text-green-800',
        },
        [TableStatus.Seated]: {
            container: 'bg-blue-100 border-blue-300',
            primaryText: 'text-blue-800',
            secondaryText: 'text-blue-700',
            badge: 'bg-blue-200 text-blue-800',
            timer: 'bg-blue-200 text-blue-800',
        },
        [TableStatus.Ordered]: {
            container: 'bg-violet-100 border-violet-300',
            primaryText: 'text-violet-800',
            secondaryText: 'text-violet-800',
            badge: 'bg-violet-100 text-violet-800',
            timer: 'bg-violet-100 text-violet-800',
        },
        [TableStatus.NeedsAttention]: {
            container: 'bg-yellow-100 border-yellow-400',
            primaryText: 'text-yellow-800',
            secondaryText: 'text-yellow-700',
            badge: 'bg-yellow-200 text-yellow-800',
            timer: 'bg-yellow-200 text-yellow-800',
        },
        [TableStatus.FoodReady]: {
            container: 'bg-teal-500 border-teal-700',
            primaryText: 'text-white',
            secondaryText: 'text-teal-100',
            badge: 'bg-teal-600 text-white',
            timer: 'bg-teal-600 text-white',
        }
    };
    
    const styles = statusStyles[table.status];

    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-lg border-2 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between ${styles.container}`}
        >
            <div className="flex justify-between items-center">
                <h3 className={`font-bold text-lg ${styles.primaryText}`}>{table.name}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>{table.status}</span>
            </div>
            <div>
              <p className={`text-sm mt-2 ${styles.secondaryText}`}>Capacity: {table.capacity}</p>
              {table.status !== TableStatus.Available && table.seatedAt && (
                <p className={`text-sm mt-1 font-mono rounded px-1.5 py-0.5 inline-block ${styles.timer}`}>
                    {elapsedTime}
                </p>
              )}
            </div>
        </div>
    );
};

const WaiterDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data: metrics, loading: metricsLoading, refetch: refetchMetrics } = useApi(api.getWaiterDashboardMetrics, user!.id);
    const { data: tables, loading: tablesLoading, refetch: refetchTables } = useApi(api.getTablesForWaiter, user!.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
    const [isTakeawayModalOpen, setIsTakeawayModalOpen] = useState(false);

    const handleTableClick = async (table: TableType) => {
        if (table.status === TableStatus.FoodReady) {
            await api.acknowledgeFoodReady(table.id);
            refetchTables();
        }
        setSelectedTable(table);
        setIsModalOpen(true);
    }
    
    const handleAction = () => {
        refetchTables();
        refetchMetrics();
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsLoading ? (
                     Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : (
                  metrics?.map(metric => <DashboardCard key={metric.title} metric={{...metric, value: formatMetricValue(metric)}} />)
                )}
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-secondary">My Assigned Tables</h3>
                    <Button onClick={() => setIsTakeawayModalOpen(true)} leftIcon={<PlusIcon className="w-5 h-5"/>}>
                        New Takeaway Order
                    </Button>
                </div>
                {tablesLoading ? <p>Loading tables...</p> : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {tables?.map(table => <TableCard key={table.id} table={table} onClick={() => handleTableClick(table)}/>)}
                    </div>
                )}
            </div>

            {isModalOpen && selectedTable && <TableManagementModal table={selectedTable} onClose={() => setIsModalOpen(false)} onAction={handleAction} waiterId={user!.id} />}
            {isTakeawayModalOpen && <TakeawayModal onClose={() => setIsTakeawayModalOpen(false)} outletId={user!.outletIds[0]} />}
        </div>
    );
};
// --- END: Waiter Dashboard ---

// --- START: Chef Dashboard ---
const RequisitionModal: React.FC<{
    onClose: () => void;
    onSubmit: () => void;
}> = ({ onClose, onSubmit }) => {
    const { user, selectedOutlet } = useAuth();
    const [items, setItems] = useState<RequisitionItem[]>([{ name: '', quantity: 1, unit: 'kg' }]);
    
    const handleItemChange = (index: number, field: keyof RequisitionItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, unit: 'kg' }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validItems = items.filter(item => item.name.trim() !== '' && item.quantity > 0);
        if (validItems.length === 0 || !selectedOutlet || !user) {
            alert("Please add at least one valid item.");
            return;
        }
        await api.createRequisition(selectedOutlet.id, Department.Kitchen, user.name, validItems);
        onSubmit();
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Raise New Indent">
            <form onSubmit={handleSubmit}>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                className="md:col-span-2 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                required
                            />
                             <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                required
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Unit (kg, L, etc)"
                                    value={item.unit}
                                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={addItem} leftIcon={<PlusIcon className="w-4 h-4" />}>
                        Add Another Item
                    </Button>
                </div>
                 <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Indent</Button>
                </div>
            </form>
        </Modal>
    );
};


const KotCard: React.FC<{ kot: KOT; onItemStatusChange: (kotId: string, itemIndex: number, status: KotStatus) => void; onItemCancel: (kotId: string, itemIndex: number) => void; }> = ({ kot, onItemStatusChange, onItemCancel }) => {
    const timeSince = useElapsedTime(kot.createdAt);
    
    const getStatusColor = (status: KotStatus) => {
        switch(status) {
            case KotStatus.New: return 'text-slate-500';
            case KotStatus.Preparing: return 'text-yellow-600 font-semibold';
            case KotStatus.Ready: return 'text-green-600 font-bold';
            default: return '';
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h4 className="font-bold text-lg text-primary">{kot.orderIdentifier}</h4>
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{timeSince}</span>
            </div>
            <ul className="mb-4 divide-y divide-slate-100">
                {kot.items.map((item, index) => (
                    <li key={index} className="py-2 text-slate-700 flex justify-between items-center">
                        <div>
                           <p className={getStatusColor(item.status)}>
                             <span className="font-semibold">{item.quantity}x</span> {item.name}
                           </p>
                        </div>
                        <div className="flex space-x-1">
                           {item.status === KotStatus.New && (
                                <>
                                <Button size="sm" variant="secondary" onClick={() => onItemCancel(kot.id, index)}>Cancel</Button>
                                <Button size="sm" onClick={() => onItemStatusChange(kot.id, index, KotStatus.Preparing)}>Cook</Button>
                                </>
                           )}
                           {item.status === KotStatus.Preparing && (
                                <>
                                <Button size="sm" variant="secondary" onClick={() => onItemCancel(kot.id, index)}>Cancel</Button>
                                <Button size="sm" variant="primary" onClick={() => onItemStatusChange(kot.id, index, KotStatus.Ready)}>Ready</Button>
                                </>
                           )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ChefDashboard: React.FC = () => {
    const { selectedOutlet } = useAuth();
    const { data: kots, loading, error, refetch } = useApi(api.getKots, selectedOutlet?.id || '');
    const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('raise-indent') === 'true') {
            setIsRequisitionModalOpen(true);
        }
    }, [location.search]);

    const handleCloseRequisitionModal = () => {
        setIsRequisitionModalOpen(false);
        navigate('/dashboard', { replace: true });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 5000); // Poll for new orders every 5 seconds
        return () => clearInterval(interval);
    }, [refetch]);

    const handleItemStatusChange = async (kotId: string, itemIndex: number, status: KotStatus) => {
        await api.updateKotItemStatus(kotId, itemIndex, status);
        refetch();
    };

    const handleItemCancel = async (kotId: string, itemIndex: number) => {
        await api.cancelKotItem(kotId, itemIndex);
        refetch();
    };
    
    const allKots = kots || [];
    
    const readyKots = allKots.filter(k => k.items.length > 0 && k.items.every(i => i.status === KotStatus.Ready));
    
    const activeKots = allKots.filter(k => k.items.length > 0 && !readyKots.some(rk => rk.id === k.id));

    // A KOT is 'New' if ALL its items are 'New'.
    const newKots = activeKots.filter(k => k.items.every(i => i.status === KotStatus.New));
    
    // A KOT is 'Preparing' if at least one item is 'Preparing' and no items are 'New'.
    // BUG FIX: The KOT should be 'Preparing' if ANY item is preparing, OR some are ready and some are preparing. It is NOT new and NOT fully ready.
    const preparingKots = activeKots.filter(k => !newKots.some(nk => nk.id === k.id));

    const takeawayKots = activeKots.filter(k => k.orderType === OrderType.Takeaway);
    const dineInNewKots = newKots.filter(k => k.orderType === OrderType.DineIn);
    // BUG FIX: The preparing KOTs for dine-in should be filtered from the corrected `preparingKots` list.
    const dineInPreparingKots = preparingKots.filter(k => k.orderType === OrderType.DineIn);


    if (loading && !kots) return <div className="text-center p-8">Loading Kitchen Orders...</div>;
    if (error) return <div className="text-center p-8 text-danger">Failed to load kitchen orders.</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end sr-only">
                <Button onClick={() => setIsRequisitionModalOpen(true)} leftIcon={<PlusIcon className="w-5 h-5"/>}>
                    Raise Indent
                </Button>
            </div>
            <div className="flex h-full space-x-4 overflow-x-auto pb-4">
                {/* Takeaway Column */}
                <div className="bg-slate-100 p-4 rounded-lg flex flex-col w-full sm:w-80 flex-shrink-0">
                    <h3 className="text-lg font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Takeaway ({takeawayKots.length})</h3>
                    <div className="flex-grow overflow-y-auto">
                        {takeawayKots.map(kot => <KotCard key={kot.id} kot={kot} onItemStatusChange={handleItemStatusChange} onItemCancel={handleItemCancel} />)}
                        {takeawayKots.length === 0 && <p className="text-slate-500 text-center pt-10">No new takeaway orders.</p>}
                    </div>
                </div>
                {/* New Column */}
                <div className="bg-slate-100 p-4 rounded-lg flex flex-col w-full sm:w-80 flex-shrink-0">
                    <h3 className="text-lg font-bold text-secondary mb-4 border-b-2 border-red-500 pb-2">New ({dineInNewKots.length})</h3>
                    <div className="flex-grow overflow-y-auto">
                        {dineInNewKots.map(kot => <KotCard key={kot.id} kot={kot} onItemStatusChange={handleItemStatusChange} onItemCancel={handleItemCancel} />)}
                        {dineInNewKots.length === 0 && <p className="text-slate-500 text-center pt-10">No new dine-in orders.</p>}
                    </div>
                </div>
                {/* Preparing Column */}
                <div className="bg-slate-100 p-4 rounded-lg flex flex-col w-full sm:w-80 flex-shrink-0">
                    <h3 className="text-lg font-bold text-secondary mb-4 border-b-2 border-yellow-500 pb-2">Preparing ({dineInPreparingKots.length})</h3>
                    <div className="flex-grow overflow-y-auto">
                        {dineInPreparingKots.map(kot => <KotCard key={kot.id} kot={kot} onItemStatusChange={handleItemStatusChange} onItemCancel={handleItemCancel} />)}
                        {dineInPreparingKots.length === 0 && <p className="text-slate-500 text-center pt-10">No orders in preparation.</p>}
                    </div>
                </div>
                {/* Ready Column */}
                <div className="bg-slate-100 p-4 rounded-lg flex flex-col w-full sm:w-80 flex-shrink-0">
                    <h3 className="text-lg font-bold text-secondary mb-4 border-b-2 border-green-500 pb-2">Ready for Pickup ({readyKots.length})</h3>
                     <div className="flex-grow overflow-y-auto">
                        {readyKots.map(kot => <KotCard key={kot.id} kot={kot} onItemStatusChange={handleItemStatusChange} onItemCancel={handleItemCancel}/>)}
                        {readyKots.length === 0 && <p className="text-slate-500 text-center pt-10">No orders ready.</p>}
                    </div>
                </div>
            </div>
            {isRequisitionModalOpen && <RequisitionModal onClose={handleCloseRequisitionModal} onSubmit={() => {}} />}
        </div>
    );
};
// --- END: Chef Dashboard ---


const Dashboard: React.FC = () => {
  const { user, selectedOutlet } = useAuth();
  
  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>
  }
  
  if (user.role === UserRole.Waiter) {
      return <WaiterDashboard />;
  }

  if (user.role === UserRole.Chef) {
    return <ChefDashboard />;
  }
  
  if (user.role === UserRole.Manager) {
      return <ManagerDashboard />;
  }

  if (!selectedOutlet) {
      return <div className="text-center p-8">Please select an outlet to view the dashboard.</div>
  }
  
  if (user.role === UserRole.StoreManager) {
      return <StoreManagerDashboard />;
  }

  return <SalesDashboard />;
};

export default Dashboard;
