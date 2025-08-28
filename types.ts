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
  Admin = 'Admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  outletIds: string[];
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
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}
