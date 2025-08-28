
import { Order, OrderStatus, InventoryItem, Recipe, ThreeWayMatchItem, MatchStatus, DashboardMetric, User, UserRole, Outlet, Requisition, RequisitionStatus, Department, StaffMember, StaffRole, Vendor, VendorStatus, VendorPerformance, Table, TableStatus, CustomerOrder, CustomerOrderItem, MenuItem, KOT, KotStatus, KOTItem, Kitchen, Floor, OrderType, RequisitionItem, Ingredient, CustomerOrderItemStatus, MenuEngineeringCategory, MenuEngineeringItem, WastageEntry, ActivityLogEntry, WastageReason, VendorItem } from '../types';

// --- MOCK DATABASE ---

let mockUsers: User[] = [
  { id: 'user-1', name: 'Priya Singh', email: 'owner@halfplate.com', role: UserRole.RestaurantOwner, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Overall P&L', 'Expansion Strategy'] },
  { id: 'user-2', name: 'System Admin', email: 'admin@halfplate.com', role: UserRole.Admin, outletIds: ['outlet-1', 'outlet-2', 'outlet-3', 'outlet-4', 'hq-1'], kras: ['System Uptime', 'User Management'] },
  { id: 'user-3', name: 'Sanjeev Kapoor', email: 'chef@halfplate.com', role: UserRole.Chef, outletIds: ['outlet-1'], kras: ['Menu Innovation', 'Kitchen Food Cost'] },
  { id: 'user-4', name: 'Rajesh Kumar', email: 'store.manager@halfplate.com', role: UserRole.StoreManager, outletIds: ['outlet-1', 'outlet-2'], kras: ['Inventory Accuracy', 'Stock Rotation'] },
  { id: 'user-5', name: 'Meera Desai', email: 'procurement@halfplate.com', role: UserRole.Procurement, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'], kras: ['Vendor Negotiation', 'Purchase Order Accuracy'] },
  { id: 'user-6', name: 'Arjun Sharma', email: 'waiter@halfplate.com', role: UserRole.Waiter, outletIds: ['outlet-1'], kras: ['Guest Satisfaction', 'Upselling'] },
  { id: 'user-7', name: 'Anjali Sharma', email: 'manager@halfplate.com', role: UserRole.Manager, outletIds: ['outlet-1'], kras: ['Shift Management', 'Guest Experience', 'Team Training'] },
];

let mockVendors: Vendor[] = [
    { 
        id: 'ven-1', name: 'Sabzi Mandi Suppliers', contactPerson: 'Vikram Patel', email: 'vikram@sabzisuppliers.in', phone: '+91 98765 43210', status: VendorStatus.Active, performanceRating: VendorPerformance.Excellent,
        vendorCode: 'SABZI-123', isLinked: true, specialty: 'Fresh Vegetables',
        items: [
            { id: 'i-1', name: 'Tomatoes', sku: 'VEG-TOM', price: 40, unit: 'kg' },
            { id: 'i-2', name: 'Onions', sku: 'VEG-ONI', price: 30, unit: 'kg' },
            { id: 'i-3', name: 'Potatoes', sku: 'VEG-POT', price: 25, unit: 'kg' },
        ]
    },
    { 
        id: 'ven-2', name: 'Quality Meats Delhi', contactPerson: 'Aisha Khan', email: 'aisha@qualitymeats.in', phone: '+91 98765 43211', status: VendorStatus.Active, performanceRating: VendorPerformance.Good,
        vendorCode: 'QMD-456', isLinked: true, specialty: 'Poultry and Meat',
        items: [
            { id: 'i-4', name: 'Chicken Breast', sku: 'MEA-CHB', price: 350, unit: 'kg' },
            { id: 'i-5', name: 'Mutton Curry Cut', sku: 'MEA-MCC', price: 700, unit: 'kg' },
        ]
    },
    { 
        id: 'ven-3', name: 'Amul Dairy Distributors', contactPerson: 'Rohan Mehta', email: 'rohan@amuldist.in', phone: '+91 98765 43212', status: VendorStatus.Inactive, performanceRating: VendorPerformance.Average,
        vendorCode: 'AMUL-789', isLinked: false, specialty: 'Dairy Products',
        items: [
            { id: 'i-6', name: 'Paneer', sku: 'DAI-PAN', price: 320, unit: 'kg' },
            { id: 'i-7', name: 'Amul Milk', sku: 'DAI-MIL', price: 60, unit: 'L' },
        ]
    },
    { 
        id: 'ven-4', name: 'Modern Bakery Mumbai', contactPerson: 'Sunita Rao', email: 'sunita@modernbakery.in', phone: '+91 98765 43213', status: VendorStatus.Active, performanceRating: VendorPerformance.Good,
        vendorCode: 'MBM-101', isLinked: false, specialty: 'Bakery Goods',
        items: []
    },
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
  { id: 'INV-107', outletId: 'outlet-1', name: 'Basmati Rice', sku: 'DRY-RIC-BGL', category: 'Dry Goods', stock: 100, par: 100, unit: 'kg' },


  // Outlet 2
  { id: 'INV-103', outletId: 'outlet-2', name: 'Amul Milk', sku: 'DAI-MIL', category: 'Dairy', stock: 5, par: 20, unit: 'L' },
  { id: 'INV-104', outletId: 'outlet-2', name: 'Basmati Rice', sku: 'DRY-RIC-MUM', category: 'Dry Goods', stock: 80, par: 50, unit: 'kg' },
  // Outlet 3
  { id: 'INV-105', outletId: 'outlet-3', name: 'Mustard Oil', sku: 'OIL-MUS', category: 'Oils', stock: 10, par: 12, unit: 'L' },
];

let mockRequisitions: Requisition[] = [
    { id: 'REQ-001', outletId: 'outlet-1', department: Department.Kitchen, requestedBy: 'Sanjeev Kapoor', date: '2023-10-27', items: [{name: 'Tomatoes', quantity: 10, unit: 'kg'}, {name: 'Paneer', quantity: 5, unit: 'kg'}], status: RequisitionStatus.Pending },
    { id: 'REQ-002', outletId: 'outlet-1', department: Department.Bar, requestedBy: 'Amit Sood', date: '2023-10-27', items: [{name: 'Lemons', quantity: 2, unit: 'kg'}, {name: 'Mint', quantity: 5, unit: 'bunch'}], status: RequisitionStatus.Pending },
    { id: 'REQ-003', outletId: 'outlet-2', department: Department.Kitchen, requestedBy: 'Isha Gupta', date: '2023-10-26', items: [{name: 'Basmati Rice', quantity: 20, unit: 'kg'}], status: RequisitionStatus.Fulfilled },
]

let mockRecipes: Recipe[] = [
    { 
        id: 'REC-01', name: 'Paneer Butter Masala', category: 'Main Course', 
        costPerPortion: 120, targetMargin: 70, 
        ingredients: [
            { name: 'Paneer', quantity: 0.2, unit: 'kg', cost: 60 },
            { name: 'Tomato Puree', quantity: 0.15, unit: 'L', cost: 20 },
            { name: 'Butter', quantity: 0.05, unit: 'kg', cost: 25 },
            { name: 'Cream', quantity: 0.05, unit: 'L', cost: 15 },
        ] 
    },
    { 
        id: 'REC-02', name: 'Chicken Biryani', category: 'Main Course', 
        costPerPortion: 180, targetMargin: 65, 
        ingredients: [
            { name: 'Chicken', quantity: 0.25, unit: 'kg', cost: 80 },
            { name: 'Basmati Rice', quantity: 0.15, unit: 'kg', cost: 30 },
            { name: 'Mixed Spices', quantity: 0.05, unit: 'kg', cost: 40 },
            { name: 'Ghee', quantity: 0.03, unit: 'kg', cost: 30 },
        ]
    },
    {
        id: 'REC-03', name: 'Paneer Tikka', category: 'Starters',
        costPerPortion: 95, targetMargin: 75,
        ingredients: [
            { name: 'Paneer', quantity: 0.18, unit: 'kg', cost: 54 },
            { name: 'Yogurt', quantity: 0.05, unit: 'kg', cost: 10 },
            { name: 'Tikka Masala', quantity: 0.02, unit: 'kg', cost: 31 },
        ]
    },
    {
        id: 'REC-04', name: 'Dal Makhani', category: 'Mains',
        costPerPortion: 80, targetMargin: 80,
        ingredients: [
            { name: 'Urad Dal', quantity: 0.1, unit: 'kg', cost: 20 },
            { name: 'Butter', quantity: 0.05, unit: 'kg', cost: 25 },
            { name: 'Cream', quantity: 0.05, unit: 'L', cost: 15 },
             { name: 'Tomato Puree', quantity: 0.1, unit: 'L', cost: 20 },
        ]
    }
];

const mockFinanceData: ThreeWayMatchItem[] = [
    { id: 'FIN-001', outletId: 'outlet-1', poId: 'PO-001', grnId: 'GRN-001', invoiceId: 'INV-A01', vendor: 'Sabzi Mandi Suppliers', amount: 12500, date: '2023-10-26', status: MatchStatus.Matched },
    { id: 'FIN-002', outletId: 'outlet-2', poId: 'PO-003', grnId: 'GRN-003', invoiceId: 'INV-C01', vendor: 'Amul Dairy Distributors', amount: 8200, date: '2023-10-25', status: MatchStatus.Mismatched },
    { id: 'FIN-004', outletId: 'outlet-2', poId: 'PO-004', grnId: 'GRN-004', invoiceId: 'INV-D01', vendor: 'Modern Bakery Mumbai', amount: 15000, date: '2023-10-24', status: MatchStatus.Matched },
];

const mockDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: "Today's Sales", value: '280000', change: '12%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '28.5', change: '0.5%', changeType: 'increase', description: 'vs last month' },
        { title: 'Wastage %', value: '2.1', change: '0.2%', changeType: 'increase', description: 'of total procurement' },
        { title: 'Vendor OTIF', value: '96', change: '1.2%', changeType: 'decrease', description: 'On-Time In-Full' },
    ],
    'outlet-2': [
        { title: "Today's Sales", value: '195000', change: '8%', changeType: 'decrease', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '31.2', change: '1.1%', changeType: 'increase', description: 'vs last month' },
        { title: 'Average Bill Value', value: '2800', change: '0.5%', changeType: 'decrease', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '92', change: '0.8%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
    'outlet-3': [
        { title: "Today's Sales", value: '350000', change: '15%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Food Cost %', value: '29.8', change: '0.3%', changeType: 'decrease', description: 'vs last month' },
        { title: 'Average Bill Value', value: '4100', change: '3.0%', changeType: 'increase', description: 'vs last week' },
        { title: 'Vendor OTIF', value: '98', change: '0.5%', changeType: 'increase', description: 'On-Time In-Full' },
    ],
};

const mockManagerDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: "Today's Sales", value: '280000', change: '12%', changeType: 'increase', description: 'vs yesterday' },
        { title: 'Table Turnover', value: '3.5', description: 'Times per table today' },
        { title: 'Average Bill Value', value: '3200', change: '1.5%', changeType: 'increase', description: 'vs last shift' },
        { title: 'Staff Attendance', value: '97', description: 'Percent on shift today' },
    ],
    'outlet-2': [
        { title: "Today's Sales", value: '195000', change: '8%', changeType: 'decrease', description: 'vs yesterday' },
        { title: 'Table Turnover', value: '2.8', description: 'Times per table today' },
        { title: 'Average Bill Value', value: '2800', change: '0.5%', changeType: 'decrease', description: 'vs last shift' },
        { title: 'Staff Attendance', value: '94', description: 'Percent on shift today' },
    ]
};

