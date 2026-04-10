import React from 'react'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

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
                    <div 
                        key={job._id} 
                        onClick={() => navigate(`/description/${job._id}`)}
                        className='min-w-[320px] p-6 rounded-2xl shadow-sm border border-gray-100 bg-white cursor-pointer hover:shadow-lg transition-all duration-300'
                    >
                        <div className='flex items-center gap-4 mb-4'>
                            <Avatar className="h-12 w-12 border p-1">
                                <AvatarImage src={job?.company?.logo} className="object-contain" />
                            </Avatar>
                            <div className='w-full overflow-hidden'>
                                <h1 className='font-bold text-lg truncate'>{job?.title}</h1>
                                <p className='text-sm text-gray-500 truncate'>{job?.company?.name}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 text-sm text-gray-500 mb-4 font-sans'>
                             <span>📍 {job?.location}</span>
                             <span>•</span>
                             <span>💰 {job?.salary} LPA</span>
                        </div>

                        <div className='flex items-center gap-2'>
                            <Badge className={'text-blue-700 font-bold bg-blue-50'} variant="ghost">{job?.jobType}</Badge>
                            <Badge className={'text-[#F83002] font-bold bg-red-50'} variant="ghost">{job?.experienceLevel} yrs</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecommendedJobs;