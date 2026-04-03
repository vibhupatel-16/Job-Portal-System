import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, ShieldCheck, Zap, Bell, MessageCircle, Briefcase, Building2, CreditCard, HelpCircle, Users, Calendar, Bookmark, Clock, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const jobseekerFaqs = [
  { category: "Applications", q: "How do I find jobs that match my skills?", a: "Our smart AI analyzes your profile skills and matches them with active job requirements. You can see these under 'Recommended Jobs' on your dashboard.", icon: <Zap className="text-yellow-500" size={20} /> },
  { category: "Applications", q: "How can I track my job applications?", a: "Go to your dashboard. You can see whether your application is 'Pending', 'Shortlisted', 'Accepted', or 'Rejected' in real-time.", icon: <ShieldCheck className="text-green-500" size={20} /> },
  { category: "Applications", q: "Can I apply to multiple jobs at once?", a: "Yes, you can browse and apply to as many jobs as you want. Each application is tracked separately in your dashboard.", icon: <Briefcase className="text-blue-500" size={20} /> },
  { category: "Applications", q: "What happens after I apply to a job?", a: "Employers will review your application. If shortlisted, you'll receive a notification. You can track all updates in your dashboard.", icon: <Bell className="text-orange-500" size={20} /> },
  { category: "Interviews", q: "What should I do if I can't attend a scheduled interview?", a: "Go to the 'My Interviews' tab from your sidebar. If an interview is scheduled, you can click on 'Request Reschedule' to instantly notify the employer to pick a different time.", icon: <MessageCircle className="text-pink-500" size={20} /> },
  { category: "Interviews", q: "How do I join an online interview?", a: "When an employer schedules an interview, a Google Meet link will be generated. You can find the 'Join Platform' link directly in your 'My Interviews' section on the scheduled date.", icon: <Zap className="text-indigo-500" size={20} /> },
  { category: "Interviews", q: "Can I cancel a scheduled interview?", a: "Yes, you can cancel your own interviews from the 'My Interviews' section. This will notify the employer and admin immediately.", icon: <ShieldCheck className="text-red-500" size={20} /> },
  { category: "Interviews", q: "How do I reschedule an interview?", a: "In your 'My Interviews' section, click 'Request Reschedule' and suggest a new date/time. The employer will approve or deny your request.", icon: <Calendar className="text-purple-500" size={20} /> },
  { category: "Account", q: "Can I see notifications while I was offline?", a: "Yes! Any updates regarding your applications or new job matches are saved in your account. Just click the Bell icon in the navbar.", icon: <Bell className="text-blue-500" size={20} /> },
  { category: "Account", q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. Enter your email and follow the reset instructions sent to your inbox.", icon: <ShieldCheck className="text-green-500" size={20} /> },
  { category: "Account", q: "Can I delete my account?", a: "Account deletion is not available yet. Please contact support if you need to deactivate your account.", icon: <Users className="text-gray-500" size={20} /> },
  { category: "Profile", q: "What should I do if my skills are not matching any jobs?", a: "We recommend updating your profile with specific keywords like 'React.js', 'Node.js', or 'Tailwind CSS'. The more specific your skills, the better our recommendation engine works.", icon: <Search className="text-purple-500" size={20} /> },
  { category: "Profile", q: "How do I update my Resume?", a: "Go to 'My Profile' and click the Edit (Pen) icon. You can upload a new PDF or Document format resume which employers will see when you apply.", icon: <Briefcase className="text-indigo-500" size={20} /> },
  { category: "Profile", q: "What information should I include in my profile?", a: "Include your skills, experience level, preferred location, and salary expectations. A complete profile increases your chances of getting matched with relevant jobs.", icon: <Users className="text-teal-500" size={20} /> },
  { category: "Saved Jobs", q: "Can I save a job to apply later?", a: "Yes, you can click the 'Bookmark' icon on any job card. You can view all your bookmarked jobs in the 'Saved Jobs' section from the sidebar.", icon: <ShieldCheck className="text-emerald-500" size={20} /> },
  { category: "Saved Jobs", q: "How many jobs can I save?", a: "You can save unlimited jobs. They remain saved until you remove them or apply to them.", icon: <Bookmark className="text-blue-500" size={20} /> },
  { category: "Support", q: "How do I contact support?", a: "Go to 'Contact Support' from the footer or navbar. Fill out the form with your issue and our team will respond within 24 hours.", icon: <MessageCircle className="text-indigo-500" size={20} /> },
  { category: "Support", q: "What types of issues can I report?", a: "You can report technical issues, account problems, application concerns, or general feedback. Our support team handles all platform-related matters.", icon: <HelpCircle className="text-purple-500" size={20} /> },
  { category: "Support", q: "How long does it take to get a response?", a: "We aim to respond to all support tickets within 24 hours during business days. Urgent issues are prioritized.", icon: <Clock className="text-orange-500" size={20} /> },
  { category: "General", q: "Is the platform free to use?", a: "Yes, job seekers can browse and apply to jobs for free. Employers can post jobs during our current free access period.", icon: <CreditCard className="text-green-500" size={20} /> },
  { category: "General", q: "How do I browse jobs without logging in?", a: "You can view job listings and details without an account, but you'll need to log in to apply or save jobs.", icon: <Search className="text-blue-500" size={20} /> },
  { category: "General", q: "What browsers are supported?", a: "The platform works best on modern browsers like Chrome, Firefox, Safari, and Edge. Mobile browsers are also supported.", icon: <Zap className="text-yellow-500" size={20} /> }
];

const employerFaqs = [
  { category: "Getting Started", q: "How do I create and post a new job?", a: "First, ensure you have registered a Company. Then go to 'My Jobs', click 'New Job', select your company, and fill out the role details (Title, Description, Requirements, Salary).", icon: <Briefcase className="text-blue-500" size={20} /> },
  { category: "Getting Started", q: "How do I register my company?", a: "Go to 'My Companies' and click 'Register Company'. Fill in your company details, logo, and description. Once approved by admin, you can post jobs.", icon: <Building2 className="text-indigo-500" size={20} /> },
  { category: "Getting Started", q: "What information do I need to post a job?", a: "Job title, description, requirements, salary, location, experience level, and position count. The more detailed your posting, the better candidates you'll attract.", icon: <Briefcase className="text-green-500" size={20} /> },
  { category: "Applicants", q: "Where can I see who applied to my jobs?", a: "Go to 'My Jobs' and click the 'Applicants' button on any active job. This opens the Manage Applicants table to see everyone who applied.", icon: <Users className="text-indigo-500" size={20} /> },
  { category: "Applicants", q: "How does the AI Resume Screening work?", a: "When a candidate applies, our Google Gemini AI scans their resume against your job description and automatically generates a 'Match Score' along with suggested interview questions.", icon: <Zap className="text-yellow-500" size={20} /> },
  { category: "Applicants", q: "Can I view candidate resumes?", a: "Yes, in the applicants table, click the 'View Details' icon to see the candidate's resume, cover letter, and AI match report.", icon: <Search className="text-purple-500" size={20} /> },
  { category: "Applicants", q: "How do I shortlist or reject candidates?", a: "Use the status dropdown in the applicants table. You can update individual candidates or bulk select multiple ones.", icon: <ShieldCheck className="text-green-500" size={20} /> },
  { category: "Hiring", q: "Can I bulk reject or shortlist candidates?", a: "Yes, you can use the checkboxes in the Manage Applicants table to select multiple candidates and update their statuses simultaneously.", icon: <Users className="text-emerald-500" size={20} /> },
  { category: "Hiring", q: "How do I view a candidate's actual resume?", a: "In the applicants table, click the 'Eye' icon next to a candidate. This will open a detailed modal showing their raw resume, cover letter, and full AI Match Report.", icon: <Search className="text-purple-500" size={20} /> },
  { category: "Hiring", q: "What does the match score mean?", a: "The AI calculates how well the candidate's skills and experience match your job requirements. Higher scores indicate better matches.", icon: <Zap className="text-orange-500" size={20} /> },
  { category: "Interviews", q: "How do I schedule an interview?", a: "Once you change an applicant's status to 'Accepted', a 'Schedule Interview' button will appear for them. You can click it to pick a date and time.", icon: <MessageCircle className="text-pink-500" size={20} /> },
  { category: "Interviews", q: "How do I connect my Google Meet automatically?", a: "Click the 'Connect Google Meet' button on your dashboard. Once authenticated, the system will auto-generate meeting links when you schedule online interviews.", icon: <Zap className="text-yellow-500" size={20} /> },
  { category: "Interviews", q: "Can I cancel a scheduled interview?", a: "Yes, you can cancel interviews from the 'Interview List' section. This will notify the candidate and admin immediately.", icon: <ShieldCheck className="text-red-500" size={20} /> },
  { category: "Interviews", q: "How do I approve interview reschedule requests?", a: "In your 'Interview List', look for interviews with 'Reschedule Requested' status. Click 'Approve' to accept the candidate's suggested time.", icon: <CheckCircle className="text-green-500" size={20} /> },
  { category: "Interviews", q: "How do I submit interview feedback?", a: "After an interview is completed, go to your 'Interview List' and click 'Feedback' on the completed interview to submit ratings and comments.", icon: <MessageCircle className="text-blue-500" size={20} /> },
  { category: "Analytics", q: "What does 'Skills in Demand' show on my Dashboard?", a: "The Skills in Demand chart scans all candidates who have applied to your jobs and highlights their most common skills. This helps you understand the talent pool applying to you.", icon: <Building2 className="text-teal-500" size={20} /> },
  { category: "Analytics", q: "How can I track my job performance?", a: "Your dashboard shows application counts, interview schedules, and completion rates for all your posted jobs.", icon: <Briefcase className="text-indigo-500" size={20} /> },
  { category: "Account", q: "How do I manage multiple companies?", a: "You can register multiple companies under your account. Switch between them when posting jobs or viewing applicants.", icon: <Building2 className="text-purple-500" size={20} /> },
  { category: "Account", q: "Can I delete a job posting?", a: "Job deletion is not available yet. You can edit job details or contact support if you need to remove a posting.", icon: <ShieldCheck className="text-gray-500" size={20} /> },
  { category: "Billing", q: "Are there any charges for posting jobs?", a: "Currently, you can post unlimited jobs and manage candidates entirely for free during our early access period.", icon: <CreditCard className="text-red-500" size={20} /> },
  { category: "Billing", q: "Will there be paid features in the future?", a: "We're committed to keeping core features free. Premium features like advanced analytics may be introduced later.", icon: <CreditCard className="text-orange-500" size={20} /> },
  { category: "Support", q: "How do I contact support?", a: "Go to 'Contact Support' from the footer or navbar. Fill out the form with your issue and our team will respond within 24 hours.", icon: <MessageCircle className="text-indigo-500" size={20} /> },
  { category: "Support", q: "What if I have issues with candidate applications?", a: "Contact support with specific details about the issue. Our team can help troubleshoot application processing problems.", icon: <HelpCircle className="text-purple-500" size={20} /> },
  { category: "Support", q: "How do I report a technical issue?", a: "Use the 'Contact Support' form and select 'Technical Issue' as the category. Include screenshots and steps to reproduce the problem.", icon: <ShieldCheck className="text-red-500" size={20} /> },
  { category: "General", q: "Is there a mobile app?", a: "Currently, the platform is web-based and works on all mobile browsers. A dedicated mobile app may be available in the future.", icon: <Zap className="text-blue-500" size={20} /> },
  { category: "General", q: "How secure is my data?", a: "We use industry-standard encryption and security measures. Your data is protected and never shared with third parties without consent.", icon: <ShieldCheck className="text-green-500" size={20} /> }
];

const FAQSection = () => {
  const { user } = useSelector(store => store.auth);
  const defaultTab = user?.role === 'employer' ? 'employer' : 'jobseeker';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const currentFaqs = activeTab === 'jobseeker' ? jobseekerFaqs : employerFaqs;

  // Filter based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return currentFaqs;
    const lowerQuery = searchQuery.toLowerCase();
    return currentFaqs.filter(faq => 
      faq.q.toLowerCase().includes(lowerQuery) || 
      faq.a.toLowerCase().includes(lowerQuery) ||
      faq.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, currentFaqs]);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 rounded-lg overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Header */}
        <div className="text-center mb-10 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black tracking-widest uppercase shadow-sm"
          >
            Support Center
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Got Questions? We’ve got <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Answers.</span>
          </h2>
          <p className="text-gray-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Everything you need to know about navigating the platform, managing applications, and leveraging our advanced AI features.
          </p>
        </div>

        {/* Roles Toggles */}
        <div className="flex justify-center mb-10">
           <div className="bg-white p-1.5 rounded-2xl flex border border-gray-200 shadow-sm relative">
              <button 
                onClick={() => { setActiveTab('jobseeker'); setOpenIndex(null); }}
                className={`flex-1 relative z-10 font-bold px-8 py-3 rounded-xl transition-colors duration-300 text-sm ${activeTab === 'jobseeker' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                For Jobseekers
                {activeTab === 'jobseeker' && (
                  <motion.div layoutId="tabMarker" className="absolute inset-0 bg-gray-900 rounded-xl -z-10 shadow-md" />
                )}
              </button>
              
              <button 
                onClick={() => { setActiveTab('employer'); setOpenIndex(null); }}
                className={`flex-1 relative z-10 font-bold px-8 py-3 rounded-xl transition-colors duration-300 text-sm ${activeTab === 'employer' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                For Employers
                {activeTab === 'employer' && (
                  <motion.div layoutId="tabMarker" className="absolute inset-0 bg-gray-900 rounded-xl -z-10 shadow-md" />
                )}
              </button>
           </div>
        </div>

        {/* Search Bar */}
        <div className="mb-10 relative group">
           <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
           </div>
           <input 
             type="text"
             placeholder="Search for questions, keywords, or topics..." 
             className="w-full bg-white border-2 border-gray-100 text-gray-900 text-sm rounded-2xl block pl-12 p-4 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none font-semibold transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-20">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
              <motion.div 
                key={faq.q}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`border-2 transition-all duration-300 overflow-hidden ${
                  openIndex === index 
                    ? 'border-indigo-600 bg-white shadow-xl rounded-[2rem]' 
                    : 'border-transparent bg-white shadow-sm hover:border-indigo-100 rounded-3xl'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <div className="flex items-center gap-5 pr-6">
                    <div className={`p-3 rounded-2xl transition-all shadow-sm ${openIndex === index ? 'bg-indigo-50 scale-110' : 'bg-gray-50'}`}>
                      {faq.icon}
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">
                         {faq.category}
                       </span>
                       <span className={`font-bold block transition-colors ${openIndex === index ? 'text-indigo-800 text-base' : 'text-gray-800 text-base'}`}>
                         {faq.q}
                       </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 pt-2">
                         <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-50 ml-16 text-sm text-indigo-900 font-medium leading-relaxed shadow-inner">
                            {faq.a}
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )) : (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-300" size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-800 mb-1">No results found</h3>
                 <p className="text-sm font-semibold text-gray-400">We couldn't find any FAQs matching "{searchQuery}"</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support Footer */}
        <div className="relative overflow-hidden group bg-gray-900 rounded-[2.5rem] p-10 text-center shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <HelpCircle className="mx-auto text-indigo-400 mb-4 opacity-50" size={40} />
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Still need help?</h3>
          <p className="text-gray-400 text-sm font-semibold mb-8 max-w-sm mx-auto">
            Can't find the answer you're looking for? Don't hesitate to reach out to our dedicated support team.
          </p>
          
          <Link to="/contact-support" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm group-hover:bg-indigo-50 inline-block">
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQSection;