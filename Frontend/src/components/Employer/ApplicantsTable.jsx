import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, FileText, Mail, Phone, UserRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';

const shortlistingStatus = ["Shortlisted", "Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      const res = await axiosInstance.post(`/application/status/${id}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Applicant</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Contact</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Resume</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Applied On</TableHead>
            <TableHead className="text-right text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants && applicants?.applications?.length > 0 ? (
            applicants.applications.map((item) => (
              <TableRow key={item._id} className="border-slate-100 transition hover:bg-sky-50/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                      <UserRound size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item?.applicant?.fullname}</p>
                      <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} />
                        {item?.applicant?.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="text-sky-500" />
                    {item?.applicant?.phoneNumber || "NA"}
                  </span>
                </TableCell>

                <TableCell>
                  {item.applicant?.profile?.resume ? (
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await axiosInstance.post(`/user/profile/view/${item?.applicant?._id}`, {});
                        } catch (error) {
                          console.log(error);
                        }
                        window.open(item?.applicant?.profile?.resume, '_blank', 'noopener,noreferrer');
                      }}
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                    >
                      <FileText size={14} />
                      {item?.applicant?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span className="text-slate-400">NA</span>
                  )}
                </TableCell>

                <TableCell className="font-medium text-slate-600">
                  {item?.applicant?.createdAt ? new Date(item.applicant.createdAt).toLocaleDateString('en-GB') : "NA"}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="rounded-xl p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700">
                      <MoreHorizontal size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-40 rounded-2xl border-slate-100 p-2 shadow-xl">
                      {shortlistingStatus.map((status, index) => (
                        <button
                          onClick={() => statusHandler(status, item?._id)}
                          key={index}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                        >
                          {status}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-16 text-center text-slate-500">
                No applicants found for this job.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
