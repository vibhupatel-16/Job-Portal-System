import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Briefcase, Building2, MapPin, FileText } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const JobSetup = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { companies } = useSelector(store => store.company);
  const { allJobs } = useSelector(store => store.job);

  const jobData = allJobs?.find(j => j._id === params.id);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: ""
  });

useEffect(() => {
  if (jobData) {
    setInput({
      title: jobData.title || "",
      description: jobData.description || "",
      requirements: jobData.requirements?.join("<br>") || "",
      salary: jobData.salary || "",
      location: jobData.location || "",
      jobType: jobData.jobType || "",
      experience: jobData.experienceLevel || "",
      position: jobData.position || "",
      companyId: jobData.company?._id || ""
    });
  }
}, [jobData]);


  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(c => c.name.toLowerCase() === value);
    setInput({ ...input, companyId: selectedCompany?._id || "" });
  };

  const submitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formattedData = {
      ...input,
      requirements: input.requirements
        .split("<br>")
        .map(r => r.trim())
        .filter(r => r !== "")
    };

    const res = await axios.put(
      `${JOB_API_END_POINT}/update/${params.id}`,
      formattedData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    );

    if (res.data.success) {
      toast.success("Job updated successfully");
      navigate("/employer/jobs");
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
          <h1 className="text-3xl font-bold text-gray-900">Update Job</h1>
          <p className="text-gray-500 mt-1">Modify job details and update listing.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-10">

          {/* BASIC DETAILS */}
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
                  className="mt-1 h-11 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Building2 size={18} className="text-purple-600" /> Company
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-1 h-11 rounded-lg">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {companies.map(company => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
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
                  className="mt-1 h-11 rounded-lg"
                />
              </div>

            </div>
          </div>

          {/* SALARY */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-purple-600" /> Salary
            </h2>

            <div className="w-full md:w-1/2">
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="mt-1 h-11 rounded-lg"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-[#FAFAFA] p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <FileText size={18} className="text-purple-600" /> Description
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

          {/* SUBMIT */}
          {loading ? (
            <Button className="w-full h-11 text-lg">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Updating...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-12 text-lg rounded-xl bg-[#6A38C2] hover:bg-[#4f1ea5]"
            >
              Update Job
            </Button>
          )}

        </form>
      </div>
    </div>
  );
};

export default JobSetup;
