// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: Date;
  createdBy?: string; // ID of the admin who created this user
  assignedClubs?: string[]; // Array of club IDs assigned to this admin
}

// Club Types
export interface Club {
  id: string;
  name: string;
  location: string;
  contact: string;
  email: string;
  assignedAdminId: string;
  createdAt: Date;
  createdBy?: string;
  settings: ClubSettings;
}

export interface ClubSettings {
  trialFee: number;
  membershipPlans: MembershipPlan[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  description: string;
}

// Visitor/Member Types
export interface Visitor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  referralSource: string;
  visitDate: Date;
  clubId: string;
  type: 'visitor' | 'trial' | 'member';
  status: 'active' | 'inactive';
  trialEndDate?: Date;
  membershipEndDate?: Date;
  payments: Payment[];
  amount?: number;
  paymentStatus?: 'pending' | 'partial' | 'completed';
}

// Payment Types
export interface Payment {
  id: string;
  amount: number;
  type: 'trial' | 'membership' | 'other';
  status: 'pending' | 'partial' | 'completed';
  date: Date;
  visitorId: string;
  clubId: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  visitorId: string;
  clubId: string;
  date: Date;
  status: 'present' | 'absent';
}

// Inventory Types
export interface Product {
  id: string;
  name: string;
  category?: string;
  stock?: number;
  minStock?: number;
  clubId?: string;
  price?: number;
}

// Inventory Types
export interface ConsumptionLog {
  id: string;
  productId: string;
  clubId: string;
  quantity: number;
  consumedBy: string; // User ID of Club Admin
  consumptionDate: Date;
}

export interface InventoryReportItem {
  productId: string;
  productName: string;
  totalConsumedQuantity: number;
  unit: string;
  clubName: string;
  clubId: string;
}

export interface DailyConsumptionReport {
  date: Date;
  items: InventoryReportItem[];
}

export interface StockUsage {
  id: string;
  productId: string;
  quantity: number;
  date: Date;
  consumedBy: string; // User ID of Club Admin
  clubId: string;
}

// Expense Types
export interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  clubId: string;
  paymentType?: 'cash' | 'upi' | 'card';
}

// Dashboard Types
export interface DashboardStats {
  totalVisitors: number;
  totalTrials: number;
  totalMembers: number;
  todayVisitors: number;
  todayTrials: number;
  todayMembers: number;
  monthlyRevenue: number;
  pendingPayments: number;
  lowStockProducts: number;
  attendanceRate: number;
}

// Auth Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Context Types
export interface AppContextType {
  clubs: Club[];
  visitors: Visitor[];
  products: Product[];
  expenses: Expense[];
  attendance: Attendance[];
  currentClub?: Club;
  setCurrentClub: (club: Club | undefined) => void;
  refreshData: () => void;
  addVisitor: (visitorData: Partial<Visitor>) => void;
  updateVisitor: (visitorId: string, visitorData: Partial<Visitor>) => void;
  stockUsage: StockUsage[];
  dailyConsumptionReports: DailyConsumptionReport[];
  addProduct: (productData: Partial<Product>) => void;
  logConsumption: (logData: Partial<StockUsage>) => void;
  getDailyConsumptionReport: (date: Date) => DailyConsumptionReport | undefined;
  getOverallConsumedProductCount: () => number;
}

// Subscription Types
export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
