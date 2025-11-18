import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
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

            {/* Hide Home for Employer */}
            {user?.role !== "employer" && (
              <li><Link to="/">Home</Link></li>
            )}

            {/* Employer → Companies + Jobs | Jobseeker → Jobs + Browse */}
            {user?.role === "employer" ? (
              <>
                <li><Link to="/employer/companies">Companies</Link></li>
                <li><Link to="/employer/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* For Employers Button (Only if NOT logged in) */}
          {!user && (
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
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* User Logged In → Profile Menu */}
          {!user ? (
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
                  <AvatarImage
                    src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={user?.fullname}
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72">

                {/* Top Profile Info */}
                <div className="flex gap-3 mb-3">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={user?.fullname}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold capitalize">{user.fullname}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col text-gray-600">

                  {/* View Profile → ONLY for Jobseeker */}
                  {user.role === "jobseeker" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md transition"
                    >
                      <User2 size={18} /> View Profile
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 px-2 py-2 text-red-600 hover:bg-red-100 rounded-md transition"
                  >
                    <LogOut size={18} /> Logout
                  </button>

                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
