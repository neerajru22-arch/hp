import { Order, OrderStatus, InventoryItem, Recipe, ThreeWayMatchItem, MatchStatus, DashboardMetric, User, UserRole, Outlet, Requisition, RequisitionStatus, Department, StaffMember, StaffRole, Vendor, VendorStatus, VendorPerformance, Table, TableStatus, CustomerOrder, CustomerOrderItem, MenuItem, KOT, KotStatus, KOTItem, Kitchen, Floor, OrderType, RequisitionItem } from '../types';

// --- MOCK DATABASE ---

let mockUsers: User[] = [
  { id: 'user-1', name: 'Priya Singh', email: 'owner@halfplate.com', role: UserRole.RestaurantOwner, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Overall P&L', 'Expansion Strategy'] },
  { id: 'user-2', name: 'System Admin', email: 'admin@halfplate.com', role: UserRole.Admin, outletIds: ['outlet-1', 'outlet-2', 'outlet-3', 'outlet-4', 'hq-1'], kras: ['System Uptime', 'User Management'] },
  { id: 'user-3', name: 'Sanjeev Kapoor', email: 'chef@halfplate.com', role: UserRole.Chef, outletIds: ['outlet-1'], kras: ['Menu Innovation', 'Kitchen Food Cost'] },
  { id: 'user-4', name: 'Rajesh Kumar', email: 'store.manager@halfplate.com', role: UserRole.StoreManager, outletIds: ['outlet-1', 'outlet-2'], kras: ['Inventory Accuracy', 'Stock Rotation'] },
  { id: 'user-5', name: 'Meera Desai', email: 'procurement@halfplate.com', role: UserRole.Procurement, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Vendor Negotiation', 'Purchase Order Accuracy'] },
  { id: 'user-6', name: 'Arjun Sharma', email: 'waiter@halfplate.com', role: UserRole.Waiter, outletIds: ['outlet-1'], kras: ['Guest Satisfaction', 'Upselling'] },
];

let mockVendors: Vendor[] = [
    { id: 'ven-1', name: 'Sabzi Mandi Suppliers', contactPerson: 'Vikram Patel', email: 'vikram@sabzisuppliers.in', phone: '+91 98765 43210', status: VendorStatus.Active, performanceRating: VendorPerformance.Excellent },
    { id: 'ven-2', name: 'Quality Meats Delhi', contactPerson: 'Aisha Khan', email: 'aisha@qualitymeats.in', phone: '+91 98765 43211', status: VendorStatus.Active, performanceRating: VendorPerformance.Good },
    { id: 'ven-3', name: 'Amul Dairy Distributors', contactPerson: 'Rohan Mehta', email: 'rohan@amuldist.in', phone: '+91 98765 43212', status: VendorStatus.Inactive, performanceRating: VendorPerformance.Average },
    { id: 'ven-4', name: 'Modern Bakery Mumbai', contactPerson: 'Sunita Rao', email: 'sunita@modernbakery.in', phone: '+91 98765 43213', status: VendorStatus.Active, performanceRating: VendorPerformance.Good },
];

const mockOutlets: Outlet[] = [
    { id: 'hq-1', name: 'Halfplate Group HQ', location: 'Mumbai', manager: 'CEO', parentId: null },
    { id: 'outlet-1', name: 'Koramangala Kitchen', location: 'Bengaluru', manager: 'Anjali Sharma', parentId: 'hq-1' },
    { id: 'outlet-2', name: 'Bandra Cafe', location: 'Mumbai', manager: 'Rohan Verma', parentId: 'hq-1' },
    { id: 'outlet-3', name: 'Cyber Hub Grill', location: 'Gurugram', manager: 'Siddharth Singh', parentId: 'hq-1' },
    { id: 'outlet-4', name: 'Innovation Kitchen', location: 'Pune', manager: 'Dr. Kavita Iyer', parentId: 'outlet-1' },
];

let mockKitchens: Kitchen[] = [
    { id: 'kit-1', name: 'Main Kitchen', outletId: 'outlet-1'},
    { id: 'kit-2', name: 'Tandoor Section', outletId: 'outlet-1'},
    { id: 'kit-3', name: 'Bandra Main Kitchen', outletId: 'outlet-2'},
];

let mockFloors: Floor[] = [
    { id: 'floor-1', name: 'Ground Floor', outletId: 'outlet-1'},
    { id: 'floor-2', name: 'Rooftop Seating', outletId: 'outlet-1'},
    { id: 'floor-3', name: 'Main Dining Hall', outletId: 'outlet-2'},
];

let mockStaff: StaffMember[] = [
    // Outlet 1
    { id: 'staff-1', outletId: 'outlet-1', name: 'Alok Nath', role: StaffRole.Manager, salary: 1200000, attendance: 98 },
    { id: 'staff-2', outletId: 'outlet-1', name: 'Ravi Kumar', role: StaffRole.Chef, salary: 900000, attendance: 95 },
    { id: 'staff-3', outletId: 'outlet-1', name: 'Suresh Pillai', role: StaffRole.Waiter, salary: 480000, attendance: 99 },
    // Outlet 2
    { id: 'staff-4', outletId: 'outlet-2', name: 'Deepika Sharma', role: StaffRole.Manager, salary: 1300000, attendance: 97 },
    { id: 'staff-5', outletId: 'outlet-2', name: 'Isha Gupta', role: StaffRole.Chef, salary: 950000, attendance: 96 },
];

const mockOrders: Order[] = [
  // Outlet 1
  { id: 'PO-001', outletId: 'outlet-1', vendor: 'Sabzi Mandi Suppliers', date: '2023-10-26', itemCount: 12, total: 12500, status: OrderStatus.Delivered },
  { id: 'PO-002', outletId: 'outlet-1', vendor: 'Quality Meats Delhi', date: '2023-10-25', itemCount: 5, total: 35000, status: OrderStatus.Approved },
  // Outlet 2
  { id: 'PO-003', outletId: 'outlet-2', vendor: 'Amul Dairy Distributors', date: '2023-10-25', itemCount: 8, total: 8500, status: OrderStatus.PendingApproval },
  { id: 'PO-004', outletId: 'outlet-2', vendor: 'Modern Bakery Mumbai', date: '2023-10-24', itemCount: 20, total: 15000, status: OrderStatus.Delivered },
  // Outlet 3
  { id: 'PO-005', outletId: 'outlet-3', vendor: 'Sabzi Mandi Suppliers', date: '2023-10-23', itemCount: 10, total: 11200, status: OrderStatus.Cancelled },
];

const mockInventory: InventoryItem[] = [
  // Outlet 1
  { id: 'INV-101', outletId: 'outlet-1', name: 'Tomatoes', sku: 'VEG-TOM', category: 'Vegetables', stock: 18, par: 40, unit: 'kg' },
  { id: 'INV-102', outletId: 'outlet-1', name: 'Chicken Tikka Cut', sku: 'MEA-CHI', category: 'Meat', stock: 10, par: 30, unit: 'kg' },
  { id: 'INV-106', outletId: 'outlet-1', name: 'Paneer', sku: 'DAI-PAN', category: 'Dairy', stock: 8, par: 20, unit: 'kg' },

  // Outlet 2
  { id: 'INV-103', outletId: 'outlet-2', name: 'Amul Milk', sku: 'DAI-MIL', category: 'Dairy', stock: 5, par: 20, unit: 'L' },
  { id: 'INV-104', outletId: 'outlet-2', name: 'Basmati Rice', sku: 'DRY-RIC', category: 'Dry Goods', stock: 80, par: 50, unit: 'kg' },
  // Outlet 3
  { id: 'INV-105', outletId: 'outlet-3', name: 'Mustard Oil', sku: 'OIL-MUS', category: 'Oils', stock: 10, par: 12, unit: 'L' },
];

let mockRequisitions: Requisition[] = [
    { id: 'REQ-001', outletId: 'outlet-1', department: Department.Kitchen, requestedBy: 'Sanjeev Kapoor', date: '2023-10-27', items: [{name: 'Tomatoes', quantity: 10, unit: 'kg'}, {name: 'Paneer', quantity: 5, unit: 'kg'}], status: RequisitionStatus.Pending },
    { id: 'REQ-002', outletId: 'outlet-1', department: Department.Bar, requestedBy: 'Amit Sood', date: '2023-10-27', items: [{name: 'Lemons', quantity: 2, unit: 'kg'}, {name: 'Mint', quantity: 5, unit: 'bunch'}], status: RequisitionStatus.Pending },
    { id: 'REQ-003', outletId: 'outlet-2', department: Department.Kitchen, requestedBy: 'Isha Gupta', date: '2023-10-26', items: [{name: 'Basmati Rice', quantity: 20, unit: 'kg'}], status: RequisitionStatus.Fulfilled },
]

const mockRecipes: Recipe[] = [
    { id: 'REC-01', name: 'Paneer Butter Masala', category: 'Main Course', costPerPortion: 120, targetMargin: 70, ingredients: [] },
    { id: 'REC-02', name: 'Chicken Biryani', category: 'Main Course', costPerPortion: 180, targetMargin: 65, ingredients: [] },
];

const mockFinanceData: ThreeWayMatchItem[] = [
    { id: 'FIN-001', outletId: 'outlet-1', poId: 'PO-001', grnId: 'GRN-001', invoiceId: 'INV-A01', vendor: 'Sabzi Mandi Suppliers', amount: 12500, date: '2023-10-26', status: MatchStatus.Matched },
    { id: 'FIN-002', outletId: 'outlet-2', poId: 'PO-003', grnId: 'GRN-003', invoiceId: 'INV-C01', vendor: 'Amul Dairy Distributors', amount: 8200, date: '2023-10-25', status: MatchStatus.Mismatched },
    { id: 'FIN-004', outletId: 'outlet-2', poId: 'PO-004', grnId: 'GRN-004', invoiceId: 'INV-D01', vendor: 'Modern Bakery Mumbai', amount: 15000, date: '2023-10-24', status: MatchStatus.Matched },
];

const mockDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: "Today's Sales", value: '2,80,000', change: '12%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '28.5%', change: '0.5%', changeType: 'increase', description: 'vs last month' },
        { title: 'Average Bill Value', value: '3,500', change: '2.1%', changeType: 'increase', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '96%', change: '1.2%', changeType: 'decrease', description: 'On-Time In-Full' },
    ],
    'outlet-2': [
        { title: "Today's Sales", value: '1,95,000', change: '8%', changeType: 'decrease', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '31.2%', change: '1.1%', changeType: 'increase', description: 'vs last month' },
        { title: 'Average Bill Value', value: '2,800', change: '0.5%', changeType: 'decrease', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '92%', change: '0.8%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
    'outlet-3': [
        { title: "Today's Sales", value: '3,50,000', change: '15%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '29.8%', change: '0.3%', changeType: 'decrease', description: 'vs last month' },
        { title: 'Average Bill Value', value: '4,100', change: '3.0%', changeType: 'increase', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '98%', change: '0.5%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
};

const mockStoreManagerDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: 'Low Stock Items', value: '2', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '4.2', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '2', description: 'From Kitchen & Bar' },
        { title: 'Total Inventory Value', value: '1,50,000', description: 'As of today' },
    ],
    'outlet-2': [
        { title: 'Low Stock Items', value: '1', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '3.8', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '0', description: 'All requests fulfilled' },
        { title: 'Total Inventory Value', value: '2,10,000', description: 'As of today' },
    ]
};

const generateSalesData = (days: number, scale: number) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            sales: Math.floor(Math.random() * 150000 + 100000) * scale,
        });
    }
    return data;
};

