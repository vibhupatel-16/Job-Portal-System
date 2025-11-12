import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = () => {
const navigate = useNavigate();
const jobId = "bdvchsdmbasdmasn";
  return (
    <div className='p-5 bg-white rounded-md border border-gray-100 shadow-xl'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>3 days ago</p>
      <Button variant='outline' className="rounded-full" size="icon"><Bookmark></Bookmark>
      </Button>
      </div>
      <div className='flex items-center gap-2 my-2'>
        <Button className="p-6" variant="outline" size= "icon">
            <Avatar>
        <AvatarImage src="https://tse4.mm.bing.net/th/id/OIP.gACuT28NqAzpSrdFK9eLpgHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"></AvatarImage>

      </Avatar>
        </Button>
        <div>
            <h1 className='font-medium text-lg'>Company Name</h1>
            <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>
      <div>
        <h1 className='text-lg font-bold my-2'>Title</h1>
        <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas adipisci est nobis itaque qui laboriosam porro alias inventore ullam incidunt.</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
            <Badge className={'text-blue-700 font-bold'} variant="ghost">12 Position</Badge>
            <Badge className={'text-[#F83002] font-bold'} variant="ghost">Part Time </Badge> 
            <Badge className={'text-[#7209b7] font-bold'} variant="ghost">24LPA</Badge>  
    </div>
    <div className='flex items-center gap-4 mt-4'>
        <Button onClick={()=>navigate(`/description/${jobId}`)} variant='outline'>Details</Button>
        <Button className="bg-[#7209b7]">Save For Latter</Button>
    </div>
    </div>
  )
}

export default Job
