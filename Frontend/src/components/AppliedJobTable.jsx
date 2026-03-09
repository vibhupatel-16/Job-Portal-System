import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

import { Link } from "react-router-dom"; 
import { ListChecks, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"; // Dialog import karein

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);
  const [selectedApp, setSelectedApp] = useState(null); // Timeline ke liye state
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <div>
      <Link 
          to="/jobseeker/interviews" 
          className="flex items-center gap-2 mt-5 mb-3 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all shadow-md"
        >
          <ListChecks size={20} />
          <span className="font-medium">My Interviews</span>
        </Link>
      <Table>
        
 
        <TableCaption>
          
          A List Of Applied Jobs
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            allAppliedJobs?.length <= 0
              ? <span>You haven't applied to any jobs</span>
              : allAppliedJobs.map((appliedJob) => (
                <TableRow key={appliedJob._id}>
                  
                  {/* DATE */}
                  <TableCell>
                    {appliedJob?.createdAt.split("T")[0].split("-").reverse().join("-") || "N/A"}
                  </TableCell>

                  {/* JOB TITLE – SAFE */}
                  <TableCell>
                    {appliedJob?.job?.title || "Job Deleted"}
                  </TableCell>

                  {/* COMPANY NAME – SAFE */}
                  <TableCell>
                    {appliedJob?.job?.company?.name || "N/A"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className='text-right'>
                    <Badge className={`${appliedJob?.status === "rejected"? 'bg-red-400': appliedJob?.status === "pending"? 'bg-gray-400': 'bg-green-400'}`}>{appliedJob?.status.toUpperCase()|| "N/A"}</Badge>
                    {/* 🕒 Timeline Button */}
                <button 
                  onClick={() => { setSelectedApp(appliedJob); setTimelineOpen(true); }}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-blue-600 border border-blue-100"
                >
                  <Clock size={16} />
                </button>
                  </TableCell>
                
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
      {/* ⭐ Timeline Modal Design */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-gray-800">
              Job Journey
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 ml-4 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
            
            {/* Stage 1: Always Applied */}
            <TimelineItem 
               title="Job Applied" 
               date={selectedApp?.createdAt?.split("T")[0].split("-").reverse().join("-")}
               isCompleted={true} 
            />

            {/* Stage 2 & 3: History from Database */}
            {selectedApp?.statusHistory?.map((event, i) => (
              <TimelineItem 
                key={i}
                title={event.status === 'accepted' ? 'Interview Scheduled' : event.status} 
               date={new Date(event.changedAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                isCompleted={true}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const TimelineItem = ({ title, date, isCompleted }) => (
  <div className="relative pl-12 group">
    <div className={`absolute left-0 w-10 h-10 border-4 border-white rounded-full flex items-center justify-center -translate-x-1/2 shadow-sm transition-all ${isCompleted ? 'bg-purple-600 scale-110' : 'bg-gray-100'}`}>
      <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-white' : 'bg-gray-400'}`}></div>
    </div>
    <div className="flex flex-col">
      <h4 className={`font-black uppercase text-[11px] tracking-widest ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
        {title}
      </h4>
      <p className="text-[10px] font-bold text-gray-400">{date}</p>
    </div>
  </div>
);

export default AppliedJobTable
