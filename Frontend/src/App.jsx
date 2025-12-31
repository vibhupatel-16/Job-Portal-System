import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,     // ⭐ WRAP ALL ROUTES INSIDE LAYOUT
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

      // Employer Routes
      { path: "/employer/companies", element: <Companies /> },
      { path: "/employer/companies/create", element: <CompanyCreate /> },
      { path: "/employer/companies/:id", element: <CompanySetup /> },
      { path: "/employer/jobs", element: <EmployerJobs /> },
      { path: "/employer/jobs/create", element: <PostJob /> },
      { path: "/employer/jobs/:id/applicants", element: <Applicants /> },
      { path: "/employer/jobs/:id", element: <JobSetup /> },
      {path: "/employer/dashboard", element:<EmployerDashboard/>},
  {
  path:"/admin/panel" ,
  element:
    <AdminProtectedRoute>
      <AdminPanel />
    </AdminProtectedRoute>
  },
  { path:"/admin/users", element:<ManageUsers /> },
  {path:"/admin/jobs", element:<ManageJobs /> },
  {path:"/admin/jobs/create", element:<PostJob/>},
  {path:"/admin/jobs/update/:id", element:<JobSetup/>},
  {path:"/admin/companies", element:<ManageCompanies/>},
  {path:"/admin/companies/create", element:<AdminCompanyCreate/>},
  {path:"/admin/companies/update/:id", element:<AdminCompanyUpdate/>},
  {path:"/admin/applications", element:<ManageApplications />}





    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
