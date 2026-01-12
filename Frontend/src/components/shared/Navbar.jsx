import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2, Briefcase, Bell, Calendar, Bookmark } from 'lucide-react'; // Bell icon add kiya
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT, INTERVIEW_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { socket } from '@/App'; // App.jsx se socket import karein

function Navbar() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Notification States
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // 1. Fetch Saved Notifications from DB (For Offline users when they login)
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

    // 2. Listen for Real-time Notifications via Socket
    useEffect(() => {
        if (socket) {
            socket.on("notification", (data) => {
                // Nayi notification ko list mein sabse upar add karein
                setNotifications((prev) => [data, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });
        }
        return () => socket?.off("notification");
    }, []);

    // 3. Mark as Read handler
    const markAsReadHandler = async () => {
        try {
            if (unreadCount > 0) {
                await axios.put(`${INTERVIEW_API_END_POINT}/notifications/mark-read`, {}, { withCredentials: true });
                setUnreadCount(0);
                // Local state update
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
                    <ul className="flex font-medium items-center gap-5">
                        {user?.role !== "employer" && (
                            <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
                        )}
                        {user?.role === "employer" ? (
                            <>
                                <li><Link to="/employer/companies" className="hover:text-red-500 transition">Companies</Link></li>
                                <li><Link to="/employer/jobs" className="hover:text-red-500 transition">Jobs</Link></li>
                                <li><Link to="/employer/interview-list" className="hover:text-red-500 transition">Interviews</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/jobs" className="hover:text-red-500 transition">Jobs</Link></li>
                                <li><Link to="/browse" className="hover:text-red-500 transition">Browse</Link></li>
                                {user && <li><Link to="/jobseeker/interviews" className="hover:text-red-500 transition">My Schedule</Link></li>}
                            </>
                        )}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2"> {/* Gap thoda kam kiya icons ke liye */}
                    
                    {/* ⭐ SAVED JOBS ICON (Added Here) */}
                    {user && user.role === "jobseeker" && (
                        <div 
                            onClick={() => navigate("/saved-jobs")} 
                            className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition group"
                            title="Saved Jobs"
                        >
                            <Bookmark size={22} className="text-gray-600 group-hover:text-[#6A38C2]" />
                            {user?.savedJobs?.length > 0 && (
                                <span className="absolute top-1 right-1 bg-[#6A38C2] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                                    {user?.savedJobs?.length}
                                </span>
                            )}
                        </div>
                    )}
                    {/* 🔔 Notification Bell Icon */}
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
                                            <div key={notif._id} className={`p-4 border-b hover:bg-gray-50 transition cursor-default ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex gap-3">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
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

                    {/* Authentication Buttons */}
                    {!user ? (
                        <div className="flex items-center gap-2">
                            {/* Employer Popover for guest */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Briefcase className="w-4 h-4" /> For Employers
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2">
                                    <Link to="/employer-login"><Button variant="ghost" className="w-full justify-start text-sm">Login</Button></Link>
                                    <Link to="/employer-signup"><Button variant="ghost" className="w-full justify-start text-sm">Sign Up</Button></Link>
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
                            <PopoverContent className="w-72">
                                <div className="flex gap-3 mb-4 p-1">
                                    <Avatar><AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} /></Avatar>
                                    <div>
                                        <h4 className="font-semibold capitalize leading-none mb-1">{user.fullname}</h4>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {user.role === "jobseeker" && (
                                        <Link to="/profile" className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md transition text-sm">
                                            <User2 size={16} /> View Profile
                                        </Link>
                                    )}
                                    <button onClick={logoutHandler} className="flex items-center gap-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition text-sm text-left">
                                        <LogOut size={16} /> Logout
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