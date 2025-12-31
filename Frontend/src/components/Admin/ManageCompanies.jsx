import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Building2, Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch all companies (ADMIN)
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete company
  const deleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      await axiosInstance.delete(`/admin/companies/${id}`);
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Building2 className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manage Companies</h1>
            <p className="text-gray-500 text-sm">
              Admin can create, update and manage companies
            </p>
          </div>
        </div>

        {/* ➕ ADD COMPANY */}
        <button
          onClick={() => navigate("/admin/companies/create")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Company
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No companies found
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Website</th>
                <th className="p-4 text-left">Employer</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{c.name}</td>

                  <td className="p-4 text-gray-700">
                    {c.location || "-"}
                  </td>

                  <td className="p-4 text-gray-700">
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Visit
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4 text-gray-700">
                    {c.userId?.fullname || "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex justify-center gap-2">
                    {/* ✏️ UPDATE */}
                    <button
                      onClick={() =>
                        navigate(`/admin/companies/update/${c._id}`)
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    {/* 🗑 DELETE */}
                    <button
                      onClick={() => deleteCompany(c._id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCompanies;
