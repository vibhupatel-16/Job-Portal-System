import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "sonner";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all applications (Admin)
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/applications");
      setApplications(res.data.applications || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update application status
  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch {
      toast.error("Status update failed");
    }
  };

  // 🔹 Delete application
  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await axiosInstance.delete(`/admin/applications/${id}`);
      toast.success("Application deleted successfully");
      fetchApplications();
    } catch {
      toast.error("Failed to delete application");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl">
          <FileText className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Manage Applications</h1>
          <p className="text-gray-500 text-sm">Review and manage job applications</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No applications found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Job</th>
                <th className="p-4 text-left">Applicant</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Applied On</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {app.job?.title || "-"}
                  </td>

                  <td className="p-4 text-gray-700">
                    {app.applicant?.fullname || "-"}
                  </td>

                  {/* STATUS BADGE */}
                  <td className="p-4">
                    {app.status === "accepted" && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Accepted
                      </span>
                    )}
                    {app.status === "rejected" && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Rejected
                      </span>
                    )}
                    {app.status === "pending" && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(app._id, "accepted")}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                          >
                            <CheckCircle size={16} /> Accept
                          </button>

                          <button
                            onClick={() => updateStatus(app._id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => deleteApplication(app._id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
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

export default ManageApplications;