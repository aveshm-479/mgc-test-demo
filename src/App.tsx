import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { VisitorsPage } from './pages/VisitorsPage';
import { ClubsPage } from './pages/ClubsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AttendancePage } from './pages/AttendancePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AdminManagementPage } from './pages/AdminManagementPage';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import './utils/smoothScroll';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="mgc-test-demo/dashboard" element={<DashboardPage />} />
        <Route path="mgc-test-demo/visitors" element={<VisitorsPage />} />
        <Route path="mgc-test-demo/clubs" element={<ClubsPage />} />
        <Route path="mgc-test-demo/inventory" element={<InventoryPage />} />
        <Route path="mgc-test-demo/attendance" element={<AttendancePage />} />
        <Route path="mgc-test-demo/expenses" element={<ExpensesPage />} />
        {user?.role === 'super_admin' && (
          <Route path="mgc-test-demo/admin-management" element={<AdminManagementPage />} />
        )}
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router basename="/mgc-test-demo">
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
