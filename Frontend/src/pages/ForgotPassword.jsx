import React, { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="flex justify-center items-center max-w-7xl mx-auto">
        <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
          <h1 className="font-bold text-xl mb-5">Forgot Password</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="focus:ring-0 focus:border-gray-300"
            />
          </div>
          <Button type="submit" className="w-full my-4">Send Reset Link</Button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
