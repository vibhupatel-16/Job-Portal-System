import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const getStatusStyles = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'rejected':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'closed':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const getStatusLabel = (status) => {
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  if (status === 'closed') return 'Closed';
  return 'Pending';
};

const EmployerJobTable = () => {
  const { allEmployerJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allEmployerJobs);
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
        <TableCaption className="pt-4 text-sm text-slate-500">Your latest posted jobs and quick actions.</TableCaption>

        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Company</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Role</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Status</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Created</TableHead>
            <TableHead className="text-right text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Briefcase size={24} />
                  </div>
                  <p className="font-semibold text-slate-500">You haven't posted any jobs yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job?._id} className="border-slate-100 transition hover:bg-sky-50/40">
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{job?.company?.name}</p>
                    <p className="text-xs text-slate-400">Employer listing</p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-slate-700">{job?.title}</span>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getStatusStyles(job?.status)}`}
                  >
                    {getStatusLabel(job?.status)}
                  </span>
                </TableCell>

                <TableCell className="font-medium text-slate-600">
                  {job?.createdAt.split("T")[0].split("-").reverse().join("-")}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="rounded-xl p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700">
                      <MoreHorizontal size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-44 rounded-2xl border-slate-100 p-2 shadow-xl">
                      <button
                        onClick={() => navigate(`/employer/jobs/${job._id}`)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                      >
                        <Edit2 className="w-4" />
                        Edit Job
                      </button>
                      <button
                        onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                      >
                        <Eye className="w-4" />
                        View Applicants
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployerJobTable;
