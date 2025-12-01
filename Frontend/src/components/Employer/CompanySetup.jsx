import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import useGetCompanyById from '../hooks/useGetCompanyById';
import { setSingleCompany } from '@/redux/companySlice'; // Redux action to update company

const CompanySetup = () => {
  const params = useParams();
  const dispatch = useDispatch();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // Submit updated company
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Update Redux state with new company data
        dispatch(setSingleCompany(res.data.company));
        navigate("/employer/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Sync input state with singleCompany from Redux
  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  return (
    <div>
      {/* <Navbar /> */}

      <div className="max-w-3xl mx-auto mt-12 p-6">
        <div className="bg-white shadow-xl border rounded-2xl p-10">

          {/* Top Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/employer/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft size={18} />
              Back
            </Button>

            <h1 className="font-bold text-2xl">Company Setup</h1>
          </div>

          <form onSubmit={submitHandler}>

            {/* GRID FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <Label className="font-semibold">Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="mt-2 h-11 rounded-xl shadow-sm"
                />
              </div>

              <div>
                <Label className="font-semibold">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="mt-2 h-11 rounded-xl shadow-sm"
                />
              </div>

              <div>
                <Label className="font-semibold">Website</Label>
                <Input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="mt-2 h-11 rounded-xl shadow-sm"
                />
              </div>

              <div>
                <Label className="font-semibold">Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="mt-2 h-11 rounded-xl shadow-sm"
                />
              </div>

              {/* LOGO UPLOAD */}
              <div className="col-span-2">
                <Label className="font-semibold">Company Logo</Label>

                <div className="mt-2 flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="cursor-pointer h-11 rounded-xl shadow-sm"
                  />

                  {/* Preview: show new file if selected, otherwise current logo */}
                  {input.file ? (
                    <img
                      src={URL.createObjectURL(input.file)}
                      alt="preview"
                      className="w-14 h-14 rounded-xl object-cover border shadow-sm"
                    />
                  ) : singleCompany?.logo ? (
                    <img
                      src={`${singleCompany.logo}?t=${new Date().getTime()}`}
                      alt="Company Logo"
                      className="w-14 h-14 rounded-xl object-cover border shadow-sm"
                    />
                  ) : null}
                </div>
              </div>

            </div>

            {/* Submit Button */}
            {loading ? (
              <Button className="w-full mt-10 h-12 rounded-xl text-lg">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full mt-10 h-12 rounded-xl text-lg bg-[#6A38C2] hover:bg-[#5729a6]"
              >
                Update Company
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
