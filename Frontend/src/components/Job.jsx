import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'

const job = () => {
  return (
    <div className='p-5 bg-white rounded-md border border-gray-100 shadow-xl'>
      <div className='flex items-center justify-between'>
        <p>3 days ago</p>
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
            <h1>Company Name</h1>
            <p>India</p>
        </div>
      </div>
      
    </div>
  )
}

export default job
