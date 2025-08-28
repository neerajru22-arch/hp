
export enum OrderStatus {
  PendingApproval = 'Pending Approval',
  Approved = 'Approved',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum UserRole {
  RestaurantOwner = 'Restaurant Owner',
  Chef = 'Chef',
  Procurement = 'Procurement Manager',
  Vendor = 'Vendor',
  Admin = 'Admin',
  StoreManager = 'Store Manager',
  Waiter = 'Waiter'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  outletIds: string[];
  kras?: string[];
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  manager: string;
  parentId?: string | null;
}

export interface Order {
  id: string;
  outletId: string;
  vendor: string;
  date: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}

export interface InventoryItem {
  id: string;
  outletId: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  par: number;
  unit: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: Ingredient[];
  costPerPortion: number;
  targetMargin: number;
}

export enum MatchStatus {
  Matched = 'Matched',
  Mismatched = 'Mismatched',
  Pending = 'Pending'
}

export interface ThreeWayMatchItem {
  id: string;
  outletId: string;
  poId: string;
  grnId: string;
  invoiceId: string;
  vendor: string;
  amount: number;
  date: string;
  status: MatchStatus;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  description?: string;
}

export enum Department {
    Kitchen = 'Kitchen',
    Bar = 'Bar',
    Housekeeping = 'Housekeeping'
}

export enum RequisitionStatus {
    Pending = 'Pending',
    Fulfilled = 'Fulfilled',
    Cancelled = 'Cancelled'
}

export interface RequisitionItem {
    name: string;
    quantity: number;
    unit: string;
}

export interface Requisition {
    id: string;
    outletId: string;
    department: Department;
    requestedBy: string;
    date: string;
    items: RequisitionItem[];
    status: RequisitionStatus;
}

export enum StaffRole {
    Waiter = 'Waiter',
    Chef = 'Chef',
    Accountant = 'Accountant',
    Cleaner = 'Cleaner',
    Manager = 'Manager'
}

export interface StaffMember {
    id: string;
    outletId: string;
    name: string;
    role: StaffRole;
    salary: number;
    attendance: number; // Percentage
}

export enum VendorStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export enum VendorPerformance {
    Excellent = 'Excellent',
    Good = 'Good',
    Average = 'Average',
    Poor = 'Poor'
}

export interface Vendor {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    status: VendorStatus;
    performanceRating: VendorPerformance;
}

export enum TableStatus {
    Available = 'Available',
    Seated = 'Seated',
    Ordered = 'Ordered',
    NeedsAttention = 'Needs Attention',
    FoodReady = 'Food Ready'
}

export interface Kitchen {
    id: string;
    name: string;
    outletId: string;
}

export interface Floor {
    id: string;
    name: string;
    outletId: string;
}

export interface Table {
    id: string;
    name: string;
    capacity: number;
    status: TableStatus;
    orderId?: string;
    assignedWaiterId: string;
    seatedAt: number | null; // Timestamp when customers were seated
    floorId: string;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    recipeId: string;
}

export type CustomerOrderItemStatus = 'Ordered' | 'Cancelled';

export interface CustomerOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    status: CustomerOrderItemStatus;
}

export interface CustomerOrder {
    id: string;
    tableId: string;
    waiterId: string;
    items: CustomerOrderItem[];
    total: number;
    status: 'Open' | 'Closed';
    covers: number;
}

export enum KotStatus {
    New = 'New',
    Preparing = 'Preparing',
    Ready = 'Ready for Pickup',
    Cancelled = 'Cancelled'
}

export interface KOTItem {
    name: string;
    quantity: number;
    status: KotStatus;
}

export enum OrderType {
    DineIn = 'Dine-In',
    Takeaway = 'Takeaway',
}

export interface KOT {
    id: string;
    tableId?: string;
    tableName?: string;
    orderIdentifier: string; // e.g., Table Name or "Takeaway #123"
    items: KOTItem[];
    createdAt: number; // Timestamp
    outletId: string;
    orderType: OrderType;
}

export enum MenuEngineeringCategory {
  Star = 'Star', // High Profit, High Popularity
  Plowhorse = 'Plowhorse', // Low Profit, High Popularity
  Puzzle = 'Puzzle', // High Profit, Low Popularity
  Dog = 'Dog', // Low Profit, Low Popularity
}

export interface MenuEngineeringItem {
  id: string;
  name: string;
  classification: MenuEngineeringCategory;
  unitsSold: number;
  profitPerItem: number;
  totalProfit: number;
}