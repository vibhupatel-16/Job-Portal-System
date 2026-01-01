import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import { toast } from "sonner";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [selectedApp, setSelectedApp] = useState(null);

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/admin/applications", {
        params: {
          status: statusFilter || undefined,
          companyId: companyFilter || undefined,
        },
      });

      setApplications(res.data.applications || []);
    } catch (error) {
      toast.error("Failed to load applications");
    }
  };

  // ================= FETCH COMPANIES =================
  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get("/admin/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 FIX: reset search + refetch on filter change
  useEffect(() => {
    setSearch("");
    fetchApplications();
  }, [statusFilter, companyFilter]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================= STATUS UPDATE =================
  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch {
      toast.error("Status update failed");
    }
  };

  // ================= DELETE =================
  const deleteApplication = async (id) => {
    if (!confirm("Delete this application?")) return;

    try {
      await axiosInstance.delete(`/admin/applications/${id}`);
      toast.success("Application deleted");
      fetchApplications();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= SEARCH FILTER =================
  const filteredApplications = applications.filter(
    (app) =>
      app.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <Input
          placeholder="Search applicant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl"
        />

        {/* 🔥 FIX: value binding */}
        <select
          className="border rounded-xl p-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* 🔥 FIX: value binding */}
        <select
          className="border rounded-xl p-3"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <Button onClick={fetchApplications}>Refresh</Button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Applicant</th>
              <th className="p-4 text-left">Job</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id} className="border-t hover:bg-gray-50">

                <td className="p-4">
                  <p className="font-medium">{app.applicant?.fullname}</p>
                  <p className="text-sm text-gray-500">
                    {app.applicant?.email}
                  </p>
                </td>

                <td className="p-4">
                  {app.job?.title || "-"}
                </td>

                <td className="p-4">
                  {app.job?.company?.name || "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${app.status === "pending" && "bg-yellow-100 text-yellow-700"}
                      ${app.status === "accepted" && "bg-green-100 text-green-700"}
                      ${app.status === "rejected" && "bg-red-100 text-red-700"}
                    `}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="p-4 text-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                    View
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => updateStatus(app._id, "accepted")}
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteApplication(app._id)}
                  >
                    🗑
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <p className="text-center py-10 text-gray-500">
            No applications found
          </p>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedApp && (
        <Dialog open onOpenChange={() => setSelectedApp(null)}>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Application Details</h2>

            <p><b>Name:</b> {selectedApp.applicant?.fullname}</p>
            <p><b>Email:</b> {selectedApp.applicant?.email}</p>
            <p><b>Job:</b> {selectedApp.job?.title}</p>
            <p><b>Company:</b> {selectedApp.job?.company?.name}</p>

            {selectedApp.applicant?.profile?.resume && (
              <a
                href={selectedApp.applicant.profile.resume}
                target="_blank"
                className="text-blue-600 underline mt-2 inline-block"
              >
                View Resume
              </a>
            )}
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default ManageApplications;
