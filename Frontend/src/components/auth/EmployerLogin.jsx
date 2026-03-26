import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const EmployerLogin = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const { loading } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
  `${USER_API_END_POINT}/login`,
  input,
  {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  }
);

if (res.data.success) {

  // 🚫 agar admin hai to employer dashboard allow mat karo
  if (res.data.user.role !== "employer") {
    toast.error("You are not an employer");
    return;
  }

  dispatch(setUser(res.data.user));
  toast.success(res.data.message);
  navigate("/employer/dashboard");

 // redirect home or employer dashboard
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-fuchsia-50 via-purple-50/50 to-pink-50 p-4 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] p-8 sm:p-10 relative z-10'
      >
        <form onSubmit={submitHandler}>
          <div className="text-center mb-8">
            <h1 className='font-black text-3xl mb-2 text-gray-900 tracking-tight'>Employer Portal</h1>
            <p className="text-sm font-semibold text-gray-500">Log in to manage your hiring pipeline</p>
          </div>

          <div className='space-y-5'>
            <div className='space-y-2'>
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Company Email</Label>
              <Input 
                type="email" 
                value={input.email} 
                name="email" 
                onChange={changeEventHandler} 
                placeholder="hr@company.com" 
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl px-4 transition-all"
              />
            </div>

            <div className='space-y-2'>
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Password</Label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <Input 
                type="password" 
                value={input.password} 
                name="password" 
                onChange={changeEventHandler} 
                placeholder="••••••••" 
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <Button disabled className='w-full h-12 rounded-xl bg-purple-500 text-white font-bold text-sm shadow-md transition-all'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                Verifying...
              </Button>
            ) : (
              <Button type="submit" className='w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 hover:shadow-lg text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5'>
                Login as Employer
              </Button>
            )}
          </div>

          <div className='text-center mt-6'>
            <span className='text-sm text-gray-500 font-medium'>
              Don’t have an account? <Link to="/employer/signup" className='text-purple-600 font-bold hover:underline transition-all'>Create one</Link>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployerLogin;
