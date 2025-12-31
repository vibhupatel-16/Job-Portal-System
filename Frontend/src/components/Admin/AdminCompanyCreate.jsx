import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminCompanyCreate = () => {
  const navigate = useNavigate();

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    employerId: "",
    file: null
  });

  const loadEmployers = async () => {
    try {
      const res = await axiosInstance.get("/admin/employers");
      setEmployers(res.data.employers || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async () => {
    if (!input.companyName || !input.employerId) {
      return toast.error("Company name and employer are required");
    }

    const formData = new FormData();
    formData.append("companyName", input.companyName);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("employerId", input.employerId);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      await axiosInstance.post("/admin/companies", formData);
      toast.success("🎉 Company created successfully");
      navigate("/admin/companies");
    } catch (error) {
      toast.error("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-14 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Company
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Admin can create & assign company to employer
        </p>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <Label>Company Name</Label>
            <Input name="companyName" onChange={changeHandler} />
          </div>

          <div>
            <Label>Website</Label>
            <Input name="website" onChange={changeHandler} />
          </div>

          <div>
            <Label>Location</Label>
            <Input name="location" onChange={changeHandler} />
          </div>

          <div>
            <Label>Select Employer</Label>
            <select
              name="employerId"
              onChange={changeHandler}
              className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Employer</option>
              {employers.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.fullname} ({e.email})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input name="description" onChange={changeHandler} />
          </div>

          <div className="md:col-span-2">
            <Label>Company Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={fileHandler}
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 mt-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
          >
            Cancel
          </Button>

          <Button
            onClick={submitHandler}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {loading ? "Creating..." : "Create Company"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AdminCompanyCreate;
