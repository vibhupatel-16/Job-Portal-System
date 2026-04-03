import React, { useEffect, useState } from "react";
import { Eye, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

const ManageSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/support/all");
      if (res.data.success) {
        setTickets(res.data.tickets || []);
      } else {
        toast.error("Unable to load support tickets");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch support tickets");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/support/update/${id}`, { status });
      if (res.data.success) {
        toast.success("Status updated");
        fetchTickets();
        if (activeTicket && activeTicket._id === id) {
          setActiveTicket({ ...activeTicket, status });
        }
      }
    } catch (error) {
      toast.error("Could not update status");
    }
  };

  const sendReply = async (ticketId) => {
    if (!replyText.trim()) {
      toast.error("Please type a reply message.");
      return;
    }

    setReplying(true);
    try {
      const res = await axiosInstance.put(`/support/update/${ticketId}`, {
        reply: replyText,
        status: "in-progress"
      });
      if (res.data.success) {
        toast.success("Reply sent and user notified!");
        setReplyText("");
        setActiveTicket(null);
        fetchTickets();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Support Tickets</h1>
            <p className="text-sm text-slate-500">Review incoming requests from users and reply from ticket details.</p>
          </div>
          <button
            onClick={fetchTickets}
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400">Total Tickets</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{tickets.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400">Open</p>
            <p className="mt-2 text-3xl font-black text-orange-600">{tickets.filter(t => t.status === "open").length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400">Resolved</p>
            <p className="mt-2 text-3xl font-black text-emerald-600">{tickets.filter(t => t.status === "resolved").length}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center text-slate-500">Loading support tickets...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan="7" className="py-12 text-center text-slate-500">No support tickets found</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{ticket.name || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{ticket.email || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{ticket.category}</td>
                    <td className="px-6 py-4 text-slate-600">{ticket.priority}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${ticket.status === "open" ? "bg-orange-50 text-orange-600" : ticket.status === "resolved" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTicket(ticket);
                            setReplyText(ticket.reply || "");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100"
                        ><Eye size={14}/>View</button>
                        {ticket.status !== "resolved" && (
                          <button
                            onClick={() => updateStatus(ticket._id, "resolved")}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                          ><CheckCircle2 size={14}/>Resolve</button>
                        )}
                        {ticket.status !== "closed" && (
                          <button
                            onClick={() => updateStatus(ticket._id, "closed")}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
                          ><XCircle size={14}/>Close</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {activeTicket && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-xl font-black text-slate-900">Ticket Detail</h2>
              <button onClick={() => setActiveTicket(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100">Close</button>
            </div>

            <div className="grid gap-2 md:grid-cols-2 mb-4">
              <p className="text-sm text-slate-500"><span className="font-bold">Name:</span> {activeTicket.name}</p>
              <p className="text-sm text-slate-500"><span className="font-bold">Email:</span> {activeTicket.email}</p>
              <p className="text-sm text-slate-500"><span className="font-bold">Category:</span> {activeTicket.category}</p>
              <p className="text-sm text-slate-500"><span className="font-bold">Priority:</span> {activeTicket.priority}</p>
              <p className="text-sm text-slate-500"><span className="font-bold">Status:</span>
                <span className={`ml-2 rounded-full px-2 py-1 text-xs font-bold uppercase ${activeTicket.status === "open" ? "bg-orange-50 text-orange-600" : activeTicket.status === "resolved" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"}`}>
                  {activeTicket.status}
                </span>
              </p>
              <p className="text-sm text-slate-500"><span className="font-bold">Created:</span> {new Date(activeTicket.createdAt).toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-700 mb-2">User Message</h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{activeTicket.message}</div>
            </div>

            {activeTicket.reply && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-emerald-700 mb-2">Existing Reply</h3>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{activeTicket.reply}</div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Reply to User</h3>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => sendReply(activeTicket._id)}
                disabled={replying || !replyText.trim()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replying ? "Sending..." : "Send Reply and Notify"}
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => updateStatus(activeTicket._id, "resolved")} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Mark Resolved</button>
              <button onClick={() => updateStatus(activeTicket._id, "closed")} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">Close Ticket</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSupportTickets;
