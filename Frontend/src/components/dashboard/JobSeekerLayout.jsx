import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TestimonialFeedbackForm from "../shared/TestimonialFeedbackForm";
import { MessageSquareHeart } from "lucide-react";
import { Outlet } from "react-router-dom";

const jobSeekerSidebarItems = [
  { label: "Dashboard", path: "/jobseeker/dashboard", icon: "LayoutDashboard" },
  { label: "My Profile", path: "/profile", icon: "UserCircle" },
  { label: "Saved Jobs", path: "/saved-jobs", icon: "Bookmark" },
  { label: "My Interviews", path: "/jobseeker/interviews", icon: "Calendar" },
  { label: "FAQ & Support", path: "/jobseeker/faq", icon: "HelpCircle" },
  { label: "View Support Response", path: "/jobseeker/support-responses", icon: "MessageSquare" },
];

export function JobSeekerLayout() {
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  return (
    <DashboardLayout sidebarItems={jobSeekerSidebarItems} title="Job Seeker">
      {<Outlet/>}
      
      {/* Floating Action Button for Testimonial */}
      <button 
        onClick={() => setShowTestimonialModal(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center p-4 text-white transition-all bg-indigo-600 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105"
        title="Share your feedback"
      >
        <MessageSquareHeart size={24} />
      </button>

      {/* Testimonial Modal */}
      <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <TestimonialFeedbackForm 
            submitPath="/testimonials/submit/jobseeker"
            placeholder="Tell us how we helped you find your dream job..."
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default JobSeekerLayout;
