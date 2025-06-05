import { Link, useLocation } from "react-router-dom";
import { CalendarDaysIcon, HomeIcon } from "@heroicons/react/24/outline";
import useStore from "@/store/useStore";
import { LogOut } from "lucide-react";

export default function ReservationEmployeeSidebar() {
  const location = useLocation();
  const { logout } = useStore();

  const navigation = [
    { name: "Dashboard", href: "/employee", icon: HomeIcon },
    {
      name: "Reservations",
      href: "/employee/reservations",
      icon: CalendarDaysIcon,
    },
    { name: "Rooms", href: "/employee/rooms", icon: HomeIcon },
    { name: "reservation history", href: "/employee/reservation history", icon: HomeIcon },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-background border-r text-white">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 h-14 border-b px-4">
            <span className="text-xl font-semibold ">Hotel Management</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive
                        ? "text-primary-foreground"
                        : "text-gray-400 group-hover:text-gray-300"
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
