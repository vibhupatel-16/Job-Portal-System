import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue
} from '../ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Briefcase, Building2, MapPin, FileText, CalendarDays } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import axiosInstance from '@/utils/axiosInstance';
import useGetAllCompanies from '../hooks/useGetAllCompanies';

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    applicationDeadline: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: ""
  });

  const { companies } = useSelector(store => store.company);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load companies when component mounts
  useGetAllCompanies();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(company => company.name.toLowerCase() === value);
    setInput({ ...input, companyId: selectedCompany?._id || "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = input;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/job/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/employer/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen pb-20">
      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 mt-1">Create a job listing and attract the best candidates.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-10">

          {/* BASIC DETAILS CARD */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-purple-600" /> Job Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label>Job Title</Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="Software Developer, UI Designer..."
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

              <div>
                <Label>Job Type</Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="Full-time, Remote, Internship..."
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

              <div>
                <Label>Experience</Label>
                <Input
                  type="text"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="0-1 Yrs, 2-5 Yrs..."
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

              <div>
                <Label>No. of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="1, 2, 3..."
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

            </div>
          </div>

          {/* COMPANY CARD */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Building2 size={18} className="text-purple-600" /> Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full mt-1 h-11 rounded-lg">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map(company => (
                        <SelectItem key={company._id} value={company.name.toLowerCase()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="Ahmedabad, Remote..."
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

            </div>
          </div>

          {/* SALARY CARD */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-purple-600" /> Salary & Compensation
            </h2>

            <div className="w-full md:w-1/2">
              <Label>Salary (LPA)</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="3 LPA - 10 LPA"
                className="mt-1 h-11 rounded-lg"
              />
            </div>
          </div>

          {/* DEADLINE CARD */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <CalendarDays size={18} className="text-purple-600" /> Application Deadline
            </h2>

            <div className="w-full md:w-1/2">
              <Label>Deadline (Optional)</Label>
              <Input
                type="date"
                name="applicationDeadline"
                value={input.applicationDeadline}
                onChange={changeEventHandler}
                className="mt-1 h-11 rounded-lg"
              />
              <p className="mt-2 text-xs text-gray-500">If set, the job will auto-close after this date.</p>
            </div>
          </div>

          {/* DESCRIPTION CARD */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <FileText size={18} className="text-purple-600" /> Job Description
            </h2>

            <Label>Description</Label>
            <RichTextEditor
              value={input.description}
              onChange={(html) => setInput({ ...input, description: html })}
            />

            <Label className="mt-4">Requirements</Label>
            <RichTextEditor
              value={input.requirements}
              onChange={(html) => setInput({ ...input, requirements: html })}
            />
          </div>

          {/* SUBMIT BUTTON */}
          {loading ? (
            <Button className="w-full h-11 text-lg">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-12 text-lg rounded-xl bg-[#6A38C2] hover:bg-[#4f1ea5]"
            >
              Post New Job
            </Button>
          )}

        </form>
      </div>
    </div>
  );
};

export default PostJob;
