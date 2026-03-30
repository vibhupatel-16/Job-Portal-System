import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Building2, PlusCircle, Search } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.6rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">Employer Workspace</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Manage Companies</h1>
              <p className="mt-2 text-sm text-slate-500">Create, browse, and update your company profiles from one polished workspace.</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/employer/companies/create")}
            className="h-12 rounded-2xl bg-sky-600 px-5 font-black shadow-sm hover:bg-sky-700"
          >
            <PlusCircle size={18} className="mr-2" />
            New Company
          </Button>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none focus-visible:ring-sky-200"
              placeholder="Search company by name..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
