import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2, Briefcase, Bell, Calendar, Bookmark, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, PlusCircle, Building2, ListChecks, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { logout } from '@/redux/authSlice';
import { socket } from '@/App';
import axiosInstance from '@/utils/axiosInstance';

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosInstance.get(`/interview/notifications`);
                if (res.data.success) {
                    setNotifications(res.data.notifications);
                    const unread = res.data.notifications.filter((notification) => !notification.isRead).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.log("Error fetching notifications", error);
                }
            }
        };

        if (user) {
            fetchNotifications();
            return;
        }

        setNotifications([]);
        setUnreadCount(0);
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
                await axiosInstance.put(`/interview/notifications/mark-read`, {}, );
                setUnreadCount(0);
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const normalizeInterviewNotificationLink = (link) => {
        if (!link) return null;
        if (link === "/admin/interviews") return "/admin/interview-list";
        if (link === "/employer/interviews") return "/employer/interview-list";
        if (link === "/jobseeker/interviews") return "/jobseeker/interviews";
        return link;
    };

    const getSupportNotificationLink = () => {
        if (user?.role === "employer") return "/employer/support-responses";
        return "/jobseeker/support-responses";
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark this specific notification as read
            const res = await axiosInstance.put(`/interview/notifications/${notification._id}/mark-read`);
            if (res.data.success) {
                // Remove clicked notification from list / mark as read
                setNotifications(notifications.filter(n => n._id !== notification._id));
                if (!notification.isRead) setUnreadCount(prev => Math.max(0, prev - 1));

                // Navigate to the appropriate page based on notification link
                const targetLink = normalizeInterviewNotificationLink(notification.link);
                if (targetLink) {
                    if (notification.type === "SUPPORT" && targetLink === "/contact-support") {
                        navigate(getSupportNotificationLink());
                    } else {
                        navigate(targetLink);
                    }
                } else {
                    // Fallback based on notification type
                    switch (notification.type) {
                        case 'SUPPORT':
                            navigate(getSupportNotificationLink());
                            break;
                        case 'INTERVIEW_SCHEDULED':
                        case 'INTERVIEW_CANCELLED':
                            navigate('/jobseeker/interviews');
                            break;
                        case 'JOB_APPLIED':
                            navigate('/jobseeker/dashboard');
                            break;
                        case 'STATUS_UPDATED':
                            navigate('/profile');
                            break;
                        default:
                            navigate('/jobseeker/dashboard');
                    }
                }
            }
        } catch (error) {
            console.log(error);
            // Still navigate even if marking as read fails
            if (notification.link) {
                if (notification.type === "SUPPORT" && notification.link === "/contact-support") {
                    navigate(getSupportNotificationLink());
                } else {
                    navigate(notification.link);
                }
            } else {
                navigate(notification.type === "SUPPORT" ? getSupportNotificationLink() : '/contact-support');
            }
        }
    };

    const clearAllNotificationsHandler = async () => {
        try {
            const res = await axiosInstance.delete(`/interview/notifications`);
            if (res.data.success) {
                setNotifications([]);
                setUnreadCount(0);
                toast.success(res.data.message || "All notifications cleared");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear notifications");
        }
    };

    const deleteSingleNotificationHandler = async (notification, e) => {
        e.stopPropagation();
        try {
            const res = await axiosInstance.delete(`/interview/notifications/${notification._id}`);
            if (res.data.success) {
                setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
                if (!notification.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete notification");
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.get(`/user/logout`);
            if (res.data.success) {
                dispatch(logout());
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const isDashboardRoute =
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/employer') ||
        location.pathname.startsWith('/jobseeker');

    return (
        <div className="bg-white shadow-sm sticky top-0 z-50">
            <div className={`flex justify-between items-center mx-auto max-w-7xl h-16 px-4 ${isDashboardRoute ? 'lg:ml-64 lg:max-w-[calc(100%-16rem)]' : ''}`}>
                {/* Navigation arrows + Logo */}
                <div className="flex items-center gap-3">
               
                    <Link to="/" className="flex items-center gap-2">
                        <img 
                            src="/logo.png" 
                            alt="NexForge Logo" 
                            className="h-14 sm:h-16 md:h-20 w-auto object-contain" 
                        />
                    </Link>
                </div>

                {/* Middle Menu - Desktop Only */}
                <div className="hidden md:flex items-center gap-12">
                    <ul className='flex font-medium items-center gap-6'>
                        <li><Link to="/" className="hover:text-[#6A38C2] transition font-medium">Home</Link></li>

                        {/* --- CONDITION 1: EMPLOYER MENU --- */}
                        {user && user.role === 'admin' ? (
                            <>
                                <li><Link to="/admin/panel" className="hover:text-[#6A38C2] transition font-medium">Dashboard</Link></li>
                                <li><Link to="/admin/interview-list" className="hover:text-[#6A38C2] transition font-medium">Interviews</Link></li>
                                
                            </>
                        ) : user && user.role === 'employer' ? (
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
                                <li><Link to="/employer/dashboard" className="hover:text-[#6A38C2] transition font-medium">Dashboard</Link></li>
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
                                {user && user.role === "jobseeker" && (
                                    <li><Link to="/jobseeker/dashboard" className="hover:text-[#6A38C2] transition font-medium">Dashboard</Link></li>
                                )}
                                {/* {user && <li><Link to="/jobseeker/interviews" className="hover:text-[#6A38C2] transition font-medium">My Schedule</Link></li>} */}
                            </>
                        )}
                    </ul>
                </div>

                {/* Mobile Menu Button - Visible on mobile only */}
                <div className="md:hidden flex items-center gap-2">
                    {user && (
                        <Popover onOpenChange={(open) => open && markAsReadHandler()}>
                            <PopoverTrigger asChild>
                                <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
                                    <Bell size={20} className="text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-0 shadow-lg border-none rounded-xl overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-10 text-center text-gray-400 text-sm">No notifications yet</p>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif._id} onClick={() => handleNotificationClick(notif)} className={`p-4 border-b hover:bg-gray-100 transition cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex gap-3 items-start">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                                                    </div>
                                                    <button onClick={(e) => deleteSingleNotificationHandler(notif, e)} className="text-gray-400 hover:text-gray-600 ml-2">
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllNotificationsHandler}
                                        className="block w-full text-center p-3 text-sm text-red-600 font-medium hover:bg-red-50 border-t"
                                    >
                                        Clear all notifications
                                    </button>
                                )}
                            </PopoverContent>
                        </Popover>
                    )}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Right Section - Desktop Only */}
                <div className="hidden md:flex items-center gap-2">
                    {user && user.role === "jobseeker" && (
                        <div onClick={() => navigate("/saved-jobs")} className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition group" title="Saved Jobs">
                            <Bookmark size={22} className="text-gray-600 group-hover:text-[#6A38C2]" />
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
                                            <div key={notif._id} onClick={() => handleNotificationClick(notif)} className={`p-4 border-b hover:bg-gray-100 transition cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex gap-3 items-start">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                                                    </div>
                                                    <button onClick={(e) => deleteSingleNotificationHandler(notif, e)} className="text-gray-400 hover:text-gray-600 ml-2">
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllNotificationsHandler}
                                        className="block w-full text-center p-3 text-sm text-red-600 font-medium hover:bg-red-50 border-t"
                                    >
                                        Clear all notifications
                                    </button>
                                )}
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

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 max-h-96 overflow-y-auto">
                    <div className="px-4 py-4 space-y-2">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Home</Link>

                        {user && user.role === 'employer' ? (
                            <>
                                <Link to="/employer/companies" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">My Companies</Link>
                                <Link to="/employer/companies/create" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Register Company</Link>
                                <Link to="/employer/jobs" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">My Jobs</Link>
                                <Link to="/employer/jobs/create" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Post New Job</Link>
                                <Link to="/employer/interview-list" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Interviews</Link>
                                <Link to="/employer/faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">FAQ</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">All Jobs</Link>
                                <Link to="/saved-jobs" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Saved Jobs</Link>
                                {user && user.role === "jobseeker" && <Link to="/jobseeker/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Dashboard</Link>}
                                {user && user.role === "jobseeker" && <Link to="/jobseeker/interviews" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">My Interviews</Link>}
                                <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">FAQ</Link>
                            </>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>

                        {!user ? (
                            <div className="space-y-2">
                                <Link to="/employer-login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Employer Login</Link>
                                <Link to="/employer/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Employer Sign Up</Link>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Login</Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 bg-[#6A38C2] text-white hover:bg-[#4f1ea5] rounded-lg transition font-medium text-sm text-center">Sign Up</Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {user.role === "jobseeker" && (
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-sm">My Profile</Link>
                                )}
                                <button onClick={logoutHandler} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition font-medium text-sm">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
