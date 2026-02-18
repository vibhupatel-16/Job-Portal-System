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
  const [bookedSlots, setBookedSlots] = useState([]);
const standardSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/employer/applications", {
        params: { status: statusFilter || undefined },
      });
      setApplications(res.data.applications || []);
    } catch (err) {
      toast.error("Failed to load applications", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setInterviewData({ ...interviewData, date: selectedDate });

    try {
        // Backend se busy slots mangwayein
        const res = await axiosInstance.get(`${INTERVIEW_API_END_POINT}/booked-slots?date=${selectedDate}`);
        if (res.data.success) {
            setBookedSlots(res.data.bookedTimes);
        }
    } catch (error) {
        console.error("Error fetching slots", error);
    }
};

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
      toast.error("Interview scheduling failed", err);
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
    {/* INTERVIEW MODAL - Replace your old block with this */}
{showInterviewModal && (
    <Dialog open onOpenChange={() => setShowInterviewModal(false)}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-8 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Schedule Interview</h2>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Select a convenient time slot</p>
            </div>

            <div className="space-y-6">
                {/* Date Picker */}
                <div className="group">
                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em] ml-1 mb-2 block">1. Choose Date</label>
                    <div className="relative">
                        <Input 
                            type="date" 
                            value={interviewData.date}
                            onChange={handleDateChange} 
                            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all focus:ring-4 focus:ring-purple-100 border-none shadow-sm"
                        />
                    </div>
                </div>

                {/* Slots Grid UI */}
                {interviewData.date ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em] ml-1 mb-3 block">2. Available Slots</label>
                        <div className="grid grid-cols-3 gap-3">
                            {standardSlots.map((slot) => {
                                const isBusy = bookedSlots.includes(slot);
                                const isSelected = interviewData.time === slot;
                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => setInterviewData({ ...interviewData, time: slot })}
                                        className={`relative group p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                                            isBusy 
                                            ? "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed opacity-50" 
                                            : isSelected 
                                                ? "bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-200 scale-95" 
                                                : "bg-white border-gray-50 text-gray-600 hover:border-purple-200 hover:shadow-md"
                                        }`}
                                    >
                                        <span className="text-[11px] font-black">{slot}</span>
                                        <span className={`text-[8px] font-bold uppercase tracking-tighter ${isBusy ? 'text-red-300' : isSelected ? 'text-purple-200' : 'text-green-500'}`}>
                                            {isBusy ? "Booked" : "Free"}
                                        </span>
                                        {isSelected && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600 animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select a date to see slots</p>
                    </div>
                )}

                {/* Mode & Submit */}
                <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center gap-3 p-1 bg-gray-100 rounded-2xl">
                        <button 
                            onClick={() => setInterviewData({...interviewData, mode: 'online'})}
                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${interviewData.mode === 'online' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                        >Online</button>
                        <button 
                            onClick={() => setInterviewData({...interviewData, mode: 'offline'})}
                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${interviewData.mode === 'offline' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                        >Offline</button>
                    </div>

                    <Button 
                        disabled={!interviewData.time || !interviewData.date}
                        className="w-full h-14 rounded-[1.5rem] bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100 font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:bg-gray-200"
                        onClick={scheduleInterview}
                    >
                        Confirm Appointment
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
)}
    </div>
  );
};

export default EmployerApplications;