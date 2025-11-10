import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup} from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [input, setInput] = useState({
      fullname:"",
      email:"",
      phoneNumber:"",
      password:"",
      role:"",
      file:""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {loading} = useSelector(store=> store.auth)
    const changeEventHandler = (e)=>{
      setInput({...input, [e.target.name]: e.target.value});
    }
    const changeFileHandler = (e)=>{
      setInput({...input, file:e.target.files?.[0]});
    }
    const submitHandler = async (e) =>{
      e.preventDefault();
      // console.log(input);
      const formdata = new FormData();
      formdata.append("fullname", input.fullname);
      formdata.append("email", input.email);
      formdata.append("phoneNumber", input.phoneNumber);
      formdata.append("password", input.password);
      formdata.append("role", input.role);
      if(input.file){
        formdata.append("file", input.file);
      }
      try{
        dispatch(setLoading(true))
        const res = await axios.post(`${USER_API_END_POINT}/register`, formdata, {
          headers:{
            "Content-Type":"multipart/form-data"
          },
          withCredentials:true,
        });
        if(res.data.success){
          navigate('/login');
          toast.success(res.data.message);
        }
      }catch (error){

        console.log(error);
        toast.error(error.response.data.message);
      }finally{
        dispatch(setLoading(false))
      }
     }
  return (
    <div>
      <Navbar/>
      <div className='flex justify-center items-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
            <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
            <div className='my-2'>
                <Label>Full Name</Label>
                <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange = {changeEventHandler}
                placeholder="fullname"/>
            </div>
            <div className='my-2'>
                <Label>Email</Label>
                <Input
                type="email"
                value={input.email}
                name="email"
                onChange = {changeEventHandler}
                placeholder="Email"/>
            </div>
            <div className='my-2'>
                <Label>Phone Number</Label>
                <Input
                type="text"
                value={input.phoneNumber}
                name = "phoneNumber"
                onChange = {changeEventHandler}
                placeholder="900000000"/>
            </div>
            <div className='my-2'>
                <Label>Password</Label>
                <Input
                type="password"
                value={input.password}
                name = "password"
                onChange = {changeEventHandler}
                placeholder="123@hello"/>
            </div>
            <div className='flex items-center justify-between'>
              <RadioGroup className="flex item-center gap-4 my-3">
  <div className="flex items-center space-x-2">
    <Input
      type="radio"
      name="role"
      value="employer"
      checked = {input.role === 'employer'}
      onChange = {changeEventHandler}
      className="cursor-pointer" />
    <Label htmlFor="option-one">Employer</Label>
  </div>
  <div className="flex items-center space-x-2">
    <Input
      type="radio"
      name="role"
      value="jobseeker"
      checked = {input.role === 'jobseeker'}
      onChange = {changeEventHandler}
      className="cursor-pointer" />
    <Label htmlFor="option-two">JobSeeker</Label>
  </div>
</RadioGroup>
<div className='flex items-center gap-2'>
    <Label>Profile</Label>
    <Input
    accept="image/*"
    type = "file"
    onChange = {changeFileHandler}
    className = "cursor-pointer"
    />
    </div>  
            </div>
            {
              loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>Please Wait</Button>:<Button type="submit" className="w-full my-4">Sign up</Button>

            }
           
            <span className='text-sm content-center'>Already have an account?<Link to= "/login" className='text-blue-600'>Login</Link></span>
        </form>
      </div>
    </div>
  )
}

export default Signup
