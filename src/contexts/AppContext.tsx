import React, { useState, useEffect } from 'react';
import type { Club, Visitor, Product, Expense, Attendance, StockUsage, DailyConsumptionReport, Subscription } from '../types';
import { AppContext } from './AppContextProvider';
import {
  sampleClubs,
  sampleVisitors,
  sampleProducts,
  sampleExpenses,
  sampleAttendance,
  sampleStockUsage,
  sampleDailyConsumptionReports,
  sampleSubscriptions
} from '../data/sampleData';
import { useAuth } from '../hooks/useAuth';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const auth = useAuth();
  const user = auth.user;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [stockUsage, setStockUsage] = useState<StockUsage[]>([]);
  const [dailyConsumptionReports, setDailyConsumptionReports] = useState<DailyConsumptionReport[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentClub, setCurrentClub] = useState<Club | undefined>();

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = () => {
    // Filter data based on user permissions
    if (user?.role === 'super_admin') {
      // Super admin sees all data
      setClubs(sampleClubs);
      setVisitors(sampleVisitors);
      setProducts(sampleProducts);
      setExpenses(sampleExpenses);
      setAttendance(sampleAttendance);
      setStockUsage(sampleStockUsage);
      setDailyConsumptionReports(sampleDailyConsumptionReports);
      setSubscriptions(sampleSubscriptions);
    } else if (user?.role === 'admin') {
      // Admin sees data for their assigned clubs and clubs of admins they created
      const adminClubs = sampleClubs.filter((club: Club) => 
        club.assignedAdminId === user.id
      );
      
      // This is a simplified version - in real app, you'd recursively find all created admins
      const adminVisitors = sampleVisitors.filter((v: Visitor) => 
        adminClubs.some((c: Club) => c.id === v.clubId)
      );
      const adminExpenses = sampleExpenses.filter((e: Expense) => 
        adminClubs.some((c: Club) => c.id === e.clubId)
      );
      const adminAttendance = sampleAttendance.filter((a: Attendance) => 
        adminClubs.some((c: Club) => c.id === a.clubId)
      );
      const adminStockUsage = sampleStockUsage.filter((su: StockUsage) =>
        adminClubs.some((c: Club) => c.id === su.clubId)
      );
      // Daily consumption reports are now global, but items within them need to be filtered by club for admins
      const adminDailyConsumptionReports = sampleDailyConsumptionReports.map(report => ({
        ...report,
        items: report.items.filter(item => 
          adminClubs.some((c: Club) => c.id === item.clubId)
        )
      })).filter(report => report.items.length > 0);

      setClubs(adminClubs);
      setVisitors(adminVisitors);
      setProducts(sampleProducts); // Products are now global, no filtering needed for admins
      setExpenses(adminExpenses);
      setAttendance(adminAttendance);
      setStockUsage(adminStockUsage);
      setDailyConsumptionReports(adminDailyConsumptionReports);
      
      // Set first club as current if available
      if (adminClubs.length > 0) {
        setCurrentClub(adminClubs[0]);
      }
    }
  };

  const addVisitor = (visitorData: Partial<Visitor>) => {
    const newVisitor: Visitor = {
      id: `visitor_${Date.now()}`,
      name: visitorData.name || '',
      email: visitorData.email || '',
      mobile: visitorData.mobile || '',
      address: visitorData.address || '',
      referralSource: visitorData.referralSource || '',
      visitDate: visitorData.visitDate || new Date(),
      clubId: visitorData.clubId || currentClub?.id || '',
      type: visitorData.type || 'visitor',
      status: 'active',
      payments: visitorData.payments || [],
    };
    
    setVisitors(prev => [...prev, newVisitor]);
  };

  const updateVisitor = (visitorId: string, visitorData: Partial<Visitor>) => {
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === visitorId 
          ? { ...visitor, ...visitorData }
          : visitor
      )
    );
  };

  const addProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      name: productData.name || '',
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const logConsumption = (logData: Partial<StockUsage>) => {
    const newLog: StockUsage = {
      id: `consumption_${Date.now()}`,
      productId: logData.productId || '',
      clubId: logData.clubId || '',
      quantity: logData.quantity || 0,
      consumedBy: logData.consumedBy || '',
      date: logData.date || new Date(),
    };
    setStockUsage(prev => {
      const updatedUsage = [...prev, newLog];
      return updatedUsage;
    });

    // Update daily consumption reports
    const consumptionDate = newLog.date.toDateString();
    setDailyConsumptionReports(prev => {
      const existingReportIndex = prev.findIndex(report => report.date.toDateString() === consumptionDate);
      if (existingReportIndex > -1) {
        const updatedReports = [...prev];
        const existingReport = updatedReports[existingReportIndex];
        const existingItemIndex = existingReport.items.findIndex(item => item.productId === newLog.productId && item.clubId === newLog.clubId);

        if (existingItemIndex > -1) {
          const updatedItems = [...existingReport.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            totalConsumedQuantity: updatedItems[existingItemIndex].totalConsumedQuantity + newLog.quantity
          };
          updatedReports[existingReportIndex] = { ...existingReport, items: updatedItems };
        } else {
          const product = products.find(p => p.id === newLog.productId);
          const club = clubs.find(c => c.id === newLog.clubId);
          if (product && club) {
            existingReport.items.push({
              productId: newLog.productId,
              productName: product.name,
              totalConsumedQuantity: newLog.quantity,
              unit: 'units', 
              clubName: club.name,
              clubId: club.id,
            });
          }
        }
        return updatedReports;
      } else {
        const product = products.find(p => p.id === newLog.productId);
        const club = clubs.find(c => c.id === newLog.clubId);
        if (product && club) {
          return [
            ...prev,
            {
              date: new Date(consumptionDate),
              items: [
                {
                  productId: newLog.productId,
                  productName: product.name,
                  totalConsumedQuantity: newLog.quantity,
                  unit: 'units',
                  clubName: club.name,
                  clubId: club.id,
                },
              ],
            },
          ];
        }
        return prev;
      }
    });
  };

  const getDailyConsumptionReport = (date: Date) => {
    const dateString = date.toDateString();
    return dailyConsumptionReports.find(report => report.date.toDateString() === dateString);
  };

  const getOverallConsumedProductCount = () => {
    const today = new Date().toDateString();
    const todayReport = dailyConsumptionReports.find(report => report.date.toDateString() === today);
    return todayReport ? todayReport.items.reduce((sum, item) => sum + item.totalConsumedQuantity, 0) : 0;
  };

  const addSubscription = (subscriptionData: Partial<Subscription>) => {
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      name: subscriptionData.name || '',
      price: subscriptionData.price || 0,
      duration: subscriptionData.duration || 1,
      description: subscriptionData.description || '',
      features: subscriptionData.features || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const updateSubscription = (id: string, subscriptionData: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, ...subscriptionData, updatedAt: new Date() }
        : sub
    ));
  };

  const toggleSubscriptionStatus = (id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id
        ? { ...sub, isActive: !sub.isActive, updatedAt: new Date() }
        : sub
    ));
  };

  return (
    <AppContext.Provider value={{
      clubs,
      visitors,
      products,
      expenses,
      attendance,
      stockUsage,
      dailyConsumptionReports,
      subscriptions,
      currentClub,
      setCurrentClub,
      refreshData,
      addVisitor,
      updateVisitor,
      addProduct,
      logConsumption,
      getDailyConsumptionReport,
      getOverallConsumedProductCount,
      addSubscription,
      updateSubscription,
      toggleSubscriptionStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
