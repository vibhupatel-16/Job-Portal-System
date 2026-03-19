import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TestimonialFeedbackForm from "../shared/TestimonialFeedbackForm";
import { MessageSquareHeart } from "lucide-react";

const employerSidebarItems = [
  { label: "Dashboard", path: "/employer/dashboard", icon: "LayoutDashboard" },
  { label: "Companies", path: "/employer/companies", icon: "Building2" },
  { label: "My Jobs", path: "/employer/jobs", icon: "Briefcase" },
  { label: "Interview List", path: "/employer/interview-list", icon: "Calendar" },
];

export function EmployerLayout({ children }) {
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  return (
    <DashboardLayout sidebarItems={employerSidebarItems} title="Recruiter">
      {children ?? <Outlet />}
      
      {/* Floating Action Button for Testimonial */}
      <button 
        onClick={() => setShowTestimonialModal(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center p-4 text-white transition-all bg-purple-600 rounded-full shadow-2xl hover:bg-purple-700 hover:scale-105"
        title="Share your feedback"
      >
        <MessageSquareHeart size={24} />
      </button>

      {/* Testimonial Modal */}
      <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <TestimonialFeedbackForm 
            submitPath="/testimonials/submit/employer"
            placeholder="Tell us how we helped you find talent..."
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default EmployerLayout;
