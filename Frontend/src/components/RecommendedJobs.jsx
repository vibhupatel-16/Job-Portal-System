import React from 'react'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const RecommendedJobs = () => {
    const { homeJobs } = useSelector(store => store.job); 
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    if (!user) return null;

    const userSkills = user?.profile?.skills || [];
    let recommendedJobs = homeJobs?.filter(job => {
        return job.requirements.some(req => 
            userSkills.some(skill => 
                skill.trim().toLowerCase() === req.trim().toLowerCase()
            )
        );
    }).slice(0, 6);
    const displayJobs = recommendedJobs?.length > 0 ? recommendedJobs : homeJobs?.slice(0, 6);
    if (!displayJobs || displayJobs.length === 0) return null;

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <div className='flex items-center justify-between mb-5'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Recommended jobs <span className='text-[#6A38C2]'>for you</span>
                    </h1>
                    <p className='text-sm text-gray-500'>Based on your profile skills</p>
                </div>
                <Button variant="link" onClick={() => navigate("/jobs")} className="text-blue-600 font-bold font-sans">View all</Button>
            </div>
            
            <div className='flex gap-4 overflow-x-auto pb-5 no-scrollbar'>
                {displayJobs.map((job) => (
                    <motion.div 
                        key={job._id} 
                        onClick={() => navigate(`/description/${job._id}`)}
                        className='min-w-[320px] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer group'
                    >
                        <div className='flex items-center gap-4 mb-4'>
                            <Avatar className="h-12 w-12 border p-1">
                                <AvatarImage src={job?.company?.logo} className="object-contain" />
                            </Avatar>
                            <div className='w-full overflow-hidden'>
                                <h1 className='font-bold text-lg truncate group-hover:text-indigo-600 transition-colors'>{job?.title}</h1>
                                <p className='text-sm text-gray-500 truncate'>{job?.company?.name}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 text-sm text-gray-500 mb-4 font-sans'>
                             <span>📍 {job?.location}</span>
                             <span>•</span>
                             <span>{job?.experienceLevel} yrs</span>
                        </div>

                       <div className="flex flex-wrap items-center gap-2 mt-auto pb-4">
  
  <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-indigo-100 hover:text-indigo-800 transition-colors">
    {job?.position} Positions
  </Badge>

  <Badge className="bg-orange-50 text-orange-600 border border-orange-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-orange-100 hover:text-orange-700 transition-colors">
    {job?.jobType}
  </Badge>

  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
    {job?.salary} LPA
  </Badge>
</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default RecommendedJobs;