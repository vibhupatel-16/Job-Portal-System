import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

const skills = ["Html", "Css", "Javascript", "React"];
const isResume = true;
const Profile = () => {
  const [open, setOpen] = useState(false);
  const {user} = useSelector(store=>store.auth)
  return (
    <div>
      <Navbar/>
      <div className='max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex justify-between'>
            <div className='flex items-center gap-4'>
            <Avatar className= "h-24 w-24">
            <AvatarImage src="https://tse4.mm.bing.net/th/id/OIP.gACuT28NqAzpSrdFK9eLpgHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="profile">
            
            </AvatarImage>
            
        </Avatar>
        <div>
            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
            <p>{user?.profile?.bio} </p>
        </div>
        </div>
        <Button  onClick={()=>setOpen(true)} className='text-right' variant='outline'><Pen/></Button>
        </div>
        <div className='my-10'>
            <div className='flex items-center gap-3 my-2'>
            <Mail/>
            <span>{user?.email}</span>
            </div>
            
            <div className='flex items-center gap-3 my-2'>
            <Contact/>
            <span>{user?.phoneNumber}</span>
            </div>

        </div>
       <div className='my-5'>
         <h1>Skills</h1>
         
            <div className='flex items-center gap-2'>
             {
                 user?.profile?.skills.length != 0? user?.profile?.skills.map((item, index)=><Badge key={index}>{item}</Badge>): <span>NA</span>
             }
            </div>
           </div>
           <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Label className='text-md font-bold'>{user?.profile?.resume}</Label>
             {
                isResume ? <a target='blank' href='https://www.youtube.com/watch?v=v0_AT8zaLo8' className='text-blue-500 w-full hover:underline cursor-pointer'>Resume Link</a> : <span>NA</span>
             }
           </div>
           <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
            <h1 className='text-lg font-bold'>Applied Job</h1>
             <AppliedJobTable/>
           </div>
           <UpdateProfileDialog open={open} setOpen={setOpen}/>
      </div>
    </div>
  )
}

export default Profile
