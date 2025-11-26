import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from './hooks/useGetAppliedJob';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      {/* TOP PROFILE CARD */}
      <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-md mt-10 p-8 border border-gray-200'>
        <div className='flex justify-between items-start'>
          
          {/* LEFT - Avatar + Info */}
          <div className='flex items-center gap-6'>
            <Avatar className="h-28 w-28 ring-4 ring-gray-200 shadow-md">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt="profile"
              />
            </Avatar>

            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                {user?.fullname}
              </h1>
              <p className='text-gray-600 mt-1 max-w-xl'>
                {user?.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          {/* RIGHT - Edit Button */}
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className='rounded-lg flex items-center gap-2'
          >
            <Pen size={18} /> Edit Profile
          </Button>
        </div>

        {/* CONTACT INFO */}
        <div className='mt-8 grid grid-cols-2 gap-6 text-gray-800'>
          <div className='flex items-center gap-3'>
            <Mail className='text-[#7209b7]' />
            <span className='text-lg'>{user?.email}</span>
          </div>

          <div className='flex items-center gap-3'>
            <Contact className='text-[#7209b7]' />
            <span className='text-lg'>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div className='mt-10'>
          <h1 className='text-xl font-semibold text-gray-900 mb-2'>Skills</h1>
          <div className='flex flex-wrap items-center gap-3'>
            {user?.profile?.skills?.length > 0 ? (
              user?.profile?.skills.map((skill, index) => (
                <Badge
                  key={index}
                  className='px-4 py-1 text-md bg-purple-100 text-purple-700 font-medium'
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className='text-gray-500'>No skills added</span>
            )}
          </div>
        </div>

        {/* RESUME */}
        <div className='mt-8'>
          <Label className='text-lg font-bold text-gray-800'>Resume</Label>
          <div className='mt-2'>
            {user?.profile?.resume ? (
              <a
                target='_blank'
                href={user?.profile?.resume}
                className='text-blue-600 font-medium hover:underline break-all'
              >
                📄 {user?.profile?.resumeOriginalName || "View Resume"}
              </a>
            ) : (
              <span className='text-gray-500'>No Resume Uploaded</span>
            )}
          </div>
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>

      {/* APPLIED JOB TABLE CARD */}
      <div className='max-w-5xl mx-auto mt-10 mb-20 bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
        <h1 className='text-2xl font-semibold mb-4 text-gray-900'>
          Applied Jobs
        </h1>
        <AppliedJobTable />
      </div>
    </div>
  );
};

export default Profile;
