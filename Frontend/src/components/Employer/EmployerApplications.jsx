import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: "",
  });

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/employer/applications", {
        params: { status: statusFilter || undefined },
      });
      setApplications(res.data.applications || []);
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  // ================= SCHEDULE INTERVIEW =================
  const scheduleInterview = async () => {
    try {
      await axiosInstance.post("/employer/interviews", {
        applicationId: selectedApp._id,
        ...interviewData,
      });

      toast.success("Interview scheduled successfully");
      setShowInterviewModal(false);
      setInterviewData({ date: "", time: "", mode: "online", meetingLink: "" });
    } catch (err) {
      toast.error("Interview scheduling failed");
    }
  };

  const filteredApplications = applications.filter((app) =>
    app.applicant?.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex gap-4">
        <Input
          placeholder="Search applicant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Applicant</th>
              <th className="p-4 text-left">Job</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id} className="border-t">
                <td className="p-4">
                  <p className="font-medium">{app.applicant?.fullname}</p>
                  <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                </td>
                <td className="p-4">{app.job?.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${app.status === "accepted" && "bg-green-100 text-green-700"}
                    ${app.status === "rejected" && "bg-red-100 text-red-700"}
                    ${app.status === "pending" && "bg-yellow-100 text-yellow-700"}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                    View
                  </Button>

                  {app.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowInterviewModal(true);
                      }}
                    >
                      Schedule Interview
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <p className="text-center py-10 text-gray-500">No applications found</p>
        )}
      </div>

      {/* VIEW MODAL */}
      {selectedApp && !showInterviewModal && (
        <Dialog open onOpenChange={() => setSelectedApp(null)}>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <p><b>Name:</b> {selectedApp.applicant?.fullname}</p>
            <p><b>Email:</b> {selectedApp.applicant?.email}</p>
            <p><b>Job:</b> {selectedApp.job?.title}</p>

            {selectedApp.applicant?.profile?.resume && (
              <a
                href={selectedApp.applicant.profile.resume}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* INTERVIEW MODAL */}
      {showInterviewModal && (
        <Dialog open onOpenChange={() => setShowInterviewModal(false)}>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>

            <Input type="date" value={interviewData.date}
              onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
            />

            <Input type="time" value={interviewData.time}
              onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
            />

            <select
              className="border rounded-xl p-3"
              value={interviewData.mode}
              onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            {interviewData.mode === "online" && (
              <Input
                placeholder="Meeting Link"
                value={interviewData.meetingLink}
                onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
              />
            )}

            <Button onClick={scheduleInterview}>Confirm Interview</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployerApplications;