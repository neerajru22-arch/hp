import { Order, OrderStatus, InventoryItem, Recipe, ThreeWayMatchItem, MatchStatus, DashboardMetric, User, UserRole, Outlet, Requisition, RequisitionStatus, Department, StaffMember, StaffRole, Vendor, VendorStatus, VendorPerformance, Table, TableStatus, CustomerOrder, CustomerOrderItem, MenuItem, KOT, KotStatus, KOTItem, Kitchen, Floor, OrderType } from '../types';

// --- MOCK DATABASE ---

let mockUsers: User[] = [
  { id: 'user-1', name: 'Ana Johnson', email: 'owner@halfplate.com', role: UserRole.RestaurantOwner, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Overall P&L', 'Expansion Strategy'] },
  { id: 'user-2', name: 'System Admin', email: 'admin@halfplate.com', role: UserRole.Admin, outletIds: ['outlet-1', 'outlet-2', 'outlet-3', 'outlet-4', 'hq-1'], kras: ['System Uptime', 'User Management'] },
  { id: 'user-3', name: 'Marco Pierre', email: 'chef@halfplate.com', role: UserRole.Chef, outletIds: ['outlet-1'], kras: ['Menu Innovation', 'Kitchen Food Cost'] },
  { id: 'user-4', name: 'Sam Carter', email: 'store.manager@halfplate.com', role: UserRole.StoreManager, outletIds: ['outlet-1', 'outlet-2'], kras: ['Inventory Accuracy', 'Stock Rotation'] },
  { id: 'user-5', name: 'Penny Lane', email: 'procurement@halfplate.com', role: UserRole.Procurement, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Vendor Negotiation', 'Purchase Order Accuracy'] },
  { id: 'user-6', name: 'Chris P. Bacon', email: 'waiter@halfplate.com', role: UserRole.Waiter, outletIds: ['outlet-1'], kras: ['Guest Satisfaction', 'Upselling'] },
];

let mockVendors: Vendor[] = [
    { id: 'ven-1', name: 'Fresh Veggies Co.', contactPerson: 'Mark Green', email: 'mark@freshveg.com', phone: '555-0101', status: VendorStatus.Active, performanceRating: VendorPerformance.Excellent },
    { id: 'ven-2', name: 'Prime Meats', contactPerson: 'Susan Beeford', email: 'susan@primemeats.com', phone: '555-0102', status: VendorStatus.Active, performanceRating: VendorPerformance.Good },
    { id: 'ven-3', name: 'Dairy Best', contactPerson: 'Charles Cheese', email: 'charles@dairybest.com', phone: '555-0103', status: VendorStatus.Inactive, performanceRating: VendorPerformance.Average },
    { id: 'ven-4', name: 'Bakery World', contactPerson: 'Brenda Breadson', email: 'brenda@bakery.com', phone: '555-0104', status: VendorStatus.Active, performanceRating: VendorPerformance.Good },
];

const mockOutlets: Outlet[] = [
    { id: 'hq-1', name: 'Halfplate Group HQ', location: 'Corporate Office', manager: 'CEO', parentId: null },
    { id: 'outlet-1', name: 'Downtown Bistro', location: '123 Main St, Cityville', manager: 'John Doe', parentId: 'hq-1' },
    { id: 'outlet-2', name: 'Uptown Cafe', location: '456 Oak Ave, Cityville', manager: 'Jane Smith', parentId: 'hq-1' },
    { id: 'outlet-3', name: 'Seaside Grill', location: '789 Beach Blvd, Beachtown', manager: 'Mike Ross', parentId: 'hq-1' },
    { id: 'outlet-4', name: 'Test Kitchen', location: 'Innovation Park', manager: 'Dr. Rene', parentId: 'outlet-1' },
];

let mockKitchens: Kitchen[] = [
    { id: 'kit-1', name: 'Main Kitchen', outletId: 'outlet-1'},
    { id: 'kit-2', name: 'Pastry Kitchen', outletId: 'outlet-1'},
    { id: 'kit-3', name: 'Uptown Main', outletId: 'outlet-2'},
];

let mockFloors: Floor[] = [
    { id: 'floor-1', name: 'Ground Floor', outletId: 'outlet-1'},
    { id: 'floor-2', name: 'Patio', outletId: 'outlet-1'},
    { id: 'floor-3', name: 'Main Dining', outletId: 'outlet-2'},
];

let mockStaff: StaffMember[] = [
    // Outlet 1
    { id: 'staff-1', outletId: 'outlet-1', name: 'Alice', role: StaffRole.Manager, salary: 60000, attendance: 98 },
    { id: 'staff-2', outletId: 'outlet-1', name: 'Bob', role: StaffRole.Chef, salary: 52000, attendance: 95 },
    { id: 'staff-3', outletId: 'outlet-1', name: 'Charlie', role: StaffRole.Waiter, salary: 35000, attendance: 99 },
    // Outlet 2
    { id: 'staff-4', outletId: 'outlet-2', name: 'Diana', role: StaffRole.Manager, salary: 62000, attendance: 97 },
    { id: 'staff-5', outletId: 'outlet-2', name: 'Eve', role: StaffRole.Chef, salary: 54000, attendance: 96 },
];

const mockOrders: Order[] = [
  // Outlet 1
  { id: 'PO-001', outletId: 'outlet-1', vendor: 'Fresh Veggies Co.', date: '2023-10-26', itemCount: 12, total: 450.75, status: OrderStatus.Delivered },
  { id: 'PO-002', outletId: 'outlet-1', vendor: 'Prime Meats', date: '2023-10-25', itemCount: 5, total: 1250.00, status: OrderStatus.Approved },
  // Outlet 2
  { id: 'PO-003', outletId: 'outlet-2', vendor: 'Dairy Best', date: '2023-10-25', itemCount: 8, total: 320.50, status: OrderStatus.PendingApproval },
  { id: 'PO-004', outletId: 'outlet-2', vendor: 'Bakery World', date: '2023-10-24', itemCount: 20, total: 600.00, status: OrderStatus.Delivered },
  // Outlet 3
  { id: 'PO-005', outletId: 'outlet-3', vendor: 'Fresh Veggies Co.', date: '2023-10-23', itemCount: 10, total: 410.20, status: OrderStatus.Cancelled },
];

const mockInventory: InventoryItem[] = [
  // Outlet 1
  { id: 'INV-101', outletId: 'outlet-1', name: 'Tomatoes', sku: 'VEG-TOM', category: 'Vegetables', stock: 18, par: 40, unit: 'kg' },
  { id: 'INV-102', outletId: 'outlet-1', name: 'Chicken Breast', sku: 'MEA-CHI', category: 'Meat', stock: 10, par: 30, unit: 'kg' },
  { id: 'INV-106', outletId: 'outlet-1', name: 'Lettuce', sku: 'VEG-LET', category: 'Vegetables', stock: 30, par: 25, unit: 'heads' },

  // Outlet 2
  { id: 'INV-103', outletId: 'outlet-2', name: 'Milk', sku: 'DAI-MIL', category: 'Dairy', stock: 5, par: 20, unit: 'L' },
  { id: 'INV-104', outletId: 'outlet-2', name: 'All-Purpose Flour', sku: 'DRY-FLR', category: 'Dry Goods', stock: 80, par: 50, unit: 'kg' },
  // Outlet 3
  { id: 'INV-105', outletId: 'outlet-3', name: 'Olive Oil', sku: 'OIL-OLI', category: 'Oils', stock: 10, par: 12, unit: 'L' },
];

const mockRequisitions: Requisition[] = [
    { id: 'REQ-001', outletId: 'outlet-1', department: Department.Kitchen, requestedBy: 'Marco Pierre', date: '2023-10-27', itemCount: 3, status: RequisitionStatus.Pending },
    { id: 'REQ-002', outletId: 'outlet-1', department: Department.Bar, requestedBy: 'Leo Robitschek', date: '2023-10-27', itemCount: 2, status: RequisitionStatus.Pending },
    { id: 'REQ-003', outletId: 'outlet-2', department: Department.Kitchen, requestedBy: 'Jane Smith', date: '2023-10-26', itemCount: 5, status: RequisitionStatus.Fulfilled },
    { id: 'REQ-004', outletId: 'outlet-1', department: Department.Kitchen, requestedBy: 'Marco Pierre', date: '2023-10-25', itemCount: 4, status: RequisitionStatus.Fulfilled },
]

const mockRecipes: Recipe[] = [
    { id: 'REC-01', name: 'Classic Margherita Pizza', category: 'Main Course', costPerPortion: 2.85, targetMargin: 70, ingredients: [] },
    { id: 'REC-02', name: 'Chicken Alfredo Pasta', category: 'Main Course', costPerPortion: 4.50, targetMargin: 65, ingredients: [] },
];

const mockFinanceData: ThreeWayMatchItem[] = [
    { id: 'FIN-001', outletId: 'outlet-1', poId: 'PO-001', grnId: 'GRN-001', invoiceId: 'INV-A01', vendor: 'Fresh Veggies Co.', amount: 450.75, date: '2023-10-26', status: MatchStatus.Matched },
    { id: 'FIN-002', outletId: 'outlet-2', poId: 'PO-003', grnId: 'GRN-003', invoiceId: 'INV-C01', vendor: 'Dairy Best', amount: 310.00, date: '2023-10-25', status: MatchStatus.Mismatched },
    { id: 'FIN-004', outletId: 'outlet-2', poId: 'PO-004', grnId: 'GRN-004', invoiceId: 'INV-D01', vendor: 'Bakery World', amount: 600.00, date: '2023-10-24', status: MatchStatus.Matched },
];

const mockDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: 'Daily Revenue', value: '$3,450', change: '12%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '28.5%', change: '0.5%', changeType: 'increase', description: 'vs last month' },
        { title: 'Average Check Size', value: '$45.50', change: '2.1%', changeType: 'increase', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '96%', change: '1.2%', changeType: 'decrease', description: 'On-Time In-Full' },
    ],
    'outlet-2': [
        { title: 'Daily Revenue', value: '$2,890', change: '8%', changeType: 'decrease', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '31.2%', change: '1.1%', changeType: 'increase', description: 'vs last month' },
        { title: 'Average Check Size', value: '$38.20', change: '0.5%', changeType: 'decrease', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '92%', change: '0.8%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
    'outlet-3': [
        { title: 'Daily Revenue', value: '$4,120', change: '15%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '29.8%', change: '0.3%', changeType: 'decrease', description: 'vs last month' },
        { title: 'Average Check Size', value: '$52.80', change: '3.0%', changeType: 'increase', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '98%', change: '0.5%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
};

const mockStoreManagerDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: 'Low Stock Items', value: '2', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '4.2', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '2', description: 'From Kitchen & Bar' },
        { title: 'Total Inventory Value', value: '$1,850', description: 'As of today' },
    ],
    'outlet-2': [
        { title: 'Low Stock Items', value: '1', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '3.8', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '0', description: 'All requests fulfilled' },
        { title: 'Total Inventory Value', value: '$2,400', description: 'As of today' },
    ]
};

const generateSalesData = (days: number, scale: number) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: Math.floor(Math.random() * 2000 + 1500) * scale,
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
    { id: 'menu-1', name: 'Margherita Pizza', price: 14.00, category: 'Main' },
    { id: 'menu-2', name: 'Chicken Alfredo', price: 18.50, category: 'Main' },
    { id: 'menu-3', name: 'Caesar Salad', price: 12.00, category: 'Starter' },
    { id: 'menu-4', name: 'Coke', price: 3.00, category: 'Drink' },
    { id: 'menu-5', name: 'Iced Tea', price: 3.50, category: 'Drink' },
    { id: 'menu-6', name: 'Tiramisu', price: 8.00, category: 'Dessert' },
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
            { title: 'My Sales', value: `$${mySales.toFixed(2)}`, description: 'Total from your closed tables' },
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
        const activeKots = mockKots.filter(kot => kot.items.some(item => item.status !== KotStatus.Ready));
        return simulateApiCall(activeKots);
    },
    updateKotItemStatus: (kotId: string, itemIndex: number, status: KotStatus) => {
        const kot = mockKots.find(k => k.id === kotId);
        if (kot && kot.items[itemIndex]) {
            kot.items[itemIndex].status = status;
            
            if (status === KotStatus.Ready && kot.orderType === OrderType.DineIn && kot.tableId) {
                const table = mockTables.find(t => t.id === kot.tableId);
                if (table) {
                    table.status = TableStatus.FoodReady;
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