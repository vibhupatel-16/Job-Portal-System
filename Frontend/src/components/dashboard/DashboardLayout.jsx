import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import { logout } from "@/redux/authSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
  ChevronDown,
  LogOut,
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get(`/user/logout`);
      if (res.data.success) {
        dispatch(logout());
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

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
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r transform transition-transform duration-200 ease-out lg:translate-x-0",
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

          {/* User Profile Section */}
          {user && (
            <div className="border-t border-gray-200 mt-auto pt-3">
              {/* Profile Header - Clickable */}
              <button
                onClick={() => setProfileExpanded(!profileExpanded)}
                className="w-full px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.fullname}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${profileExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {profileExpanded && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <div className="mb-3 pb-2">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-all group"
                  >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:ml-64">
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
