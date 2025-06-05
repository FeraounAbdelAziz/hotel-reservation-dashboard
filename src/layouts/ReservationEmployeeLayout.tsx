import { Outlet } from 'react-router-dom';
import ReservationEmployeeSidebar from '@/components/ReservationEmployeeSidebar';
import Navbar from '@/components/Navbar';

interface ReservationEmployeeLayoutProps {
  children?: React.ReactNode;
}

export default function ReservationEmployeeLayout({ children }: ReservationEmployeeLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ReservationEmployeeSidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
} 