const mockSalesDataByOutlet: {[key: string]: {week: any[], month: any[], year: any[]}} = {
    'outlet-1': { week: generateSalesData(7, 1.2), month: generateSalesData(30, 1.2), year: generateSalesData(365, 1.2)},
    'outlet-2': { week: generateSalesData(7, 1.0), month: generateSalesData(30, 1.0), year: generateSalesData(365, 1.0)},
    'outlet-3': { week: generateSalesData(7, 1.5), month: generateSalesData(30, 1.5), year: generateSalesData(365, 1.5)},
}

// Waiter-specific data
let mockTables: Table[] = [
    { id: 't-1', name: 'Table 1', capacity: 2, status: TableStatus.Available, assignedWaiterId: 'user-6', seatedAt: null, floorId: 'floor-1' },
    { id: 't-2', name: 'Table 2', capacity: 4, status: TableStatus.Seated, assignedWaiterId: 'user-6', orderId: 'co-1', seatedAt: Date.now() - 15 * 60000, floorId: 'floor-1' },
    { id: 't-3', name: 'Table 3', capacity: 2, status: TableStatus.Available, assignedWaiterId: 'user-6', seatedAt: null, floorId: 'floor-1' },
    { id: 't-4', name: 'Table 4', capacity: 4, status: TableStatus.NeedsAttention, assignedWaiterId: 'user-6', orderId: 'co-2', seatedAt: Date.now() - 35 * 60000, floorId: 'floor-2' },
    { id: 't-5', name: 'Table 5', capacity: 6, status: TableStatus.Available, assignedWaiterId: 'user-6', seatedAt: null, floorId: 'floor-2' },
    { id: 't-6', name: 'Table 6', capacity: 2, status: TableStatus.Seated, assignedWaiterId: 'user-6', orderId: 'co-3', seatedAt: Date.now() - 5 * 60000, floorId: 'floor-2' },
];