const mockStoreManagerDashboardMetrics: {[key: string]: DashboardMetric[]} = {
    'outlet-1': [
        { title: 'Low Stock Items', value: '2', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '4.2', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '2', description: 'From Kitchen & Bar' },
        { title: 'Total Inventory Value', value: '150000', description: 'As of today' },
    ],
    'outlet-2': [
        { title: 'Low Stock Items', value: '1', description: 'Items below 50% of par' },
        { title: 'Stock Turnover', value: '3.8', description: 'Rate for this month' },
        { title: 'Pending Requisitions', value: '0', description: 'All requests fulfilled' },
        { title: 'Total Inventory Value', value: '210000', description: 'As of today' },
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

const mockMenuItems: MenuItem[] = [
    { id: 'menu-1', name: 'Paneer Tikka', price: 350, category: 'Starters', recipeId: 'REC-03' },
    { id: 'menu-2', name: 'Butter Chicken', price: 450, category: 'Mains', recipeId: 'REC-02' }, // Note: No recipe for this one
    { id: 'menu-3', name: 'Dal Makhani', price: 300, category: 'Mains', recipeId: 'REC-04' },
    { id: 'menu-4', name: 'Masala Coke', price: 120, category: 'Drinks', recipeId: 'REC-_DUMMY_' }, // No recipe
    { id: 'menu-5', name: 'Garlic Naan', price: 80, category: 'Breads', recipeId: 'REC-_DUMMY_' },
    { id: 'menu-6', name: 'Gulab Jamun', price: 150, category: 'Desserts', recipeId: 'REC-_DUMMY_' },
];

let mockCustomerOrders: CustomerOrder[] = [
    { id: 'co-1', tableId: 't-2', waiterId: 'user-6', status: 'Open', covers: 4, items: [], total: 0 },
    { id: 'co-2', tableId: 't-4', waiterId: 'user-6', status: 'Open', covers: 3, items: [], total: 0 },
    { id: 'co-3', tableId: 't-6', waiterId: 'user-6', status: 'Open', covers: 2, items: [], total: 0 },
    // Closed orders for Menu Engineering
    { id: 'co-closed-1', tableId: 't-1', waiterId: 'user-6', status: 'Closed', covers: 2, items: [{id: 'menu-1', name: 'Paneer Tikka', quantity: 2, price: 350, status: 'Ordered'}], total: 700},
    { id: 'co-closed-2', tableId: 't-3', waiterId: 'user-6', status: 'Closed', covers: 4, items: [{id: 'menu-2', name: 'Butter Chicken', quantity: 3, price: 450, status: 'Ordered'}, {id: 'menu-5', name: 'Garlic Naan', quantity: 6, price: 80, status: 'Ordered'}], total: 1830},
    { id: 'co-closed-3', tableId: 't-5', waiterId: 'user-6', status: 'Closed', covers: 1, items: [{id: 'menu-3', name: 'Dal Makhani', quantity: 1, price: 300, status: 'Ordered'}], total: 300},
    { id: 'co-closed-4', tableId: 't-1', waiterId: 'user-6', status: 'Closed', covers: 3, items: [{id: 'menu-1', name: 'Paneer Tikka', quantity: 1, price: 350, status: 'Ordered'}, {id: 'menu-2', name: 'Butter Chicken', quantity: 2, price: 450, status: 'Ordered'}], total: 1250},
];


let mockKots: KOT[] = [];
let takeawayOrderCounter = 1;

let mockWastageLog: WastageEntry[] = [
    { id: 'w-1', outletId: 'outlet-1', itemName: 'Tomatoes', quantity: 5, unit: 'kg', reason: WastageReason.Spoilage, loggedBy: 'Rajesh Kumar', date: '2023-10-28' },
    { id: 'w-2', outletId: 'outlet-1', itemName: 'Paneer Tikka', quantity: 2, unit: 'portion', reason: WastageReason.CookingError, loggedBy: 'Sanjeev Kapoor', date: '2023-10-28' },
    { id: 'w-3', outletId: 'outlet-2', itemName: 'Amul Milk', quantity: 1, unit: 'L', reason: WastageReason.Expired, loggedBy: 'Store Manager', date: '2023-10-27' },
];

let mockActivityLog: ActivityLogEntry[] = [
    { id: 'act-1', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 'user-1', userName: 'Priya Singh', userRole: UserRole.RestaurantOwner, outletId: 'outlet-2', outletName: 'Bandra Cafe', action: 'User Update', details: 'Updated user: Isha Gupta' },
    { id: 'act-2', timestamp: new Date(Date.now() - 7200000).toISOString(), userId: 'user-3', userName: 'Sanjeev Kapoor', userRole: UserRole.Chef, outletId: 'outlet-1', outletName: 'Koramangala Kitchen', action: 'KOT Status', details: 'Marked "2x Paneer Tikka" as Preparing for Table 4' },
    { id: 'act-3', timestamp: new Date(Date.now() - 10800000).toISOString(), userId: 'user-6', userName: 'Arjun Sharma', userRole: UserRole.Waiter, outletId: 'outlet-1', outletName: 'Koramangala Kitchen', action: 'Bill Finalized', details: 'Closed order co-closed-1 for Table 1 (₹700)' },
];

// --- API SIMULATION ---

const simulateApiCall = <T,>(data: T, delay?: number): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation issues
        }, delay ?? 300 + Math.random() * 400);
    });
};

