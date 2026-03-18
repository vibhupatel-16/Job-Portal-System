import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Star, CheckCircle2, Trash2, Building2, User2, Calendar } from "lucide-react";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB");
  } catch {
    return "";
  }
};

const RolePill = ({ role }) => {
  const r = (role || "").toLowerCase();
  const label = r === "employer" ? "Employer" : r === "jobseeker" ? "Job Seeker" : "User";
  const cls =
    r === "employer"
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : "bg-slate-50 text-slate-700 border-slate-100";
  return <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${cls}`}>{label}</span>;
};

const Stars = ({ rating }) => {
  const r = Math.max(1, Math.min(5, Number(rating || 5)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: r }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
};

const ManageTestimonials = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/testimonials/pending", { withCredentials: true });
      if (res.data?.success) setItems(res.data.testimonials || []);
      else setItems([]);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approve = async (id) => {
    try {
      const res = await axiosInstance.put(`/testimonials/approve/${id}`, {}, { withCredentials: true });
      if (res.data?.success) {
        toast.success(res.data.message || "Approved");
        setItems((prev) => prev.filter((x) => x._id !== id));
      } else toast.error(res.data?.message || "Approval failed");
    } catch (e) {
      toast.error(e.response?.data?.message || "Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      const res = await axiosInstance.delete(`/testimonials/delete/${id}`, { withCredentials: true });
      if (res.data?.success) {
        toast.success(res.data.message || "Rejected");
        setItems((prev) => prev.filter((x) => x._id !== id));
      } else toast.error(res.data?.message || "Reject failed");
    } catch (e) {
      toast.error(e.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-indigo-50 px-6 py-10">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
          <p className="text-sm text-gray-600 mt-1">
            Yaha <b>Employer</b> aur <b>Job Seeker</b> dono ka feedback show ho raha hai. Approve karte hi landing page par appear ho jayega.
          </p>
        </div>
        <button
          onClick={loadPending}
          className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all font-semibold text-gray-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600 font-medium">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500 font-semibold">
          No pending testimonials.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((t) => (
            <div key={t._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <RolePill role={t.role} />
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                      <Calendar className="h-4 w-4" />
                      {formatDate(t.createdAt)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">
                      {(t.user?.fullname || "U").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate flex items-center gap-2">
                        <User2 className="h-4 w-4 text-gray-400" />
                        {t.user?.fullname || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 font-semibold truncate flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {t.user?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <Stars rating={t.rating} />
              </div>

              <p className="mt-4 text-gray-700 font-medium leading-relaxed">
                “{t.content}”
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => approve(t._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Approve
                </button>
                <button
                  onClick={() => reject(t._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;

