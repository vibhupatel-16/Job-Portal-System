import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import EmployerDashboard from "./components/Employer/EmployerDashboard";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminPanel from "./components/Admin/Adminpanel";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageJobs from "./components/Admin/ManageJobs";
import ManageCompanies from "./components/Admin/ManageCompanies";
import ManageApplications from "./components/Admin/ManageApplications";
import AdminCompanyCreate from "./components/Admin/AdminCompanyCreate";
import AdminCompanyUpdate from "./components/Admin/AdminCompanyUpdate";

// Interviews

import ScheduledInterviews from "./components/Employer/ScheduleInterviews";
import AdminInterviewList from "./components/Admin/AdminInterviewList";
import JobseekerInterviews from "./components/JobseekerInterviews";
import SavedJobs from "./components/SavedJobs";
import FAQSection from "./components/shared/FAQSection";


// Global Socket Instance (Export if needed in other components)
export const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: false, // Login ke baad connect karenge
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
      { path: "/employer-login", element: <EmployerLogin /> },
      { path: "/employer-signup", element: <EmployerSignup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/description/:id", element: <JobDescription /> },
      { path: "/browse", element: <Browse /> },
      { path: "/profile", element: <Profile /> },

      {path:"/saved-jobs", element:<SavedJobs/> },


      // Employer Routes
      { path: "/employer/companies", element: <Companies /> },
      { path: "/employer/companies/create", element: <CompanyCreate /> },
      { path: "/employer/companies/:id", element: <CompanySetup /> },
      { path: "/employer/jobs", element: <EmployerJobs /> },
      { path: "/employer/jobs/create", element: <PostJob /> },
      { path: "/employer/jobs/:id/applicants", element: <Applicants /> },
      { path: "/employer/jobs/:id", element: <JobSetup /> },
      { path: "/employer/dashboard", element: <EmployerDashboard /> },

      // Admin Routes
      {
        path: "/admin/panel",
        element: (
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        ),
      },
      { path: "/admin/users", element: <ManageUsers /> },
      { path: "/admin/jobs", element: <ManageJobs /> },
      { path: "/admin/jobs/create", element: <PostJob /> },
      { path: "/admin/jobs/update/:id", element: <JobSetup /> },
      { path: "/admin/companies", element: <ManageCompanies /> },
      { path: "/admin/companies/create", element: <AdminCompanyCreate /> },
      { path: "/admin/companies/update/:id", element: <AdminCompanyUpdate /> },
      { path: "/admin/applications", element: <ManageApplications /> },

      // Interview Routes
      
      { path: "/employer/interview-list", element: <ScheduledInterviews/> },
      {path:"/admin/interview-list", element:<AdminInterviewList/>},
      {path:"/jobseeker/interviews", element:<JobseekerInterviews/>},
      {path:"/faq", element:<FAQSection/>}
      
      
    ],
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user) {
      // 1. Socket Connect karein
      socket.connect();

      // 2. User ko private room mein join karwayein (for direct notifications)
      socket.emit("join", user._id);

      // 3. Listen for global or private notifications
      socket.on("notification", (data) => {
        toast.success(data.message, {
          duration: 4000,
          position: "bottom-right",
        });
      });

      // 4. New Job notification (agar postJob mein emit kiya hai)
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