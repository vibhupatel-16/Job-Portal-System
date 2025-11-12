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

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
{
    path:"/login",
    element:<Login/>
  },
    {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/forgot-password",
    element:<ForgotPassword/>
  },
  {
    path:"/reset-password/:token",
    element:<ResetPassword/>
  },
   {
    path:"/jobs",
    element:<Jobs/>
   },
   {
    path:"/description/:id",
    element:<JobDescription/>
   },
   {
    path: "/browse",
    element:<Browse/>
   },
   {
    path:"/profile",
    element:<Profile/>
   },


])
 function App() {
  return (
   <>
   <RouterProvider router={appRouter}/>

   
  
   </>
  );
}
export default App;