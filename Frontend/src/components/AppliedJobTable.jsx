import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

import { Link } from "react-router-dom"; 
import { ListChecks, Clock, Calendar, Building2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);
  
  const [selectedApp, setSelectedApp] = useState(null); 
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Link 
            to="/jobseeker/interviews" 
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all font-bold text-sm"
          >
            <ListChecks size={18} />
            <span>My Interviews</span>
        </Link>
      </div>
      
      <div className="w-full overflow-hidden rounded-2xl">
        <Table>
          <TableHeader className="bg-gray-50/80 border-b border-gray-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Date Applied</TableHead>
              <TableHead className="py-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Job Details</TableHead>
              <TableHead className="py-4 text-gray-500 font-bold uppercase tracking-wider text-xs text-right">Status & Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-50/50">
            {
              allAppliedJobs?.length <= 0
                ? <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-400 font-medium tracking-wide">You haven't applied to any jobs yet.</TableCell></TableRow>
                : allAppliedJobs.map((appliedJob) => (
                  <TableRow key={appliedJob._id} className="hover:bg-indigo-50/30 transition-colors group">
                    
                    {/* DATE */}
                    <TableCell className="py-4">
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                         <div className="p-1.5 bg-gray-100 rounded-md text-gray-400"><Calendar size={14}/></div>
                         {appliedJob?.createdAt.split("T")[0].split("-").reverse().join("-") || "N/A"}
                      </span>
                    </TableCell>

                    {/* JOB & COMPANY */}
                    <TableCell className="py-4">
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm shadow-gray-100/50">
                            {appliedJob?.job?.company?.logo ? (
                              <img src={appliedJob.job.company.logo} alt="logo" className="w-6 h-6 object-contain" />
                            ) : (
                              <Building2 size={16} className="text-gray-300"/>
                            )}
                         </div>
                         <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{appliedJob?.job?.title || "Job Deleted"}</h3>
                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-1">{appliedJob?.job?.company?.name || "N/A"}</p>
                         </div>
                      </div>
                    </TableCell>

                    {/* STATUS & ACTION */}
                    <TableCell className='text-right py-4 align-top'>
                       <div className="flex flex-col items-end gap-2">
                          <Badge className={`border font-bold text-[10px] uppercase tracking-widest px-3 py-1 shadow-sm ${
                            appliedJob?.status === "rejected" ? 'bg-red-50 text-red-700 border-red-200' 
                            : appliedJob?.status === "pending" ? 'bg-orange-50 text-orange-600 border-orange-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {appliedJob?.status || "N/A"}
                          </Badge>
                          <button 
                            onClick={() => { setSelectedApp(appliedJob); setTimelineOpen(true); }}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors"
                          >
                            <Clock size={12} /> Track Full Journey
                          </button>
                       </div>
                    </TableCell>
                  
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </div>

      {/* ⭐ Timeline Modal Design */}
      <AnimatePresence>
        {timelineOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.95, y: -20, opacity: 0 }}
               transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
               className="bg-white w-full max-w-[400px] rounded-[2rem] shadow-2xl overflow-hidden relative"
            >
               {/* Header */}
               <div className="absolute top-0 right-0 p-4">
                 <button onClick={() => setTimelineOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
               </div>
               
               <div className="p-8">
                  <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6 border-b border-gray-100 pb-4">
                    Application Journey
                  </h2>
                  
                  <div className="py-2 ml-4 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-[90%] before:w-[2px] before:bg-gradient-to-b before:from-indigo-200 before:via-gray-100 before:to-transparent">
                    
                    {/* Stage 1: Always Applied */}
                    <TimelineItem 
                       title="Application Submitted" 
                       date={selectedApp?.createdAt?.split("T")[0].split("-").reverse().join("-")}
                       isCompleted={true} 
                    />

                    {/* Stages from DB */}
                    {selectedApp?.statusHistory?.map((event, i) => (
                      <TimelineItem 
                        key={i}
                        title={event.status === 'accepted' ? 'Interview Scheduled' : event.status} 
                        date={new Date(event.changedAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                        isCompleted={true}
                        isLatest={i === selectedApp.statusHistory.length - 1}
                      />
                    ))}
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TimelineItem = ({ title, date, isCompleted, isLatest }) => (
  <div className="relative pl-12 group">
    <div className={`absolute left-0 w-10 h-10 border-4 border-white rounded-full flex items-center justify-center -translate-x-1/2 shadow-sm transition-all z-10 ${isCompleted ? 'bg-indigo-600 scale-100' : 'bg-gray-100'}`}>
      <div className={`w-2 h-2 rounded-full ${isCompleted ? (isLatest ? 'bg-white animate-pulse' : 'bg-white') : 'bg-gray-400'}`}></div>
    </div>
    <div className="flex flex-col pt-1">
      <h4 className={`font-black uppercase text-[11px] tracking-widest ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
        {title}
      </h4>
      <p className="text-[10px] font-bold text-gray-500 mt-0.5">{date}</p>
    </div>
  </div>
);

export default AppliedJobTable
