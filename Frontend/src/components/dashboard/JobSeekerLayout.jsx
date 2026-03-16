import React from "react";
import { DashboardLayout } from "./DashboardLayout";

const jobSeekerSidebarItems = [
  { label: "Dashboard", path: "/jobseeker/dashboard", icon: "LayoutDashboard" },
  { label: "My Profile", path: "/profile", icon: "UserCircle" },
  { label: "Saved Jobs", path: "/saved-jobs", icon: "Bookmark" },
  { label: "My Interviews", path: "/jobseeker/interviews", icon: "Calendar" },
];

export function JobSeekerLayout({ children }) {
  return (
    <DashboardLayout sidebarItems={jobSeekerSidebarItems} title="Job Seeker">
      {children}
    </DashboardLayout>
  );
}

export default JobSeekerLayout;
