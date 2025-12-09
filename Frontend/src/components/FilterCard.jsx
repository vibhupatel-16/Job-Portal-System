import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from "react-redux";
import { setFilter } from "@/redux/jobSlice";
import { useNavigate } from 'react-router-dom';

const filterdata = [
  { filterType: "Location", key: "location", array: ["pune", "banglore", "Ahemedabad", "Baroda"] },
  { filterType: "Industry", key: "jobType", array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Scientist"] },
  { filterType: "Salary", key: "salary", array: ["0-40k", "1lakh-8lakh", "9lakh-15lakh"] }
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3'/>

      {filterdata.map((data, index) => (
        <div key={index}>
          <h1 className='font-bold text-lg mt-3'>{data.filterType}</h1>

          {/* ⭐ Correct placement of onValueChange */}
          <RadioGroup
            onValueChange={(value) => {
              dispatch(setFilter({ [data.key]: value }));
              navigate("/browse");   // redirect to browse page
            }}
          >
            {data.array.map((item, i) => (
              <div className='flex items-center space-x-2 my-2' key={i}>
                <RadioGroupItem value={item}></RadioGroupItem>
                <Label>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )
}

export default FilterCard;
