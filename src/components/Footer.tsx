import React from 'react';
import { 
  Heart, 
  ShieldAlert, 
  ShieldCheck, 
  Bug, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
  onOpenReportError: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSOS,
  onOpenReportError,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#5FB8B0] flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xl font-black text-white font-heading">
                  Sankalp
                </span>
                <span className="text-teal-400 font-bold ml-1">.care</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              "Your resolve to heal, with care beside you." Sankalp pairs verified clinical doctors with an AI follow-up assistant and a personalized recovery tracker to ensure continuous, empathetic care beyond the consultation room.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA-aligned & Telemedicine Practice Guidelines compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Doctor Discovery & Slots
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Consultation Room (with Blur)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('recovery')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Recovery Tracker & Health Score
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disorders')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Disorders Library (A–Z)
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Patient Care & Help
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('support')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReportError}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Report an Issue / Bug</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500">care@sankalphealth.in</span>
              </li>
            </ul>
          </div>

          {/* Emergency SOS Quick Dial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>24x7 India Helplines</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <a href="tel:112" className="hover:text-white flex items-center justify-between">
                  <span>National Emergency:</span>
                  <strong className="text-white">112</strong>
                </a>
              </li>
              <li>
                <a href="tel:108" className="hover:text-white flex items-center justify-between">
                  <span>Ambulance Service:</span>
                  <strong className="text-white">108</strong>
                </a>
              </li>
              <li>
                <a href="tel:14416" className="hover:text-white flex items-center justify-between">
                  <span>Tele-MANAS Mental Health:</span>
                  <strong className="text-white">14416</strong>
                </a>
              </li>
            </ul>

            <button
              onClick={onOpenSOS}
              className="w-full mt-2 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition-all"
            >
              Open Complete SOS Panel
            </button>
          </div>
        </div>

        {/* Medical & Legal Disclaimer */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-300">Medical Disclaimer:</p>
          <p>
            Sankalp is a telemedicine and post-visit recovery management platform. Information and AI follow-up interactions provided are for supportive and wellness purposes only and do not replace professional medical judgment, in-person diagnosis, or emergency critical care. If you are experiencing symptoms of a heart attack, respiratory collapse, or severe trauma, immediately contact emergency services at 112 / 108.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Sankalp Health Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Privacy Notice</span>
            <span>•</span>
            <span>Telehealth Consent</span>
            <span>•</span>
            <span>Terms of Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
