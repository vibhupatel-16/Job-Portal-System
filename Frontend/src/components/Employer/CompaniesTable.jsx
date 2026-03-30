import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Building2, Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterdCompany, setFilterdCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filterdCompany = companies.length >= 0 && companies.filter((company) => {
      if (!searchCompanyByText) {
        return true;
      }
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterdCompany(filterdCompany);
  }, [companies, searchCompanyByText]);

  return (
    <div>
      <Table>
        <TableCaption className="pt-4 text-sm text-slate-500">Your recently registered companies.</TableCaption>

        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Company</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Brand</TableHead>
            <TableHead className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Created</TableHead>
            <TableHead className="text-right text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterdCompany?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Building2 size={24} />
                  </div>
                  <p className="font-semibold text-slate-500">You haven't registered any company yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterdCompany?.map((company) => (
              <TableRow key={company._id} className="border-slate-100 transition hover:bg-sky-50/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-2xl border border-slate-100 bg-slate-50">
                      <AvatarImage src={company.logo} />
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-400">Company profile</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-sky-700">
                    Active
                  </span>
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  {company.createdAt.split("T")[0].split("-").reverse().join("-")}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="rounded-xl p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700">
                      <MoreHorizontal size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-40 rounded-2xl border-slate-100 p-2 shadow-xl">
                      <button
                        onClick={() => navigate(`/employer/companies/${company._id}`)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                      >
                        <Edit2 className="w-4" />
                        Edit Company
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
