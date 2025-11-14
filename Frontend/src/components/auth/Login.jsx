import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/axiosInstance'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "jobseeker"
  });

  const { loading } = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axiosInstance.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {

        // 🔥 TOKEN KO LOCALSTORAGE ME SAVE KARO — most important!
        localStorage.setItem("token", res.data.token);

        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate('/');
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex justify-center items-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-sm'>
          <h1 className='font-bold text-xl mb-5 text-center'>Login</h1>

          <div className='my-2'>
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className='my-2'>
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              required
            />
          </div>

          {loading ? (
            <Button className='w-full my-4'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#4f1ea5]">
              Login
            </Button>
          )}

          <div className="text-center mt-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className='flex justify-center mt-3'>
            <span className='text-sm'>
              Don’t have an account?{" "}
              <Link to="/signup" className='text-blue-600 hover:underline'>
                Signup
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
