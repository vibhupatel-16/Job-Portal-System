import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axiosInstance.post(
        `/user/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const meRes = await axiosInstance.get(`/user/me`);

        if (!meRes.data.success || !meRes.data.user) {
          toast.error("Login succeeded but session was not created.");
          return;
        }

        const verifiedUser = meRes.data.user;
        dispatch(setUser(verifiedUser));
        toast.success(res.data.message);

        if (verifiedUser.role === "admin") {
          navigate("/admin/panel");
          return;
        }

        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-10 relative z-10'
      >
        <form onSubmit={submitHandler}>
          <div className="text-center mb-8">
            <h1 className='font-black text-3xl mb-2 text-gray-900 tracking-tight'>Welcome Back</h1>
            <p className="text-sm font-semibold text-gray-500">Log in to your Jobseeker account</p>
          </div>

          <div className='space-y-5'>
            <div className='space-y-2'>
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="john@example.com"
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl px-4 transition-all"
              />
            </div>

            <div className='space-y-2'>
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Password</Label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="........"
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <Button disabled className='w-full h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Authenticating...
              </Button>
            ) : (
              <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold text-sm shadow-md transition-all">
                Login
              </Button>
            )}
          </div>

          <div className='flex justify-center mt-6'>
            <span className='text-sm text-gray-500 font-medium'>
              Don't have an account?{" "}
              <Link to="/signup" className='text-indigo-600 font-bold hover:underline transition-all'>
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
