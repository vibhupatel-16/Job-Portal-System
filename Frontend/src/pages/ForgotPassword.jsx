import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axiosInstance from '@/utils/axiosInstance'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/user/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-10 relative z-10'
      >
        <form onSubmit={submitHandler}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h1 className='font-black text-2xl mb-2 text-gray-900 tracking-tight'>Reset Password</h1>
            <p className="text-sm font-semibold text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          <div className="space-y-4">
            <div className='space-y-2'>
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registered@email.com"
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 hover:shadow-lg text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5">
              Send Reset Link
            </Button>
          </div>
          
          <div className="mt-6 text-center">
             <button type="button" onClick={() => window.history.back()} className="text-[10px] font-bold text-gray-400 hover:text-gray-800 uppercase tracking-widest transition-colors">
                &larr; Back to login
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
