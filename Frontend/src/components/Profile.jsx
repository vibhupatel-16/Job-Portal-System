import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from './hooks/useGetAppliedJob';
import { motion } from 'framer-motion';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const normalizedSkills = Array.isArray(user?.profile?.skills)
    ? user.profile.skills
    : typeof user?.profile?.skills === "string"
      ? user.profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 relative overflow-hidden'>
      {/* Decorative Blobs */}
      <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none"></div>

      {/* TOP PROFILE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='max-w-5xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-white/60 relative z-10'
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          
          {/* LEFT - Avatar + Info */}
          <div className='flex items-center gap-6'>
            <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
              <Avatar className="h-28 w-28 ring-4 ring-white border border-indigo-50 shadow-lg">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt="profile"
                  className="object-cover"
                />
              </Avatar>
            </motion.div>

            <div>
              <h1 className='text-3xl font-black text-gray-900 tracking-tight'>
                {user?.fullname}
              </h1>
              <p className='text-gray-500 mt-2 max-w-xl font-medium leading-relaxed'>
                {user?.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          {/* RIGHT - Edit Button */}
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className='rounded-xl flex items-center gap-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-bold transition-all shadow-sm'
          >
            <Pen size={18} /> Edit Profile
          </Button>
        </div>

        {/* CONTACT INFO */}
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800'>
          <div className='flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all'>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
               <Mail size={18} />
            </div>
            <span className='text-[15px] font-semibold text-gray-700 truncate'>{user?.email}</span>
          </div>

          <div className='flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all'>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Contact size={18} />
            </div>
            <span className='text-[15px] font-semibold text-gray-700'>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div className='mt-10'>
          <h1 className='text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2'>
             <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
             Skills Matrix
          </h1>
          <div className='flex flex-wrap items-center gap-2'>
            {normalizedSkills.length > 0 ? (
              normalizedSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className='px-4 py-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/50 font-bold rounded-xl transition-colors'
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-400 font-medium italic bg-gray-50 px-4 py-2 rounded-xl border border-dashed border-gray-200'>No skills added</span>
            )}
          </div>
        </div>

        {/* RESUME */}
        <div className='mt-10'>
          <Label className='text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-4'>
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             Resume Attachment
          </Label>
          <div className=''>
            {user?.profile?.resume ? (
              <a
                target='_blank'
                href={user?.profile?.resume}
                className='inline-flex items-center gap-3 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md px-5 py-3 rounded-2xl text-indigo-600 font-bold text-sm transition-all group'
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                {user?.profile?.resumeOriginalName || "View Resume document"}
              </a>
            ) : (
              <span className='text-sm text-gray-400 font-medium italic bg-gray-50 px-4 py-3 rounded-xl border border-dashed border-gray-200 inline-block'>No Resume Uploaded</span>
            )}
          </div>
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </motion.div>

      {/* APPLIED JOB TABLE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className='max-w-5xl mx-auto mt-8 mb-20 bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-white/60 relative z-10'
      >
        <h1 className='text-xl font-bold mb-6 text-gray-900 flex items-center gap-3'>
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
             <Briefcase size={20} />
          </div>
          Application History
        </h1>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
           <AppliedJobTable />
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
