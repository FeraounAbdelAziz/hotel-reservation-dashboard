import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ChevronDown,
  Building2,
  Wrench,
  Package,
  CalendarDays,
  FileText,
  LogOut,
} from 'lucide-react';
import useStore from '@/store/useStore';
import { useState } from 'react';

const employeeLinks = [
  { name: 'Reservations', href: '/admin/employees/reservations', icon: CalendarDays },
  { name: 'Maintenance', href: '/admin/employees/maintenance', icon: Wrench },
  { name: 'Stock', href: '/admin/employees/stock', icon: Package },
  { name: 'Reports', href: '/admin/employees/reports', icon: FileText },
  { name: 'Facilities', href: '/admin/employees/facilities', icon: Building2 },
];

const mainNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tasks', href: '/admin/tasks', icon: ClipboardList },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useStore();
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isEmployeesActive = employeeLinks.some(link => isActive(link.href));

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {mainNavItems.map((item) => (
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

        {/* Employees Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setIsEmployeesOpen(!isEmployeesOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              isEmployeesActive
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              <span>Employees</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isEmployeesOpen ? "rotate-180" : ""
            )} />
          </button>
          
          {isEmployeesOpen && (
            <div className="ml-4 space-y-1">
              {employeeLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(link.href)
                      ? "bg-primary/20 text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
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