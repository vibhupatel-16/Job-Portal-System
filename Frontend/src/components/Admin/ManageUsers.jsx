import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2, Users, ShieldAlert, ShieldCheck, RefreshCw, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${id}/toggle-status`);
      toast.success(res.data.message);
      fetchUsers();
    } catch {
      toast.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.5rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500">Admin Control</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Users</h1>
              <p className="mt-2 text-sm text-slate-500">View platform members, protect admins, and control access cleanly.</p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <RefreshCw size={16} />
            Refresh Users
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Total Users" value={users.length} tone="sky" />
          <SummaryCard label="Employers" value={users.filter((u) => u.role === "employer").length} tone="emerald" />
          <SummaryCard label="Blocked Users" value={users.filter((u) => u.isBlocked).length} tone="amber" />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          {loading ? (
            <p className="py-16 text-center text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="py-16 text-center text-slate-500">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-5">Profile</th>
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">State</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="transition hover:bg-sky-50/40">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                            <UserRound size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.fullname}</p>
                            <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-500">
                              <Mail size={12} />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          u.role === "admin" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          u.isBlocked ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {u.isBlocked ? "blocked" : "active"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {u.role !== "admin" ? (
                            <>
                              <button
                                onClick={() => toggleStatus(u._id)}
                                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition ${
                                  u.isBlocked
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                }`}
                              >
                                {u.isBlocked ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                {u.isBlocked ? "Unblock" : "Block"}
                              </button>
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-700 transition hover:bg-rose-100"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold italic text-slate-500">Protected admin</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, tone }) => {
  const tones = {
    sky: "from-sky-500/10 to-cyan-500/10 text-sky-700",
    emerald: "from-emerald-500/10 to-green-500/10 text-emerald-700",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-700",
  };

  return (
    <div className={`rounded-[1.75rem] border border-white/60 bg-gradient-to-br ${tones[tone]} p-5 shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
};

export default ManageUsers;
