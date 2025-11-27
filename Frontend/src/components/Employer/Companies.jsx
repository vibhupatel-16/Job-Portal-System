import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <Navbar /> */}

      {/* PAGE CONTAINER */}
      <div className="max-w-6xl mx-auto py-10 px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Companies
          </h1>

          <Button 
            onClick={() => navigate("/employer/companies/create")}
            className="rounded-xl shadow-sm"
          >
            + New Company
          </Button>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border mb-6 flex items-center justify-between">
          <div className="w-full">
            <Input
              className="w-full rounded-xl"
              placeholder="Search company by name..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
