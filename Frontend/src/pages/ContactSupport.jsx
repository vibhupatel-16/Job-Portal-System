import React, { useState } from "react";
import SupportModal from "../components/SupportModal";
import { MessageSquare, HelpCircle, Clock, CheckCircle } from "lucide-react";

const ContactSupport = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const faqs = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond within 24 hours during business days."
    },
    {
      question: "What information should I include in my support request?",
      answer: "Please include detailed information about your issue, steps to reproduce, and any relevant screenshots or error messages."
    },
    {
      question: "Can I track the status of my support request?",
      answer: "Yes, you'll receive email updates when your ticket status changes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Contact Support</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Need help? We're here to assist you. Submit a support request and our team will get back to you as soon as possible.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Submit Support Request</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Create a support ticket and our team will respond within 24 hours.
            </p>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Open Support Form
            </button>
          </div>

          {/* Response Time Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Response Time</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Average response: <strong>24 hours</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Business days: <strong>Monday - Friday</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Email notifications for updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Modal */}
        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ContactSupport;