import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmployerJobTable from './EmployerJobTable';
import useGetAllEmployerJobs from '../hooks/useGetAllEmployerJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { Search, PlusCircle, Briefcase } from 'lucide-react';

const EmployerJobs = () => {
  useGetAllEmployerJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.6rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">Employer Workspace</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Manage Jobs</h1>
              <p className="mt-2 text-sm text-slate-500">Track your live listings, search quickly, and jump into editing or applicants in one place.</p>
            </div>
          </div>

          <Button
            className="h-12 rounded-2xl bg-sky-600 px-5 font-black shadow-sm hover:bg-sky-700"
            onClick={() => navigate("/employer/jobs/create")}
          >
            <PlusCircle size={18} className="mr-2" />
            New Job
          </Button>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none focus-visible:ring-sky-200"
                placeholder="Filter by job title or company..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <p className="text-sm text-slate-500">Manage your posted jobs and jump directly into editing or applicant review.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <EmployerJobTable />
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;
