import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmployerLogin from "./components/auth/EmployerLogin";
import ErrorPage from "./pages/ErrorPage"; 
import EmployerSignup from "./components/auth/EmployerSignup";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Companies from "./components/Employer/Companies";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/employer-login",
    element: <EmployerLogin />,
  },
  {
  path: "/employer-signup",
  element: <EmployerSignup />
},
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path:"/employer/companies",
    element:<Companies/>
  }
]);

function App() {
  
  const {isLogin}=useSelector((state)=>state.auth)

  useEffect(()=>{
    console.log("is login value----> ",isLogin);
    
  },[isLogin])
  return <RouterProvider router={appRouter} />;
}

export default App;
