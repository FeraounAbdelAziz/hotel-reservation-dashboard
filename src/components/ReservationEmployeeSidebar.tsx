import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  LogOut,
} from 'lucide-react';
import useStore from '@/store/useStore';

const menuItems = [
  { name: 'Dashboard', href: '/employee/reservations', icon: LayoutDashboard },
  { name: 'Reservations', href: '/employee/reservation-list', icon: CalendarDays },
  { name: 'Rooms', href: '/employee/rooms', icon: Building2 },
];

export function ReservationEmployeeSidebar() {
  const location = useLocation();
  const { logout } = useStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Reservation System</h2>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t p-2">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
} 