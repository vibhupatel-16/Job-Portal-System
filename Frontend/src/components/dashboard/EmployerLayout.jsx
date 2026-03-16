import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";

const employerSidebarItems = [
  { label: "Dashboard", path: "/employer/dashboard", icon: "LayoutDashboard" },
  { label: "Companies", path: "/employer/companies", icon: "Building2" },
  { label: "My Jobs", path: "/employer/jobs", icon: "Briefcase" },
  { label: "Interview List", path: "/employer/interview-list", icon: "Calendar" },
];

export function EmployerLayout({ children }) {
  return (
    <DashboardLayout sidebarItems={employerSidebarItems} title="Recruiter">
      {children ?? <Outlet />}
    </DashboardLayout>
  );
}

export default EmployerLayout;
