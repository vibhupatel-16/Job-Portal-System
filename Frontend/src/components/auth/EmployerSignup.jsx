import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const EmployerSignup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    profilePhoto: ""
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
    setInput({ ...input, profilePhoto: file });
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    formdata.append("role", "employer"); // ✅ Fixed role
    if (input.profilePhoto) {
      formdata.append("profilePhoto", input.profilePhoto);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate('/employer-login'); // ✅ Employer login page par jaayega
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className='flex justify-center items-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-5 text-center'> Sign Up</h1>

          <div className='my-2'>
            <Label>Full Name</Label>
            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Full Name" />
          </div>

          <div className='my-2'>
            <Label>Email</Label>
            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="Email" />
          </div>

          <div className='my-2'>
            <Label>Phone Number</Label>
            <Input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="900000000" />
          </div>

          <div className='my-2'>
            <Label>Password</Label>
            <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="Password" />
          </div>

          <div className='flex items-center gap-2 my-3'>
           <Label>Profile</Label>
            <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer" />
          </div>

          {preview && (
            <div className="flex justify-center mb-4">
              <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-sm" />
            </div>
          )}

          {loading ? (
            <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait</Button>
          ) : (
            <Button type="submit" className='w-full my-4'>Sign Up</Button>
          )}

          <div className='text-center mt-2'>
            <span className='text-sm'>
              Already have an account? <Link to="/employer-login" className='text-blue-600 hover:underline'>Login</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerSignup;
