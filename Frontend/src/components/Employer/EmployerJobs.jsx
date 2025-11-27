import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmployerJobTable from './EmployerJobTable';
import useGetAllEmployerJobs from '../hooks/useGetAllEmployerJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { Search, PlusCircle } from 'lucide-react';

const EmployerJobs = () => {
  useGetAllEmployerJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div className="bg-[#F8F9FC] min-h-screen">
      {/* <Navbar /> */}

      <div className="max-w-6xl mx-auto mt-10 p-6">
        
        {/* HEADER CARD */}
        <div className="bg-white shadow-xl border rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute top-3 left-3 text-gray-500" size={18} />
              <Input
                className="pl-10 h-11 rounded-xl shadow-sm"
                placeholder="Filter by job title..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Create Job Button */}
            <Button
              className="h-11 rounded-xl font-semibold flex items-center gap-2 bg-[#6A38C2] hover:bg-[#5729A6]"
              onClick={() => navigate("/employer/jobs/create")}
            >
              <PlusCircle size={20} />
              New Job
            </Button>

          </div>

          {/* Small subtitle */}
          <p className="text-gray-500 text-sm mt-3">
            Manage your posted jobs and track applicant performance
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white shadow-xl border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Your Posted Jobs</h2>
          <EmployerJobTable />
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;
