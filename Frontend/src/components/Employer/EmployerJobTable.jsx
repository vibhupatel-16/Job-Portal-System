import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const EmployerJobTable = () => {

    const { companies, searchCompanyByText } = useSelector(store => store.company); // default empty array
    const {allEmployerJobs, searchJobByText} = useSelector(store=>(store.job));
    const [ filterJobs, setFilterJobs] = useState(allEmployerJobs);
    const navigate = useNavigate();

    useEffect(() => {
  if (!Array.isArray(allEmployerJobs)) return;

  const filtered = allEmployerJobs.filter((job) => {
    if (!searchJobByText) return true;

    const text = searchJobByText.toLowerCase();

    return (
      job?.title?.toLowerCase().includes(text) ||
      job?.company?.name?.toLowerCase().includes(text)
    );
  });

  setFilterJobs(filtered);
}, [allEmployerJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of registered recent posted jobs</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filterJobs?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                You haven't registered any company
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterJobs?.map((job) => (
                            <TableRow key={job?._id}>
    <TableCell>{job?.company?.name}</TableCell>

    <TableCell>{job?.title}</TableCell>

    <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>

    <TableCell className="text-right cursor-pointer">
        <Popover>
            <PopoverTrigger>
                <MoreHorizontal />
            </PopoverTrigger>
            <PopoverContent className="w-32">
                <div
                    onClick={() => navigate(`/employer/companies/${job._id}`)}
                    className="flex items-center gap-2 w-fit cursor-pointer"
                >
                    <Edit2 className="w-4" />
                    <span>Edit</span>
                </div>
            </PopoverContent>
        </Popover>
    </TableCell>
</TableRow>

                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default EmployerJobTable
