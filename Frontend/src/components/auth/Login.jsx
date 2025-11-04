import React from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup} from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex justify-center items-center max-w-7xl mx-auto'>
        <form action="" className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
            <h1 className='font-bold text-xl mb-5'>Login</h1>
     
            <div className='my-2'>
                <Label>Email</Label>
                <Input
                type="email"
                placeholder="Email"/>
            </div>
       
            <div className='my-2'>
                <Label>Password</Label>
                <Input
                type="password"
                placeholder="123"/>
            </div>
            <div className='flex items-center justify-between'>
              <RadioGroup className="flex item-center gap-4 my-3">
  <div className="flex items-center space-x-2">
    <Input
      type="radio"
      name="role"
      value="employer"
      className="cursor-pointer" />
    <Label htmlFor="option-one">Employer</Label>
  </div>
  <div className="flex items-center space-x-2">
    <Input
      type="radio"
      name="role"
      value="jobseeker"
      className="cursor-pointer" />
    <Label htmlFor="option-two">JobSeeker</Label>
  </div>
</RadioGroup>
  
            </div>
            <Button type="submit" className="w-full my-4">Login</Button>
            <span className='text-sm '>Don't have an account?<Link to= "/signup" className='text-blue-600'>Signup</Link></span>
        </form>
      </div>
    </div>
  )
}

export default Login
