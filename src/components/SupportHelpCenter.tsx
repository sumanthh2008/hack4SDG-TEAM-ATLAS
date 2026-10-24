import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Headphones,
  Mail
} from 'lucide-react';
import { InformationService } from '../services/supabase';
import type { SupportTicket } from '../types/database';

interface SupportHelpCenterProps {
  userId?: string;
}

export const SupportHelpCenter: React.FC<SupportHelpCenterProps> = ({ userId }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Consultation & Video');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  const faqs = [
    {
      q: 'How does the WebRTC video consultation room work?',
      a: 'Once your doctor accepts your booking, a unique, encrypted video consultation link is generated. The "Join Consultation" button activates 5 minutes prior to the scheduled time. You can toggle your camera, microphone, and patient-controlled video blur at any time.'
    },
    {
      q: 'What is the "Blur my video" feature and when should I use it?',
      a: 'The "Blur my video" toggle provides extra privacy during your visit. If you are in a busy environment or prefer visual anonymity, switching it on applies an instantaneous soft blur filter to your background and video feed while keeping communication clear.'
    },
    {
      q: 'How does the AI Follow-up Assistant work after my doctor visit?',
      a: 'When your doctor submits your digital prescription, our system parses the medication timings and creates a personalized schedule. Sankalp AI sends timely dose notifications (with Taken, Skipped, and Snooze options) and initiates daily check-ins to monitor symptom recovery.'
    },
    {
      q: 'Can the AI Assistant diagnose or alter my medicines?',
      a: 'No. Strictly by clinical safety protocols, Sankalp AI NEVER diagnoses, prescribes new drugs, or alters dosages. It provides general wellness support (hydration, sleep, diet). If your symptoms worsen, it calmly escalates by recommending an immediate doctor visit or emergency services.'
    },
    {
      q: 'Can I use Sankalp as a Guest without creating a password?',
      a: 'Yes! Simply click "Continue as Guest" on the login screen. You will receive an anonymous session ID to book consultations and use the AI companion. You will see a gentle reminder to create a permanent account whenever you wish to save your long-term health history.'
    },
    {
      q: 'How do I download my prescription as a PDF?',
      a: 'Go to "My Prescriptions" or your appointment summary. Click the "Download PDF" button to immediately obtain a digitally signed, formatted prescription with clinic details and medication instructions.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = InformationService.createSupportTicket({
        userId,
        subject,
        category,
        message,
      });
      setIsSubmitting(false);
      setSubmittedTicket(ticket);
      setSubject('');
      setMessage('');
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-12 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800">
          <Headphones className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient & Doctor Care Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          How can we help your healing journey?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          Find instant answers to common questions about consultations, prescriptions, and AI recovery tracking, or open a direct support ticket.
        </p>
      </div>

      {/* 2-Column Layout: FAQs on left, Ticket Form on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <h2 className="text-xl font-bold text-slate-800 font-heading flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" /> Frequently Asked Questions
            </h2>
            <span className="text-xs text-slate-400">6 topics</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all hover:border-teal-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 text-sm sm:text-base hover:text-teal-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-full bg-slate-100 text-slate-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-center gap-3 text-xs text-teal-900">
            <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span>
              Your medical consultations and chat records are secured with end-to-end data encryption and strict HIPAA-compliant principles.
            </span>
          </div>
        </div>

        {/* Right Column: Ticket / Support Contact */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-teal-100/60 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100/70 text-teal-700 rounded-2xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Direct Care Desk</h3>
                <p className="text-xs text-slate-500">Response within 2 hours</p>
              </div>
            </div>

            {submittedTicket ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Ticket Raised Successfully!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ticket Reference: <strong>{submittedTicket.id}</strong>. A clinical support specialist has been assigned to your query.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Raise Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Topic / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  >
                    <option value="Consultation & Video">Video Consultation & Call Issues</option>
                    <option value="Doctor Availability">Doctor Availability & Slot Booking</option>
                    <option value="Prescription & Reminders">Prescription & AI Follow-up</option>
                    <option value="Payment & Refunds">Consultation Fee & Invoicing</option>
                    <option value="Other">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short summary of your question"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain in detail so our care desk can assist promptly..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !subject.trim() || !message.trim()}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                care@sankalphealth.in
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Mon–Sun 8am–10pm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
