import type { User, Club, Visitor, Product, Expense, Attendance, StockUsage, DailyConsumptionReport, Subscription } from '../types';

// Sample Users
export const sampleUsers: User[] = [
  {
    id: 'super-admin-1',
    email: 'super@magicalcommunity.com',
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'admin-1',
    email: 'admin1@magicalcommunity.com',
    name: 'Admin A',
    role: 'admin',
    createdAt: new Date('2024-01-15'),
    createdBy: 'super-admin-1',
  },
  {
    id: 'admin-2',
    email: 'admin2@magicalcommunity.com',
    name: 'Admin B',
    role: 'admin',
    createdAt: new Date('2024-02-01'),
    createdBy: 'super-admin-1',
  },
  {
    id: 'admin-3',
    email: 'admin3@magicalcommunity.com',
    name: 'Admin C',
    role: 'admin',
    createdAt: new Date('2024-02-15'),
    createdBy: 'admin-1', // Created by Admin A
  },
];

// Sample Clubs
export const sampleClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Magical Wellness Downtown',
    location: '123 Main St, Downtown',
    contact: '+91 98765 43210',
    email: 'downtown@magicalcommunity.com',
    assignedAdminId: 'admin-1',
    createdAt: new Date('2024-01-20'),
    settings: {
      trialFee: 700,
      membershipPlans: [
        {
          id: 'plan-1',
          name: 'Monthly Membership',
          price: 7500,
          duration: 30,
          description: 'Full access to all facilities for 30 days',
        },
        {
          id: 'plan-2',
          name: 'Quarterly Membership',
          price: 20000,
          duration: 90,
          description: 'Save 11% with quarterly membership',
        },
      ],
    },
  },
  {
    id: 'club-2',
    name: 'Magical Wellness Uptown',
    location: '456 Park Ave, Uptown',
    contact: '+91 98765 43211',
    email: 'uptown@magicalcommunity.com',
    assignedAdminId: 'admin-2',
    createdAt: new Date('2024-02-05'),
    settings: {
      trialFee: 700,
      membershipPlans: [
        {
          id: 'plan-3',
          name: 'Monthly Membership',
          price: 7500,
          duration: 30,
          description: 'Full access to all facilities for 30 days',
        },
      ],
    },
  },
  {
    id: 'club-3',
    name: 'Magical Wellness Westside',
    location: '789 West Blvd, Westside',
    contact: '+91 98765 43212',
    email: 'westside@magicalcommunity.com',
    assignedAdminId: 'admin-3',
    createdAt: new Date('2024-02-20'),
    settings: {
      trialFee: 700,
      membershipPlans: [
        {
          id: 'plan-4',
          name: 'Monthly Membership',
          price: 7500,
          duration: 30,
          description: 'Full access to all facilities for 30 days',
        },
      ],
    },
  },
];

// Sample Visitors
export const sampleVisitors: Visitor[] = [
  {
    id: 'visitor-1',
    name: 'John Doe',
    email:'',
    
    mobile: '+91 98765 12345',
    address: '123 Street, City',
    referralSource: 'Google',
    visitDate: new Date('2024-07-15'),
    clubId: 'club-1',
    type: 'visitor',
    status: 'active',
    payments: [],
  },
  {
    id: 'visitor-2',
    name: 'Jane Smith',
    email:'',
    
    mobile: '+91 98765 12346',
    address: '456 Avenue, City',
    referralSource: 'Friend',
    visitDate: new Date('2024-07-14'),
    clubId: 'club-1',
    type: 'trial',
    status: 'active',
    trialEndDate: new Date('2024-07-17'),
    payments: [
      {
        id: 'payment-1',
        amount: 700,
        type: 'trial',
        status: 'completed',
        date: new Date('2024-07-14'),
        visitorId: 'visitor-2',
        clubId: 'club-1',
      },
    ],
  },
  {
    id: 'visitor-3',
    name: 'Mike Johnson',
    email:'',

    mobile: '+91 98765 12347',
    address: '789 Road, City',
    referralSource: 'Instagram',
    visitDate: new Date('2024-07-10'),
    clubId: 'club-1',
    type: 'member',
    status: 'active',
    membershipEndDate: new Date('2024-08-10'),
    payments: [
      {
        id: 'payment-2',
        amount: 7500,
        type: 'membership',
        status: 'completed',
        date: new Date('2024-07-10'),
        visitorId: 'visitor-3',
        clubId: 'club-1',
      },
    ],
  },
  {
    id: 'visitor-4',
    email:'',
    name: 'Sarah Wilson',
    mobile: '+91 98765 12348',
    address: '321 Lane, City',
    referralSource: 'Facebook',
    visitDate: new Date('2024-07-16'),
    clubId: 'club-2',
    type: 'trial',
    status: 'active',
    trialEndDate: new Date('2024-07-19'),
    payments: [
      {
        id: 'payment-3',
        amount: 700,
        type: 'trial',
        status: 'completed',
        date: new Date('2024-07-16'),
        visitorId: 'visitor-4',
        clubId: 'club-2',
      },
    ],
  },
];

