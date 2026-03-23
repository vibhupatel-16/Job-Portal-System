import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  Calendar,
  UserCircle,
  Bookmark,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  Calendar,
  UserCircle,
  Bookmark,
  MessageSquare,
};

export function DashboardLayout({ sidebarItems, children, title }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r transform transition-transform duration-200 ease-out lg:translate-x-0",
          "border-gray-200 bg-white text-gray-900",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full py-4">
          <div className="flex items-center justify-between px-4 mb-4 lg:justify-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {title}
            </span>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 px-3">
            {sidebarItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isExactDashboard =
                item.path === "/admin/panel" || item.path === "/employer/dashboard" || item.path === "/jobseeker/dashboard";
              const isActive = isExactDashboard
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className={cn("h-4 w-4 opacity-0", isActive && "opacity-70")} />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-800">Menu</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
