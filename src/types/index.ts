// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: Date;
  createdBy?: string; // ID of the admin who created this user
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
  category: 'shake' | 'vitamin' | 'supplement';
  price: number;
  stock: number;
  minStock: number;
  clubId: string;
}

export interface StockUsage {
  id: string;
  productId: string;
  quantity: number;
  date: Date;
  visitorId?: string;
  clubId: string;
}

// Expense Types
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  clubId: string;
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
}
