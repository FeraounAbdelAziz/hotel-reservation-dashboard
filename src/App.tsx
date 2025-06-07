import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import StockManagerDashboard from './pages/stock/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import useStore from './store/useStore';
import Reservations from './pages/admin/employees/Reservations';
import Maintenance from './pages/admin/employees/Maintenance';
import Stock from './pages/admin/employees/Stock';
import Reports from './pages/admin/employees/Reports';
import Facilities from './pages/admin/employees/Facilities';
import { useEffect } from 'react';
import ReservationList from './pages/employee/ReservationList';
import Rooms from './pages/employee/Rooms';
import ReservationEmployeeLayout from './layouts/ReservationEmployeeLayout';
import ReservationEmployeeDashboard from './pages/employee/ReservationEmployeeDashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'stock_manager' | 'user' | 'reservation_employee')[];
}

function SessionCheck() {
  const { checkSession, currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkSession();
      if (!isValid && currentUser) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [checkSession, currentUser, navigate]);

  return null;
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <SessionCheck />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="tasks" element={<div>Task Management</div>} />
              
              {/* Employee Management Routes */}
              <Route path="employees">
                <Route index element={<Users />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="stock" element={<Stock />} />
                <Route path="reports" element={<Reports />} />
                <Route path="facilities" element={<Facilities />} />
              </Route>
            </Route>

            <Route 
              path="/stock" 
              element={
                <ProtectedRoute allowedRoles={['stock_manager']}>
                  <StockManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute allowedRoles={['reservation_employee']}>
                  <ReservationEmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="reservations" replace />} />
              <Route path="reservations" element={<ReservationEmployeeDashboard />} />
              <Route path="reservation-list" element={<ReservationList />} />
              <Route path="rooms" element={<Rooms />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 