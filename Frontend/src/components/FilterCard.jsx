import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setFilter, setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const filterdata = [
  {
    filterType: "Location",
    key: "location",
    array: ["Pune", "Bangalore", "Ahmedabad", "Baroda", "Delhi"],
  },
  {
    filterType: "Industry",
    key: "title", // IMPORTANT
    array: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "MERN Developer",
    ],
  },
  {
    filterType: "Salary",
    key: "salary",
    array: ["0-3LPA", "3-6LPA", "6-10LPA"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />

      {filterdata.map((data, index) => (
        <div key={index}>
          <h1 className="font-bold text-lg mt-3">{data.filterType}</h1>

          <RadioGroup
            onValueChange={(value) => {
              console.log("🔥 FILTER APPLIED →", data.key, value);

              // clear search
              dispatch(setSearchedQuery(""));

              // set filter
              dispatch(setFilter({ [data.key]: value }));

              // navigate safely
              setTimeout(() => {
                navigate("/browse");
              }, 80);
            }}
          >
            {data.array.map((item, i) => (
              <div className="flex items-center space-x-2 my-2" key={i}>
                <RadioGroupItem value={item} />
                <Label>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
