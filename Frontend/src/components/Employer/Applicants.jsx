import React, { useEffect } from 'react';
import ApplicantsTable from './ApplicantsTable';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import axiosInstance from '@/utils/axiosInstance';
import { Briefcase, Users } from 'lucide-react';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axiosInstance.get(`/application/${params.id}/applicants`);
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-[1.6rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">Employer Workspace</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Applicants</h1>
            <p className="mt-2 text-sm text-slate-500">Review the people who applied for this role and update their application status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-700/70">Total Applicants</p>
            <p className="mt-3 text-3xl font-black text-sky-700">{applicants?.applications?.length || 0}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-700/70">Hiring Pipeline</p>
            <p className="mt-3 inline-flex items-center gap-2 text-lg font-black text-indigo-700">
              <Briefcase size={18} />
              Candidate Review
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
};

export default Applicants;
