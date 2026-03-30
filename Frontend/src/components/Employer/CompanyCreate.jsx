import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import axiosInstance from '@/utils/axiosInstance';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    const trimmedName = companyName.trim();

    if (!trimmedName) {
      toast.error("Company name is required");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/company/register`,
        { companyName: trimmedName },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (res?.data?.success) {
        toast.success(res.data.message);
        dispatch(setSingleCompany(res.data.company));
        navigate(`/employer/companies/${res?.data?.company?._id}`);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="max-w-3xl mx-auto mt-16 p-6">
        {/* CARD */}
        <div className="bg-white shadow-xl border rounded-2xl p-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-bold text-3xl mb-2">Create New Company</h1>
            <p className="text-gray-500 text-sm tracking-wide">
              Enter the company name you'd like to register.  
              You can always update this later.
            </p>
          </div>

          {/* Input */}
          <div>
            <Label className="font-semibold text-sm">Company Name</Label>
            <Input
              type="text"
              placeholder="Example: JobHunt, Microsoft, TCS..."
              className="mt-2 h-12 rounded-xl text-base shadow-sm"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-xl"
              onClick={() => navigate("/employer/companies")}
            >
              Cancel
            </Button>

            <Button
              className="px-6 py-2 rounded-xl"
              onClick={registerNewCompany}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyCreate;
