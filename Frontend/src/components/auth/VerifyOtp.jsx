import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { Loader2, MailCheck } from 'lucide-react';

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
   
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email missing. Please signup again.");
            navigate('/signup');
        }
    }, [email, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return toast.error("Please enter a 6-digit OTP");

        try {
            setLoading(true);
            const res = await axiosInstance.post('/user/verify-email', { email, otp });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl rounded-[2.5rem] p-8 sm:p-10 relative z-10'
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-lg shadow-indigo-200">
                        <MailCheck className="text-white w-8 h-8 -rotate-12" />
                    </div>
                    <h1 className="font-black text-3xl mb-2 text-gray-900 tracking-tight">Verify Email</h1>
                    <p className="text-sm font-semibold text-gray-500">
                        We've sent a 6-digit code to <br/>
                        <span className="text-indigo-600 font-bold">{email}</span>
                    </p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] ml-1">Enter OTP Code</Label>
                        <Input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="0 0 0 0 0 0"
                            className="h-14 text-center text-2xl font-black tracking-[0.5em] bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl transition-all"
                        />
                    </div>

                    <Button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-indigo-600 text-white font-bold text-base shadow-lg transition-all hover:-translate-y-1"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Activate"}
                    </Button>

                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => toast.info("New OTP sent!")}
                            className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;