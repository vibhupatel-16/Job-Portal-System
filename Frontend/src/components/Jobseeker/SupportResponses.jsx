import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MessageSquare, RefreshCw } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const statusStyles = {
  open: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-slate-200 text-slate-700",
};

const SupportResponses = () => {
  const user = useSelector((store) => store.auth.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/support/user/${user._id}`);
      if (res.data?.success) {
        setTickets(Array.isArray(res.data.tickets) ? res.data.tickets : []);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.log("Failed to fetch support tickets", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Support Responses</h1>
          <p className="text-sm text-gray-500 mt-1">View replies from support team for your contact requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/contact-support"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Contact Support
          </Link>
          <button
            type="button"
            onClick={fetchTickets}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading support responses...</p>
        ) : tickets.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-4">No support tickets found yet.</p>
            <Link
              to="/contact-support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Open Contact Support
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Ticket #{ticket?._id?.toString().slice(-8).toUpperCase()}
                  </p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[ticket.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold text-gray-800">Your message:</span> {ticket.message}
                </p>

                {ticket.reply ? (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Support reply</p>
                    <p className="text-sm text-indigo-900">{ticket.reply}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No response yet. Our team will reply soon.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportResponses;
