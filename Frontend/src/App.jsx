import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "sonner";

// Components & Layout
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";

// Employer
import EmployerLogin from "./components/auth/EmployerLogin";
import EmployerSignup from "./components/auth/EmployerSignup";
import Companies from "./components/Employer/Companies";
import CompanyCreate from "./components/Employer/CompanyCreate";
import CompanySetup from "./components/Employer/CompanySetup";
import EmployerJobs from "./components/Employer/EmployerJobs";
import PostJob from "./components/Employer/PostJob";
import Applicants from "./components/Employer/Applicants";
import JobSetup from "./components/Employer/JobSetup";

// Pages & Admin
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ErrorPage from "./pages/ErrorPage";
import NotAuthorized from "./pages/NotAuthorized";
import EmployerDashboard from "./components/Employer/EmployerDashboard";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLayout from "./components/dashboard/AdminLayout";
import EmployerLayout from "./components/dashboard/EmployerLayout";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageJobs from "./components/Admin/ManageJobs";
import ManageCompanies from "./components/Admin/ManageCompanies";
import ManageApplications from "./components/Admin/ManageApplications";
import AdminCompanyCreate from "./components/Admin/AdminCompanyCreate";
import AdminCompanyUpdate from "./components/Admin/AdminCompanyUpdate";
import ManageTestimonials from "./components/Admin/ManageTestimonials";
import ManageSupportTickets from "./components/Admin/ManageSupportTickets";

// Interviews
import ScheduledInterviews from "./components/Employer/ScheduleInterviews";
import AdminInterviewList from "./components/Admin/AdminInterviewList";
import JobseekerInterviews from "./components/JobseekerInterviews";
import JobSeekerDashboard from "./components/Jobseeker/JobSeekerDashboard";
import SupportResponses from "./components/Jobseeker/SupportResponses";
import JobSeekerLayout from "./components/dashboard/JobSeekerLayout";
import SavedJobs from "./components/SavedJobs";
import FAQSection from "./components/shared/FAQSection";
import { baseURL } from "./utils/constant";
import VerifyOtp from "./components/auth/VerifyOtp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ContactSupport from "./pages/ContactSupport";
import JobSeekerProtectedRoute from "./components/JobSeeekerProtectedRoute";


// Global Socket Instance (Export if needed in other components)
export const socket = io(baseURL, {
  withCredentials: true,
  autoConnect: false,
});

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path:"/verify-otp", element:<VerifyOtp />} ,
      { path: "/employer-login", element: <EmployerLogin /> },
      { path: "/employer/signup", element: <EmployerSignup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/not-authorized", element: <NotAuthorized /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/description/:id", element: <JobDescription /> },
      { path: "/browse", element: <Browse /> },
      { path: "/profile", element: <Profile /> },
        { path: "/saved-jobs", element: <SavedJobs /> },
      {
        path: "/jobseeker",
        element: (
          <JobSeekerProtectedRoute>
            <JobSeekerLayout />
          </JobSeekerProtectedRoute>
        ),
        children: [
    {index: true, element: <Navigate to="dashboard" replace/>},
    { path: "dashboard", element: <JobSeekerDashboard /> },
    { path: "saved-jobs", element: <SavedJobs /> },
    { path: "interviews", element: <JobseekerInterviews /> },
    { path: "faq", element: <FAQSection /> },
    { path: "support-responses", element: <SupportResponses /> },

        ]
      },
      
       
      
      // Employer Routes (with sidebar layout)
      {
        path: "/employer",
        element: <EmployerLayout />,
        children: [
          { index: true, element: <Navigate to="/employer/dashboard" replace /> },
          { path: "dashboard", element: <EmployerDashboard /> },
          { path: "companies", element: <Companies /> },
          { path: "companies/create", element: <CompanyCreate /> },
          { path: "companies/:id", element: <CompanySetup /> },
          { path: "jobs", element: <EmployerJobs /> },
          { path: "jobs/create", element: <PostJob /> },
          { path: "jobs/:id/applicants", element: <Applicants /> },
          { path: "jobs/:id", element: <JobSetup /> },
          { path: "interview-list", element: <ScheduledInterviews /> },
          { path: "faq", element: <FAQSection /> },
          { path: "support-responses", element: <SupportResponses /> },
        ],
      },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsOfService /> },
      { path: "/cookies", element: <CookiePolicy /> },
      { path: "/contact-support", element: <ContactSupport /> },
      { path: "/faq", element: <FAQSection /> },
     
      {
        path: "/admin",
        element: (
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/panel" replace /> },
          { path: "panel", element: <AdminPanel /> },
          { path: "users", element: <ManageUsers /> },
          { path: "jobs", element: <ManageJobs /> },
          { path: "jobs/create", element: <PostJob /> },
          { path: "jobs/update/:id", element: <JobSetup /> },
          { path: "companies", element: <ManageCompanies /> },
          { path: "companies/create", element: <AdminCompanyCreate /> },
          { path: "companies/update/:id", element: <AdminCompanyUpdate /> },
          { path: "applications", element: <ManageApplications /> },
          { path: "testimonials", element: <ManageTestimonials /> },
          { path: "interview-list", element: <AdminInterviewList /> },
          { path: "support", element: <ManageSupportTickets /> },
          
          { path: "faq", element: <FAQSection /> },
          {path:"privacy-policy", element: <PrivacyPolicy/>},
          {path:"terms", element: <TermsOfService/>},
          {path:"cookies", element: <CookiePolicy/>}
    ],
  },
  
]}]);

function App() {
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user) {
      // 1. Socket Connect
      socket.connect();

      // 2. (for direct notifications)
      socket.emit("join", user._id);

      // 3. Listen for global or private notifications
      socket.on("notification", (data) => {
        toast.success(data.message, {
          duration: 4000,
          position: "bottom-right",
        });
      });

      // 4. New Job notification
      socket.on("newJob", (data) => {
        toast.info(`New Job Posted: ${data.title}`);
      });
    }

    return () => {
      socket.disconnect(); // Cleanup on Logout/Unmount
      socket.off("notification");
      socket.off("newJob");
    };
  }, [user]);

  return <RouterProvider router={appRouter} />;
}

export default App;