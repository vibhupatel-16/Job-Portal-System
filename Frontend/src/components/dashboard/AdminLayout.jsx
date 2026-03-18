import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";

const adminSidebarItems = [
  { label: "Dashboard", path: "/admin/panel", icon: "LayoutDashboard" },
  { label: "Manage Users", path: "/admin/users", icon: "Users" },
  { label: "Manage Jobs", path: "/admin/jobs", icon: "Briefcase" },
  { label: "Manage Companies", path: "/admin/companies", icon: "Building2" },
  { label: "Manage Applications", path: "/admin/applications", icon: "ClipboardList" },
  { label: "Manage Testimonials", path: "/admin/testimonials", icon: "MessageSquare" },
  { label: "Interview List", path: "/admin/interview-list", icon: "Calendar" },
];

export function AdminLayout({ children }) {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="Admin">
      {children ?? <Outlet />}
    </DashboardLayout>
  );
}

export default AdminLayout;
