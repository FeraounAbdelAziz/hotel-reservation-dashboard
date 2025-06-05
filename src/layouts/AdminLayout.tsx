import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Tasks", href: "/admin/tasks", icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
