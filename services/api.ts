import { Order, OrderStatus, InventoryItem, Recipe, ThreeWayMatchItem, MatchStatus, DashboardMetric, User, UserRole, Outlet } from '../types';

// --- MOCK DATABASE ---

const mockUsers: User[] = [
  { id: 'user-1', name: 'Ana Johnson', email: 'owner@halfplate.com', role: UserRole.RestaurantOwner, outletIds: ['outlet-1', 'outlet-2', 'outlet-3'] },
  { id: 'user-2', name: 'System Admin', email: 'admin@halfplate.com', role: UserRole.Admin, outletIds: ['outlet-1', 'outlet-2', 'outlet-3', 'outlet-4', 'hq-1'] },
  { id: 'user-3', name: 'Marco Pierre', email: 'chef@halfplate.com', role: UserRole.Chef, outletIds: ['outlet-1'] },
];

const mockOutlets: Outlet[] = [
    { id: 'hq-1', name: 'Halfplate Group HQ', location: 'Corporate Office', manager: 'CEO', parentId: null },
    { id: 'outlet-1', name: 'Downtown Bistro', location: '123 Main St, Cityville', manager: 'John Doe', parentId: 'hq-1' },
    { id: 'outlet-2', name: 'Uptown Cafe', location: '456 Oak Ave, Cityville', manager: 'Jane Smith', parentId: 'hq-1' },
    { id: 'outlet-3', name: 'Seaside Grill', location: '789 Beach Blvd, Beachtown', manager: 'Mike Ross', parentId: 'hq-1' },
    { id: 'outlet-4', name: 'Test Kitchen', location: 'Innovation Park', manager: 'Dr. Rene', parentId: 'outlet-1' },
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
  // Outlet 2
  { id: 'INV-103', outletId: 'outlet-2', name: 'Milk', sku: 'DAI-MIL', category: 'Dairy', stock: 5, par: 20, unit: 'L' },
  { id: 'INV-104', outletId: 'outlet-2', name: 'All-Purpose Flour', sku: 'DRY-FLR', category: 'Dry Goods', stock: 80, par: 50, unit: 'kg' },
  // Outlet 3
  { id: 'INV-105', outletId: 'outlet-3', name: 'Olive Oil', sku: 'OIL-OLI', category: 'Oils', stock: 10, par: 12, unit: 'L' },
];

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
        { title: 'Food Cost %', value: '28.5%', change: '0.5%', changeType: 'increase', description: 'vs last month' },
        { title: 'Vendor OTIF', value: '96%', change: '1.2%', changeType: 'decrease', description: 'On-Time In-Full' },
        { title: 'Open Invoices', value: '$450.75', change: '$100', changeType: 'decrease', description: 'Pending payment' },
        { title: 'Price Volatility', value: '3.2%', change: '0.2%', changeType: 'increase', description: 'This week' },
    ],
    'outlet-2': [
        { title: 'Food Cost %', value: '31.2%', change: '1.1%', changeType: 'increase', description: 'vs last month' },
        { title: 'Vendor OTIF', value: '92%', change: '0.8%', changeType: 'increase', description: 'On-Time In-Full' },
        { title: 'Open Invoices', value: '$920.50', change: '$300', changeType: 'increase', description: 'Pending payment' },
        { title: 'Price Volatility', value: '2.5%', change: '0.5%', changeType: 'decrease', description: 'This week' },
    ],
    'outlet-3': [
        { title: 'Food Cost %', value: '29.8%', change: '0.3%', changeType: 'decrease', description: 'vs last month' },
        { title: 'Vendor OTIF', value: '98%', change: '0.5%', changeType: 'increase', description: 'On-Time In-Full' },
        { title: 'Open Invoices', value: '$410.20', change: '$50', changeType: 'decrease', description: 'Pending payment' },
        { title: 'Price Volatility', value: '4.1%', change: '0.8%', changeType: 'increase', description: 'This week' },
    ],
};

// --- API SIMULATION ---

const simulateApiCall = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation issues
        }, 300 + Math.random() * 400);
    });
};

export const api = {
    login: (email: string) => {
        const user = mockUsers.find(u => u.email === email);
        if (user) return simulateApiCall(user);
        return Promise.reject(new Error("User not found"));
    },
    getOutlets: () => simulateApiCall(mockOutlets),
    getOrders: (outletId: string) => simulateApiCall(mockOrders.filter(o => o.outletId === outletId)),
    getInventory: (outletId: string) => simulateApiCall(mockInventory.filter(i => i.outletId === outletId)),
    getInventoryForOutletIds: (outletIds: string[]) => simulateApiCall(mockInventory.filter(i => outletIds.includes(i.outletId))),
    getRecipes: () => simulateApiCall(mockRecipes),
    getFinanceData: (outletId: string) => simulateApiCall(mockFinanceData.filter(f => f.outletId === outletId)),
    getDashboardMetrics: (outletId: string) => simulateApiCall(mockDashboardMetrics[outletId] || []),
};