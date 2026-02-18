import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck, Zap, Bell, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion'; // Animation ke liye
import { motion } from "framer-motion"; // Ye line add karein

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { 
            q: "How do I find jobs that match my skills?", 
            a: "Our smart AI analyzes your profile skills and matches them with active job requirements. You can see these under 'Recommended Jobs' on your dashboard or in the Jobs dropdown menu.",
            icon: <Zap className="text-yellow-500" size={20} />
        },
        { 
            q: "How can I track my job applications?", 
            a: "Go to 'Application Status' from your profile menu. You can see whether your application is 'Pending', 'Accepted', or 'Rejected' in real-time.",
            icon: <ShieldCheck className="text-green-500" size={20} />
        },
        { 
            q: "Can I see notifications while I was offline?", 
            a: "Yes! Any updates regarding your applications or new job matches are saved in your account. Just click the Bell icon (🔔) in the navbar to see all previous alerts.",
            icon: <Bell className="text-blue-500" size={20} />
        },
        { 
            q: "What should I do if my skills are not matching any jobs?", 
            a: "We recommend updating your profile with specific keywords like 'React.js', 'Node.js', or 'Tailwind CSS'. The more specific your skills, the better our recommendation engine works.",
            icon: <Search className="text-purple-500" size={20} />
        },
        { 
            q: "How do I communicate with employers?", 
            a: "Once an employer accepts your application, they may schedule an interview. You will receive an email and a notification with the meeting details or contact info.",
            icon: <MessageCircle className="text-pink-500" size={20} />
        }
    ];

    return (
        <div className="max-w-5xl mx-auto my-24 px-6">
            {/* Header Section */}
            <div className="text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 mb-4 rounded-full bg-purple-50 text-[#6A38C2] text-sm font-bold tracking-wide uppercase"
                >
                    Support Center
                </motion.div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                    Got Questions? We’ve got <span className="text-[#6A38C2]">Answers.</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                    Everything you need to know about finding your dream job and managing your applications effectively.
                </p>
            </div>

            {/* FAQ List */}
            <div className="grid gap-4">
                {faqs.map((faq, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group border rounded-2xl transition-all duration-300 ${openIndex === index ? 'border-[#6A38C2] bg-white shadow-xl' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center p-6 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-colors ${openIndex === index ? 'bg-purple-100' : 'bg-gray-50'}`}>
                                    {faq.icon}
                                </div>
                                <span className={`font-bold text-lg ${openIndex === index ? 'text-[#6A38C2]' : 'text-gray-800'}`}>
                                    {faq.q}
                                </span>
                            </div>
                            <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#6A38C2]' : 'text-gray-400'}`}>
                                <ChevronDown size={24} />
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed text-base border-t border-gray-50 ml-14">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Need More Help Footer */}
            <div className="mt-16 p-8 rounded-3xl bg-[#6A38C2] text-white text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                <p className="opacity-80 mb-6">Can't find the answer you're looking for? Please chat with our friendly team.</p>
                <button className="bg-white text-[#6A38C2] px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all active:scale-95">
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default FAQSection;