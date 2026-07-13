import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, Briefcase, MapPin, Trash2, MessageSquareText, Timer, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import FeedbackModal from './FeedbackModel';
import axiosInstance from '@/utils/axiosInstance';

const CountdownTimer = ({ targetDate, targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      let formattedDate = targetDate;
      if (targetDate && targetDate.includes('-')) {
        const parts = targetDate.split('-');
        if (parts[0].length === 2) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      const interviewDateTime = new Date(`${formattedDate} ${targetTime}`).getTime();
      const distance = interviewDateTime - now;

      if (distance < 0) {
        setTimeLeft("Meeting Finished?");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString = "";
      if (days > 0) timeString += `${days}d `;
      timeString += `${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
      <Timer size={12} className="animate-pulse" />
      <span>Starts in: {timeLeft}</span>
    </div>
  );
};

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  const fetchList = async () => {
    try {
      const res = await axiosInstance.get(`/interview/scheduled-list`);
      if (res.data.success) {
        setInterviews(res.data.interviews);
      }
    } catch (error) {
      console.error("Error fetching scheduled interviews", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleApproveReschedule = async (interviewId, newDate, newTime) => {
    try {
      const res = await axiosInstance.post(`/interview/approve-reschedule`, { interviewId, newDate, newTime });
      if (res.data.success) {
        toast.success("Interview rescheduled successfully!");
        fetchList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    }
  };

  const deleteInterview = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) return;
    try {
      const res = await axiosInstance.delete(`/interview/interview/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      }
    } catch (error) {
      toast.error("Error cancelling interview", error);
    }
  };

  const markJoinAndOpen = async (interviewId, meetingLink) => {
    try {
      await axiosInstance.post(`/interview/interview/${interviewId}/join`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not mark join attendance");
    }

    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">Employer Workspace</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Interview List</h1>
            <p className="mt-2 text-sm text-slate-500">Manage scheduled interviews, approve reschedule requests, and submit feedback from a cleaner dashboard.</p>
          </div>
          <button
            onClick={fetchList}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <RefreshCw size={16} />
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Total Interviews" value={interviews.length} tone="sky" />
          <SummaryCard label="Reschedule Requests" value={interviews.filter((item) => item.status === "reschedule_requested").length} tone="amber" />
          <SummaryCard label="Completed" value={interviews.filter((item) => item.status === "completed").length} tone="emerald" />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Candidate</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Job Role</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Date & Time</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Mode</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Meeting</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Status</TableHead>
                <TableHead className="text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((item) => (
                <TableRow key={item._id} className="border-slate-100 transition hover:bg-sky-50/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.jobseeker?.fullname || item.application?.applicant?.fullname || "Candidate Name"}</p>
                        <p className="text-xs text-slate-400">Interview candidate</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <Briefcase size={16} className="text-sky-500" />
                      <span>{item.job?.title}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <Calendar size={13} className="text-amber-500" />
                        {item.date ? (() => {
                          const parts = item.date.split('-');
                          if (parts.length === 3 && parts[0].length === 4) {
                            return `${parts[2]}-${parts[1]}-${parts[0]}`;
                          }
                          return item.date;
                        })() : "N/A"}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-slate-500">
                        <Clock size={13} className="text-amber-400" />
                        {item.time}
                      </span>
                      <CountdownTimer targetDate={item.date} targetTime={item.time} />
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={item.mode === 'online' ? "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700" : "rounded-full bg-blue-50 px-3 py-1 text-blue-700"}>
                      {item.mode.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {item.mode === "online" && item.meetingLink ? (
                      <button
                        onClick={() => markJoinAndOpen(item._id, item.meetingLink)}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                      >
                        <Video size={16} />
                        Join Meeting
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} />
                        {item.mode === 'online' ? 'Link Pending' : 'In-Person'}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge className={`${
                      item.status === 'scheduled' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      item.status === 'reschedule_requested' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    } border font-bold text-[10px] uppercase tracking-widest px-3 py-1`}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {item.status === "completed" && (
                        <button
                          onClick={() => {
                            setSelectedInterviewId(item._id);
                            setOpenFeedback(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-700 hover:shadow-md"
                        >
                          <MessageSquareText size={14} />
                          Feedback
                        </button>
                      )}

                      {item.status === 'reschedule_requested' && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left">
                          <div className="mb-2 text-[11px] font-semibold text-amber-800">
                            New Request: {item.suggestedDate} at {item.suggestedTime}
                            <br />
                            Reason: {item.rescheduleReason}
                          </div>
                          <button
                            onClick={() => handleApproveReschedule(item._id, item.suggestedDate, item.suggestedTime)}
                            className="w-full rounded-xl bg-emerald-600 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-700"
                          >
                            Approve & Update
                          </button>
                        </div>
                      )}

                      {item.scheduledByRole === 'employer' ? (
                        <button
                          onClick={() => deleteInterview(item._id)}
                          className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-slate-400">Controlled by Admin</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {interviews.length === 0 && (
            <div className="bg-slate-50 py-20 text-center text-slate-400">
              No interviews found.
            </div>
          )}
        </div>

        <FeedbackModal
          open={openFeedback}
          setOpen={setOpenFeedback}
          interviewId={selectedInterviewId}
          onFeedbackSubmit={() => fetchList()}
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, tone }) => {
  const tones = {
    sky: "from-sky-500/10 to-cyan-500/10 text-sky-700",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-700",
    emerald: "from-emerald-500/10 to-green-500/10 text-emerald-700",
  };

  return (
    <div className={`rounded-[1.75rem] border border-white/60 bg-gradient-to-br ${tones[tone]} p-5 shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
};

export default ScheduledInterviews;
