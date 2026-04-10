import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate, useLocation } from "react-router-dom";

const filterdata = [
  {
    filterType: "Location",
    key: "location",
    array: ["Pune", "Bangalore", "Ahemedabad", "Baroda"],
  },
  {
    filterType: "Category",
    key: "category",
    array: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "MERN Developer",
      "React Developer",
      "Software Engineer"
    ],
  },
  {
    filterType: "Experience",
    key: "experience",
    array: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
  },
  {
    filterType: "Job Type",
    key: "jobType",
    array: ["Full-Time", "Part-Time", "Internship", "Contract"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const location = useLocation();

  const clearAllFilters = () => {
    dispatch(setSearchedQuery(""));
    dispatch(
      setFilter({
        location: "",
        category: "",
        experience: "",
        jobType: "",
        salary: "",
      })
    );
  };

  const toggleFilterOption = (key, value) => {
    dispatch(setSearchedQuery(""));
    dispatch(setFilter({ [key]: filters[key] === value ? "" : value }));

    if (location.pathname === "/") {
      setTimeout(() => {
        navigate("/browse");
      }, 80);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-md border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        <button
          onClick={clearAllFilters}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Clear All
        </button>
      </div>
      <hr className="mt-3" />

      {filterdata.map((data, index) => (
        <div key={index} className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-bold text-base">{data.filterType}</h1>
            {filters[data.key] && (
              <button
                onClick={() => toggleFilterOption(data.key, filters[data.key])}
                className="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
              >
                Unselect
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {data.array.map((item, i) => {
              const isSelected = filters[data.key] === item;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleFilterOption(data.key, item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
