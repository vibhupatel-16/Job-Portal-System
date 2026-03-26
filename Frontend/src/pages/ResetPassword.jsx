import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Industry Standard Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 chars, include an uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-[2rem] p-8 sm:p-10 relative z-10'
      >
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-8">
             <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             </div>
            <h1 className="font-black text-2xl mb-2 text-gray-900 tracking-tight">Set New Password</h1>
            <p className="text-sm font-semibold text-gray-500">Secure your account with a strong password.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <div className="mt-8">
            <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5">
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
