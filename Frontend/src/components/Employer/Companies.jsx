import React from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'

const Companies = () => {
    const navigate = useNavigate();
  return (
    <div>
      <Navbar/>
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex justify-between items- my-5'>
        <Input
        className="w-fit"
        placeholder= "filterd by name"/>
        <Button onClick={()=>{navigate("/employer/companies/create")}}>New Company</Button>
        </div>
        <CompaniesTable/>
      </div>
    </div>
  )
}

export default Companies
