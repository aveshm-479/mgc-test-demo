import React, { useState, useEffect } from 'react';
import type { Club, Visitor, Product, Expense, Attendance } from '../types';
import { AppContext } from './AppContextProvider';
import { 
  sampleClubs, 
  sampleVisitors, 
  sampleProducts, 
  sampleExpenses, 
  sampleAttendance 
} from '../data/enhancedSampleData';
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
    } else if (user?.role === 'admin') {
      // Admin sees data for their assigned clubs and clubs of admins they created
      const adminClubs = sampleClubs.filter((club: Club) => 
        club.assignedAdminId === user.id
      );
      
      // This is a simplified version - in real app, you'd recursively find all created admins
      const adminVisitors = sampleVisitors.filter((v: Visitor) => 
        adminClubs.some((c: Club) => c.id === v.clubId)
      );
      const adminProducts = sampleProducts.filter((p: Product) => 
        adminClubs.some((c: Club) => c.id === p.clubId)
      );
      const adminExpenses = sampleExpenses.filter((e: Expense) => 
        adminClubs.some((c: Club) => c.id === e.clubId)
      );
      const adminAttendance = sampleAttendance.filter((a: Attendance) => 
        adminClubs.some((c: Club) => c.id === a.clubId)
      );

      setClubs(adminClubs);
      setVisitors(adminVisitors);
      setProducts(adminProducts);
      setExpenses(adminExpenses);
      setAttendance(adminAttendance);
      
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

  return (
    <AppContext.Provider value={{
      clubs,
      visitors,
      products,
      expenses,
      attendance,
      currentClub,
      setCurrentClub,
      refreshData,
      addVisitor,
      updateVisitor,
    }}>
      {children}
    </AppContext.Provider>
  );
};