// --- LOGGING HELPER ---
const logActivity = (logData: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newLog: ActivityLogEntry = {
        ...logData,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    mockActivityLog.unshift(newLog);
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
    addRecipe: (recipe: Omit<Recipe, 'id'>) => {
        const newRecipe: Recipe = { ...recipe, id: `REC-${Date.now()}` };
        mockRecipes.push(newRecipe);
        return simulateApiCall(newRecipe);
    },
    updateRecipe: (recipe: Recipe) => {
        const index = mockRecipes.findIndex(r => r.id === recipe.id);
        if (index > -1) {
            mockRecipes[index] = recipe;
            return simulateApiCall(recipe);
        }
        return Promise.reject(new Error("Recipe not found"));
    },
    deleteRecipe: (recipeId: string) => {
        mockRecipes = mockRecipes.filter(r => r.id !== recipeId);
        return simulateApiCall({ success: true });
    },
    getFinanceData: (outletId: string) => simulateApiCall(mockFinanceData.filter(f => f.outletId === outletId)),
    getDashboardMetrics: (outletId: string) => simulateApiCall(mockDashboardMetrics[outletId] || []),
    getSalesData: (outletId: string, period: 'week' | 'month' | 'year') => simulateApiCall(mockSalesDataByOutlet[outletId]?.[period] || []),
    getManagerDashboardMetrics: (outletId: string) => simulateApiCall(mockManagerDashboardMetrics[outletId] || []),
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
    linkVendorByCode: (code: string) => {
        const vendor = mockVendors.find(v => v.vendorCode === code);
        if (vendor) {
            return simulateApiCall(vendor);
        }
        return Promise.reject(new Error("Invalid Vendor Code"));
    },
    getComparisonForItem: (itemName: string) => {
        const comparisons: { vendorName: string; price: number; unit: string }[] = [];
        const linkedVendors = mockVendors.filter(v => v.isLinked);
        
        for (const vendor of linkedVendors) {
            const item = vendor.items?.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
            if (item) {
                comparisons.push({ vendorName: vendor.name, price: item.price, unit: item.unit });
            }
        }
        return simulateApiCall(comparisons);
    },
    getWaitersForOutlet: (outletId: string) => {
        const waiters = mockUsers.filter(u => u.role === UserRole.Waiter && u.outletIds.includes(outletId));
        return simulateApiCall(waiters);
    },
    updateTableAssignment: (tableId: string, waiterId: string, managerUser: User, outlet: Outlet) => {
        const table = mockTables.find(t => t.id === tableId);
        const waiter = mockUsers.find(u => u.id === waiterId);
        if(table && waiter) {
            table.assignedWaiterId = waiterId;
            logActivity({
                userId: managerUser.id,
                userName: managerUser.name,
                userRole: managerUser.role,
                outletId: outlet.id,
                outletName: outlet.name,
                action: 'Table Assignment',
                details: `Assigned ${waiter.name} to ${table.name}`
            });
            return simulateApiCall(table);
        }
        return Promise.reject(new Error("Table or Waiter not found"));
    },
    clubTables: (tableIds: string[], user: User, outlet: Outlet) => {
        const clubId = `club-${Date.now()}`;
        const tablesToClub = mockTables.filter(t => tableIds.includes(t.id));
        if (tablesToClub.length !== tableIds.length || tablesToClub.some(t => t.status !== TableStatus.Available)) {
            return Promise.reject(new Error("One or more tables are not available for clubbing."));
        }
        tablesToClub.forEach(t => t.clubId = clubId);
        logActivity({
            userId: user.id, userName: user.name, userRole: user.role, outletId: outlet.id, outletName: outlet.name,
            action: 'Table Clubbing', details: `Clubbed tables: ${tablesToClub.map(t => t.name).join(', ')}`
        });
        return simulateApiCall(tablesToClub);
    },
    unclubTables: (clubId: string, user: User, outlet: Outlet) => {
        const tablesToUnclub = mockTables.filter(t => t.clubId === clubId);
        tablesToUnclub.forEach(t => {
            t.clubId = undefined;
            t.status = TableStatus.Available;
            t.orderId = undefined;
            t.seatedAt = null;
        });
        logActivity({
            userId: user.id, userName: user.name, userRole: user.role, outletId: outlet.id, outletName: outlet.name,
            action: 'Table Unclubbed', details: `Unclubbed tables: ${tablesToUnclub.map(t => t.name).join(', ')}`
        });
        return simulateApiCall(tablesToUnclub);
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
    startTableSession: (tableIds: string[], covers: number, waiterId: string) => {
        const tables = mockTables.filter(t => tableIds.includes(t.id));
        if (tables.length !== tableIds.length || tables.some(t => t.status !== TableStatus.Available)) {
             return Promise.reject(new Error("One or more tables are not available."));
        }

        const newOrder: CustomerOrder = {
            id: `co-${Date.now()}`,
            tableId: tables[0].clubId || tables[0].id,
            waiterId,
            covers,
            items: [],
            total: 0,
            status: 'Open',
        };
        mockCustomerOrders.push(newOrder);

        tables.forEach(table => {
            table.status = TableStatus.Seated;
            table.seatedAt = Date.now();
            table.orderId = newOrder.id;
        });
        
        return simulateApiCall({ tables, order: newOrder });
    },
    closeOrder: (orderId: string, user: User, outlet: Outlet) => {
        const order = mockCustomerOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'Closed';
            const tables = mockTables.filter(t => t.orderId === orderId);
            const clubId = tables.find(t => t.clubId)?.clubId;

            if (clubId) {
                // If tables were clubbed, unclub them now.
                api.unclubTables(clubId, user, outlet);
            } else if (tables.length > 0) {
                // Handle single table
                tables.forEach(table => {
                    table.status = TableStatus.Available;
                    table.seatedAt = null;
                    table.orderId = undefined;
                });
            }
            
            // BUG FIX: Remove the KOT from the chef's view when the bill is closed.
            mockKots = mockKots.filter(kot => kot.tableId !== order.tableId);

            return simulateApiCall({ order, tables });
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
    sendKotToKitchen: (orderId: string, newItems: Omit<CustomerOrderItem, 'status'>[]) => {
        const order = mockCustomerOrders.find(o => o.id === orderId);
        const tables = mockTables.filter(t => t.orderId === orderId);
        if (order && tables.length > 0) {
            const table = tables[0]; // Use the first table for identification
            const kotItems: KOTItem[] = newItems.map(item => ({ name: item.name, quantity: item.quantity, status: KotStatus.New }));
            
            let kot = mockKots.find(k => k.tableId === order.tableId);
            if(kot) {
                kot.items.push(...kotItems);
            } else {
                kot = {
                    id: `kot-${Date.now()}`,
                    tableId: order.tableId,
                    tableName: table.clubId ? `Club (${tables.map(t=>t.name).join(', ')})` : table.name,
                    orderIdentifier: table.clubId ? `Club (${tables.map(t=>t.name).join(', ')})` : table.name,
                    items: kotItems,
                    createdAt: Date.now(),
                    outletId: 'outlet-1',
                    orderType: OrderType.DineIn
                };
                mockKots.unshift(kot);
            }
            
            newItems.forEach(newItem => {
                const itemWithStatus: CustomerOrderItem = {...newItem, status: 'Ordered'};
                order.items.push(itemWithStatus);
                order.total += newItem.price * newItem.quantity;
            });

            tables.forEach(t => {
                if (t.status === TableStatus.Seated) {
                    t.status = TableStatus.Ordered;
                }
            });
            
            return simulateApiCall({ kot, updatedOrder: order });
        }
        return Promise.reject(new Error("Order or Table not found"));
    },
    createTakeawayOrder: (outletId: string, items: Omit<CustomerOrderItem, 'status'>[]) => {
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
    updateKotItemStatus: (kotId: string, itemIndex: number, newStatus: KotStatus) => {
        const kot = mockKots.find(k => k.id === kotId);
        if (kot && kot.items[itemIndex]) {
            kot.items[itemIndex].status = newStatus;
            
            if (kot.orderType === OrderType.DineIn && kot.tableId) {
                const anyItemReady = kot.items.some(item => item.status === KotStatus.Ready);
                if (anyItemReady) {
                    const tables = mockTables.filter(t => t.clubId === kot.tableId || t.id === kot.tableId);
                    tables.forEach(table => {
                        table.status = TableStatus.FoodReady;
                    });
                }
            }
            return simulateApiCall(kot);
        }
        return Promise.reject(new Error("KOT or KOT item not found"));
    },
    cancelKotItem: (kotId: string, itemIndex: number) => {
        const kot = mockKots.find(k => k.id === kotId);
        if (kot && kot.items[itemIndex]) {
            const cancelledItem = kot.items[itemIndex];
            kot.items.splice(itemIndex, 1); // Remove from KOT

            // Find corresponding customer order and update the item status
            const order = mockCustomerOrders.find(o => o.tableId === kot.tableId);
            if (order) {
                // Find the first matching item that isn't already cancelled
                const orderItem = order.items.find(item => item.name === cancelledItem.name && item.status !== 'Cancelled');
                if (orderItem) {
                    orderItem.status = 'Cancelled';
                    order.total -= orderItem.price * orderItem.quantity;
                }
            }
            // If the KOT is now empty, remove it entirely
            if(kot.items.length === 0) {
                mockKots = mockKots.filter(k => k.id !== kotId);
            }

            return simulateApiCall({ success: true });
        }
        return Promise.reject(new Error("KOT or KOT item not found"));
    },
    // User Management APIs
    getAllUsers: () => simulateApiCall(mockUsers),
    addUser: (user: Omit<User, 'id'>) => {
        const new_user: User = { ...user, id: `user-${Date.now()}` };
        mockUsers.push(new_user);
        return simulateApiCall(new_user);
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
    getMenuEngineeringReport: (outletId: string): Promise<MenuEngineeringItem[]> => {
        const relevantOrders = mockCustomerOrders.filter(o => o.status === 'Closed' && mockTables.find(t => t.id === o.tableId || t.clubId === o.tableId)?.floorId.startsWith('floor-')); // A simple way to check if it's an outlet table
        
        const salesCount: { [key: string]: { unitsSold: number; menuItem: MenuItem } } = {};
        let totalUnitsSold = 0;

        for (const order of relevantOrders) {
            for (const item of order.items) {
                if (item.status === 'Ordered') {
                     const menuItem = mockMenuItems.find(mi => mi.id === item.id);
                     if (menuItem) {
                        if (!salesCount[item.id]) {
                            salesCount[item.id] = { unitsSold: 0, menuItem };
                        }
                        salesCount[item.id].unitsSold += item.quantity;
                        totalUnitsSold += item.quantity;
                     }
                }
            }
        }

        const itemsWithProfit = Object.values(salesCount).map(({ unitsSold, menuItem }) => {
            const recipe = mockRecipes.find(r => r.id === menuItem.recipeId);
            const profitPerItem = recipe ? menuItem.price - recipe.costPerPortion : 0;
            return {
                id: menuItem.id,
                name: menuItem.name,
                unitsSold,
                profitPerItem,
                totalProfit: unitsSold * profitPerItem,
                popularity: unitsSold / totalUnitsSold
            };
        });

        if (itemsWithProfit.length === 0) return simulateApiCall([]);

        const avgPopularity = 1 / itemsWithProfit.length;
        const avgProfit = itemsWithProfit.reduce((sum, item) => sum + item.profitPerItem, 0) / itemsWithProfit.length;

        const report: MenuEngineeringItem[] = itemsWithProfit.map(item => {
            const isPopular = item.popularity > avgPopularity * 0.7; // 70% rule
            const isProfitable = item.profitPerItem > avgProfit;
            let classification: MenuEngineeringCategory;

            if (isPopular && isProfitable) classification = MenuEngineeringCategory.Star;
            else if (isPopular && !isProfitable) classification = MenuEngineeringCategory.Plowhorse;
            else if (!isPopular && isProfitable) classification = MenuEngineeringCategory.Puzzle;
            else classification = MenuEngineeringCategory.Dog;

            return {
                id: item.id,
                name: item.name,
                classification,
                unitsSold: item.unitsSold,
                profitPerItem: item.profitPerItem,
                totalProfit: item.totalProfit
            };
        });

        return simulateApiCall(report);
    },
    // New Logging APIs
    getWastageLog: (outletId: string) => simulateApiCall(mockWastageLog.filter(w => w.outletId === outletId)),
    addWastageEntry: (entry: Omit<WastageEntry, 'id' | 'date'>) => {
        const newEntry: WastageEntry = {
            ...entry,
            id: `w-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };
        mockWastageLog.unshift(newEntry);
        return simulateApiCall(newEntry);
    },
    getActivityLog: (outletIds: string[]) => simulateApiCall(mockActivityLog.filter(l => outletIds.includes(l.outletId))),
    logActivity: (logData: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
        logActivity(logData); // Use the helper to add to the mock DB
        return simulateApiCall({ success: true });
    },
};