// Sample Products
export const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Protein Shake - Chocolate',
  },
  {
    id: 'product-2',
    name: 'Protein Shake - Vanilla',
  },
  {
    id: 'product-3',
    name: 'Multivitamin Complex',
  },
  {
    id: 'product-4',
    name: 'Whey Protein Powder',
  },
  {
    id: 'product-5',
    name: 'Protein Shake - Chocolate',
  },
  {
    id: 'product-6',
    name: 'Energy Bar',
  },
];

// Sample Stock Usage (Consumption Logs)
export const sampleStockUsage: StockUsage[] = [
  {
    id: 'usage-1',
    productId: 'product-1',
    clubId: 'club-1',
    quantity: 5,
    consumedBy: 'admin-1',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-2',
    productId: 'product-1',
    clubId: 'club-2',
    quantity: 3,
    consumedBy: 'admin-2',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-3',
    productId: 'product-1',
    clubId: 'club-3',
    quantity: 4,
    consumedBy: 'admin-3',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-4',
    productId: 'product-2',
    clubId: 'club-1',
    quantity: 2,
    consumedBy: 'admin-1',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-5',
    productId: 'product-2',
    clubId: 'club-2',
    quantity: 1,
    consumedBy: 'admin-2',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-6',
    productId: 'product-3',
    clubId: 'club-1',
    quantity: 3,
    consumedBy: 'admin-1',
    date: new Date('2025-07-19'),
  },
  {
    id: 'usage-7',
    productId: 'product-3',
    clubId: 'club-3',
    quantity: 2,
    consumedBy: 'admin-3',
    date: new Date('2025-07-19'),
  },
];

// Sample Daily Consumption Reports (can be generated from StockUsage)
export const sampleDailyConsumptionReports: DailyConsumptionReport[] = [
  {
    date: new Date('2025-07-19'),
    items: [
      {
        productId: 'product-1',
        productName: 'Protein Shake - Chocolate',
        totalConsumedQuantity: 2,
        unit: 'units',
        clubName: 'Magical Wellness Downtown',
        clubId: 'club-1',
      },
      {
        productId: 'product-1',
        productName: 'Protein Shake - Chocolate',
        totalConsumedQuantity: 1,
        unit: 'units',
        clubName: 'Magical Wellness Downtown',
        clubId: 'club-2',
      },
      {
        productId: 'product-1',
        productName: 'Protein Shake - Chocolate',
        totalConsumedQuantity: 3,
        unit: 'units',
        clubName: 'Magical Wellness Uptown',
        clubId: 'club-3',
      },
    ],
  },
  {
    date: new Date('2025-07-19'),
    items: [
      {
        productId: 'product-1',
        productName: 'Protein Shake - Chocolate',
        totalConsumedQuantity: 1,
        unit: 'units',
        clubName: 'Magical Wellness Downtown',
        clubId: 'club-1',
      },
    ],
  },
];

// Sample Expenses
export const sampleExpenses: Expense[] = [
  {
    id: 'expense-1',
    name: 'Electricity Bill',
    description: 'Electricity Bill',
    amount: 5000,
    date: new Date('2024-07-01'),
    category: 'Utilities',
    clubId: 'club-1',
  },
  {
    id: 'expense-2',
    name: 'Equipment Maintenance',
    description: 'Equipment Maintenance',
    amount: 3000,
    date: new Date('2024-07-05'),
    category: 'Maintenance',
    clubId: 'club-1',
  },
  {
    id: 'expense-3',
    name: 'Cleaning Supplies',
    description: 'Cleaning Supplies',
    amount: 1500,
    date: new Date('2024-07-10'),
    category: 'Supplies',
    clubId: 'club-1',
  },
];

// Sample Attendance
export const sampleAttendance: Attendance[] = [
  {
    id: 'attendance-1',
    visitorId: 'visitor-3',
    clubId: 'club-1',
    date: new Date('2024-07-15'),
    status: 'present',
  },
  {
    id: 'attendance-2',
    visitorId: 'visitor-3',
    clubId: 'club-1',
    date: new Date('2024-07-14'),
    status: 'present',
  },
  {
    id: 'attendance-3',
    visitorId: 'visitor-3',
    clubId: 'club-1',
    date: new Date('2024-07-13'),
    status: 'absent',
  },
];

// Sample Subscriptions
export const sampleSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Basic Monthly',
    price: 1999,
    duration: 1,
    description: 'Perfect for getting started with basic gym access',
    features: [
      'Basic gym access',
      'Locker access',
      'Basic fitness assessment'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'sub-2',
    name: 'Premium Quarterly',
    price: 5499,
    duration: 3,
    description: 'Great value with additional benefits',
    features: [
      'Full gym access',
      'Locker access',
      'Personal trainer consultation',
      'Group classes',
      'Nutrition guidance'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'sub-3',
    name: 'Pro Annual',
    price: 19999,
    duration: 12,
    description: 'Best value with all premium features',
    features: [
      'Full gym access',
      'Premium locker access',
      'Monthly personal trainer sessions',
      'Unlimited group classes',
      'Nutrition consultation',
      'Spa access',
      'Guest passes'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
