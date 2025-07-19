/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';
import type { 
  Club, 
  Visitor, 
  Product, 
  Expense, 
  Attendance, 
  StockUsage, 
  DailyConsumptionReport,
  Subscription 
} from '../types';

export interface AppContextType {
  clubs: Club[];
  visitors: Visitor[];
  products: Product[];
  expenses: Expense[];
  attendance: Attendance[];
  stockUsage: StockUsage[];
  dailyConsumptionReports: DailyConsumptionReport[];
  subscriptions: Subscription[];
  currentClub: Club | undefined;
  setCurrentClub: (club: Club | undefined) => void;
  refreshData: () => void;
  addVisitor: (visitorData: any) => void;
  updateVisitor: (id: string, visitorData: any) => void;
  addProduct: (productData: any) => void;
  logConsumption: (consumptionData: any) => void;
  getDailyConsumptionReport: (date: Date) => DailyConsumptionReport | undefined;
  getOverallConsumedProductCount: () => number;
  addSubscription: (subscriptionData: Partial<Subscription>) => void;
  updateSubscription: (id: string, subscriptionData: Partial<Subscription>) => void;
  toggleSubscriptionStatus: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
