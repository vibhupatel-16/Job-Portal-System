import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

const AdminCompanyUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    employerId: "",
    file: null,
  });

  // 🔹 Load company + employers
  useEffect(() => {
    const loadData = async () => {
      try {
        const [companyRes, employerRes] = await Promise.all([
          axiosInstance.get(`/admin/companies/${id}`),
          axiosInstance.get("/admin/employers"),
        ]);

        const company = companyRes.data.company;

        setInput({
          name: company.name || "",
          description: company.description || "",
          website: company.website || "",
          location: company.location || "",
          employerId: company.userId?._id || company.userId,
          file: null,
        });

        setLogoPreview(company.logo || "");
        setEmployers(employerRes.data.employers || []);
      } catch (error) {
        console.log("LOAD ERROR 👉", error);
        toast.error("Failed to load company data");
      }
    };

    loadData();
  }, [id]);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, file });
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async () => {
    console.log("SUBMIT HANDLER CALLED");

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("employerId", input.employerId);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      await axiosInstance.put(`/admin/companies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Company updated successfully");
      navigate("/admin/companies");
    } catch (error) {
      console.log("UPDATE ERROR 👉", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to update company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-14 px-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/companies")}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Update Company
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white border shadow-xl rounded-2xl p-10">

        {/* ✅ FORM START */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <Label>Company Name</Label>
              <Input
                name="name"
                value={input.name}
                onChange={changeHandler}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                name="website"
                value={input.website}
                onChange={changeHandler}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                onChange={changeHandler}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeHandler}
                className="mt-2"
              />
            </div>

            {/* Employer */}
            <div className="md:col-span-2">
              <Label>Assigned Employer</Label>
              <select
                name="employerId"
                value={input.employerId}
                onChange={changeHandler}
                className="w-full mt-2 border rounded-xl p-3"
              >
                <option value="">Select Employer</option>
                {employers.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.fullname} ({e.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Logo */}
            <div className="md:col-span-2">
              <Label>Company Logo</Label>

              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={fileHandler}
                />

                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-10">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/companies")}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                "Update Company"
              )}
            </Button>
          </div>
        </form>
        {/* ✅ FORM END */}

      </div>
    </div>
  );
};

export default AdminCompanyUpdate;
