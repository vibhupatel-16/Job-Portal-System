import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';


function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="flex justify-between items-center mx-auto max-w-7xl h-16 px-4">
        {/* Left Logo */}
        <div>
          <h1 className="text-2xl font-bold">
            Job <span className="text-red-500">Portal</span>
          </h1>
        </div>

        {/* Middle Menu */}
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/jobs"}>Jobs</Link></li>
            <li><Link to={"/browse"}>Browse</Link></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* FOR EMPLOYERS BUTTON / MENU */}
          {
            !user && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    For Employers
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col gap-2">
                    <Link to="/employer-login">
                      <Button variant="ghost" className="w-full justify-start">
                        Employer Login
                      </Button>
                    </Link>
                    <Link to="/employer-signup">
                      <Button variant="ghost" className="w-full justify-start">
                        Employer Sign Up
                      </Button>
                    </Link>
                    {/* <Link to="/admin-login">
                      <Button variant="ghost" className="w-full justify-start">
                        Admin Login
                      </Button>
                    </Link> */}
                  </div>
                </PopoverContent>
              </Popover>
            )
          }

          {/* JOBSEEKER AUTH OR PROFILE */}
          {
            !user ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] hover:bg-[#4f1ea5]">SignUp</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@user" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="flex gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="@user" />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold capitalize">{user.fullname || "User"}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col text-gray-600">
                    {
                      user.role === "employer" && (
                        <>
                          <Link to="/employer/dashboard" className="flex items-center gap-2">
                            <User2 size={18} /> Employer Dashboard
                          </Link>
                          <Link to="/employer/post-job" className="flex items-center gap-2">
                            <Briefcase size={18} /> Post a Job
                          </Link>
                        </>
                      )
                    }

                    {
                      user.role === "jobseeker" && (
                        <Link to="/profile" className="flex items-center gap-2">
                          <User2 size={18} /> View Profile
                        </Link>
                      )
                    }

                    <div onClick={handleLogout} className="flex items-center gap-2 cursor-pointer mt-2">
                      <LogOut size={18} /> Logout
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Navbar;
