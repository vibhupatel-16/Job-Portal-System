import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion';
import axiosInstance from '@/utils/axiosInstance'

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "jobseeker", // ✅ fixed by default
    file: ""
  });
  
  const [preview, setPreview] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Industry Standard Validations
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(input.fullname.trim())) {
      return toast.error("Please enter a valid Full Name (min 3 letters, no numbers).");
    }
    if (!emailRegex.test(input.email.trim())) {
      return toast.error("Please enter a valid Email address.");
    }
    if (!phoneRegex.test(input.phoneNumber.trim())) {
      return toast.error("Phone number must be exactly 10 digits.");
    }
    if (!passwordRegex.test(input.password)) {
      return toast.error("Password must be at least 8 chars, include an uppercase, lowercase, number, and special character.");
    }

    const formdata = new FormData();
    formdata.append("fullname", input.fullname);
    formdata.append("email", input.email);
    formdata.append("phoneNumber", input.phoneNumber);
    formdata.append("password", input.password);
    formdata.append("role", input.role); // ✅ always jobseeker
    
    if (input.file) {
      formdata.append("profilePhoto", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post(`/user/register`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
       navigate('/verify-otp', { state: { email: input.email } });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tl from-indigo-50 via-white to-blue-50 p-4 sm:p-8 relative overflow-hidden py-10">
      {/* Decorative Blob */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='w-full max-w-xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] p-8 sm:p-12 relative z-10'
      >
        <form onSubmit={submitHandler}>
          <div className="text-center mb-10">
            <h1 className='font-black text-3xl mb-2 text-gray-900 tracking-tight'>Create Account</h1>
            <p className="text-sm font-semibold text-gray-500">Join our platform and find your dream job</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-2 md:col-span-2'>
              <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="John Doe"
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl px-4 transition-all"
              />
            </div>

            <div className='space-y-2 md:col-span-2'>
              <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Email</Label>
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
              <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Phone Number</Label>
              <Input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="9000000000"
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl px-4 transition-all"
              />
            </div>

            <div className='space-y-2'>
              <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••••"
                required
                minLength="8"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}"
                title="Password must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character."
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <div className='mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex flex-col items-center justify-center gap-4'>
            <div className="w-full">
              <Label className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest ml-1 mb-2 block">Upload Avatar</Label>
              <div className="relative">
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="cursor-pointer file:cursor-pointer file:bg-indigo-100 file:text-indigo-700 file:font-bold file:border-0 file:rounded-lg file:px-4 file:py-1 file:mr-4 h-12 bg-white/50 border-indigo-100 hover:border-indigo-300 transition-all rounded-xl"
                />
              </div>
            </div>
            
            {preview && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2">
                <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto" />
              </motion.div>
            )}
          </div>

          <div className="mt-8">
            {loading ? (
              <Button disabled className='w-full h-14 rounded-xl bg-indigo-500 text-white font-bold text-sm shadow-md transition-all'>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Creating Account...
              </Button>
            ) : (
              <Button type="submit" className="w-full h-14 rounded-xl bg-gray-900 hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold text-sm shadow-md transition-all">
                Sign Up
              </Button>
            )}
          </div>

          <div className='flex justify-center mt-6'>
            <span className='text-sm text-gray-500 font-medium'>
              Already have an account?{" "}
              <Link to="/login" className='text-indigo-600 font-bold hover:underline transition-all'>
                Log in
              </Link>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
