import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Building2, Trash2, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 filters
  const [searchCompany, setSearchCompany] = useState("");
  const [searchEmployer, setSearchEmployer] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const navigate = useNavigate();

  // FETCH
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/companies");
      setCompanies(res.data.companies || []);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteCompany = async (id) => {
    if (!confirm("Delete this company?")) return;

    try {
      await axiosInstance.delete(`/admin/companies/${id}`);
      toast.success("Company deleted");
      fetchCompanies();
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredCompanies = companies.filter((c) => {
    const companyMatch = c.name
      ?.toLowerCase()
      .includes(searchCompany.toLowerCase());

    const employerMatch = c.userId?.fullname
      ?.toLowerCase()
      .includes(searchEmployer.toLowerCase());

    const locationMatch = c.location
      ?.toLowerCase()
      .includes(searchLocation.toLowerCase());

    return companyMatch && employerMatch && locationMatch;
  });

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

        <button
          onClick={() => navigate("/admin/companies/create")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Company
        </button>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            placeholder="Search company name"
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
            onChange={(e) => setSearchCompany(e.target.value)}
          />
        </div>

        <input
          placeholder="Filter by employer name"
          className="w-full px-4 py-2 border rounded-xl"
          onChange={(e) => setSearchEmployer(e.target.value)}
        />

        <input
          placeholder="Filter by location"
          className="w-full px-4 py-2 border rounded-xl"
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : filteredCompanies.length === 0 ? (
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
              {filteredCompanies.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.location || "-"}</td>

                  <td className="p-4">
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Visit
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4">
                    {c.userId?.fullname || "-"}
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/companies/update/${c._id}`)
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => deleteCompany(c._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg"
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