let mockCustomerOrders: CustomerOrder[] = [
    { id: 'co-1', tableId: 't-2', waiterId: 'user-6', status: 'Open', covers: 4, items: [], total: 0 },
    { id: 'co-2', tableId: 't-4', waiterId: 'user-6', status: 'Open', covers: 3, items: [], total: 0 },
    { id: 'co-3', tableId: 't-6', waiterId: 'user-6', status: 'Open', covers: 2, items: [], total: 0 },
];

const mockMenuItems: MenuItem[] = [
    { id: 'menu-1', name: 'Paneer Tikka', price: 350, category: 'Starters' },
    { id: 'menu-2', name: 'Butter Chicken', price: 450, category: 'Mains' },
    { id: 'menu-3', name: 'Dal Makhani', price: 300, category: 'Mains' },
    { id: 'menu-4', name: 'Masala Coke', price: 120, category: 'Drinks' },
    { id: 'menu-5', name: 'Garlic Naan', price: 80, category: 'Breads' },
    { id: 'menu-6', name: 'Gulab Jamun', price: 150, category: 'Desserts' },
];

let mockKots: KOT[] = [];
let takeawayOrderCounter = 1;

// --- API SIMULATION ---

const simulateApiCall = <T,>(data: T, delay?: number): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation issues
        }, delay ?? 300 + Math.random() * 400);
    });
};

