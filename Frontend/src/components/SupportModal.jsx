import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';

const SupportModal = ({ isOpen, onClose }) => {
    const { user } = useSelector(store => store.auth);
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("general");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        { value: "technical", label: "Technical Issue" },
        { value: "billing", label: "Billing" },
        { value: "general", label: "General Inquiry" },
        { value: "bug-report", label: "Bug Report" },
        { value: "feature-request", label: "Feature Request" }
    ];

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!message.trim()) {
            return toast.error("Please enter your message");
        }

        if (message.trim().length < 10) {
            return toast.error("Message must be at least 10 characters long");
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post('/support/create', {
                userId: user?._id,
                name: user?.fullname || "Guest User",
                email: user?.email,
                message: message.trim(),
                category: category
            });

            if (res.data.success) {
                setSubmitted(true);
                toast.success(res.data.message);
                
                setTimeout(() => {
                    setMessage("");
                    setCategory("general");
                    setSubmitted(false);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
            console.error("Support error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setMessage("");
        setCategory("general");
        setSubmitted(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 p-8 text-white relative">
                            <button 
                                onClick={handleClose} 
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <MessageSquare size={28} />
                                <h2 className="text-2xl font-black tracking-tight">Contact Support</h2>
                            </div>
                            <p className="text-orange-50 text-sm font-medium">We're here to help you</p>
                        </div>

                        {/* Success Message */}
                        {submitted && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-8 text-center bg-green-50"
                            >
                                <CheckCircle className="mx-auto mb-4 text-green-600" size={52} />
                                <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                                <p className="text-sm text-green-700">
                                    Thank you for contacting us. Our team will review your request soon.
                                </p>
                            </motion.div>
                        )}

                        {/* Form */}
                        {!submitted && (
                            <form onSubmit={submitHandler} className="p-4 sm:p-8 space-y-5">
                                {/* Name & Email Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Name</label>
                                        <input 
                                            type="text" 
                                            value={user?.fullname || "Guest"} 
                                            disabled 
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email</label>
                                        <input 
                                            type="email" 
                                            value={user?.email || "N/A"} 
                                            disabled 
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                                    <select 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-12 border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message Textarea */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        Your Message
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        rows="4"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Describe your issue or inquiry in detail..."
                                        maxLength={500}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                                    />
                                    <div className="flex justify-between items-center pt-1">
                                        <p className="text-xs text-gray-500">Minimum 10 characters required</p>
                                        <p className="text-xs text-gray-500">{message.length}/500</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {/* Help Text */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                                    <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700">
                                        Our support team typically responds within 24 hours. Check your email for our reply.
                                    </p>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SupportModal;