import { Outlet } from 'react-router-dom';
import { ReservationEmployeeSidebar } from '@/components/ReservationEmployeeSidebar';
import Navbar from '@/components/Navbar';

export default function ReservationEmployeeLayout() {
  return (
    <div className="flex h-screen">
      <ReservationEmployeeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 