import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '@/utils/axiosInstance'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({open, setOpen}) => {
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=> store.auth);

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => skill?.toString().trim()).filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  return [];
};

const initialSkills = normalizeSkills(user?.profile?.skills);

const [input, setInput] = useState({
  fullname: user?.fullname || "",
  email: user?.email || "",
  phoneNumber: user?.phoneNumber || "",
  bio: user?.profile?.bio || "",
  skills: initialSkills.join(", "),
  file: null
});
const [skillInput, setSkillInput] = useState("");
const [skillsList, setSkillsList] = useState(initialSkills);
const [phoneError, setPhoneError] = useState("");

    const dispatch = useDispatch();

    const changeEventHandler = (e)=> {
        if (e.target.name === "phoneNumber") {
          const rawValue = e.target.value;
          const digitsOnly = rawValue.replace(/\D/g, "");
          const limitedDigits = digitsOnly.slice(0, 10);

          if (rawValue !== digitsOnly) {
            setPhoneError("Only numbers are allowed.");
          } else if (digitsOnly.length > 10) {
            setPhoneError("Phone number cannot be more than 10 digits.");
          } else if (limitedDigits.length > 0 && limitedDigits.length < 10) {
            setPhoneError("Phone number must be exactly 10 digits.");
          } else {
            setPhoneError("");
          }

          setInput({ ...input, phoneNumber: limitedDigits });
          return;
        }

        setInput({...input, [e.target.name]: e.target.value});
    }

    const fileChangeHandler = (e)=>{
        const file = e.target.files?.[0];
        setInput({...input, file})
    }

    const addSkill = () => {
      const nextSkill = skillInput.trim();
      if (!nextSkill) return;
      if (skillsList.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())) {
        setSkillInput("");
        return;
      }
      const updatedSkills = [...skillsList, nextSkill];
      setSkillsList(updatedSkills);
      setInput((prev) => ({ ...prev, skills: updatedSkills.join(", ") }));
      setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
      const updatedSkills = skillsList.filter((skill) => skill !== skillToRemove);
      setSkillsList(updatedSkills);
      setInput((prev) => ({ ...prev, skills: updatedSkills.join(", ") }));
    };

    const skillKeyDownHandler = (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addSkill();
      }
    };

    const submitHandler = async (e)=>{
        e.preventDefault();
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(input.phoneNumber.trim())) {
          return toast.error("Phone number must be exactly 10 digits.");
        }
        if (phoneError) {
          return toast.error(phoneError);
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if(input.file){
            formData.append("file", input.file);
        }
        if (input.profilePhoto) {
  formData.append("profilePhoto", input.profilePhoto);
}

        try {
          setLoading(true)
  const res = await axiosInstance.post(`/user/profile/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  console.log("Response from backend:", res.data); 

  if (res.data.success) {
    dispatch(setUser(res.data.user));
    toast.success(res.data.message);
  }

} catch (error) {
  console.log(error.response?.data || error.message);
  toast.error(error.response?.data?.message || "Something went wrong");
}
finally{
  setLoading(false);
}

console.log("Updated input data:", input); 
setOpen(false);

    }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={()=> setOpen(false)}>
            <DialogTitle>Update Profile</DialogTitle>
  <DialogDescription>Update your profile details below.</DialogDescription>
            <form onSubmit={submitHandler}>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="fullname" className="text-right">Name</Label>
                    <Input id="fullname"
                    name = "fullname"
                    type = "text"
                    value = {input.fullname}
                    onChange = {changeEventHandler}
                    className= "col-span-3"/>
                 </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email"
                    name = "email"
                    type = "email"
                    value = {input.email}
                    onChange = {changeEventHandler}
                    className= "col-span-3"/>
                 </div>

                 <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="phoneNumber" className="text-right">Number</Label>
                    <Input id="phoneNumber"
                    name = "phoneNumber"
                    value = {input.phoneNumber}
                    onChange = {changeEventHandler}
                    inputMode="numeric"
                    maxLength={10}
                    className= "col-span-3"/>
                    {phoneError && (
                      <p className="col-span-4 text-right text-xs text-red-600 font-medium">{phoneError}</p>
                    )}
                 </div>

                 <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="bio" className="text-right">Bio</Label>
                    <textarea id="bio"
                    name = "bio"
                    value = {input.bio}
                    onChange = {changeEventHandler}
                    rows={3}
                    className= "col-span-3 min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"/>
                 </div>

                 <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="skills" className="text-right">Skills</Label>
                    <Input id="skills"
                    name="skillInput"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={skillKeyDownHandler}
                    placeholder="Type a skill and press Enter"
                    className= "col-span-3"/>
                 </div>
                 {skillsList.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="text-right text-sm text-muted-foreground">Added</span>
                    <div className="col-span-3 flex flex-wrap gap-2">
                      {skillsList.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="text-indigo-700 hover:text-indigo-900">
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                 )}
                   
                   <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="file" className="text-right">Resume</Label>
                    <Input id="file"
                    name = "file"
                    type="file"
                    accept= "application/pdf"
                    onChange = {fileChangeHandler}
                    className= "col-span-3"/>
                 </div>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
                <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) =>
                setInput({ ...input, profilePhoto: e.target.files?.[0] })
                }
                 className="col-span-3"/>
                </div>

                <DialogFooter>
                   {
              loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>Please Wait</Button>:<Button type="submit" className="w-full my-4">update</Button>

            }
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProfileDialog
