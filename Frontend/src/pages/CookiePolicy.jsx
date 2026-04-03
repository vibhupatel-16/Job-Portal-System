import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, ShieldCheck, Settings, Info, ArrowLeft } from 'lucide-react';


const CookiePolicy = () => {
  const cookieDetails = [
    {
      icon: <ShieldCheck className="text-blue-600" />,
      title: "Essential Cookies",
      desc: "These are required for technical reasons, such as keeping you logged in (JWT tokens) and protecting your security."
    },
    {
      icon: <Settings className="text-purple-600" />,
      title: "Preference Cookies",
      desc: "Used to remember your settings like theme preferences or recently searched job categories."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-orange-100 rounded-full mb-6">
            <Cookie className="text-orange-600" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Cookie Policy</h1>
          <p className="text-slate-500 font-medium">How we use cookies to improve your experience at Nexforge.</p>
        </div>

        <div className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          {cookieDetails.map((item, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <Info className="text-blue-600 shrink-0" size={18} />
            <p className="text-xs text-blue-700 leading-normal">
              Note: You can disable cookies in your browser settings, but please note that our login and verification features will not work without them.
            </p>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default CookiePolicy;