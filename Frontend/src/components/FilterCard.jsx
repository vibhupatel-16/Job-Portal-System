import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

const filterdata = [
  {
    filterType: "Location",
    array: ["pune", "banglore", "Ahemedabad", "chennai", "delhi"]
  },

   {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },

   {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh-5lakh"]
  }

  
]
const FilterCard = () => {
  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3'/>
      <RadioGroup>
        {
          filterdata.map((data, index)=>(
            <div  key={index}>
              <h1 className='font-bold text-lg'>{data.filterType}</h1>
              {
                data.array.map((item, index)=>{
                  return (
                    <div className='flex items-center space-x-2 my-2' key={index}>
                      <RadioGroupItem value={item}>
                      </RadioGroupItem>
                      <Label >{item}</Label>
                    </div>
                  )
                })
              }
            </div>
          ))
        }
        </RadioGroup>    
    </div>
  )
}

export default FilterCard
