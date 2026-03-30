import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Building2, Trash2, Pencil, Plus, Search, MapPin, Globe, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCompany, setSearchCompany] = useState("");
  const [searchEmployer, setSearchEmployer] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

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

  const filteredCompanies = companies.filter((c) => {
    const companyMatch = c.name?.toLowerCase().includes(searchCompany.toLowerCase());
    const employerMatch = c.userId?.fullname?.toLowerCase().includes(searchEmployer.toLowerCase());
    const locationMatch = c.location?.toLowerCase().includes(searchLocation.toLowerCase());
    return companyMatch && employerMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.5rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500">Admin Control</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Companies</h1>
              <p className="mt-2 text-sm text-slate-500">Organize employers and company profiles with a cleaner admin view.</p>
            </div>
          </div>
          <button onClick={() => navigate("/admin/companies/create")} className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-sky-700">
            <Plus size={18} />
            Add Company
          </button>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input placeholder="Search company name" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-sky-300 focus:bg-white" onChange={(e) => setSearchCompany(e.target.value)} />
            </div>
            <input placeholder="Filter by employer name" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-300 focus:bg-white" onChange={(e) => setSearchEmployer(e.target.value)} />
            <input placeholder="Filter by location" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-300 focus:bg-white" onChange={(e) => setSearchLocation(e.target.value)} />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          {loading ? (
            <p className="py-16 text-center text-slate-500">Loading...</p>
          ) : filteredCompanies.length === 0 ? (
            <p className="py-16 text-center text-slate-500">No companies found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-5">Company</th>
                    <th className="px-6 py-5">Location</th>
                    <th className="px-6 py-5">Website</th>
                    <th className="px-6 py-5">Employer</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map((c) => (
                    <tr key={c._id} className="transition hover:bg-sky-50/40">
                      <td className="px-6 py-5 font-bold text-slate-900">{c.name}</td>
                      <td className="px-6 py-5">
                        <p className="inline-flex items-center gap-2 text-slate-600">
                          <MapPin size={14} className="text-sky-500" />
                          {c.location || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        {c.website ? (
                          <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:underline">
                            <Globe size={14} />
                            Visit
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <p className="inline-flex items-center gap-2 text-slate-600">
                          <UserRound size={14} className="text-sky-500" />
                          {c.userId?.fullname || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/admin/companies/update/${c._id}`)} className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-sky-700 transition hover:bg-sky-100">
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button onClick={() => deleteCompany(c._id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-700 transition hover:bg-rose-100">
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