export const api = {
    login: (email: string) => {
        const user = mockUsers.find(u => u.email === email);
        if (user) return simulateApiCall(user);
        return Promise.reject(new Error("User not found"));
    },
    getOutlets: () => simulateApiCall(mockOutlets),
    getKitchens: (outletId: string) => simulateApiCall(mockKitchens.filter(k => k.outletId === outletId)),
    getFloors: (outletId: string) => simulateApiCall(mockFloors.filter(f => f.outletId === outletId)),
    getTablesForFloor: (floorId: string) => simulateApiCall(mockTables.filter(t => t.floorId === floorId)),
    addKitchenToOutlet: (name: string, outletId: string) => {
        const newKitchen: Kitchen = { id: `kit-${Date.now()}`, name, outletId };
        mockKitchens.push(newKitchen);
        return simulateApiCall(newKitchen);
    },
    updateKitchen: (kitchen: Kitchen) => {
        const index = mockKitchens.findIndex(k => k.id === kitchen.id);
        if (index > -1) {
            mockKitchens[index] = kitchen;
            return simulateApiCall(kitchen);
        }
        return Promise.reject(new Error("Kitchen not found"));
    },
    deleteKitchen: (kitchenId: string) => {
        mockKitchens = mockKitchens.filter(k => k.id !== kitchenId);
        return simulateApiCall({ success: true });
    },
    addFloorToOutlet: (name: string, outletId: string) => {
        const newFloor: Floor = { id: `floor-${Date.now()}`, name, outletId };
        mockFloors.push(newFloor);
        return simulateApiCall(newFloor);
    },
    updateFloor: (floor: Floor) => {
        const index = mockFloors.findIndex(f => f.id === floor.id);
        if (index > -1) {
            mockFloors[index] = floor;
            return simulateApiCall(floor);
        }
        return Promise.reject(new Error("Floor not found"));
    },
    deleteFloor: (floorId: string) => {
        mockFloors = mockFloors.filter(f => f.id !== floorId);
        mockTables = mockTables.filter(t => t.floorId !== floorId); // Also delete tables on this floor
        return simulateApiCall({ success: true });
    },
    addTableToFloor: (name: string, capacity: number, floorId: string, assignedWaiterId: string) => {
        const newTable: Table = { id: `t-${Date.now()}`, name, capacity, floorId, assignedWaiterId, status: TableStatus.Available, seatedAt: null };
        mockTables.push(newTable);
        return simulateApiCall(newTable);
    },
    updateTable: (table: Table) => {
        const index = mockTables.findIndex(t => t.id === table.id);
        if (index > -1) {
            mockTables[index] = table;
            return simulateApiCall(table);
        }
        return Promise.reject(new Error("Table not found"));
    },
    deleteTable: (tableId: string) => {
        mockTables = mockTables.filter(t => t.id !== tableId);
        return simulateApiCall({ success: true });
    },
    getOrders: (outletId: string) => simulateApiCall(mockOrders.filter(o => o.outletId === outletId)),
    getInventory: (outletId: string) => simulateApiCall(mockInventory.filter(i => i.outletId === outletId)),
    getInventoryForOutletIds: (outletIds: string[]) => simulateApiCall(mockInventory.filter(i => outletIds.includes(i.outletId))),
    getRecipes: () => simulateApiCall(mockRecipes),
    getFinanceData: (outletId: string) => simulateApiCall(mockFinanceData.filter(f => f.outletId === outletId)),
    getDashboardMetrics: (outletId: string) => simulateApiCall(mockDashboardMetrics[outletId] || []),
    getSalesData: (outletId: string, period: 'week' | 'month' | 'year') => simulateApiCall(mockSalesDataByOutlet[outletId]?.[period] || []),
    getStoreManagerDashboardMetrics: (outletId: string) => simulateApiCall(mockStoreManagerDashboardMetrics[outletId] || []),
    getRequisitions: (outletId: string) => simulateApiCall(mockRequisitions.filter(r => r.outletId === outletId)),
    createRequisition: (outletId: string, department: Department, requestedBy: string, items: RequisitionItem[]) => {
        const newRequisition: Requisition = {
            id: `REQ-${Date.now()}`,
            outletId,
            department,
            requestedBy,
            items,
            date: new Date().toISOString().split('T')[0],
            status: RequisitionStatus.Pending,
        };
        mockRequisitions.unshift(newRequisition);
        return simulateApiCall(newRequisition);
    },
    getStaff: (outletId: string) => simulateApiCall(mockStaff.filter(s => s.outletId === outletId)),
    addStaff: (staffMember: Omit<StaffMember, 'id'>) => {
        const newStaff: StaffMember = { ...staffMember, id: `staff-${Date.now()}` };
        mockStaff.push(newStaff);
        return simulateApiCall(newStaff);
    },
    updateStaff: (staffMember: StaffMember) => {
        const index = mockStaff.findIndex(s => s.id === staffMember.id);
        if (index > -1) {
            mockStaff[index] = staffMember;
            return simulateApiCall(staffMember);
        }
        return Promise.reject(new Error("Staff member not found"));
    },
    getVendors: () => simulateApiCall(mockVendors),
    addVendor: (vendor: Omit<Vendor, 'id'>) => {
        const newVendor: Vendor = { ...vendor, id: `ven-${Date.now()}` };
        mockVendors.push(newVendor);
        return simulateApiCall(newVendor);
    },
    updateVendor: (vendor: Vendor) => {
        const index = mockVendors.findIndex(v => v.id === vendor.id);
        if (index > -1) {
            mockVendors[index] = vendor;
            return simulateApiCall(vendor);
        }
        return Promise.reject(new Error("Vendor not found"));
    },
    // Waiter APIs
    getTablesForWaiter: (waiterId: string) => simulateApiCall(mockTables.filter(t => t.assignedWaiterId === waiterId)),
    getCustomerOrder: (orderId: string) => simulateApiCall(mockCustomerOrders.find(o => o.id === orderId) || null),
    getWaiterDashboardMetrics: (waiterId: string) => {
        const openTables = mockTables.filter(t => t.assignedWaiterId === waiterId && (t.status === TableStatus.Seated || t.status === TableStatus.Ordered || t.status === TableStatus.FoodReady)).length;
        const openOrders = mockCustomerOrders.filter(o => o.waiterId === waiterId && o.status === 'Open');
        const totalCovers = openOrders.reduce((acc, o) => acc + o.covers, 0);
        const mySales = mockCustomerOrders
            .filter(o => o.waiterId === waiterId && o.status === 'Closed')
            .reduce((acc, o) => acc + o.total, 0);

        const metrics: DashboardMetric[] = [
            { title: 'Open Tables', value: openTables.toString(), description: 'Tables currently seated' },
            { title: 'Total Covers', value: totalCovers.toString(), description: 'Guests currently seated' },
            { title: 'Avg. Turn Time', value: '45m', description: 'Average table duration' },
            { title: 'My Sales', value: mySales.toString(), description: 'Total from your closed tables' },
        ];
        return simulateApiCall(metrics);
    },
    getMenuItems: () => simulateApiCall(mockMenuItems),
    startTableSession: (tableId: string, covers: number, waiterId: string) => {
        const table = mockTables.find(t => t.id === tableId);
        if (table && table.status === TableStatus.Available) {
            const newOrder: CustomerOrder = {
                id: `co-${Date.now()}`,
                tableId,
                waiterId,
                covers,
                items: [],
                total: 0,
                status: 'Open',
            };
            mockCustomerOrders.push(newOrder);
            table.status = TableStatus.Seated;
            table.seatedAt = Date.now();
            table.orderId = newOrder.id;
            return simulateApiCall({ table, order: newOrder });
        }
        return Promise.reject(new Error("Table is not available"));
    },
    closeOrder: (orderId: string) => {
        const order = mockCustomerOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'Closed';
            const table = mockTables.find(t => t.id === order.tableId);
            if (table) {
                table.status = TableStatus.Available;
                table.seatedAt = null;
                table.orderId = undefined;
                return simulateApiCall({ order, table });
            }
        }
        return Promise.reject(new Error("Order not found"));
    },
    acknowledgeFoodReady: (tableId: string) => {
        const table = mockTables.find(t => t.id === tableId);
        if (table && table.status === TableStatus.FoodReady) {
            table.status = TableStatus.Ordered; // Or Seated, depending on desired flow. Ordered is better.
            return simulateApiCall(table);
        }
        return Promise.reject(new Error("Table not found or not in Food Ready state"));
    },
    // KOT APIs
    sendKotToKitchen: (orderId: string, newItems: CustomerOrderItem[]) => {
        const order = mockCustomerOrders.find(o => o.id === orderId);
        const table = mockTables.find(t => t.id === order?.tableId);
        if (order && table) {
            const kotItems: KOTItem[] = newItems.map(item => ({ name: item.name, quantity: item.quantity, status: KotStatus.New }));
            
            let kot = mockKots.find(k => k.tableId === table.id);
            if(kot) {
                kot.items.push(...kotItems);
            } else {
                kot = {
                    id: `kot-${Date.now()}`,
                    tableId: table.id,
                    tableName: table.name,
                    orderIdentifier: table.name,
                    items: kotItems,
                    createdAt: Date.now(),
                    outletId: 'outlet-1',
                    orderType: OrderType.DineIn
                };
                mockKots.unshift(kot);
            }
            
            newItems.forEach(newItem => {
                order.items.push(newItem);
                order.total += newItem.price * newItem.quantity;
            });

            if (table.status === TableStatus.Seated) {
                table.status = TableStatus.Ordered;
            }

            return simulateApiCall({ kot, updatedOrder: order });
        }
        return Promise.reject(new Error("Order or Table not found"));
    },
    createTakeawayOrder: (outletId: string, items: CustomerOrderItem[]) => {
        const kotItems: KOTItem[] = items.map(item => ({ name: item.name, quantity: item.quantity, status: KotStatus.New }));
        const newKot: KOT = {
            id: `kot-${Date.now()}`,
            orderIdentifier: `Takeaway #${takeawayOrderCounter++}`,
            items: kotItems,
            createdAt: Date.now(),
            outletId: outletId,
            orderType: OrderType.Takeaway
        };
        mockKots.unshift(newKot);
        return simulateApiCall(newKot);
    },
    getKots: (outletId: string) => {
        const activeKots = mockKots.filter(kot => kot.outletId === outletId);
        return simulateApiCall(activeKots);
    },
    updateKotItemStatus: (kotId: string, itemIndex: number, status: KotStatus) => {
        const kot = mockKots.find(k => k.id === kotId);
        if (kot && kot.items[itemIndex]) {
            kot.items[itemIndex].status = status;
            
            if (kot.orderType === OrderType.DineIn && kot.tableId) {
                const anyItemReady = kot.items.some(item => item.status === KotStatus.Ready);
                if (anyItemReady) {
                    const table = mockTables.find(t => t.id === kot.tableId);
                    if (table) {
                        table.status = TableStatus.FoodReady;
                    }
                }
            }
            return simulateApiCall(kot);
        }
        return Promise.reject(new Error("KOT or KOT item not found"));
    },
    // User Management APIs
    getAllUsers: () => simulateApiCall(mockUsers),
    addUser: (user: Omit<User, 'id'>) => {
        const newUser: User = { ...user, id: `user-${Date.now()}` };
        mockUsers.push(newUser);
        return simulateApiCall(newUser);
    },
    updateUser: (user: User) => {
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index > -1) {
            mockUsers[index] = user;
            return simulateApiCall(user);
        }
        return Promise.reject(new Error("User not found"));
    },
    deleteUser: (userId: string) => {
        const initialLength = mockUsers.length;
        mockUsers = mockUsers.filter(u => u.id !== userId);
        if (mockUsers.length < initialLength) {
            return simulateApiCall({ success: true });
        }
        return Promise.reject(new Error("User not found"));
    },
};