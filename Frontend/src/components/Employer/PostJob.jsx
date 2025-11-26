import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const PostJob = () => {
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

  const { companies } = useSelector(store => store.company);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectChangeHandler = (value) => {
    const SelectedCompany = companies.find(company => company.name.toLowerCase() === value);
    setInput({ ...input, companyId: SelectedCompany?._id || "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = input;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
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
    <div>
      <Navbar/>
      <div className='flex justify-center items-center w-screen my-5'>
        <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
          <div className='grid grid-cols-2 gap-3'>

            <div>
              <Label>Title</Label>
              <Input type="text" name="title" value={input.title} onChange={changeEventHandler} className="my-1"/>
            </div>

            <div className='col-span-2'>
              <Label>Description</Label>
              <RichTextEditor value={input.description} onChange={(html) => setInput({ ...input, description: html })} />
            </div>

            <div className='col-span-2'>
              <Label>Requirements</Label>
              <RichTextEditor value={input.requirements} onChange={(html) => setInput({ ...input, requirements: html })} />
            </div>

            <div>
              <Label>Salary</Label>
              <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} className="my-1"/>
            </div>

            <div>
              <Label>Location</Label>
              <Input type="text" name="location" value={input.location} onChange={changeEventHandler} className="my-1"/>
            </div>

            <div>
              <Label>Job Type</Label>
              <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} className="my-1"/>
            </div>

            <div>
              <Label>Experience</Label>
              <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler} className="my-1"/>
            </div>

            <div>
              <Label>No. of Positions</Label>
              <Input type="number" name="position" value={input.position ?? ""} onChange={changeEventHandler} className="my-1"/>
            </div>

            {companies.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder='Select a Company'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map(company => (
                      <SelectItem key={company._id} value={company.name.toLowerCase()}>{company.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {loading ? (
            <Button className='w-full my-4'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
            </Button>
          ) : (
            <Button type="submit" className='w-full my-4 bg-[#6A38C2] hover:bg-[#4f1ea5]'>Post New Job</Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
