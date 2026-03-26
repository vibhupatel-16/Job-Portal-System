import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2, Briefcase, Bell, Calendar, Bookmark, ChevronDown, HelpCircle, PlusCircle, Building2, ListChecks } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT, INTERVIEW_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { socket } from '@/App';

function Navbar() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const res = await axios.get(`${INTERVIEW_API_END_POINT}/notifications`, { withCredentials: true });
                    if (res.data.success) {
                        setNotifications(res.data.notifications);
                        const unread = res.data.notifications.filter(n => !n.isRead).length;
                        setUnreadCount(unread);
                    }
                } catch (error) {
                    console.log("Error fetching notifications", error);
                }
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on("notification", (data) => {
                setNotifications((prev) => [data, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });
        }
        return () => socket?.off("notification");
    }, []);

    const markAsReadHandler = async () => {
        try {
            if (unreadCount > 0) {
                await axios.put(`${INTERVIEW_API_END_POINT}/notifications/mark-read`, {}, { withCredentials: true });
                setUnreadCount(0);
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleNotificationClick = async (notifId) => {
        try {
            const res = await axios.delete(`${INTERVIEW_API_END_POINT}/notifications/${notifId}`, { withCredentials: true });
            if (res.data.success) {
                setNotifications(notifications.filter(n => n._id !== notifId));
                setUnreadCount(prev => Math.max(0, prev - 1));
                if (user.role === 'jobseeker') navigate("/jobseeker/interviews");
                else if (user.role === 'employer') navigate("/employer/interview-list");
                else navigate('/admin/interview-list');
            }
        } catch (error) {
            navigate(user.role === 'jobseeker' ? "/jobseeker/interviews" : "/employer/interview-list");
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-white shadow-sm sticky top-0 z-50">
            <div className="flex justify-between items-center mx-auto max-w-7xl h-16 px-4">
                {/* Left Logo */}
                <div>
                    <h1 className="text-2xl font-bold">
                        Job <span className="text-red-500">Portal</span>
                    </h1>
                </div>

                {/* Middle Menu */}
                <div className="flex items-center gap-12">
                    <ul className='flex font-medium items-center gap-6'>
                        <li><Link to="/" className="hover:text-[#6A38C2] transition font-medium">Home</Link></li>

                        {/* --- CONDITION 1: EMPLOYER MENU --- */}
                        {user && user.role === 'employer' ? (
                            <>
                                {/* Companies Dropdown */}
                                <li className='relative group py-4'>
                                    <div className='flex items-center gap-1 cursor-pointer hover:text-[#6A38C2] transition font-medium'>
                                        <span>Companies</span>
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                    </div>
                                    <div className='absolute top-[100%] left-[-20px] w-56 bg-white shadow-2xl rounded-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                                        <Link to="/employer/companies" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <ListChecks size={16} className="text-gray-400" /> <span className="text-sm font-medium">My Companies</span>
                                        </Link>
                                        <Link to="/employer/companies/create" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <PlusCircle size={16} className="text-[#6A38C2]" /> <span className="text-sm font-medium">Register Company</span>
                                        </Link>
                                    </div>
                                </li>

                                {/* Jobs Dropdown */}
                                <li className='relative group py-4'>
                                    <div className='flex items-center gap-1 cursor-pointer hover:text-[#6A38C2] transition font-medium'>
                                        <span>Jobs</span>
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                    </div>
                                    <div className='absolute top-[100%] left-[-20px] w-56 bg-white shadow-2xl rounded-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                                        <Link to="/employer/jobs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <Briefcase size={16} className="text-gray-400" /> <span className="text-sm font-medium">My Jobs</span>
                                        </Link>
                                        <Link to="/employer/jobs/create" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <PlusCircle size={16} className="text-[#6A38C2]" /> <span className="text-sm font-medium">Post New Job</span>
                                        </Link>
                                    </div>
                                </li>
                                <li><Link to="/employer/interview-list" className="hover:text-[#6A38C2] transition font-medium">Interviews</Link></li>
                            </>
                        ) : (
                            /* --- CONDITION 2: JOBSEEKER MENU --- */
                            <>
                                <li className='relative group py-4'>
                                    <div className='flex items-center gap-1 cursor-pointer hover:text-[#6A38C2] transition font-medium'>
                                        <span>Jobs</span>
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                    </div>
                                    <div className='absolute top-[100%] left-[-20px] w-56 bg-white shadow-2xl rounded-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                                        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Center</div>
                                        <Link to="/jobs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <Briefcase size={16} className="text-gray-400" /> <span className="text-sm font-medium">All Job Openings</span>
                                        </Link>
                                        <Link to="/saved-jobs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-[#6A38C2] transition-colors">
                                            <Bookmark size={16} className="text-blue-500" /> <span className="text-sm font-medium">Saved Jobs</span>
                                        </Link>
                                    </div>
                                </li>
                                <li><Link to="/jobseeker/dashboard" className="hover:text-[#6A38C2] transition font-medium">Dashboard</Link></li>
                                <li><Link to="/browse" className="hover:text-[#6A38C2] transition font-medium">Browse</Link></li>
                                {/* {user && <li><Link to="/jobseeker/interviews" className="hover:text-[#6A38C2] transition font-medium">My Schedule</Link></li>} */}
                            </>
                        )}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {user && user.role === "jobseeker" && (
                        <div onClick={() => navigate("/saved-jobs")} className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition group" title="Saved Jobs">
                            <Bookmark size={22} className="text-gray-600 group-hover:text-[#6A38C2]" />
                            {user?.savedJobs?.length > 0 && (
                                <span className="absolute top-1 right-1 bg-[#6A38C2] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                                    {user?.savedJobs?.length}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {user && (
                        <Popover onOpenChange={(open) => open && markAsReadHandler()}>
                            <PopoverTrigger asChild>
                                <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
                                    <Bell size={22} className="text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 shadow-lg border-none rounded-xl overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-10 text-center text-gray-400 text-sm">No notifications yet</p>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif._id} onClick={() => handleNotificationClick(notif._id)} className={`p-4 border-b hover:bg-gray-100 transition cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex gap-3">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Link to={user.role === 'employer' ? "/employer/interview-list" : "/jobseeker/interviews"} className="block text-center p-3 text-sm text-blue-600 font-medium hover:bg-gray-50 border-t">
                                    View all interviews
                                </Link>
                            </PopoverContent>
                        </Popover>
                    )}

                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Briefcase className="w-4 h-4" /> For Employers
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2">
                                    <Link to="/employer-login"><Button variant="ghost" className="w-full justify-start text-sm">Login</Button></Link>
                                    <Link to="/employer/signup"><Button variant="ghost" className="w-full justify-start text-sm">Sign Up</Button></Link>
                                </PopoverContent>
                            </Popover>
                            <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
                            <Link to="/signup"><Button size="sm" className="bg-[#6A38C2] hover:bg-[#4f1ea5]">SignUp</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer border-2 border-transparent hover:border-red-500 transition">
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 shadow-2xl border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#6A38C2] to-[#4b288a] p-4 text-white">
                                    <div className='flex items-center gap-3'>
                                        <Avatar className="h-12 w-12 border-2 border-white">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                                        </Avatar>
                                        <div className='overflow-hidden'>
                                            <h4 className="font-bold text-lg leading-tight truncate">{user.fullname}</h4>
                                            <p className="text-xs opacity-80 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase tracking-widest">Account</div>
                                    {user.role === "jobseeker" && (
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 hover:text-[#6A38C2] rounded-lg transition-all group">
                                            <User2 size={18} className="text-gray-400 group-hover:text-[#6A38C2]" /> 
                                            <span className="text-sm font-medium">My Profile</span>
                                        </Link>
                                    )}
                                    <Link to="/faq" className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 hover:text-[#6A38C2] rounded-lg transition-all group">
                                        <HelpCircle size={18} className="text-gray-400 group-hover:text-[#6A38C2]" /> 
                                        <span className="text-sm font-medium">Help & FAQs</span>
                                    </Link>
                                    <div className="my-2 border-t border-gray-100"></div>
                                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all group">
                                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;