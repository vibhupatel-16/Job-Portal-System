import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

import { Link } from "react-router-dom"; 
import { ListChecks } from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);

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
                  </TableCell>
                
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable
