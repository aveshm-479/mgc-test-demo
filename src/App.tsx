import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextProvider';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import './utils/smoothScroll';
import { SubscriptionPage } from './pages/SubscriptionPage';

// Lazy load all page components with proper handling for named exports
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const VisitorsPage = lazy(() => import('./pages/VisitorsPage').then(module => ({ default: module.VisitorsPage })));
const ClubsPage = lazy(() => import('./pages/ClubsPage').then(module => ({ default: module.ClubsPage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(module => ({ default: module.InventoryPage })));
const AttendancePage = lazy(() => import('./pages/AttendancePage').then(module => ({ default: module.AttendancePage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(module => ({ default: module.ExpensesPage })));
const AdminManagementPage = lazy(() => import('./pages/AdminManagementPage').then(module => ({ default: module.AdminManagementPage })));

// Loading component for Suspense
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
  </div>
);

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
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/visitors" element={<VisitorsPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          {user?.role === 'super_admin' && (
            <Route path="/admin-management" element={<AdminManagementPage />} />
          )}
        </Route>
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router basename="/megical-community">
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
